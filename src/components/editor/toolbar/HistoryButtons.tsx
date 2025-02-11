
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '../../ui/button';
import { Undo, Redo } from 'lucide-react';

interface HistoryButtonsProps {
  editor: Editor;
}

const HistoryButtons = ({ editor }: HistoryButtonsProps) => {
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        className="h-8 w-8 p-0"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        className="h-8 w-8 p-0"
      >
        <Redo className="h-4 w-4" />
      </Button>
    </>
  );
};

export default HistoryButtons;
