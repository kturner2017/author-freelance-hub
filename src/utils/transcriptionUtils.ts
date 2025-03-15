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
    // Log the chunks we received
    console.log('[processAudioTranscription] Processing audio chunks:', chunks.map(chunk => ({
      type: chunk.type,
      size: chunk.size
    })));
    
    // Combine all audio chunks into a single blob
    const audioBlob = new Blob(chunks, { type: chunks[0]?.type || 'audio/webm' });
    console.log('[processAudioTranscription] Combined blob created:', {
      type: audioBlob.type,
      size: audioBlob.size,
      chunks: chunks.length
    });
    
    if (audioBlob.size === 0 || audioBlob.size < 100) { // Check for minimum size
      console.error('[processAudioTranscription] No audio recorded or file too small (empty blob)');
      throw new Error('No usable audio recorded');
    }

    console.log('[processAudioTranscription] Converting blob to audio data...');
    const audioData = await convertBlobToAudioData(audioBlob);
    console.log('[processAudioTranscription] Audio data conversion result:', audioData ? 'Success' : 'Failed');
    
    if (!audioData) {
      console.error('[processAudioTranscription] Audio data conversion failed, returning null');
      throw new Error('Failed to convert audio data');
    }
    
    if (!validateAudioData(audioData)) {
      console.error('[processAudioTranscription] Audio data validation failed');
      throw new Error('Invalid audio data. Please try speaking louder or checking your microphone.');
    }

    console.log(`[processAudioTranscription] Audio processed, calling transcriber with data length: ${audioData.length}`);
    toast.toast({
      title: "Processing speech",
      description: "Transcribing your audio..."
    });
    
    console.log('[processAudioTranscription] Whisper transcriber type:', typeof transcriber);
    console.log('[processAudioTranscription] Available methods on transcriber:', 
      Object.getOwnPropertyNames(transcriber).filter(prop => typeof transcriber[prop] === 'function'));
    
    try {
      // Call Whisper model with specific settings for better transcription
      console.log('[processAudioTranscription] Starting Whisper transcription...');
      
      // Direct pipeline call without inspecting methods
      console.log('[processAudioTranscription] Using direct pipeline call');
      const output = await transcriber(audioData);

      console.log('[processAudioTranscription] Transcription result:', output);

      if (!output) {
        console.error('[processAudioTranscription] Transcription output is null or undefined');
        throw new Error('Transcription failed - no output received');
      }

      // Handle different output formats
      let text = '';
      if (typeof output === 'string') {
        text = output;
      } else if (output.text) {
        text = output.text;
      } else if (output.generated_text) {
        text = output.generated_text;
      } else if (Array.isArray(output) && output.length > 0) {
        // Some models return an array of results
        text = output[0].text || output[0].generated_text || '';
      } else {
        console.error('[processAudioTranscription] Unrecognized output format:', output);
        throw new Error('Unrecognized transcription output format');
      }

      if (!text) {
        console.error('[processAudioTranscription] No text in transcription output:', output);
        throw new Error('Transcription failed - no text output');
      }

      // Clean up transcription text - remove extra spaces and punctuation issues
      const cleanedText = text
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/\s([.,;!?])/g, '$1');
        
      console.log('[processAudioTranscription] Transcription successful:', cleanedText);
      onTranscriptionComplete(cleanedText);
      toast.toast({
        title: "Transcription complete",
        description: cleanedText.substring(0, 50) + (cleanedText.length > 50 ? '...' : '')
      });
      
      return cleanedText;
    } catch (transcriptionError) {
      console.error('[processAudioTranscription] Error during Whisper transcription:', transcriptionError);
      throw new Error(`Whisper transcription error: ${transcriptionError.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('[processAudioTranscription] Transcription error:', error);
    toast.toast({
      title: "Transcription failed",
      description: error.message || 'Error processing audio',
      variant: "destructive"
    });
    
    // Try using the fallback OpenAI API via edge function
    console.log('[processAudioTranscription] Attempting fallback transcription via OpenAI API...');
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
    console.log('[processEdgeFunctionTranscription] Starting fallback transcription with chunks:', chunks.length);
    
    // Combine all audio chunks into a single blob
    const audioBlob = new Blob(chunks, { type: chunks[0]?.type || 'audio/webm' });
    console.log('[processEdgeFunctionTranscription] Combined blob:', {
      type: audioBlob.type,
      size: audioBlob.size + ' bytes'
    });
    
    if (audioBlob.size === 0 || audioBlob.size < 100) {
      console.error('[processEdgeFunctionTranscription] No usable audio recorded, blob too small');
      throw new Error('No usable audio recorded');
    }
    
    // Convert blob to base64 for the edge function
    const reader = new FileReader();
    console.log('[processEdgeFunctionTranscription] Converting blob to base64...');
    
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        try {
          if (!reader.result) {
            console.error('[processEdgeFunctionTranscription] FileReader result is null');
            reject(new Error('FileReader produced null result'));
            return;
          }
          
          if (typeof reader.result !== 'string') {
            console.error('[processEdgeFunctionTranscription] FileReader result is not a string:', typeof reader.result);
            reject(new Error('FileReader produced non-string result'));
            return;
          }
          
          const base64 = reader.result.split(',')[1];
          if (!base64) {
            console.error('[processEdgeFunctionTranscription] Could not extract base64 data from FileReader result');
            reject(new Error('Failed to extract base64 data'));
            return;
          }
          
          console.log(`[processEdgeFunctionTranscription] Base64 conversion complete, length: ${base64.length} chars`);
          resolve(base64);
        } catch (e) {
          console.error('[processEdgeFunctionTranscription] Error processing FileReader result:', e);
          reject(new Error('Failed to process audio data: ' + e.message));
        }
      };
      
      reader.onerror = (event) => {
        console.error('[processEdgeFunctionTranscription] FileReader error:', reader.error, event);
        reject(new Error('FileReader error: ' + (reader.error?.message || 'Unknown error')));
      };
    });
    
    reader.readAsDataURL(audioBlob);
    const base64Audio = await base64Promise;
    
    console.log('[processEdgeFunctionTranscription] Audio converted to base64, calling edge function...');
    toast.toast({
      title: "Using cloud transcription",
      description: "Processing your audio in the cloud..."
    });
    
    try {
      console.log('[processEdgeFunctionTranscription] Sending request to voice-to-text API');
      const response = await fetch('/api/voice-to-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio: base64Audio })
      });
      
      console.log('[processEdgeFunctionTranscription] API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[processEdgeFunctionTranscription] Edge function error response:', errorText, 'Status:', response.status);
        throw new Error('Server transcription failed: ' + (errorText || response.statusText));
      }
      
      console.log('[processEdgeFunctionTranscription] Parsing API response...');
      const result = await response.json();
      console.log('[processEdgeFunctionTranscription] API result:', result);
      
      if (result.text) {
        // Clean up transcription text
        const cleanedText = result.text
          .trim()
          .replace(/\s+/g, ' ')
          .replace(/\s([.,;!?])/g, '$1');
          
        console.log('[processEdgeFunctionTranscription] Transcription successful:', cleanedText);
        onTranscriptionComplete(cleanedText);
        toast.toast({
          title: "Transcription complete",
          description: cleanedText.substring(0, 50) + (cleanedText.length > 50 ? '...' : '')
        });
        return true;
      } else {
        console.error('[processEdgeFunctionTranscription] No text in edge function response:', result);
        throw new Error('No transcription returned from server');
      }
    } catch (apiError) {
      console.error('[processEdgeFunctionTranscription] API call error:', apiError);
      throw new Error('API transcription failed: ' + apiError.message);
    }
  } catch (fallbackError) {
    console.error('[processEdgeFunctionTranscription] Fallback transcription failed:', fallbackError);
    toast.toast({
      title: "Transcription failed",
      description: "All transcription methods failed. Please try again.",
      variant: "destructive"
    });
    return false;
  }
};
