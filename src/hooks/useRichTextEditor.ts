
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
      const cleanText = text.trim();
      // Only perform analysis if text is at least 50 characters to avoid unnecessary API calls
      if (cleanText.length < 50) {
        return;
      }
      
      try {
        setIsAnalyzing(true);
        const { data, error } = await supabase.functions.invoke('analyze-text', {
          body: { text: cleanText },
        });

        if (error) {
          console.error('Analysis error:', error);
          // Only show error toast for unexpected errors
          if (!error.message?.includes('characters long')) {
            toast({
              title: 'Analysis failed',
              description: 'There was an error analyzing your text',
              variant: 'destructive',
            });
          }
          return;
        }

        setAiAnalysis(data);
      } catch (error) {
        console.error('Error analyzing text:', error);
      } finally {
        setIsAnalyzing(false);
      }
    }, 2000), // Increased debounce to 2 seconds
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
      
      // Only trigger analysis for longer text
      if (plainText.trim().length >= 50) {
        performAnalysis(plainText);
      }
    },
  });

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
      const plainText = editor.getText();
      const scores = calculateScores(plainText);
      setReadabilityScores(scores);
      
      // Only perform initial analysis if text is long enough
      if (plainText.trim().length >= 50) {
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
