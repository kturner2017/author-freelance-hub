
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '../../ui/button';
import { Heading1, Heading2 } from 'lucide-react';

interface HeadingButtonsProps {
  editor: Editor;
}

const HeadingButtons = ({ editor }: HeadingButtonsProps) => {
  return (
    <>
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
    </>
  );
};

export default HeadingButtons;
