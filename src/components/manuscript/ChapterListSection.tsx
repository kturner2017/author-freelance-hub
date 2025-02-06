
import React from 'react';
import { Button } from '../ui/button';
import { 
  File, 
  Pencil,
  ArrowUp,
  ArrowDown,
  Trash2,
  X,
  Check,
  Plus
} from 'lucide-react';

interface Chapter {
  id: string;
  title: string;
}

interface ChapterListSectionProps {
  chapters: Chapter[];
  selectedChapter: string;
  editingChapterId: string | null;
  editingChapterTitle: string;
  onChapterSelect: (chapterId: string) => void;
  onChapterAdd: () => void;
  onChapterDelete: (chapterId: string) => void;
  onChapterMove: (chapterId: string, direction: 'up' | 'down') => void;
  onChapterEditStart: (chapter: Chapter) => void;
  onChapterEditSave: () => void;
  onChapterEditCancel: () => void;
  onChapterTitleChange: (title: string) => void;
}

const ChapterListSection = ({
  chapters,
  selectedChapter,
  editingChapterId,
  editingChapterTitle,
  onChapterSelect,
  onChapterAdd,
  onChapterDelete,
  onChapterMove,
  onChapterEditStart,
  onChapterEditSave,
  onChapterEditCancel,
  onChapterTitleChange,
}: ChapterListSectionProps) => {
  return (
    <div className="space-y-1">
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
    </div>
  );
};

export default ChapterListSection;
