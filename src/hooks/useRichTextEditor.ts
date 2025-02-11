
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
          class: 'rounded-lg max-w-full cursor-pointer transition-transform hover:shadow-lg resize-handle',
          draggable: false,
        },
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[600px] p-8',
      },
      handleDOMEvents: {
        mousedown: (view, event) => {
          if (event.target instanceof HTMLImageElement) {
            const img = event.target;
            let isResizing = false;
            let startX: number;
            let startY: number;
            let startWidth: number;
            let startHeight: number;

            const onMouseMove = (e: MouseEvent) => {
              if (!isResizing) return;
              
              const deltaX = e.clientX - startX;
              const deltaY = e.clientY - startY;
              const newWidth = Math.max(100, startWidth + deltaX);
              const newHeight = Math.max(100, startHeight + deltaY);
              
              img.style.width = `${newWidth}px`;
              img.style.height = `${newHeight}px`;
              
              const node = view.state.doc.nodeAt(view.posAtDOM(img, 0));
              if (node) {
                const pos = view.posAtDOM(img, 0);
                view.dispatch(view.state.tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  width: newWidth,
                  height: newHeight
                }));
              }
            };

            const onMouseUp = () => {
              isResizing = false;
              document.removeEventListener('mousemove', onMouseMove);
              document.removeEventListener('mouseup', onMouseUp);
              img.style.cursor = 'pointer';
            };

            // Check if clicking near bottom-right corner (resize handle)
            const rect = img.getBoundingClientRect();
            const cornerSize = 20;
            if (
              event.clientX > rect.right - cornerSize &&
              event.clientY > rect.bottom - cornerSize
            ) {
              isResizing = true;
              startX = event.clientX;
              startY = event.clientY;
              startWidth = img.offsetWidth;
              startHeight = img.offsetHeight;
              
              img.style.cursor = 'nwse-resize';
              document.addEventListener('mousemove', onMouseMove);
              document.addEventListener('mouseup', onMouseUp);
              event.preventDefault();
              return true;
            }
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

  // Add custom styles to the document head
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .resize-handle {
        position: relative;
      }
      .resize-handle::after {
        content: '';
        position: absolute;
        right: 0;
        bottom: 0;
        width: 20px;
        height: 20px;
        cursor: nwse-resize;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 0 0 4px 0;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return {
    editor,
    readabilityScores,
    aiAnalysis,
    isAnalyzing,
    performAnalysis
  };
};
