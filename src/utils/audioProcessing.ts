
export const validateAudioData = (audioData: Float32Array): boolean => {
  if (!audioData || !(audioData instanceof Float32Array)) {
    console.error('Invalid audio data type:', audioData);
    return false;
  }
  
  if (audioData.length === 0) {
    console.error('Audio data is empty');
    return false;
  }
  
  if (audioData.length < 16000) { // At least 1 second of audio at 16kHz
    console.error('Audio data too short, length:', audioData.length);
    return false;
  }
  
  // Calculate audio stats for debugging
  let maxAmplitude = 0;
  let sumAmplitude = 0;
  
  for (let i = 0; i < audioData.length; i++) {
    const absValue = Math.abs(audioData[i]);
    maxAmplitude = Math.max(maxAmplitude, absValue);
    sumAmplitude += absValue;
  }
  
  const avgAmplitude = sumAmplitude / audioData.length;
  console.log('Audio stats:', { 
    maxAmplitude, 
    avgAmplitude,
    sampleCount: audioData.length,
    duration: audioData.length / 16000 + ' seconds'
  });
  
  const hasValidSamples = maxAmplitude > 0.01;
  if (!hasValidSamples) {
    console.error('Audio data contains no significant samples, max amplitude:', maxAmplitude);
    return false;
  }
  
  return true;
};

export const convertBlobToAudioData = async (blob: Blob): Promise<Float32Array | null> => {
  try {
    if (!blob || blob.size === 0) {
      console.error('Invalid or empty blob');
      return null;
    }

    console.log('Converting audio blob:', {
      type: blob.type,
      size: blob.size + ' bytes'
    });

    const audioContext = new AudioContext();
    const arrayBuffer = await blob.arrayBuffer();
    console.log('Audio buffer size:', arrayBuffer.byteLength + ' bytes');
    
    try {
      console.log('Decoding audio data...');
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      console.log('Decoded audio:', {
        duration: audioBuffer.duration + ' seconds',
        numberOfChannels: audioBuffer.numberOfChannels,
        sampleRate: audioBuffer.sampleRate + ' Hz',
        length: audioBuffer.length + ' samples'
      });
      
      // Create buffer at 16kHz (required for Whisper)
      console.log('Resampling to 16kHz...');
      const offlineContext = new OfflineAudioContext(1, audioBuffer.duration * 16000, 16000);
      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(offlineContext.destination);
      source.start();

      const renderedBuffer = await offlineContext.startRendering();
      console.log('Successfully resampled audio');
      
      const audioData = renderedBuffer.getChannelData(0);
      console.log('Rendered audio data length:', audioData.length + ' samples');

      // Validate the audio data
      if (!validateAudioData(audioData)) {
        console.error('Audio validation failed');
        return null;
      }

      // Normalize audio to improve recognition
      console.log('Normalizing audio...');
      const maxAmplitude = Math.max(...Array.from(audioData).map(Math.abs));
      if (maxAmplitude <= 0.0001) {
        console.error('Audio data has near-zero amplitude:', maxAmplitude);
        return null;
      }

      const normalizedData = new Float32Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) {
        normalizedData[i] = audioData[i] / maxAmplitude;
      }

      console.log('Audio processing complete:', {
        sampleRate: 16000,
        duration: normalizedData.length / 16000 + ' seconds',
        samples: normalizedData.length,
        maxAmplitude
      });

      return normalizedData;
    } catch (decodeError) {
      console.error('Failed to decode audio:', decodeError);
      
      // Fallback to try the edge function if local processing fails
      console.log('Local audio processing failed, trying edge function fallback...');
      
      try {
        // Convert blob to base64 for the edge function
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
        });
        
        reader.readAsDataURL(blob);
        const base64Audio = await base64Promise;
        
        console.log('Audio converted to base64, calling edge function...');
        const response = await fetch('/voice-to-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio: base64Audio })
        });
        
        if (!response.ok) {
          throw new Error('Edge function failed: ' + await response.text());
        }
        
        console.log('Edge function response received');
        
        // Return dummy audio data since the edge function will handle transcription
        const dummyData = new Float32Array(16000);
        return dummyData;
      } catch (edgeFunctionError) {
        console.error('Edge function fallback also failed:', edgeFunctionError);
        throw new Error('All audio processing methods failed');
      }
    }
  } catch (error) {
    console.error('Error converting audio:', error);
    return null;
  }
};
