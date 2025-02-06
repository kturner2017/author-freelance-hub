
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
  const [transcriber, setTranscriber] = useState(null);
  const { toast } = useToast();

  const handleRecordingComplete = async (chunks: Blob[]) => {
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

  const { isRecording, startRecording, stopRecording } = useMediaRecording(handleRecordingComplete);

  const initializeWhisper = useCallback(async () => {
    try {
      setIsModelLoading(true);
      toast({
        title: "Loading speech recognition model",
        description: "This may take a moment on first use",
      });

      await initializeWhisperModel(
        (progress) => console.log('Model loading progress:', progress),
        (whisperPipeline) => {
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
    } finally {
      setIsModelLoading(false);
    }
  }, [toast]);

  const toggleRecording = () => {
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
    }
  };

  return {
    isRecording,
    isModelLoading,
    toggleRecording,
    initializeWhisper
  };
};
