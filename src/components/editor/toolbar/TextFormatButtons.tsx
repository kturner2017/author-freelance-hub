
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '../../ui/button';
import { Separator } from '../../ui/separator';
import { Bold, Italic, Underline as UnderlineIcon } from 'lucide-react';

interface TextFormatButtonsProps {
  editor: Editor;
}

const TextFormatButtons = ({ editor }: TextFormatButtonsProps) => {
  return (
    <>
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
    </>
  );
};

export default TextFormatButtons;
