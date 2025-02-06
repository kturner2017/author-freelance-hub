
import { pipeline } from '@huggingface/transformers';

export const initializeWhisperModel = async (
  onProgress: (progress: any) => void,
  onSuccess: (pipeline: any) => void,
  onError: (error: Error) => void
) => {
  try {
    const whisperPipeline = await pipeline(
      "automatic-speech-recognition",
      "Xenova/whisper-tiny.en",
      {
        revision: 'main',
        progress_callback: onProgress,
      }
    );
    onSuccess(whisperPipeline);
  } catch (error) {
    onError(error as Error);
  }
};
