
import React from 'react';
import RichTextEditor from '../RichTextEditor';

interface FrontMatterContent {
  id: string;
  title: string;
  content: string;
  sort_order: number;
}

interface FrontMatterEditorProps {
  selectedFrontMatter: FrontMatterContent | null;
  handleFrontMatterContentChange: (content: string) => void;
}

const FrontMatterEditor = ({ 
  selectedFrontMatter, 
  handleFrontMatterContentChange 
}: FrontMatterEditorProps) => {
  if (!selectedFrontMatter) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-serif font-semibold text-primary-800 mb-8">
        {selectedFrontMatter.title}
      </h2>
      <RichTextEditor
        content={selectedFrontMatter.content}
        onChange={handleFrontMatterContentChange}
      />
    </div>
  );
};

export default FrontMatterEditor;
