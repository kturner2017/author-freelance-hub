
import React from 'react';
import RichTextEditor from '../../RichTextEditor';
import { ScrollArea } from '../../ui/scroll-area';
import { Button } from '../../ui/button';
import { ArrowLeft, Book } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

interface FullChapterEditorProps {
  content: string;
  onContentChange: (content: string) => void;
}

const FullChapterEditor = ({ content, onContentChange }: FullChapterEditorProps) => {
  const { bookId, chapterId } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="flex items-center gap-4 max-w-7xl mx-auto px-4 h-16">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/editor/manuscript/${bookId}/chapters`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">Full View Editor</h1>
          <div className="ml-auto">
            <Button variant="outline" asChild>
              <Link to={`/editor/manuscript/${bookId}/chapters/${chapterId}/page-view`}>
                <Book className="h-4 w-4 mr-2" />
                Page View
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 h-[calc(100vh-4rem)]">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <RichTextEditor 
            content={content} 
            onChange={onContentChange} 
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default FullChapterEditor;
