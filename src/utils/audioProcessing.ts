
export const validateAudioData = (audioData: Float32Array): boolean => {
  if (!audioData) {
    console.error('[validateAudioData] Audio data is null or undefined');
    return false;
  }
  
  if (!(audioData instanceof Float32Array)) {
    console.error('[validateAudioData] Invalid audio data type:', typeof audioData, audioData);
    return false;
  }
  
  if (audioData.length === 0) {
    console.error('[validateAudioData] Audio data is empty');
    return false;
  }
  
  const minSamples = 4000; // Reduced threshold to accept shorter recordings
  if (audioData.length < minSamples) {
    console.error(`[validateAudioData] Audio data too short, length: ${audioData.length}, minimum required: ${minSamples}`);
    return false;
  }
  
  // Calculate audio stats for debugging
  let maxAmplitude = 0;
  let sumAmplitude = 0;
  let nonZeroSamples = 0;
  
  for (let i = 0; i < audioData.length; i++) {
    const absValue = Math.abs(audioData[i]);
    maxAmplitude = Math.max(maxAmplitude, absValue);
    sumAmplitude += absValue;
    if (absValue > 0.0001) nonZeroSamples++;
  }
  
  const avgAmplitude = sumAmplitude / audioData.length;
  console.log('[validateAudioData] Audio stats:', { 
    maxAmplitude, 
    avgAmplitude,
    sampleCount: audioData.length,
    nonZeroSamples,
    nonZeroPercentage: (nonZeroSamples / audioData.length * 100).toFixed(2) + '%',
    duration: (audioData.length / 16000).toFixed(2) + ' seconds'
  });
  
  const minAmplitude = 0.001; // Lower threshold to accept more inputs
  const hasValidSamples = maxAmplitude > minAmplitude;
  if (!hasValidSamples) {
    console.error(`[validateAudioData] Audio data contains no significant samples, max amplitude: ${maxAmplitude}, minimum required: ${minAmplitude}`);
    return false;
  }
  
  return true;
};

export const convertBlobToAudioData = async (blob: Blob): Promise<Float32Array | null> => {
  try {
    if (!blob) {
      console.error('[convertBlobToAudioData] Blob is null or undefined');
      return null;
    }
    
    if (blob.size === 0) {
      console.error('[convertBlobToAudioData] Empty blob with zero size');
      return null;
    }

    console.log('[convertBlobToAudioData] Processing audio blob:', {
      type: blob.type,
      size: blob.size + ' bytes'
    });

    // Create a new AudioContext for each conversion to avoid stale contexts
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      console.error('[convertBlobToAudioData] AudioContext is not supported in this browser');
      return null;
    }
    
    const audioContext = new AudioContextClass();
    console.log(`[convertBlobToAudioData] Created AudioContext, state: ${audioContext.state}, sample rate: ${audioContext.sampleRate}`);
    
    try {
      console.log('[convertBlobToAudioData] Converting blob to array buffer...');
      const arrayBuffer = await blob.arrayBuffer();
      console.log(`[convertBlobToAudioData] Array buffer created, size: ${arrayBuffer.byteLength} bytes`);
      
      if (arrayBuffer.byteLength === 0) {
        console.error('[convertBlobToAudioData] Array buffer is empty');
        await audioContext.close();
        return null;
      }
      
      try {
        console.log('[convertBlobToAudioData] Starting audio data decoding...');
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        console.log('[convertBlobToAudioData] Decoded audio successfully:', {
          duration: audioBuffer.duration.toFixed(2) + ' seconds',
          numberOfChannels: audioBuffer.numberOfChannels,
          sampleRate: audioBuffer.sampleRate + ' Hz',
          length: audioBuffer.length + ' samples'
        });
        
        // Check if the decoded audio has valid data
        if (audioBuffer.length === 0 || audioBuffer.numberOfChannels === 0) {
          console.error('[convertBlobToAudioData] Decoded audio buffer is empty');
          await audioContext.close();
          return null;
        }
        
        // Create buffer at 16kHz (required for Whisper)
        console.log('[convertBlobToAudioData] Resampling to 16kHz...');
        const offlineContext = new OfflineAudioContext(1, audioBuffer.duration * 16000, 16000);
        const source = offlineContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(offlineContext.destination);
        source.start();

        try {
          console.log('[convertBlobToAudioData] Starting offline rendering...');
          const renderedBuffer = await offlineContext.startRendering();
          console.log('[convertBlobToAudioData] Successfully resampled audio to 16kHz');
          
          const audioData = renderedBuffer.getChannelData(0);
          console.log(`[convertBlobToAudioData] Rendered audio data length: ${audioData.length} samples`);

          // Analyze audio data for debugging
          let maxValue = 0;
          let minValue = 0;
          let sumValue = 0;
          let nonZeroSamples = 0;
          
          for (let i = 0; i < audioData.length; i++) {
            maxValue = Math.max(maxValue, audioData[i]);
            minValue = Math.min(minValue, audioData[i]);
            sumValue += Math.abs(audioData[i]);
            if (Math.abs(audioData[i]) > 0.0001) nonZeroSamples++;
          }
          
          console.log('[convertBlobToAudioData] Audio data analysis:', {
            maxValue,
            minValue,
            avgAbsValue: sumValue / audioData.length,
            nonZeroSamples,
            nonZeroPercentage: (nonZeroSamples / audioData.length * 100).toFixed(2) + '%'
          });

          // Normalize audio to improve recognition
          console.log('[convertBlobToAudioData] Normalizing audio...');
          let maxAmplitude = 0;
          for (let i = 0; i < audioData.length; i++) {
            maxAmplitude = Math.max(maxAmplitude, Math.abs(audioData[i]));
          }
          
          if (maxAmplitude <= 0.0001) {
            console.error(`[convertBlobToAudioData] Audio data has near-zero amplitude: ${maxAmplitude}`);
            await audioContext.close();
            return null;
          }

          const normalizedData = new Float32Array(audioData.length);
          for (let i = 0; i < audioData.length; i++) {
            normalizedData[i] = audioData[i] / maxAmplitude * 0.95; // Scale to 95% to avoid clipping
          }

          console.log('[convertBlobToAudioData] Audio processing complete:', {
            sampleRate: 16000,
            duration: (normalizedData.length / 16000).toFixed(2) + ' seconds',
            samples: normalizedData.length,
            maxAmplitude,
            normalizationFactor: (0.95 / maxAmplitude).toFixed(4)
          });

          // Close audio context to free resources
          await audioContext.close();
          
          return normalizedData;
        } catch (renderError) {
          console.error('[convertBlobToAudioData] Offline context rendering error:', renderError);
          await audioContext.close();
          return null;
        }
      } catch (decodeError) {
        console.error('[convertBlobToAudioData] Failed to decode audio:', decodeError);
        if (audioContext.state !== 'closed') {
          await audioContext.close();
        }
        return null;
      }
    } catch (arrayBufferError) {
      console.error('[convertBlobToAudioData] Array buffer conversion error:', arrayBufferError);
      if (audioContext.state !== 'closed') {
        await audioContext.close();
      }
      return null;
    }
  } catch (error) {
    console.error('[convertBlobToAudioData] Top-level error converting audio:', error);
    return null;
  }
};
