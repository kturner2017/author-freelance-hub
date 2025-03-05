
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

    await initializeWhisperModel(
      (progress) => {
        console.log('Model loading progress:', progress);
        if (progress?.status === 'error') {
          console.error('Model loading error:', progress);
          throw new Error('Model loading failed');
        }
      },
      (whisperPipeline) => {
        console.log('Whisper model loaded successfully');
        if (onModelLoaded) {
          onModelLoaded(whisperPipeline);
        }
        toast.toast({
          title: "Speech recognition ready",
          description: "You can now use voice dictation",
        });
      },
      (error) => {
        console.error('Error loading Whisper model:', error);
        toast.toast({
          title: "Failed to load speech recognition",
          description: "Please try again later",
          variant: "destructive"
        });
      }
    );
  } catch (error) {
    console.error('Error in initializeWhisper:', error);
    toast.toast({
      title: "Initialization failed",
      description: error.message || "Failed to initialize speech recognition",
      variant: "destructive"
    });
  } finally {
    if (setIsModelLoading) {
      setIsModelLoading(false);
    }
  }
};
