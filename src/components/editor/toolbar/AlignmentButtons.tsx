
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '../../ui/button';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface AlignmentButtonsProps {
  editor: Editor;
}

const AlignmentButtons = ({ editor }: AlignmentButtonsProps) => {
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}
        title="Align left"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}
        title="Center"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}
        title="Align right"
      >
        <AlignRight className="h-4 w-4" />
      </Button>
    </>
  );
};

export default AlignmentButtons;
