
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { validateAudioData, convertBlobToAudioData } from '@/utils/audioProcessing';
import { initializeWhisperModel } from '@/config/whisperConfig';
import { useMediaRecording } from '@/hooks/useMediaRecording';

interface UseVoiceTranscriptionProps {
  onTranscriptionComplete: (text: string) => void;
}

export const useVoiceTranscription = ({ onTranscriptionComplete }: UseVoiceTranscriptionProps) => {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [transcriber, setTranscriber] = useState<any>(null);
  const [isTranscriptionInProgress, setIsTranscriptionInProgress] = useState(false);
  const { toast } = useToast();

  const handleRecordingComplete = async (chunks: Blob[]) => {
    console.log('Recording complete, processing chunks:', chunks.length);
    
    if (!transcriber) {
      console.error('Transcriber not initialized, initializing now before processing...');
      await initializeWhisper();
    }

    // Check again if transcriber is available after potential initialization
    if (!transcriber) {
      console.error('Failed to initialize transcriber');
      toast({
        title: "Error",
        description: "Could not initialize speech recognition, using fallback API",
        variant: "destructive"
      });
      
      try {
        // Try fallback to the edge function
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        
        // Convert blob to base64 for the edge function
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
        });
        
        reader.readAsDataURL(audioBlob);
        const base64Audio = await base64Promise;
        
        console.log('Audio converted to base64, calling edge function...');
        const response = await fetch('/api/voice-to-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio: base64Audio })
        });
        
        if (!response.ok) {
          throw new Error('Edge function failed: ' + await response.text());
        }
        
        const result = await response.json();
        if (result.text) {
          onTranscriptionComplete(result.text);
          toast({
            title: "Transcription complete",
            description: result.text.substring(0, 50) + (result.text.length > 50 ? '...' : '')
          });
        }
        
        return;
      } catch (fallbackError) {
        console.error('Fallback transcription also failed:', fallbackError);
        toast({
          title: "Transcription failed",
          description: "All transcription methods failed. Please try again.",
          variant: "destructive"
        });
        return;
      }
    }

    try {
      setIsTranscriptionInProgress(true);
      const audioBlob = new Blob(chunks, { type: 'audio/webm' });
      console.log('Processing audio, size:', audioBlob.size, 'bytes');
      
      if (audioBlob.size === 0) {
        console.error('No audio recorded (empty blob)');
        throw new Error('No audio recorded');
      }

      console.log('Converting blob to audio data...');
      const audioData = await convertBlobToAudioData(audioBlob);
      console.log('Audio data conversion result:', audioData ? 'Success' : 'Failed');
      
      if (!audioData || !validateAudioData(audioData)) {
        console.error('Invalid audio data after conversion');
        throw new Error('Invalid audio data');
      }

      console.log('Audio processed, calling transcriber with data length:', audioData.length);
      toast({
        title: "Processing speech",
        description: "Transcribing your audio..."
      });
      
      const output = await transcriber(audioData, {
        task: 'transcribe',
        language: 'en'
      });

      console.log('Transcription result:', output);

      if (!output?.text) {
        console.error('No text in transcription output:', output);
        throw new Error('Transcription failed - no text output');
      }

      console.log('Transcription successful:', output.text);
      onTranscriptionComplete(output.text);
      toast({
        title: "Transcription complete",
        description: output.text.substring(0, 50) + (output.text.length > 50 ? '...' : '')
      });
    } catch (error) {
      console.error('Transcription error:', error);
      toast({
        title: "Transcription failed",
        description: error.message || 'Error processing audio',
        variant: "destructive"
      });
    } finally {
      setIsTranscriptionInProgress(false);
    }
  };

  const { isRecording, startRecording, stopRecording } = useMediaRecording(handleRecordingComplete);

  const initializeWhisper = useCallback(async () => {
    // Don't initialize if already initialized or in progress
    if (transcriber || isModelLoading) {
      console.log('Whisper already initialized or loading in progress');
      return;
    }

    try {
      console.log('Starting Whisper model initialization...');
      setIsModelLoading(true);
      toast({
        title: "Loading speech recognition model",
        description: "This may take a moment on first use",
      });

      await initializeWhisperModel(
        (progress) => {
          console.log('Model loading progress:', progress);
          if (progress?.status === 'error') {
            console.error('Model loading error:', progress);
            throw new Error('Model loading failed');
          }
        },
        (whisperPipeline) => {
          console.log('Whisper model loaded successfully');
          setTranscriber(whisperPipeline);
          toast({
            title: "Speech recognition ready",
            description: "You can now use voice dictation",
          });
        },
        (error) => {
          console.error('Error loading Whisper model:', error);
          toast({
            title: "Failed to load speech recognition",
            description: "Please try again later",
            variant: "destructive"
          });
        }
      );
    } catch (error) {
      console.error('Error in initializeWhisper:', error);
      toast({
        title: "Initialization failed",
        description: error.message || "Failed to initialize speech recognition",
        variant: "destructive"
      });
    } finally {
      setIsModelLoading(false);
    }
  }, [toast, transcriber, isModelLoading]);

  // Initialize the model when the component mounts
  useEffect(() => {
    // Try to initialize on mount, but don't block rendering
    if (!transcriber && !isModelLoading) {
      initializeWhisper();
    }
  }, [initializeWhisper, transcriber, isModelLoading]);

  const toggleRecording = useCallback(async () => {
    console.log('Toggle recording called, current state:', { 
      isRecording, 
      isModelLoading, 
      hasTranscriber: !!transcriber 
    });
    
    if (isRecording) {
      console.log('Stopping recording...');
      stopRecording();
      toast({
        title: "Recording stopped",
        description: "Processing your speech..."
      });
    } else {
      if (!transcriber && !isModelLoading) {
        console.log('No transcriber initialized, initializing Whisper...');
        await initializeWhisper();
      }
      
      if (!isModelLoading) {
        console.log('Starting recording...');
        startRecording();
        toast({
          title: "Recording started",
          description: "Speak clearly into your microphone"
        });
      } else {
        console.log('Cannot start recording - model is still loading');
        toast({
          title: "Please wait",
          description: "Speech recognition model is still loading"
        });
      }
    }
  }, [isRecording, isModelLoading, startRecording, stopRecording, toast, transcriber, initializeWhisper]);

  return {
    isRecording,
    isModelLoading,
    isTranscribing: isTranscriptionInProgress,
    toggleRecording
  };
};
