import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import RichTextEditor from '../RichTextEditor';
import TextAnalysis from '../TextAnalysis';
import calculateScores from '@/utils/readabilityScores';
import { getWordCount } from '@/utils/wordCount';

interface Chapter {
  id: string;
  chapter_id: string;
  content: string;
}

interface ChapterEditorProps {
  chapter: Chapter;
  onContentChange: (content: string) => void;
  aiAnalysis: any;
  isAnalyzing: boolean;
}

const ChapterEditor = ({ 
  chapter, 
  onContentChange,
  aiAnalysis,
  isAnalyzing 
}: ChapterEditorProps) => {
  console.log('ChapterEditor rendering with chapter:', chapter);
  
  return (
    <ScrollArea className="h-full">
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-serif font-semibold text-primary-800">
            {chapter.chapter_id}
          </h2>
          <Badge variant="secondary" className="text-sm bg-primary-50 text-primary-700 border-primary-200">
            {getWordCount(chapter.content).toLocaleString()} words
          </Badge>
        </div>
        <RichTextEditor
          key={`editor-${chapter.id}`}
          content={chapter.content || ''}
          onChange={onContentChange}
        />
        <TextAnalysis 
          scores={calculateScores(chapter.content)}
          content={chapter.content}
          aiAnalysis={aiAnalysis}
          isAnalyzing={isAnalyzing}
        />
      </div>
    </ScrollArea>
  );
};

export default ChapterEditor;