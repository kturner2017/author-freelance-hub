
import { useState, useCallback, useEffect, useRef } from 'react';
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
  const [modelInitialized, setModelInitialized] = useState(false);
  const modelInitAttempted = useRef(false);
  const toast = useToast();

  const handleRecordingComplete = async (chunks: Blob[]) => {
    console.log('Recording complete, processing chunks:', chunks.length);
    
    if (chunks.length === 0) {
      console.error('No audio chunks recorded');
      toast.toast({
        title: "Recording failed",
        description: "No audio was recorded. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    // If model initialization failed, go straight to edge function
    if (!transcriber && modelInitAttempted.current) {
      console.log('Transcriber not available, using edge function fallback...');
      await processEdgeFunctionTranscription(chunks, toast, onTranscriptionComplete);
      return;
    }

    if (!transcriber) {
      console.log('Transcriber not initialized, initializing now before processing...');
      try {
        await initializeWhisper();
      } catch (error) {
        console.error('Failed to initialize whisper on demand:', error);
        await processEdgeFunctionTranscription(chunks, toast, onTranscriptionComplete);
        return;
      }
    }

    // Check again if transcriber is available after potential initialization
    if (!transcriber) {
      console.log('Still no transcriber available, using edge function fallback...');
      await processEdgeFunctionTranscription(chunks, toast, onTranscriptionComplete);
      return;
    }

    try {
      await processAudioTranscription(
        chunks, 
        transcriber, 
        toast, 
        onTranscriptionComplete,
        setIsTranscriptionInProgress
      );
    } catch (error) {
      console.error('Error in transcription, falling back to edge function:', error);
      await processEdgeFunctionTranscription(chunks, toast, onTranscriptionComplete);
    }
  };

  const { isRecording, startRecording, stopRecording } = useMediaRecording(handleRecordingComplete);

  const initializeWhisper = useCallback(async () => {
    // Don't initialize if already initialized or in progress
    if (transcriber || isModelLoading || modelInitialized) {
      console.log('Whisper already initialized or loading in progress');
      return;
    }
    
    // Mark that we've attempted initialization
    modelInitAttempted.current = true;

    try {
      setIsModelLoading(true);
      await initializeWhisperInstance(
        toast, 
        (transcriberInstance) => {
          console.log('Whisper model initialized successfully');
          setTranscriber(transcriberInstance);
          setModelInitialized(true);
        }, 
        setIsModelLoading
      );
    } catch (error) {
      console.error('Error initializing Whisper:', error);
      toast.toast({
        title: "Model initialization failed",
        description: "Will use cloud transcription instead",
        variant: "destructive"
      });
      setIsModelLoading(false);
    }
  }, [toast, transcriber, isModelLoading, modelInitialized]);

  // Initialize the model when the component mounts, but don't block rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!transcriber && !isModelLoading && !modelInitialized && !modelInitAttempted.current) {
        console.log('Initializing Whisper model after delay...');
        initializeWhisper();
      }
    }, 2000); // Delay initialization to prioritize UI rendering
    
    return () => clearTimeout(timer);
  }, [initializeWhisper, transcriber, isModelLoading, modelInitialized]);

  const toggleRecording = useCallback(async () => {
    console.log('Toggle recording called, current state:', { 
      isRecording, 
      isModelLoading, 
      hasTranscriber: !!transcriber,
      modelInitAttempted: modelInitAttempted.current
    });
    
    if (isRecording) {
      console.log('Stopping recording...');
      stopRecording();
      toast.toast({
        title: "Recording stopped",
        description: "Processing your speech..."
      });
    } else {
      if (!modelInitAttempted.current) {
        console.log('First recording attempt, initializing Whisper...');
        try {
          await initializeWhisper();
        } catch (error) {
          console.error('Error initializing Whisper on first recording:', error);
          // Continue anyway, we'll use the edge function fallback
        }
      }
      
      if (isModelLoading) {
        console.log('Model is still loading, showing notification');
        toast.toast({
          title: "Please wait",
          description: "Speech recognition model is still loading"
        });
        return;
      }
      
      console.log('Starting recording...');
      startRecording();
      toast.toast({
        title: "Recording started",
        description: "Speak clearly into your microphone"
      });
    }
  }, [isRecording, isModelLoading, startRecording, stopRecording, toast, transcriber, initializeWhisper]);

  return {
    isRecording,
    isModelLoading,
    isTranscribing: isTranscriptionInProgress,
    toggleRecording
  };
};
