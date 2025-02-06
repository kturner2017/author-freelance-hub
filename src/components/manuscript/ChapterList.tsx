import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Card, CardContent } from '../ui/card';
import { getWordCount } from '@/utils/wordCount';

interface Chapter {
  id: string;
  chapter_id: string;
  content: string;
}

interface ChapterListProps {
  chapters: { [key: string]: Chapter };
  selectedChapter: Chapter | null;
  onChapterSelect: (chapter: Chapter) => void;
}

const ChapterList = ({ chapters, selectedChapter, onChapterSelect }: ChapterListProps) => {
  return (
    <div className="w-72 border-r bg-white shadow-sm">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-3">
          {Object.values(chapters).map((chapter) => (
            <Card 
              key={chapter.id}
              className={`hover:shadow-lg transition-all cursor-pointer ${
                selectedChapter?.id === chapter.id ? 'border-primary shadow-md ring-1 ring-primary/20' : ''
              }`}
              onClick={() => onChapterSelect(chapter)}
            >
              <CardContent className="p-4">
                <h4 className="text-lg font-serif font-semibold text-primary-800">{chapter.chapter_id}</h4>
                <p className="text-sm text-gray-500 mt-1">
                  {getWordCount(chapter.content).toLocaleString()} words
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChapterList;