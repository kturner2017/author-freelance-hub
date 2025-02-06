
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
    if (!transcriber) {
      toast({
        title: "Error",
        description: "Speech recognition not initialized",
        variant: "destructive"
      });
      return;
    }

    try {
      const audioBlob = new Blob(chunks, { type: 'audio/webm' });
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
        language: 'en',
        chunk_length_s: 30,
        stride_length_s: 5
      });

      if (!output?.text) {
        throw new Error('Transcription failed - no text output');
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
      setIsModelLoading(true);
      toast({
        title: "Loading speech recognition model",
        description: "This may take a moment on first use",
      });

      await initializeWhisperModel(
        (progress) => {
          console.log('Model loading progress:', progress);
          if (progress?.status === 'error') {
            throw new Error('Model loading failed');
          }
        },
        (whisperPipeline) => {
          if (!whisperPipeline) {
            throw new Error('Invalid pipeline initialization');
          }
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

  const toggleRecording = useCallback(() => {
    if (!transcriber) {
      toast({
        title: "Speech recognition not ready",
        description: "Please wait for the model to load",
        variant: "destructive"
      });
      return;
    }

    if (isRecording) {
      stopRecording();
      toast({
        title: "Recording stopped",
        description: "Processing your speech..."
      });
    } else {
      startRecording();
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone"
      });
    }
  }, [isRecording, startRecording, stopRecording, toast, transcriber]);

  return {
    isRecording,
    isModelLoading,
    toggleRecording,
    initializeWhisper
  };
};
