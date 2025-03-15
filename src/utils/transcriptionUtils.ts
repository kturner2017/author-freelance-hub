
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
    // Combine all audio chunks into a single blob
    const audioBlob = new Blob(chunks, { type: chunks[0]?.type || 'audio/webm' });
    console.log('Processing audio, size:', audioBlob.size, 'bytes');
    
    if (audioBlob.size === 0 || audioBlob.size < 100) { // Check for minimum size
      console.error('No audio recorded or file too small (empty blob)');
      throw new Error('No usable audio recorded');
    }

    console.log('Converting blob to audio data...');
    const audioData = await convertBlobToAudioData(audioBlob);
    console.log('Audio data conversion result:', audioData ? 'Success' : 'Failed');
    
    if (!audioData || !validateAudioData(audioData)) {
      console.error('Invalid audio data after conversion');
      throw new Error('Invalid audio data. Please try speaking louder or checking your microphone.');
    }

    console.log('Audio processed, calling transcriber with data length:', audioData.length);
    toast.toast({
      title: "Processing speech",
      description: "Transcribing your audio..."
    });
    
    // Call Whisper model with specific settings for better transcription
    const output = await transcriber(audioData, {
      task: 'transcribe',
      language: 'en',
      chunk_length_s: 30,
      stride_length_s: 5,
      return_timestamps: false // Don't need timestamps for simple transcription
    });

    console.log('Transcription result:', output);

    if (!output?.text) {
      console.error('No text in transcription output:', output);
      throw new Error('Transcription failed - no text output');
    }

    // Clean up transcription text - remove extra spaces and punctuation issues
    const cleanedText = output.text
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\s([.,;!?])/g, '$1');
      
    console.log('Transcription successful:', cleanedText);
    onTranscriptionComplete(cleanedText);
    toast.toast({
      title: "Transcription complete",
      description: cleanedText.substring(0, 50) + (cleanedText.length > 50 ? '...' : '')
    });
    
    return cleanedText;
  } catch (error) {
    console.error('Transcription error:', error);
    toast.toast({
      title: "Transcription failed",
      description: error.message || 'Error processing audio',
      variant: "destructive"
    });
    
    // Try using the fallback OpenAI API via edge function
    console.log('Attempting fallback transcription via OpenAI API...');
    return processEdgeFunctionTranscription(chunks, toast, onTranscriptionComplete);
  } finally {
    if (setIsTranscriptionInProgress) {
      setIsTranscriptionInProgress(false);
    }
  }
};

/**
 * Uses the edge function as a fallback for transcription
 */
export const processEdgeFunctionTranscription = async (
  chunks: Blob[],
  toast: ReturnType<typeof useToast>,
  onTranscriptionComplete: (text: string) => void
) => {
  try {
    // Combine all audio chunks into a single blob
    const audioBlob = new Blob(chunks, { type: chunks[0]?.type || 'audio/webm' });
    
    if (audioBlob.size === 0 || audioBlob.size < 100) {
      throw new Error('No usable audio recorded');
    }
    
    // Convert blob to base64 for the edge function
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        try {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        } catch (e) {
          reject(new Error('Failed to process audio data'));
        }
      };
      reader.onerror = reject;
    });
    
    reader.readAsDataURL(audioBlob);
    const base64Audio = await base64Promise;
    
    console.log('Audio converted to base64, calling edge function...');
    toast.toast({
      title: "Using cloud transcription",
      description: "Processing your audio in the cloud..."
    });
    
    const response = await fetch('/api/voice-to-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audio: base64Audio })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Edge function error response:', errorText);
      throw new Error('Server transcription failed: ' + (errorText || response.statusText));
    }
    
    const result = await response.json();
    if (result.text) {
      // Clean up transcription text
      const cleanedText = result.text
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/\s([.,;!?])/g, '$1');
        
      onTranscriptionComplete(cleanedText);
      toast.toast({
        title: "Transcription complete",
        description: cleanedText.substring(0, 50) + (cleanedText.length > 50 ? '...' : '')
      });
      return true;
    } else {
      console.error('No text in edge function response:', result);
      throw new Error('No transcription returned from server');
    }
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
