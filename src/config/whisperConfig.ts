
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
    
    // Using the smallest model for faster loading and better compatibility
    const modelName = "Xenova/whisper-tiny.en";
    console.log(`Loading model: ${modelName}`);
    
    // Configure the pipeline with specific options for better performance
    const whisperPipeline = await pipeline(
      "automatic-speech-recognition",
      modelName,
      {
        progress_callback: (progress) => {
          console.log('Model loading progress:', progress);
          onProgress(progress);
        },
        revision: "main",
        // Type assertion to allow custom options that may not be in the type definition
        // but are supported by the underlying implementation
      } as any
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
