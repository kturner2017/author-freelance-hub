
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '../../ui/button';
import { Quote, Code, Highlighter } from 'lucide-react';

interface FormattingButtonsProps {
  editor: Editor;
}

const FormattingButtons = ({ editor }: FormattingButtonsProps) => {
  return (
    <>
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
    </>
  );
};

export default FormattingButtons;
