
export const validateAudioData = (audioData: Float32Array): boolean => {
  if (!audioData || !(audioData instanceof Float32Array)) {
    console.error('Invalid audio data type:', audioData);
    return false;
  }
  
  if (audioData.length === 0) {
    console.error('Audio data is empty');
    return false;
  }
  
  const minSamples = 8000; // At least 0.5 second of audio at 16kHz
  if (audioData.length < minSamples) {
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
  
  const minAmplitude = 0.005; // Lower threshold to accept more inputs
  const hasValidSamples = maxAmplitude > minAmplitude;
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

    // Create a new AudioContext for each conversion to avoid stale contexts
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
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
      return null;
    } finally {
      // Close the audio context when done
      if (audioContext.state !== 'closed') {
        await audioContext.close();
      }
    }
  } catch (error) {
    console.error('Error converting audio:', error);
    return null;
  }
};
