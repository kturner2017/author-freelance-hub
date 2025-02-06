
export const validateAudioData = (audioData: Float32Array): boolean => {
  if (!audioData || !(audioData instanceof Float32Array)) {
    console.error('Invalid audio data type:', audioData);
    return false;
  }
  
  if (audioData.length === 0) {
    console.error('Audio data is empty');
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
    const audioContext = new AudioContext({
      sampleRate: 16000 // Explicitly set sample rate for Whisper
    });
    
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    // Create an offline context for resampling
    const offlineContext = new OfflineAudioContext({
      numberOfChannels: 1,
      length: Math.ceil(audioBuffer.duration * 16000),
      sampleRate: 16000
    });

    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineContext.destination);
    source.start();

    const renderedBuffer = await offlineContext.startRendering();
    const channelData = renderedBuffer.getChannelData(0);
    
    // Convert to mono if needed
    const monoData = new Float32Array(channelData.length);
    for (let i = 0; i < channelData.length; i++) {
      monoData[i] = channelData[i];
    }
    
    // Ensure minimum length
    if (monoData.length < 16000) { // At least 1 second of audio
      console.error('Audio data too short');
      return null;
    }
    
    // Normalize audio data
    const maxAmplitude = Math.max(...Array.from(monoData).map(Math.abs));
    const normalizedData = new Float32Array(monoData.length);
    for (let i = 0; i < monoData.length; i++) {
      normalizedData[i] = maxAmplitude > 0 ? monoData[i] / maxAmplitude : monoData[i];
    }

    return normalizedData;
  } catch (error) {
    console.error('Error converting audio:', error);
    return null;
  }
};
