
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
        types: ['heading', 'paragraph', 'image'],
        alignments: ['left', 'center', 'right'],
      }),
      Highlight,
      CodeBlock,
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full cursor-pointer transition-transform',
        },
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[600px] p-8',
      },
      handleDOMEvents: {
        keydown: (view, event) => {
          // Check if there's a selected node and it's an image
          const { state } = view;
          const selectedNode = state.selection.$anchor.nodeAfter;
          
          if (!selectedNode || selectedNode.type.name !== 'image') {
            return false;
          }

          if (event.key.startsWith('Arrow') && event.shiftKey) {
            const imageAttrs = selectedNode.attrs;
            const pos = state.selection.$anchor.pos;
            let newAttrs = { ...imageAttrs };

            // Resize with Shift + Arrow keys
            if (event.key === 'ArrowUp') newAttrs.height = (imageAttrs.height || 100) - 10;
            if (event.key === 'ArrowDown') newAttrs.height = (imageAttrs.height || 100) + 10;
            if (event.key === 'ArrowLeft') newAttrs.width = (imageAttrs.width || 100) - 10;
            if (event.key === 'ArrowRight') newAttrs.width = (imageAttrs.width || 100) + 10;

            view.dispatch(view.state.tr.setNodeMarkup(pos, undefined, newAttrs));
            return true;
          }
          return false;
        },
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
