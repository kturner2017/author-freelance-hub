
import { pipeline } from '@huggingface/transformers';

export const initializeWhisperModel = async (
  onProgress: (progress: any) => void,
  onSuccess: (pipeline: any) => void,
  onError: (error: Error) => void
) => {
  if (!onProgress || !onSuccess || !onError) {
    console.error('Missing required callback functions');
    return;
  }

  try {
    console.log('Initializing Whisper model...');
    
    // Using the smaller model for faster loading
    const modelName = "Xenova/whisper-tiny.en";
    console.log(`Loading model: ${modelName}`);
    
    const whisperPipeline = await pipeline(
      "automatic-speech-recognition",
      modelName,
      {
        progress_callback: (progress) => {
          console.log('Model loading progress:', progress);
          onProgress(progress);
        },
        revision: "main",
        // The 'quantized' property is not supported in the @huggingface/transformers package
        // Removing it to fix the error
      }
    );

    if (!whisperPipeline) {
      throw new Error('Failed to initialize Whisper pipeline');
    }

    console.log('Whisper model initialized successfully');
    onSuccess(whisperPipeline);
  } catch (error) {
    console.error('Error initializing Whisper model:', error);
    onError(error as Error);
  }
};
