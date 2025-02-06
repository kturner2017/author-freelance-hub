
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
    console.error('Audio data too short');
    return false;
  }
  
  const hasValidSamples = audioData.some(sample => Math.abs(sample) > 0.01);
  if (!hasValidSamples) {
    console.error('Audio data contains no significant samples');
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

    const audioContext = new AudioContext();
    const arrayBuffer = await blob.arrayBuffer();
    console.log('Audio buffer size:', arrayBuffer.byteLength);
    
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    console.log('Decoded audio duration:', audioBuffer.duration);
    
    // Create buffer at 16kHz
    const offlineContext = new OfflineAudioContext(1, audioBuffer.duration * 16000, 16000);
    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineContext.destination);
    source.start();

    const renderedBuffer = await offlineContext.startRendering();
    const audioData = renderedBuffer.getChannelData(0);
    console.log('Rendered audio data length:', audioData.length);

    // Validate the audio data
    if (!validateAudioData(audioData)) {
      console.error('Audio validation failed');
      return null;
    }

    // Normalize audio
    const maxAmplitude = Math.max(...Array.from(audioData).map(Math.abs));
    if (maxAmplitude === 0) {
      console.error('Audio data has zero amplitude');
      return null;
    }

    const normalizedData = new Float32Array(audioData.length);
    for (let i = 0; i < audioData.length; i++) {
      normalizedData[i] = audioData[i] / maxAmplitude;
    }

    console.log('Audio processing complete:', {
      sampleRate: 16000,
      duration: normalizedData.length / 16000,
      samples: normalizedData.length,
      maxAmplitude
    });

    return normalizedData;
  } catch (error) {
    console.error('Error converting audio:', error);
    return null;
  }
};
