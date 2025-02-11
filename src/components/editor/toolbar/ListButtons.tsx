
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '../../ui/button';
import { List, ListOrdered, IndentIncrease, IndentDecrease } from 'lucide-react';

interface ListButtonsProps {
  editor: Editor;
}

const ListButtons = ({ editor }: ListButtonsProps) => {
  const handleIndentParagraph = () => {
    editor?.chain().focus().sinkListItem('listItem').run();
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`h-8 w-8 p-0 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`h-8 w-8 p-0 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleIndentParagraph}
        className="h-8 w-8 p-0"
      >
        <IndentIncrease className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().liftListItem('listItem').run()}
        className="h-8 w-8 p-0"
      >
        <IndentDecrease className="h-4 w-4" />
      </Button>
    </>
  );
};

export default ListButtons;
