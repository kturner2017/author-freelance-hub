
import { Chapter } from '@/types/manuscript';
import { useChapterRename } from './chapter-operations/useChapterRename';
import { useChapterDelete } from './chapter-operations/useChapterDelete';
import { useChapterMove } from './chapter-operations/useChapterMove';
import { useChapterAdd } from './chapter-operations/useChapterAdd';

export const useChapterOperations = (
  chapters: { [key: string]: Chapter },
  setChapters: React.Dispatch<React.SetStateAction<{ [key: string]: Chapter }>>,
  bookId: string | undefined
) => {
  const { handleChapterRename } = useChapterRename(chapters, setChapters);
  const { handleChapterDelete } = useChapterDelete(chapters, setChapters);
  const { handleChapterMove } = useChapterMove(chapters, setChapters);
  const { handleAddChapter } = useChapterAdd(chapters, setChapters, bookId);

  return {
    handleChapterRename,
    handleChapterDelete,
    handleChapterMove,
    handleAddChapter
  };
};
