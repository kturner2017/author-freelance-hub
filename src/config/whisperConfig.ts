
import { pipeline } from '@huggingface/transformers';

export const initializeWhisperModel = async (
  onProgress: (progress: any) => void,
  onSuccess: (pipeline: any) => void,
  onError: (error: Error) => void
) => {
  try {
    console.log('Initializing Whisper model...');
    const whisperPipeline = await pipeline(
      "automatic-speech-recognition",
      "Xenova/whisper-tiny.en",
      {
        progress_callback: onProgress,
        chunk_length: 30, // Process in 30-second chunks 
        stride_length: 5  // 5-second overlap between chunks
      }
    );
    console.log('Whisper model initialized successfully');
    onSuccess(whisperPipeline);
  } catch (error) {
    console.error('Error initializing Whisper model:', error);
    onError(error as Error);
  }
};
