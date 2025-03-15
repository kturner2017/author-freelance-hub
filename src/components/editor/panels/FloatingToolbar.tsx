
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '../../ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Heading1, 
  Heading2, 
  Highlighter,
  Link,
  Image
} from 'lucide-react';

interface FloatingToolbarProps {
  editor: Editor;
  position: { top: number; left: number };
  visible: boolean;
}

const FloatingToolbar = ({ editor, position, visible }: FloatingToolbarProps) => {
  if (!visible) return null;
  
  const buttonStyle = "p-1 h-7 w-7";
  
  return (
    <div 
      className="absolute bg-white border shadow-md rounded-md p-1 flex items-center gap-1 z-50 transition-opacity"
      style={{ 
        top: `${position.top}px`, 
        left: `${position.left}px`, 
        transform: 'translateX(-50%)',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none'
      }}
    >
      <Button 
        variant={editor.isActive('bold') ? 'default' : 'ghost'} 
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonStyle}
      >
        <Bold className="h-3.5 w-3.5" />
      </Button>
      
      <Button 
        variant={editor.isActive('italic') ? 'default' : 'ghost'} 
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={buttonStyle}
      >
        <Italic className="h-3.5 w-3.5" />
      </Button>
      
      <Button 
        variant={editor.isActive('underline') ? 'default' : 'ghost'} 
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={buttonStyle}
      >
        <Underline className="h-3.5 w-3.5" />
      </Button>
      
      <Button 
        variant={editor.isActive('highlight') ? 'default' : 'ghost'} 
        size="sm"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={buttonStyle}
      >
        <Highlighter className="h-3.5 w-3.5" />
      </Button>
      
      <div className="h-4 w-px bg-gray-300 mx-1"></div>
      
      <Button 
        variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'} 
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={buttonStyle}
      >
        <Heading1 className="h-3.5 w-3.5" />
      </Button>
      
      <Button 
        variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'} 
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={buttonStyle}
      >
        <Heading2 className="h-3.5 w-3.5" />
      </Button>
      
      <div className="h-4 w-px bg-gray-300 mx-1"></div>
      
      <Button 
        variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'} 
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={buttonStyle}
      >
        <AlignLeft className="h-3.5 w-3.5" />
      </Button>
      
      <Button 
        variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'} 
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={buttonStyle}
      >
        <AlignCenter className="h-3.5 w-3.5" />
      </Button>
      
      <Button 
        variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'} 
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={buttonStyle}
      >
        <AlignRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

export default FloatingToolbar;
