
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
        // Note: removed quantized option as it's not in the type definition
        revision: "main",
        chunk_length_s: 30, // Process in smaller chunks for better performance
        stride_length_s: 5,
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
