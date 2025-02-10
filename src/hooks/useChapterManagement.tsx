
import { useState, useEffect } from 'react';
import { Chapter } from '@/types/manuscript';
import { useChapterLoader } from './useChapterLoader';
import { useChapterOperations } from './useChapterOperations';

export const useChapterManagement = (bookId: string | undefined) => {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const { chapters, setChapters, isLoading, loadChapters } = useChapterLoader(bookId);
  const { 
    handleChapterRename, 
    handleChapterDelete, 
    handleChapterMove, 
    handleAddChapter 
  } = useChapterOperations(chapters, setChapters, bookId);

  useEffect(() => {
    if (bookId) {
      const initializeChapters = async () => {
        const firstChapter = await loadChapters();
        if (firstChapter && !selectedChapter) {
          setSelectedChapter({
            id: firstChapter.id,
            chapter_id: firstChapter.chapter_id,
            content: firstChapter.content || '',
          });
        }
      };
      initializeChapters();
    }
  }, [bookId]);

  return {
    selectedChapter,
    setSelectedChapter,
    chapters,
    isLoading,
    handleChapterRename,
    handleChapterDelete,
    handleChapterMove,
    handleAddChapter
  };
};
