import React from 'react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { ChevronUp, ChevronDown, Pencil, Trash2 } from 'lucide-react';
import { Input } from '../ui/input';
import { useState } from 'react';

interface Chapter {
  id: string;
  chapter_id: string;
  content: string;
}

interface ChapterListProps {
  chapters: { [key: string]: Chapter };
  selectedChapter: Chapter | null;
  onChapterSelect: (chapter: Chapter) => void;
  onChapterRename?: (chapterId: string, newName: string) => void;
  onChapterDelete?: (chapterId: string) => void;
  onChapterMove?: (chapterId: string, direction: 'up' | 'down') => void;
}

const ChapterList = ({ 
  chapters, 
  selectedChapter, 
  onChapterSelect,
  onChapterRename,
  onChapterDelete,
  onChapterMove
}: ChapterListProps) => {
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleStartRename = (chapter: Chapter) => {
    setEditingChapterId(chapter.id);
    setEditingName(chapter.chapter_id);
  };

  const handleFinishRename = () => {
    if (editingChapterId && onChapterRename) {
      onChapterRename(editingChapterId, editingName);
    }
    setEditingChapterId(null);
  };

  const sortedChapters = Object.values(chapters).sort((a, b) => {
    const aNum = parseInt(a.chapter_id.split(' ')[1]);
    const bNum = parseInt(b.chapter_id.split(' ')[1]);
    return aNum - bNum;
  });

  return (
    <div className="w-64 border-r bg-gray-50">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-gray-700">Chapters</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-10rem)]">
        <div className="space-y-1 p-2">
          {sortedChapters.map((chapter) => (
            <div
              key={chapter.id}
              className={`flex items-center justify-between group p-2 rounded-lg ${
                selectedChapter?.id === chapter.id
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex-1 min-w-0" onClick={() => onChapterSelect(chapter)}>
                {editingChapterId === chapter.id ? (
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={handleFinishRename}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleFinishRename();
                      if (e.key === 'Escape') setEditingChapterId(null);
                    }}
                    className="h-6 text-black"
                    autoFocus
                  />
                ) : (
                  <span className="truncate cursor-pointer">
                    {chapter.chapter_id}
                  </span>
                )}
              </div>
              <div className={`flex items-center space-x-1 ${
                selectedChapter?.id === chapter.id ? 'text-white' : 'text-gray-500'
              }`}>
                {onChapterMove && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => onChapterMove(chapter.id, 'up')}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => onChapterMove(chapter.id, 'down')}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </>
                )}
                {onChapterRename && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleStartRename(chapter)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                {onChapterDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => onChapterDelete(chapter.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChapterList;