
import { useCallback, useEffect, useState } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import CodeBlock from '@tiptap/extension-code-block';
import Image from '@tiptap/extension-image';
import { useToast } from '@/hooks/use-toast';
import calculateScores from '@/utils/readabilityScores';
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

  const performAnalysis = useCallback(async (text: string) => {
    const cleanText = text.trim();
    if (cleanText.length < 10) {
      toast({
        title: 'Text too short',
        description: 'Please write at least 10 characters before analyzing',
        variant: 'default',
      });
      return;
    }
    
    try {
      setIsAnalyzing(true);
      const { data, error } = await supabase.functions.invoke('analyze-text', {
        body: { text: cleanText },
      });

      if (error) {
        console.error('Analysis error:', error);
        toast({
          title: 'Analysis failed',
          description: error.message || 'There was an error analyzing your text',
          variant: 'destructive',
        });
        return;
      }

      setAiAnalysis(data);
      toast({
        title: 'Analysis complete',
        description: 'Your text has been analyzed successfully',
      });
    } catch (error) {
      console.error('Error analyzing text:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [toast]);

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
      Image.configure({
        HTMLAttributes: {
          class: 'float-left mr-4 mb-4 rounded-lg',
        },
      }),
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
    },
  });

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
      const plainText = editor.getText();
      const scores = calculateScores(plainText);
      setReadabilityScores(scores);
    }
  }, [content, editor]);

  return {
    editor,
    readabilityScores,
    aiAnalysis,
    isAnalyzing,
    performAnalysis
  };
};
