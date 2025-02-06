
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import CodeBlock from '@tiptap/extension-code-block';
import { useToast } from '@/hooks/use-toast';
import calculateScores from '@/utils/readabilityScores';
import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash';
import { pipeline } from '@huggingface/transformers';
import EditorToolbar from './editor/EditorToolbar';
import { supabase } from '@/integrations/supabase/client';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const [readabilityScores, setReadabilityScores] = useState(calculateScores(''));
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [transcriber, setTranscriber] = useState(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const performAnalysis = useCallback(
    debounce(async (text: string) => {
      if (text.length < 50) return;
      
      try {
        setIsAnalyzing(true);
        const { data, error } = await supabase.functions.invoke('analyze-text', {
          body: { text },
        });

        if (error) {
          throw error;
        }

        console.log('Text analysis result:', data);
        setAiAnalysis(data);
      } catch (error) {
        console.error('Error analyzing text:', error);
        toast({
          title: 'Analysis failed',
          description: 'There was an error analyzing your text',
          variant: 'destructive',
        });
      } finally {
        setIsAnalyzing(false);
      }
    }, 1000),
    [toast]
  );

  useEffect(() => {
    const initializeWhisper = async () => {
      try {
        setIsModelLoading(true);
        toast({
          title: "Loading speech recognition model",
          description: "This may take a moment on first use",
        });

        console.log('Initializing Whisper model...');
        const whisperPipeline = await pipeline(
          "automatic-speech-recognition",
          "Xenova/whisper-tiny.en",
          {
            revision: 'main',
            config: {
              sampling_rate: 16000,
              return_timestamps: false
            }
          }
        );

        console.log('Whisper model initialized:', whisperPipeline);
        setTranscriber(whisperPipeline);
        toast({
          title: "Speech recognition ready",
          description: "You can now use voice dictation",
        });
      } catch (error) {
        console.error('Error loading Whisper model:', error);
        toast({
          title: "Failed to load speech recognition",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setIsModelLoading(false);
      }
    };

    initializeWhisper();
  }, [toast]);

  const validateAudioData = (audioData: Float32Array): boolean => {
    console.log('Validating audio data...', {
      type: audioData?.constructor?.name,
      length: audioData?.length
    });
    
    if (!audioData || !(audioData instanceof Float32Array)) {
      console.error('Invalid audio data type:', audioData);
      return false;
    }
    
    if (audioData.length === 0) {
      console.error('Audio data is empty');
      return false;
    }
    
    const hasValidSamples = audioData.some(sample => sample !== 0);
    if (!hasValidSamples) {
      console.error('Audio data contains no valid samples');
      return false;
    }

    console.log('Audio data validation passed:', {
      length: audioData.length,
      hasValidSamples
    });
    
    return true;
  };

  const convertBlobToAudioData = async (blob: Blob): Promise<Float32Array | null> => {
    try {
      console.log('Starting audio conversion, blob size:', blob.size);
      
      if (!blob || blob.size === 0) {
        throw new Error('Invalid audio data: empty blob');
      }

      const audioContext = new AudioContext({
        sampleRate: 16000
      });
      
      const arrayBuffer = await blob.arrayBuffer();
      console.log('ArrayBuffer created, size:', arrayBuffer.byteLength);
      
      if (arrayBuffer.byteLength === 0) {
        throw new Error('Invalid audio data: empty array buffer');
      }

      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      console.log('Audio decoded:', {
        duration: audioBuffer.duration,
        channels: audioBuffer.numberOfChannels,
        sampleRate: audioBuffer.sampleRate
      });
      
      if (audioBuffer.duration === 0) {
        throw new Error('Invalid audio data: zero duration');
      }

      // Create offline context for resampling
      const offlineContext = new OfflineAudioContext(1, Math.ceil(audioBuffer.duration * 16000), 16000);
      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(offlineContext.destination);
      source.start();

      const resampled = await offlineContext.startRendering();
      console.log('Audio resampled:', {
        duration: resampled.duration,
        sampleRate: resampled.sampleRate
      });

      const monoData = new Float32Array(resampled.length);
      const channelData = resampled.getChannelData(0);
      
      if (!channelData || channelData.length === 0) {
        throw new Error('Invalid channel data');
      }
      
      monoData.set(channelData);

      console.log('Audio data prepared:', {
        length: monoData.length,
        sampleRate: resampled.sampleRate,
        hasData: monoData.some(sample => sample !== 0)
      });

      return monoData;
    } catch (error) {
      console.error('Error converting audio:', error);
      return null;
    }
  };

  const startRecording = async () => {
    if (isModelLoading) {
      toast({
        title: "Please wait",
        description: "Speech recognition model is still loading",
      });
      return;
    }

    if (!transcriber) {
      toast({
        title: "Speech recognition not available",
        description: "Please try reloading the page",
        variant: "destructive"
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: { ideal: 16000 },
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
        audioBitsPerSecond: 16000
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          if (chunksRef.current.length === 0) {
            throw new Error('No audio data recorded');
          }

          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
          console.log('Audio blob created:', audioBlob.size);
          
          if (audioBlob.size === 0) {
            throw new Error('Audio recording is empty');
          }

          toast({
            title: "Processing speech",
            description: "Converting your speech to text...",
          });

          const audioData = await convertBlobToAudioData(audioBlob);
          
          if (!audioData) {
            throw new Error('Failed to process audio data');
          }

          if (!validateAudioData(audioData)) {
            throw new Error('Invalid audio data after validation');
          }

          console.log('Sending audio data to transcriber, length:', audioData.length);
          
          if (!transcriber) {
            throw new Error('Transcriber not initialized');
          }

          const output = await transcriber(audioData, {
            task: 'transcribe',
            language: 'en'
          });
          
          if (!output?.text) {
            throw new Error('No transcription output');
          }

          console.log('Transcription result:', output);

          if (editor) {
            editor.commands.insertContent(output.text);
            toast({
              title: "Transcription complete",
              description: "Your dictated text has been added"
            });
          }
        } catch (error) {
          console.error('Transcription error:', error);
          toast({
            title: "Transcription failed",
            description: error.message || "There was an error processing your speech",
            variant: "destructive"
          });
        }
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone"
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use dictation",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      toast({
        title: "Recording stopped",
        description: "Processing your speech..."
      });
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Underline,
      TextAlign.configure({
        types: ['paragraph', 'heading'],
        alignments: ['left', 'center', 'right'],
      }),
      Highlight,
      CodeBlock,
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[600px] p-8',
      },
    },
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      onChange(newContent);
      
      const plainText = editor.getText();
      const scores = calculateScores(plainText);
      setReadabilityScores(scores);
      
      performAnalysis(plainText);
    },
  });

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
      const plainText = editor.getText();
      const scores = calculateScores(plainText);
      setReadabilityScores(scores);
      
      if (plainText.length >= 50) {
        performAnalysis(plainText);
      }
    }
  }, [content, editor, performAnalysis]);

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <EditorToolbar 
          editor={editor}
          isRecording={isRecording}
          onToggleRecording={toggleRecording}
          isModelLoading={isModelLoading}
        />
        <EditorContent 
          editor={editor} 
          className="min-h-[600px] bg-white rounded-b-lg"
        />
      </div>
    </div>
  );
};

export default RichTextEditor;

