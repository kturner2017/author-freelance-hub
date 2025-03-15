
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
  const initializationErrors = useRef<string[]>([]);
  const toast = useToast();

  const handleRecordingComplete = async (chunks: Blob[]) => {
    console.log('[useVoiceTranscription] Recording complete, processing chunks:', chunks.length);
    
    if (chunks.length === 0) {
      console.error('[useVoiceTranscription] No audio chunks recorded');
      toast.toast({
        title: "Recording failed",
        description: "No audio was recorded. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    // Log details about the chunks
    chunks.forEach((chunk, index) => {
      console.log(`[useVoiceTranscription] Chunk #${index + 1}:`, {
        type: chunk.type,
        size: chunk.size + ' bytes'
      });
    });
    
    // If model initialization failed, go straight to edge function
    if (!transcriber && modelInitAttempted.current) {
      console.log('[useVoiceTranscription] Transcriber not available, initialization was attempted but failed with errors:', initializationErrors.current);
      console.log('[useVoiceTranscription] Using edge function fallback...');
      await processEdgeFunctionTranscription(chunks, toast, onTranscriptionComplete);
      return;
    }

    if (!transcriber) {
      console.log('[useVoiceTranscription] Transcriber not initialized, initializing now before processing...');
      try {
        await initializeWhisper();
        
        // If initialization just succeeded, but we still don't have a transcriber, that's a problem
        if (!transcriber) {
          console.error('[useVoiceTranscription] Initialization completed but transcriber is still null, using fallback');
          await processEdgeFunctionTranscription(chunks, toast, onTranscriptionComplete);
          return;
        }
      } catch (error) {
        console.error('[useVoiceTranscription] Failed to initialize whisper on demand:', error);
        initializationErrors.current.push(error.message || 'Unknown initialization error');
        await processEdgeFunctionTranscription(chunks, toast, onTranscriptionComplete);
        return;
      }
    }

    // Check again if transcriber is available after potential initialization
    if (!transcriber) {
      console.log('[useVoiceTranscription] Still no transcriber available, using edge function fallback...');
      await processEdgeFunctionTranscription(chunks, toast, onTranscriptionComplete);
      return;
    }

    try {
      console.log('[useVoiceTranscription] Transcriber available, processing with Whisper model...');
      await processAudioTranscription(
        chunks, 
        transcriber, 
        toast, 
        onTranscriptionComplete,
        setIsTranscriptionInProgress
      );
    } catch (error) {
      console.error('[useVoiceTranscription] Error in transcription, falling back to edge function:', error);
      await processEdgeFunctionTranscription(chunks, toast, onTranscriptionComplete);
    }
  };

  const { isRecording, startRecording, stopRecording } = useMediaRecording(handleRecordingComplete);

  const initializeWhisper = useCallback(async () => {
    // Log current state
    console.log('[useVoiceTranscription] Initialize Whisper called, current state:', {
      transcriber: !!transcriber,
      isModelLoading,
      modelInitialized,
      modelInitAttempted: modelInitAttempted.current
    });
    
    // Don't initialize if already initialized or in progress
    if (transcriber || isModelLoading || modelInitialized) {
      console.log('[useVoiceTranscription] Whisper already initialized or loading in progress');
      return;
    }
    
    // Mark that we've attempted initialization
    modelInitAttempted.current = true;

    try {
      setIsModelLoading(true);
      console.log('[useVoiceTranscription] Starting Whisper model initialization...');
      
      await initializeWhisperInstance(
        toast, 
        (transcriberInstance) => {
          console.log('[useVoiceTranscription] Whisper model initialized successfully, instance:', !!transcriberInstance);
          if (!transcriberInstance) {
            console.error('[useVoiceTranscription] Received null transcriber instance from initialization');
            initializationErrors.current.push('Received null transcriber instance');
            setIsModelLoading(false);
            return;
          }
          
          setTranscriber(transcriberInstance);
          setModelInitialized(true);
          console.log('[useVoiceTranscription] Transcriber set and model initialized flag updated');
        }, 
        setIsModelLoading
      );
    } catch (error) {
      console.error('[useVoiceTranscription] Error initializing Whisper:', error);
      initializationErrors.current.push(error.message || 'Unknown error during initialization');
      
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
    console.log('[useVoiceTranscription] Component mounted, scheduling Whisper initialization');
    
    const timer = setTimeout(() => {
      if (!transcriber && !isModelLoading && !modelInitialized && !modelInitAttempted.current) {
        console.log('[useVoiceTranscription] Initializing Whisper model after delay...');
        initializeWhisper();
      } else {
        console.log('[useVoiceTranscription] Skipping delayed initialization:', {
          hasTranscriber: !!transcriber, 
          isModelLoading, 
          modelInitialized, 
          initAttempted: modelInitAttempted.current
        });
      }
    }, 2000); // Delay initialization to prioritize UI rendering
    
    return () => {
      console.log('[useVoiceTranscription] Component unmounting, clearing initialization timer');
      clearTimeout(timer);
    };
  }, [initializeWhisper, transcriber, isModelLoading, modelInitialized]);

  const toggleRecording = useCallback(async () => {
    console.log('[useVoiceTranscription] Toggle recording called, current state:', { 
      isRecording, 
      isModelLoading, 
      hasTranscriber: !!transcriber,
      modelInitAttempted: modelInitAttempted.current,
      modelInitialized,
      browser: navigator.userAgent
    });
    
    if (isRecording) {
      console.log('[useVoiceTranscription] Stopping recording...');
      stopRecording();
      toast.toast({
        title: "Recording stopped",
        description: "Processing your speech..."
      });
    } else {
      if (!modelInitAttempted.current) {
        console.log('[useVoiceTranscription] First recording attempt, initializing Whisper...');
        try {
          await initializeWhisper();
        } catch (error) {
          console.error('[useVoiceTranscription] Error initializing Whisper on first recording:', error);
          // Continue anyway, we'll use the edge function fallback
        }
      }
      
      if (isModelLoading) {
        console.log('[useVoiceTranscription] Model is still loading, showing notification');
        toast.toast({
          title: "Please wait",
          description: "Speech recognition model is still loading"
        });
        return;
      }
      
      console.log('[useVoiceTranscription] Starting recording...');
      startRecording();
      toast.toast({
        title: "Recording started",
        description: "Speak clearly into your microphone"
      });
    }
  }, [isRecording, isModelLoading, startRecording, stopRecording, toast, transcriber, initializeWhisper, modelInitialized]);

  return {
    isRecording,
    isModelLoading,
    isTranscribing: isTranscriptionInProgress,
    toggleRecording
  };
};
