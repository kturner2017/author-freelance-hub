import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import CodeBlock from '@tiptap/extension-code-block';
import { useToast } from './ui/use-toast';
import ReadabilityChart from './ReadabilityChart';
import calculateScores from '@/utils/readabilityScores';
import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash';
import { supabase } from '@/integrations/supabase/client';
import EditorToolbar from './editor/EditorToolbar';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const [readabilityScores, setReadabilityScores] = useState(calculateScores(''));
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

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
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        
        reader.onload = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          
          try {
            const { data, error } = await supabase.functions.invoke('voice-to-text', {
              body: { audio: base64Audio }
            });

            if (error) throw error;

            if (data.text && editor) {
              editor.commands.insertContent(data.text);
              toast({
                title: "Transcription complete",
                description: "Your dictated text has been added to the editor"
              });
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

        reader.readAsDataURL(audioBlob);
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
        <ReadabilityChart scores={readabilityScores} />
        <EditorToolbar 
          editor={editor}
          isRecording={isRecording}
          onToggleRecording={toggleRecording}
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