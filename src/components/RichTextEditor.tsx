import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import CodeBlock from '@tiptap/extension-code-block';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { useToast } from './ui/use-toast';
import ReadabilityChart from './ReadabilityChart';
import calculateScores from '@/utils/readabilityScores';
import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash';
import { supabase } from '@/integrations/supabase/client';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  AlignLeft, 
  AlignCenter,
  AlignRight,
  List, 
  ListOrdered, 
  Undo, 
  Redo,
  Heading1,
  Heading2,
  Quote,
  Code,
  Highlighter,
  IndentIncrease,
  IndentDecrease,
  Mic,
  MicOff
} from 'lucide-react';

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

  const handleIndentParagraph = () => {
    editor?.chain().focus().sinkListItem('listItem').run();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <ReadabilityChart scores={readabilityScores} />
        <div className="bg-gray-100 p-2 rounded-t-lg border-b flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`h-8 w-8 p-0 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`h-8 w-8 p-0 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`h-8 w-8 p-0 ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-6" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`h-8 w-8 p-0 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`h-8 w-8 p-0 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
          >
            <Heading2 className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}
          >
            <AlignRight className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`h-8 w-8 p-0 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`h-8 w-8 p-0 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button
            variant="ghost"
            size="sm"
            onClick={handleIndentParagraph}
            className="h-8 w-8 p-0"
          >
            <IndentIncrease className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().liftListItem('listItem').run()}
            className="h-8 w-8 p-0"
          >
            <IndentDecrease className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`h-8 w-8 p-0 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`h-8 w-8 p-0 ${editor.isActive('codeBlock') ? 'bg-gray-200' : ''}`}
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={`h-8 w-8 p-0 ${editor.isActive('highlight') ? 'bg-gray-200' : ''}`}
          >
            <Highlighter className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            className="h-8 w-8 p-0"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            className="h-8 w-8 p-0"
          >
            <Redo className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleRecording}
            className={`h-8 w-8 p-0 ${isRecording ? 'bg-red-200 hover:bg-red-300' : ''}`}
          >
            {isRecording ? (
              <MicOff className="h-4 w-4 text-red-600" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        </div>

        <EditorContent 
          editor={editor} 
          className="min-h-[600px] bg-white rounded-b-lg"
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
