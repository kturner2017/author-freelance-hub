
import React from 'react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  File, 
  Folder,
  Pencil,
  ArrowUp,
  ArrowDown,
  Trash2,
  X,
  Check
} from 'lucide-react';
import FrontMatterSection from './FrontMatterSection';

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

            {chapters.map((chapter, index) => (
              <div key={chapter.id} className="flex items-center group">
                {editingChapterId === chapter.id ? (
                  <div className="flex items-center w-full gap-1 pr-2">
                    <input
                      type="text"
                      value={editingChapterTitle}
                      onChange={(e) => onChapterTitleChange(e.target.value)}
                      className="flex-1 bg-gray-700 text-white px-2 py-1 rounded"
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={onChapterEditSave}
                    >
                      <Check className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={onChapterEditCancel}
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      className={`flex-1 justify-start text-gray-300 hover:bg-gray-700 active:bg-gray-600 transition-colors duration-200 py-1 h-auto ${
                        selectedChapter === chapter.id ? 'bg-gray-700' : ''
                      }`}
                      onClick={() => onChapterSelect(chapter.id)}
                    >
                      <div className="flex items-center">
                        <File className="h-4 w-4 mr-2" />
                        {chapter.title}
                      </div>
                    </Button>
                    <div className="hidden group-hover:flex items-center gap-1 pr-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onChapterEditStart(chapter)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onChapterMove(chapter.id, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onChapterMove(chapter.id, 'down')}
                        disabled={index === chapters.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onChapterDelete(chapter.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}

            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-300 hover:bg-gray-700 active:bg-gray-600 transition-colors duration-200 py-1 h-auto"
              onClick={onChapterAdd}
            >
              <div className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Chapter
              </div>
            </Button>

            {['act1', 'act2'].map((act) => (
              <div key={act}>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-gray-300 hover:bg-gray-700 active:bg-gray-600 transition-colors duration-200 py-1 h-auto"
                  onClick={() => onSectionToggle(act as 'act1' | 'act2')}
                >
                  <div className="flex items-center">
                    {expandedSections[act as keyof typeof expandedSections] ? (
                      <ChevronDown className="h-4 w-4 mr-2" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-2" />
                    )}
                    <Folder className="h-4 w-4 mr-2" />
                    Act {act === 'act1' ? 'I' : 'II'}
                  </div>
                </Button>
                {expandedSections[act as keyof typeof expandedSections] && (
                  <div className="ml-4 space-y-1">
                    {getBoxesForAct(act as 'act1' | 'act2').map(box => (
                      <Button 
                        key={box.id}
                        variant="ghost" 
                        className="w-full justify-start text-sm text-gray-400 hover:bg-gray-700 py-1 h-auto"
                        onClick={() => onBoxSelect(box)}
                      >
                        <File className="h-4 w-4 mr-2" />
                        {box.title}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ManuscriptSidebar;
