
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useMediaRecording } from '@/hooks/useMediaRecording';
import { initializeWhisperInstance } from '@/utils/whisperModelUtils';
import { 
  processAudioTranscription,
  processEdgeFunctionTranscription
} from '@/utils/transcriptionUtils';

interface UseVoiceTranscriptionProps {
  onTranscriptionComplete: (text: string) => void;
}

export const useVoiceTranscription = ({ onTranscriptionComplete }: UseVoiceTranscriptionProps) => {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [transcriber, setTranscriber] = useState<any>(null);
  const [isTranscriptionInProgress, setIsTranscriptionInProgress] = useState(false);
  const toast = useToast();

  const handleRecordingComplete = async (chunks: Blob[]) => {
    console.log('Recording complete, processing chunks:', chunks.length);
    
    if (!transcriber) {
      console.error('Transcriber not initialized, initializing now before processing...');
      await initializeWhisper();
    }

    // Check again if transcriber is available after potential initialization
    if (!transcriber) {
      console.error('Failed to initialize transcriber');
      toast.toast({
        title: "Error",
        description: "Could not initialize speech recognition, using fallback API",
        variant: "destructive"
      });
      
      await processEdgeFunctionTranscription(chunks, toast, onTranscriptionComplete);
      return;
    }

    await processAudioTranscription(
      chunks, 
      transcriber, 
      toast, 
      onTranscriptionComplete,
      setIsTranscriptionInProgress
    );
  };

  const { isRecording, startRecording, stopRecording } = useMediaRecording(handleRecordingComplete);

  const initializeWhisper = useCallback(async () => {
    // Don't initialize if already initialized or in progress
    if (transcriber || isModelLoading) {
      console.log('Whisper already initialized or loading in progress');
      return;
    }

    await initializeWhisperInstance(toast, setTranscriber, setIsModelLoading);
  }, [toast, transcriber, isModelLoading]);

  // Initialize the model when the component mounts
  useEffect(() => {
    // Try to initialize on mount, but don't block rendering
    if (!transcriber && !isModelLoading) {
      initializeWhisper();
    }
  }, [initializeWhisper, transcriber, isModelLoading]);

  const toggleRecording = useCallback(async () => {
    console.log('Toggle recording called, current state:', { 
      isRecording, 
      isModelLoading, 
      hasTranscriber: !!transcriber 
    });
    
    if (isRecording) {
      console.log('Stopping recording...');
      stopRecording();
      toast.toast({
        title: "Recording stopped",
        description: "Processing your speech..."
      });
    } else {
      if (!transcriber && !isModelLoading) {
        console.log('No transcriber initialized, initializing Whisper...');
        await initializeWhisper();
      }
      
      if (!isModelLoading) {
        console.log('Starting recording...');
        startRecording();
        toast.toast({
          title: "Recording started",
          description: "Speak clearly into your microphone"
        });
      } else {
        console.log('Cannot start recording - model is still loading');
        toast.toast({
          title: "Please wait",
          description: "Speech recognition model is still loading"
        });
      }
    }
  }, [isRecording, isModelLoading, startRecording, stopRecording, toast, transcriber, initializeWhisper]);

  return {
    isRecording,
    isModelLoading,
    isTranscribing: isTranscriptionInProgress,
    toggleRecording
  };
};
