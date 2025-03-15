
import { initializeWhisperModel } from '@/config/whisperConfig';
import { useToast } from '@/hooks/use-toast';

/**
 * Initializes the Whisper speech recognition model
 */
export const initializeWhisperInstance = async (
  toast: ReturnType<typeof useToast>,
  onModelLoaded: (transcriber: any) => void,
  setIsModelLoading: (loading: boolean) => void
) => {
  if (setIsModelLoading) {
    setIsModelLoading(true);
  }

  try {
    console.log('[initializeWhisperInstance] Starting Whisper model initialization...');
    
    // Log browser details for debugging
    console.log('[initializeWhisperInstance] Browser details:', {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      vendor: navigator.vendor,
      language: navigator.language,
      hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
      deviceMemory: (navigator as any).deviceMemory || 'unknown'
    });
    
    toast.toast({
      title: "Loading speech recognition model",
      description: "This may take a moment on first use",
    });

    // Set a timeout to fallback if loading takes too long
    const timeoutId = setTimeout(() => {
      console.warn('[initializeWhisperInstance] Model loading timeout - browser may not be compatible');
      throw new Error('Model loading timed out - your browser may not be compatible');
    }, 30000); // 30-second timeout

    await initializeWhisperModel(
      (progress) => {
        console.log('[initializeWhisperInstance] Model loading progress:', progress);
        if (progress?.status === 'error') {
          console.error('[initializeWhisperInstance] Model loading error:', progress);
          clearTimeout(timeoutId);
          throw new Error('Model loading failed: ' + progress.message);
        }
        
        // Update loading progress if the progress contains percentage info
        if (progress?.status === 'progress' && progress?.progress !== undefined) {
          const percentage = Math.round(progress.progress * 100);
          if (percentage % 20 === 0) { // Only show toast at 0%, 20%, 40%, 60%, 80%
            toast.toast({
              title: "Loading model",
              description: `${percentage}% complete`,
            });
          }
        }
        
        // Log specific stages of loading
        if (progress?.status === 'ready' || progress?.status === 'done') {
          console.log('[initializeWhisperInstance] Model loading stage complete:', progress);
        }
      },
      (whisperPipeline) => {
        console.log('[initializeWhisperInstance] Whisper model loaded successfully, pipeline:', !!whisperPipeline);
        clearTimeout(timeoutId);
        
        if (!whisperPipeline) {
          console.error('[initializeWhisperInstance] Pipeline is null or undefined after initialization');
          throw new Error('Loaded pipeline is null or undefined');
        }
        
        if (onModelLoaded) {
          console.log('[initializeWhisperInstance] Calling onModelLoaded callback with pipeline');
          onModelLoaded(whisperPipeline);
        } else {
          console.warn('[initializeWhisperInstance] onModelLoaded callback is not defined');
        }
        
        toast.toast({
          title: "Speech recognition ready",
          description: "You can now use voice dictation",
        });
        
        if (setIsModelLoading) {
          console.log('[initializeWhisperInstance] Setting isModelLoading to false');
          setIsModelLoading(false);
        }
      },
      (error) => {
        console.error('[initializeWhisperInstance] Error loading Whisper model:', error);
        clearTimeout(timeoutId);
        toast.toast({
          title: "Failed to load speech recognition",
          description: "Will use cloud transcription as fallback",
          variant: "destructive"
        });
        
        if (setIsModelLoading) {
          setIsModelLoading(false);
        }
        
        // Log details about the error
        console.error('[initializeWhisperInstance] Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
        
        throw error; // Rethrow to handle at the caller level
      }
    );
  } catch (error) {
    console.error('[initializeWhisperInstance] Error in initializeWhisper:', error);
    
    // Log more detailed error information
    if (error instanceof Error) {
      console.error('[initializeWhisperInstance] Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause
      });
    } else {
      console.error('[initializeWhisperInstance] Non-Error object thrown:', error);
    }
    
    toast.toast({
      title: "Using cloud transcription instead",
      description: error.message || "Local speech recognition unavailable",
      variant: "destructive"
    });
    
    if (setIsModelLoading) {
      setIsModelLoading(false);
    }
    
    throw error; // Rethrow to handle at the caller level
  }
};
