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

  // Initialize the Whisper model
  useEffect(() => {
    const initializeWhisper = async () => {
      try {
        setIsModelLoading(true);
        toast({
          title: "Loading speech recognition model",
          description: "This may take a moment on first use",
        });

        const whisperPipeline = await pipeline(
          "automatic-speech-recognition",
          "onnx-community/whisper-tiny.en",
          { 
            device: "webgpu",
            revision: "main",
            progress_callback: (progress) => {
              console.log('Model loading progress:', progress);
            }
          }
        );
        
        if (whisperPipeline) {
          setTranscriber(whisperPipeline);
          toast({
            title: "Speech recognition ready",
            description: "You can now use voice dictation",
          });
        } else {
          throw new Error('Failed to initialize Whisper model');
        }
      } catch (error) {
        console.error('Error loading Whisper model:', error);
        toast({
          title: "Failed to load speech recognition",
          description: "Please try again later or check if your browser supports WebGPU",
          variant: "destructive"
        });
      } finally {
        setIsModelLoading(false);
      }
    };

    initializeWhisper();
  }, []);

  const performAnalysis = useCallback(
    debounce(async (text: string) => {
      if (text.length < 50) return;
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = text;
      const cleanText = tempDiv.textContent || tempDiv.innerText || '';
      
      setIsAnalyzing(true);
      try {
        const { data, error } = await supabase.functions.invoke('analyze-text', {
          body: { text: cleanText }
        });

        if (error) throw error;
        console.log('AI Analysis results:', data);
        setAiAnalysis(data);
      } catch (error) {
        console.error('Error during AI analysis:', error);
      } finally {
        setIsAnalyzing(false);
      }
    }, 2000),
    []
  );

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
      console.log('Calculating readability for text:', plainText);
      const scores = calculateScores(plainText);
      console.log('Calculated scores:', scores);
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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        console.log('Data available:', e.data.size);
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        if (chunksRef.current.length === 0) {
          console.error('No audio data recorded');
          toast({
            title: "Recording failed",
            description: "No audio data was captured",
            variant: "destructive"
          });
          return;
        }

        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        console.log('Audio blob created:', audioBlob.size);
        
        try {
          toast({
            title: "Processing speech",
            description: "Converting your speech to text...",
          });

          // Convert blob to ArrayBuffer for processing
          const arrayBuffer = await audioBlob.arrayBuffer();
          const audioData = new Float32Array(arrayBuffer);
          
          console.log('Processing audio data:', audioData.length);
          const output = await transcriber(audioData);
          console.log('Transcription output:', output);
          
          if (output && output.text && editor) {
            editor.commands.insertContent(output.text);
            toast({
              title: "Transcription complete",
              description: "Your dictated text has been added"
            });
          } else {
            throw new Error('No transcription output');
          }
        } catch (error) {
          console.error('Transcription error:', error);
          toast({
            title: "Transcription failed",
            description: "There was an error processing your speech",
            variant: "destructive"
          });
        }
      };

      mediaRecorder.start();
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
