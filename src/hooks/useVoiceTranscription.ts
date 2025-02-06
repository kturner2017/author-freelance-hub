
import { useState, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { pipeline } from '@huggingface/transformers';

interface UseVoiceTranscriptionProps {
  onTranscriptionComplete: (text: string) => void;
}

export const useVoiceTranscription = ({ onTranscriptionComplete }: UseVoiceTranscriptionProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [transcriber, setTranscriber] = useState(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const validateAudioData = (audioData: Float32Array): boolean => {
    if (!audioData || !(audioData instanceof Float32Array)) {
      console.error('Invalid audio data type:', audioData);
      return false;
    }
    
    if (audioData.length === 0) {
      console.error('Audio data is empty');
      return false;
    }
    
    const hasValidSamples = audioData.some(sample => Math.abs(sample) > 0.01);
    if (!hasValidSamples) {
      console.error('Audio data contains no significant samples');
      return false;
    }
    
    return true;
  };

  const convertBlobToAudioData = async (blob: Blob): Promise<Float32Array | null> => {
    try {
      const audioContext = new AudioContext({
        sampleRate: 16000 // Explicitly set sample rate for Whisper
      });
      
      const arrayBuffer = await blob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Create an offline context for resampling
      const offlineContext = new OfflineAudioContext({
        numberOfChannels: 1,
        length: Math.ceil(audioBuffer.duration * 16000),
        sampleRate: 16000
      });

      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(offlineContext.destination);
      source.start();

      const renderedBuffer = await offlineContext.startRendering();
      const channelData = renderedBuffer.getChannelData(0);
      
      // Normalize audio data
      const maxAmplitude = Math.max(...Array.from(channelData).map(Math.abs));
      const normalizedData = new Float32Array(channelData.length);
      for (let i = 0; i < channelData.length; i++) {
        normalizedData[i] = maxAmplitude > 0 ? channelData[i] / maxAmplitude : channelData[i];
      }

      return normalizedData;
    } catch (error) {
      console.error('Error converting audio:', error);
      return null;
    }
  };

  const initializeWhisper = useCallback(async () => {
    try {
      setIsModelLoading(true);
      toast({
        title: "Loading speech recognition model",
        description: "This may take a moment on first use",
      });

      const whisperPipeline = await pipeline(
        "automatic-speech-recognition",
        "Xenova/whisper-tiny.en",
        {
          revision: 'main',
          progress_callback: (progress) => {
            console.log('Model loading progress:', progress);
          },
          config: {
            sampling_rate: 16000,
            return_timestamps: false
          }
        }
      );

      setTranscriber(whisperPipeline);
      toast({
        title: "Speech recognition ready",
        description: "You can now use voice dictation",
      });
    } catch (error) {
      console.error('Error loading Whisper model:', error);
      toast({
        title: "Failed to load speech recognition",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsModelLoading(false);
    }
  }, [toast]);

  const startRecording = async () => {
    if (!transcriber) {
      toast({
        title: "Speech recognition not ready",
        description: "Please wait for the model to load",
        variant: "destructive"
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: { ideal: 16000 },
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
        audioBitsPerSecond: 16000
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
          console.log('Processing audio, size:', audioBlob.size);
          
          if (audioBlob.size === 0) {
            throw new Error('No audio recorded');
          }

          const audioData = await convertBlobToAudioData(audioBlob);
          if (!audioData || !validateAudioData(audioData)) {
            throw new Error('Invalid audio data');
          }

          console.log('Audio processed, calling transcriber...');
          const output = await transcriber(audioData, {
            task: 'transcribe',
            language: 'en'
          });

          if (!output?.text) {
            throw new Error('Transcription failed');
          }

          onTranscriptionComplete(output.text);
          toast({
            title: "Transcription complete",
            description: output.text
          });
        } catch (error) {
          console.error('Transcription error:', error);
          toast({
            title: "Transcription failed",
            description: error.message,
            variant: "destructive"
          });
        }
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone"
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording failed",
        description: "Please check your microphone access",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      toast({
        title: "Recording stopped",
        description: "Processing your speech..."
      });
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return {
    isRecording,
    isModelLoading,
    toggleRecording,
    initializeWhisper
  };
};
