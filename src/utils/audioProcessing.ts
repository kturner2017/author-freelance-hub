
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
    
    // Normalize audio data
    const maxAmplitude = Math.max(...Array.from(channelData).map(Math.abs));
    const normalizedData = new Float32Array(channelData.length);
    for (let i = 0; i < channelData.length; i++) {
      normalizedData[i] = maxAmplitude > 0 ? channelData[i] / maxAmplitude : channelData[i];
    }

    return normalizedData;
  } catch (error) {
    console.error('Error converting audio:', error);
    return null;
  }
};
