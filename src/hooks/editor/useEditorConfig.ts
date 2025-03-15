
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import CodeBlock from '@tiptap/extension-code-block';
import Image from '@tiptap/extension-image';
import { useImageHandling } from './useImageHandling';

export const useEditorConfig = () => {
  const getExtensions = () => [
    StarterKit.configure({
      codeBlock: false,
      heading: {
        levels: [1, 2, 3, 4, 5, 6],
      },
    }),
    Underline,
    TextAlign.configure({
      types: ['heading', 'paragraph', 'image'],
      alignments: ['left', 'center', 'right'],
      defaultAlignment: 'left',
    }),
    Highlight,
    CodeBlock,
    Image.configure({
      inline: true,
      allowBase64: true,
      HTMLAttributes: {
        class: 'rounded-lg cursor-move transition-transform hover:shadow-lg resize-handle max-w-full h-auto',
        draggable: 'true'
      },
    }),
  ];

  const getEditorProps = () => ({
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[600px] p-8 [&_.is-editor-empty]:text-gray-400',
    },
    handleDOMEvents: {
      mousedown: (view: any, event: MouseEvent) => {
        if (event.target instanceof HTMLImageElement) {
          const { handleMouseDown } = useImageHandling(view);
          return handleMouseDown(event, event.target);
        }
        return false;
      },
    },
  });

  return {
    getExtensions,
    getEditorProps,
  };
};
