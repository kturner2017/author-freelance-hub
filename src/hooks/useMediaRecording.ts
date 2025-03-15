
import { useRef, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useMediaRecording = (onDataAvailable: (chunks: Blob[]) => void) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  // Clean up any ongoing recording when component unmounts
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        console.log('[useMediaRecording] Cleanup: stopping recorder on unmount');
        mediaRecorderRef.current.stop();
      }
      
      if (streamRef.current) {
        console.log('[useMediaRecording] Cleanup: stopping all tracks on unmount');
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Function to get the best microphone from the list of available devices
  const getBestMicrophone = async (): Promise<MediaDeviceInfo | null> => {
    try {
      console.log('[useMediaRecording] Getting list of audio input devices');
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputDevices = devices.filter(device => device.kind === 'audioinput');
      
      console.log('[useMediaRecording] Available audio input devices:', 
        audioInputDevices.map(d => ({ deviceId: d.deviceId, label: d.label, groupId: d.groupId })));
      
      if (audioInputDevices.length === 0) {
        console.warn('[useMediaRecording] No audio input devices found');
        return null;
      }
      
      // Prefer built-in microphone by looking for keywords in the device label
      const builtInKeywords = ['built-in', 'internal', 'default', 'integrated'];
      let bestDevice = null;
      
      // First try to find a device with built-in keywords
      for (const keyword of builtInKeywords) {
        const device = audioInputDevices.find(d => 
          d.label.toLowerCase().includes(keyword));
        if (device) {
          console.log(`[useMediaRecording] Found built-in microphone with keyword "${keyword}":`, device.label);
          bestDevice = device;
          break;
        }
      }
      
      // If no built-in device found, use the first device that doesn't mention "bluetooth" or "airpods"
      if (!bestDevice) {
        bestDevice = audioInputDevices.find(d => {
          const label = d.label.toLowerCase();
          return !label.includes('bluetooth') && !label.includes('airpods') && !label.includes('headset');
        });
      }
      
      // If still no device found, use the first available device
      if (!bestDevice && audioInputDevices.length > 0) {
        bestDevice = audioInputDevices[0];
      }
      
      if (bestDevice) {
        console.log('[useMediaRecording] Selected microphone:', bestDevice.label);
      } else {
        console.warn('[useMediaRecording] No suitable microphone found');
      }
      
      return bestDevice;
    } catch (error) {
      console.error('[useMediaRecording] Error enumerating audio devices:', error);
      return null;
    }
  };

  const startRecording = async () => {
    try {
      // Stop any existing recording first
      if (isRecording) {
        console.log('[useMediaRecording] Recording already in progress, stopping first');
        stopRecording();
      }
      
      console.log('[useMediaRecording] Requesting microphone access...');
      
      // First get access to any microphone to ensure permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Then get the best available microphone
      const bestMicrophone = await getBestMicrophone();
      
      // Prepare audio constraints with the selected device if available
      const constraints: MediaStreamConstraints = { 
        audio: {
          deviceId: bestMicrophone ? { exact: bestMicrophone.deviceId } : undefined,
          channelCount: 1,
          sampleRate: { ideal: 16000 },
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      };
      
      console.log('[useMediaRecording] Using audio constraints:', JSON.stringify(constraints));
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      console.log('[useMediaRecording] Microphone access granted, tracks:', stream.getAudioTracks().map(t => ({
        kind: t.kind,
        label: t.label,
        enabled: t.enabled,
        muted: t.muted,
        readyState: t.readyState
      })));
      
      streamRef.current = stream;
      
      // Check supported mime types - try multiple formats
      const mimeTypes = [
        'audio/webm',
        'audio/webm;codecs=opus',
        'audio/ogg;codecs=opus',
        'audio/mp4',
        'audio/mpeg'
      ];
      
      let selectedMimeType = '';
      for (const type of mimeTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          selectedMimeType = type;
          break;
        }
      }
      
      if (!selectedMimeType) {
        selectedMimeType = ''; // Use browser default
        console.warn('[useMediaRecording] No supported mime type found, using browser default');
      }
      
      console.log(`[useMediaRecording] Using mime type: ${selectedMimeType || 'browser default'}`);
      
      // Create MediaRecorder with appropriate settings
      const recorderOptions: MediaRecorderOptions = {
        audioBitsPerSecond: 128000
      };
      
      if (selectedMimeType) {
        recorderOptions.mimeType = selectedMimeType;
      }
      
      console.log('[useMediaRecording] Creating MediaRecorder with options:', recorderOptions);
      const mediaRecorder = new MediaRecorder(stream, recorderOptions);
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        console.log(`[useMediaRecording] Data available event: size=${e.data.size}, type=${e.data.type}`);
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
          console.log(`[useMediaRecording] Added chunk #${chunksRef.current.length}, total chunks: ${chunksRef.current.length}`);
        } else {
          console.warn('[useMediaRecording] Received empty data chunk');
        }
      };

      mediaRecorder.onstop = () => {
        console.log(`[useMediaRecording] MediaRecorder stopped, chunks: ${chunksRef.current.length}`);
        console.log(`[useMediaRecording] Total recording size: ${chunksRef.current.reduce((total, chunk) => total + chunk.size, 0)} bytes`);
        
        if (chunksRef.current.length > 0) {
          console.log('[useMediaRecording] Calling onDataAvailable with chunks');
          onDataAvailable(chunksRef.current);
        } else {
          console.error('[useMediaRecording] No audio data collected');
          toast({
            title: "Recording failed",
            description: "No audio data was collected. Please try again.",
            variant: "destructive"
          });
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('[useMediaRecording] MediaRecorder error:', event);
        toast({
          title: "Recording error",
          description: "An error occurred during recording",
          variant: "destructive"
        });
      };

      // Start recording with timeslice to get more frequent ondataavailable events
      console.log('[useMediaRecording] Starting MediaRecorder with 500ms timeslice');
      mediaRecorder.start(500); // Collect data every 500ms
      setIsRecording(true);
      console.log('[useMediaRecording] Recording started successfully');
    } catch (error) {
      console.error('[useMediaRecording] Error starting recording:', error);
      toast({
        title: "Recording failed",
        description: "Please check your microphone access and browser permissions",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      console.log(`[useMediaRecording] Stopping MediaRecorder, current state: ${mediaRecorderRef.current.state}`);
      
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.error('[useMediaRecording] Error stopping media recorder:', e);
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          console.log(`[useMediaRecording] Stopping track: ${track.kind}, ${track.label}, ready state: ${track.readyState}`);
          track.stop();
        });
        streamRef.current = null;
      }
      
      setIsRecording(false);
      console.log('[useMediaRecording] Recording stopped successfully');
    } else {
      console.log('[useMediaRecording] No active recording to stop');
    }
  };

  return {
    isRecording,
    startRecording,
    stopRecording
  };
};
