
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
          class: 'rounded-lg max-w-full cursor-pointer transition-transform hover:shadow-lg',
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
          const { state } = view;
          const { selection } = state;
          const { empty, anchor } = selection;

          // Only proceed if we have a selection
          if (!empty) {
            return false;
          }

          // Get the node at the current position
          const pos = anchor;
          const node = state.doc.nodeAt(pos);

          // Check if we're working with an image node
          if (!node || node.type.name !== 'image') {
            return false;
          }

          if (event.shiftKey && event.key.startsWith('Arrow')) {
            event.preventDefault();
            const imageAttrs = node.attrs;
            let newAttrs = { ...imageAttrs };

            // Scale image size with Shift + Arrow keys
            const sizeStep = 50;
            switch (event.key) {
              case 'ArrowUp':
                newAttrs.height = (imageAttrs.height || 300) - sizeStep;
                break;
              case 'ArrowDown':
                newAttrs.height = (imageAttrs.height || 300) + sizeStep;
                break;
              case 'ArrowLeft':
                newAttrs.width = (imageAttrs.width || 300) - sizeStep;
                break;
              case 'ArrowRight':
                newAttrs.width = (imageAttrs.width || 300) + sizeStep;
                break;
            }

            // Ensure minimum size
            newAttrs.width = Math.max(newAttrs.width || 100, 100);
            newAttrs.height = Math.max(newAttrs.height || 100, 100);

            // Update the node with new attributes
            view.dispatch(state.tr.setNodeMarkup(pos, undefined, newAttrs));
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
