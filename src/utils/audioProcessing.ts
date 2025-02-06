
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
    const audioContext = new AudioContext({
      sampleRate: 16000 // Required sample rate for Whisper
    });
    
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    // Create an offline context for resampling if needed
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
    
    // Get the mono channel data
    const channelData = renderedBuffer.getChannelData(0);
    const monoData = new Float32Array(channelData.length);
    
    // Copy and validate the audio data
    for (let i = 0; i < channelData.length; i++) {
      monoData[i] = channelData[i];
    }
    
    // Validate before proceeding
    if (!validateAudioData(monoData)) {
      console.error('Audio validation failed');
      return null;
    }
    
    // Normalize the audio data
    const maxAmplitude = Math.max(...Array.from(monoData).map(Math.abs));
    if (maxAmplitude === 0) {
      console.error('Audio data has zero amplitude');
      return null;
    }
    
    const normalizedData = new Float32Array(monoData.length);
    for (let i = 0; i < monoData.length; i++) {
      normalizedData[i] = monoData[i] / maxAmplitude;
    }

    console.log('Audio processing complete:', {
      sampleRate: 16000,
      duration: normalizedData.length / 16000,
      samples: normalizedData.length
    });

    return normalizedData;
  } catch (error) {
    console.error('Error converting audio:', error);
    return null;
  }
};
