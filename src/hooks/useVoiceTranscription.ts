
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { validateAudioData, convertBlobToAudioData } from '@/utils/audioProcessing';
import { initializeWhisperModel } from '@/config/whisperConfig';
import { useMediaRecording } from '@/hooks/useMediaRecording';

interface UseVoiceTranscriptionProps {
  onTranscriptionComplete: (text: string) => void;
}

export const useVoiceTranscription = ({ onTranscriptionComplete }: UseVoiceTranscriptionProps) => {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [transcriber, setTranscriber] = useState<any>(null);
  const { toast } = useToast();

  const handleRecordingComplete = async (chunks: Blob[]) => {
    console.log('Recording complete, processing chunks:', chunks.length);
    
    if (!transcriber) {
      console.error('Transcriber not initialized');
      toast({
        title: "Error",
        description: "Speech recognition not initialized",
        variant: "destructive"
      });
      return;
    }

    try {
      const audioBlob = new Blob(chunks, { type: 'audio/webm' });
      console.log('Processing audio, size:', audioBlob.size, 'bytes');
      
      if (audioBlob.size === 0) {
        console.error('No audio recorded (empty blob)');
        throw new Error('No audio recorded');
      }

      console.log('Converting blob to audio data...');
      const audioData = await convertBlobToAudioData(audioBlob);
      console.log('Audio data conversion result:', audioData ? 'Success' : 'Failed');
      
      if (!audioData || !validateAudioData(audioData)) {
        console.error('Invalid audio data after conversion');
        throw new Error('Invalid audio data');
      }

      console.log('Audio processed, calling transcriber with data length:', audioData.length);
      toast({
        title: "Processing speech",
        description: "Transcribing your audio..."
      });
      
      const output = await transcriber(audioData, {
        task: 'transcribe',
        language: 'en'
      });

      console.log('Transcription result:', output);

      if (!output?.text) {
        console.error('No text in transcription output:', output);
        throw new Error('Transcription failed - no text output');
      }

      console.log('Transcription successful:', output.text);
      onTranscriptionComplete(output.text);
      toast({
        title: "Transcription complete",
        description: output.text
      });
    } catch (error) {
      console.error('Transcription error:', error);
      toast({
        title: "Transcription failed",
        description: error.message || 'Error processing audio',
        variant: "destructive"
      });
    }
  };

  const { isRecording, startRecording, stopRecording } = useMediaRecording(handleRecordingComplete);

  const initializeWhisper = useCallback(async () => {
    if (transcriber) {
      console.log('Whisper already initialized');
      return;
    }

    try {
      console.log('Starting Whisper model initialization...');
      setIsModelLoading(true);
      toast({
        title: "Loading speech recognition model",
        description: "This may take a moment on first use",
      });

      await initializeWhisperModel(
        (progress) => {
          console.log('Model loading progress:', progress);
          if (progress?.status === 'error') {
            console.error('Model loading error:', progress);
            throw new Error('Model loading failed');
          }
        },
        (whisperPipeline) => {
          if (!whisperPipeline) {
            console.error('Invalid pipeline initialization');
            throw new Error('Invalid pipeline initialization');
          }
          console.log('Whisper model loaded successfully');
          setTranscriber(whisperPipeline);
          toast({
            title: "Speech recognition ready",
            description: "You can now use voice dictation",
          });
        },
        (error) => {
          console.error('Error loading Whisper model:', error);
          toast({
            title: "Failed to load speech recognition",
            description: "Please try again later",
            variant: "destructive"
          });
        }
      );
    } catch (error) {
      console.error('Error in initializeWhisper:', error);
      toast({
        title: "Initialization failed",
        description: error.message || "Failed to initialize speech recognition",
        variant: "destructive"
      });
    } finally {
      setIsModelLoading(false);
    }
  }, [toast, transcriber]);

  const toggleRecording = useCallback(async () => {
    console.log('Toggle recording called, current state:', { isRecording, isModelLoading, hasTranscriber: !!transcriber });
    
    if (!transcriber && !isModelLoading) {
      console.log('No transcriber initialized, initializing Whisper...');
      await initializeWhisper();
    }

    if (isRecording) {
      console.log('Stopping recording...');
      stopRecording();
      toast({
        title: "Recording stopped",
        description: "Processing your speech..."
      });
    } else if (!isModelLoading) {
      console.log('Starting recording...');
      startRecording();
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone"
      });
    } else {
      console.log('Cannot toggle recording - model is still loading');
    }
  }, [isRecording, isModelLoading, startRecording, stopRecording, toast, transcriber, initializeWhisper]);

  return {
    isRecording,
    isModelLoading,
    toggleRecording
  };
};
