
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
        mediaRecorderRef.current.stop();
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      // Stop any existing recording first
      if (isRecording) {
        stopRecording();
      }
      
      console.log('Requesting microphone access...');
      // Try different constraints for better compatibility across browsers
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: { ideal: 16000 },
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
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
        console.warn('No supported mime type found, using browser default');
      }
      
      console.log(`Using mime type: ${selectedMimeType || 'browser default'}`);
      
      // Create MediaRecorder with appropriate settings
      const recorderOptions: MediaRecorderOptions = {
        audioBitsPerSecond: 128000
      };
      
      if (selectedMimeType) {
        recorderOptions.mimeType = selectedMimeType;
      }
      
      const mediaRecorder = new MediaRecorder(stream, recorderOptions);
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        console.log('Data available:', e.data.size);
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        console.log('MediaRecorder stopped, chunks:', chunksRef.current.length);
        if (chunksRef.current.length > 0) {
          onDataAvailable(chunksRef.current);
        } else {
          console.error('No audio data collected');
          toast({
            title: "Recording failed",
            description: "No audio data was collected. Please try again.",
            variant: "destructive"
          });
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        toast({
          title: "Recording error",
          description: "An error occurred during recording",
          variant: "destructive"
        });
      };

      // Start recording with timeslice to get more frequent ondataavailable events
      mediaRecorder.start(500); // Collect data every 500ms
      setIsRecording(true);
      console.log('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording failed",
        description: "Please check your microphone access and browser permissions",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      console.log('Stopping MediaRecorder, current state:', mediaRecorderRef.current.state);
      
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.error('Error stopping media recorder:', e);
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          console.log('Stopping track:', track.kind, track.label);
          track.stop();
        });
        streamRef.current = null;
      }
      
      setIsRecording(false);
      console.log('Recording stopped');
    } else {
      console.log('No active recording to stop');
    }
  };

  return {
    isRecording,
    startRecording,
    stopRecording
  };
};
