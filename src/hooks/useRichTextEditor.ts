
import { useCallback, useEffect, useState } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import CodeBlock from '@tiptap/extension-code-block';
import { useToast } from '@/hooks/use-toast';
import calculateScores from '@/utils/readabilityScores';
import { debounce } from 'lodash';
import { supabase } from '@/integrations/supabase/client';

interface UseRichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export const useRichTextEditor = ({ content, onChange }: UseRichTextEditorProps) => {
  const [readabilityScores, setReadabilityScores] = useState(calculateScores(''));
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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

  return {
    editor,
    readabilityScores,
    aiAnalysis,
    isAnalyzing
  };
};
