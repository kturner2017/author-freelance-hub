
import { validateAudioData, convertBlobToAudioData } from '@/utils/audioProcessing';
import { useToast } from '@/hooks/use-toast';

/**
 * Processes and transcribes audio using the Whisper model
 */
export const processAudioTranscription = async (
  chunks: Blob[],
  transcriber: any,
  toast: ReturnType<typeof useToast>,
  onTranscriptionComplete: (text: string) => void,
  setIsTranscriptionInProgress?: (isInProgress: boolean) => void
) => {
  if (setIsTranscriptionInProgress) {
    setIsTranscriptionInProgress(true);
  }
  
  try {
    const audioBlob = new Blob(chunks, { type: 'audio/webm' });
    console.log('Processing audio, size:', audioBlob.size, 'bytes');
    
    if (audioBlob.size === 0) {
      console.error('No audio recorded (empty blob)');
      throw new Error('No audio recorded');
    }

    console.log('Converting blob to audio data...');
    const audioData = await convertBlobToAudioData(audioBlob);
    console.log('Audio data conversion result:', audioData ? 'Success' : 'Failed');
    
    if (!audioData || !validateAudioData(audioData)) {
      console.error('Invalid audio data after conversion');
      throw new Error('Invalid audio data');
    }

    console.log('Audio processed, calling transcriber with data length:', audioData.length);
    toast.toast({
      title: "Processing speech",
      description: "Transcribing your audio..."
    });
    
    const output = await transcriber(audioData, {
      task: 'transcribe',
      language: 'en'
    });

    console.log('Transcription result:', output);

    if (!output?.text) {
      console.error('No text in transcription output:', output);
      throw new Error('Transcription failed - no text output');
    }

    console.log('Transcription successful:', output.text);
    onTranscriptionComplete(output.text);
    toast.toast({
      title: "Transcription complete",
      description: output.text.substring(0, 50) + (output.text.length > 50 ? '...' : '')
    });
  } catch (error) {
    console.error('Transcription error:', error);
    toast.toast({
      title: "Transcription failed",
      description: error.message || 'Error processing audio',
      variant: "destructive"
    });
    return null;
  } finally {
    if (setIsTranscriptionInProgress) {
      setIsTranscriptionInProgress(false);
    }
  }
};

/**
 * Attempts to use the edge function as a fallback for transcription
 */
export const processEdgeFunctionTranscription = async (
  chunks: Blob[],
  toast: ReturnType<typeof useToast>,
  onTranscriptionComplete: (text: string) => void
) => {
  try {
    // Try fallback to the edge function
    const audioBlob = new Blob(chunks, { type: 'audio/webm' });
    
    // Convert blob to base64 for the edge function
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });
    
    reader.readAsDataURL(audioBlob);
    const base64Audio = await base64Promise;
    
    console.log('Audio converted to base64, calling edge function...');
    const response = await fetch('/api/voice-to-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audio: base64Audio })
    });
    
    if (!response.ok) {
      throw new Error('Edge function failed: ' + await response.text());
    }
    
    const result = await response.json();
    if (result.text) {
      onTranscriptionComplete(result.text);
      toast.toast({
        title: "Transcription complete",
        description: result.text.substring(0, 50) + (result.text.length > 50 ? '...' : '')
      });
      return true;
    }
    
    return false;
  } catch (fallbackError) {
    console.error('Fallback transcription failed:', fallbackError);
    toast.toast({
      title: "Transcription failed",
      description: "All transcription methods failed. Please try again.",
      variant: "destructive"
    });
    return false;
  }
};
