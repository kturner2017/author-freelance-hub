
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
    console.log('Starting Whisper model initialization...');
    toast.toast({
      title: "Loading speech recognition model",
      description: "This may take a moment on first use",
    });

    // Set a timeout to fallback if loading takes too long
    const timeoutId = setTimeout(() => {
      console.warn('Model loading timeout - browser may not be compatible');
      throw new Error('Model loading timed out - your browser may not be compatible');
    }, 30000); // 30-second timeout

    await initializeWhisperModel(
      (progress) => {
        console.log('Model loading progress:', progress);
        if (progress?.status === 'error') {
          console.error('Model loading error:', progress);
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
      },
      (whisperPipeline) => {
        console.log('Whisper model loaded successfully');
        clearTimeout(timeoutId);
        if (onModelLoaded) {
          onModelLoaded(whisperPipeline);
        }
        toast.toast({
          title: "Speech recognition ready",
          description: "You can now use voice dictation",
        });
        if (setIsModelLoading) {
          setIsModelLoading(false);
        }
      },
      (error) => {
        console.error('Error loading Whisper model:', error);
        clearTimeout(timeoutId);
        toast.toast({
          title: "Failed to load speech recognition",
          description: "Will use cloud transcription as fallback",
          variant: "destructive"
        });
        if (setIsModelLoading) {
          setIsModelLoading(false);
        }
        throw error; // Rethrow to handle at the caller level
      }
    );
  } catch (error) {
    console.error('Error in initializeWhisper:', error);
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
