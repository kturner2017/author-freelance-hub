
import React from 'react';
import RichTextEditor from '../../RichTextEditor';
import { ScrollArea } from '../../ui/scroll-area';
import { useParams } from 'react-router-dom';
import PageViewNavigation from '../toolbar/PageViewNavigation';

interface FullChapterEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  aiAnalysis?: any;
  isAnalyzing?: boolean;
}

const FullChapterEditor = ({ 
  content, 
  onContentChange,
  aiAnalysis,
  isAnalyzing 
}: FullChapterEditorProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <PageViewNavigation title="Full View Editor" viewMode="full" />
      </div>
      <ScrollArea className="flex-1 h-[calc(100vh-4rem)]">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <RichTextEditor 
            content={content} 
            onChange={onContentChange}
            aiAnalysis={aiAnalysis}
            isAnalyzing={isAnalyzing}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default FullChapterEditor;
