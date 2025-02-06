
import React from 'react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { ChevronRight } from 'lucide-react';
import FrontMatterSection from './FrontMatterSection';
import ChapterListSection from './ChapterListSection';
import ActSection from './ActSection';

interface Chapter {
  id: string;
  title: string;
}

interface ManuscriptSidebarProps {
  bookData: {
    title: string;
    author: string;
  };
  chapters: Chapter[];
  selectedChapter: string;
  expandedSections: {
    frontMatter: boolean;
    act1: boolean;
    act2: boolean;
    act3: boolean;
  };
  editingChapterId: string | null;
  editingChapterTitle: string;
  boxes: {
    [key: string]: {
      id: string;
      title: string;
      content: string;
      act: 'act1' | 'act2' | 'act3';
    };
  };
  frontMatterOptions: {
    id: string;
    title: string;
    enabled: boolean;
  }[];
  onChapterSelect: (chapterId: string) => void;
  onChapterAdd: () => void;
  onChapterDelete: (chapterId: string) => void;
  onChapterMove: (chapterId: string, direction: 'up' | 'down') => void;
  onChapterEditStart: (chapter: Chapter) => void;
  onChapterEditSave: () => void;
  onChapterEditCancel: () => void;
  onChapterTitleChange: (title: string) => void;
  onSectionToggle: (section: 'frontMatter' | 'act1' | 'act2' | 'act3') => void;
  onBoxSelect: (box: any) => void;
  onFrontMatterOptionToggle: (id: string) => void;
}

const ManuscriptSidebar = ({
  bookData,
  chapters,
  selectedChapter,
  expandedSections,
  editingChapterId,
  editingChapterTitle,
  boxes,
  frontMatterOptions,
  onChapterSelect,
  onChapterAdd,
  onChapterDelete,
  onChapterMove,
  onChapterEditStart,
  onChapterEditSave,
  onChapterEditCancel,
  onChapterTitleChange,
  onSectionToggle,
  onBoxSelect,
  onFrontMatterOptionToggle,
}: ManuscriptSidebarProps) => {
  const getBoxesForAct = (act: 'act1' | 'act2' | 'act3') => {
    return Object.values(boxes).filter(box => box.act === act);
  };

  return (
    <div className="w-64 bg-[#2c3643] text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">{bookData.title}</h2>
        <p className="text-sm text-gray-400">by {bookData.author}</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          <div className="space-y-1">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-300 hover:bg-gray-700 active:bg-gray-600 transition-colors duration-200 py-1 h-auto"
            >
              <div className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2" />
                Get Started
              </div>
            </Button>

            <FrontMatterSection
              expanded={expandedSections.frontMatter}
              options={frontMatterOptions}
              onToggleExpand={() => onSectionToggle('frontMatter')}
              onOptionToggle={onFrontMatterOptionToggle}
            />

            <ChapterListSection
              chapters={chapters}
              selectedChapter={selectedChapter}
              editingChapterId={editingChapterId}
              editingChapterTitle={editingChapterTitle}
              onChapterSelect={onChapterSelect}
              onChapterAdd={onChapterAdd}
              onChapterDelete={onChapterDelete}
              onChapterMove={onChapterMove}
              onChapterEditStart={onChapterEditStart}
              onChapterEditSave={onChapterEditSave}
              onChapterEditCancel={onChapterEditCancel}
              onChapterTitleChange={onChapterTitleChange}
            />

            {['act1', 'act2'].map((act) => (
              <ActSection
                key={act}
                act={act as 'act1' | 'act2'}
                expanded={expandedSections[act as keyof typeof expandedSections]}
                boxes={getBoxesForAct(act as 'act1' | 'act2')}
                onSectionToggle={() => onSectionToggle(act as 'act1' | 'act2')}
                onBoxSelect={onBoxSelect}
              />
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ManuscriptSidebar;
