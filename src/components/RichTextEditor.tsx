import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import CodeBlock from '@tiptap/extension-code-block';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import ReadabilityChart from './ReadabilityChart';
import calculateScores from '@/utils/readabilityScores';
import { useState, useEffect, useCallback } from 'react';
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
  IndentDecrease
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const [readabilityScores, setReadabilityScores] = useState(calculateScores(''));
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const performAnalysis = useCallback(
    debounce(async (text: string) => {
      if (text.length < 50) return;
      
      setIsAnalyzing(true);
      try {
        const { data, error } = await supabase.functions.invoke('analyze-text', {
          body: { text }
        });

        if (error) throw error;
        console.log('AI Analysis results:', data);
        setAiAnalysis(data);
      } catch (error) {
        console.error('Error during AI analysis:', error);
      } finally {
        setIsAnalyzing(false);
      }
    }, 1000),
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
      
      // Strip HTML tags for readability calculation
      const plainText = editor.getText();
      console.log('Calculating readability for text:', plainText);
      const scores = calculateScores(plainText);
      console.log('Calculated scores:', scores);
      setReadabilityScores(scores);
      
      // Trigger AI analysis
      performAnalysis(plainText);
    },
  });

  // Update readability scores when content changes externally
  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
      const plainText = editor.getText();
      console.log('Initial content text:', plainText);
      const scores = calculateScores(plainText);
      console.log('Initial scores:', scores);
      setReadabilityScores(scores);
      performAnalysis(plainText);
    }
  }, [content, editor, performAnalysis]);

  if (!editor) {
    return null;
  }

  const handleIndentParagraph = () => {
    const { from } = editor.state.selection;
    const node = editor.state.doc.nodeAt(from);
    
    if (node) {
      editor.chain()
        .focus()
        .updateAttributes('paragraph', {
          style: 'text-indent: 40px;'
        })
        .run();
      console.log('Applied paragraph indentation');
    }
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <ReadabilityChart scores={readabilityScores} />
        <div className="bg-gray-100 p-2 rounded-t-lg border-b flex flex-wrap items-center gap-2">
          {/* Text Style Controls */}
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
          
          {/* Heading Controls */}
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

          {/* Alignment Controls */}
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
          
          {/* List Controls */}
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

          {/* Indentation Controls */}
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

          {/* Special Formatting */}
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

          {/* History Controls */}
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