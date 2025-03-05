
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
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: { ideal: 16000 },
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      
      streamRef.current = stream;
      
      // Use a supported mime type
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
        ? 'audio/webm' 
        : 'audio/ogg';
        
      console.log(`Using mime type: ${mimeType}`);
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 16000
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        console.log('Data available:', e.data.size);
        if (e.data.size > 0) {
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

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      console.log('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording failed",
        description: "Please check your microphone access",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      console.log('Stopping MediaRecorder, current state:', mediaRecorderRef.current.state);
      
      if (mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
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
