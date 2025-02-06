
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
    
    // Initialize the pipeline with explicit configuration
    const whisperPipeline = await pipeline(
      "automatic-speech-recognition",
      "Xenova/whisper-tiny.en",
      {
        progress_callback: onProgress,
        revision: "main",
        quantized: true,
        config: {
          chunk_length_s: 30,
          stride_length_s: 5
        }
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
