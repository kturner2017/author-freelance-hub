
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Chapter } from '@/types/manuscript';

export const useChapterMove = (
  chapters: { [key: string]: Chapter },
  setChapters: React.Dispatch<React.SetStateAction<{ [key: string]: Chapter }>>
) => {
  const { toast } = useToast();

  const handleChapterMove = async (chapterId: string, direction: 'up' | 'down') => {
    const chaptersList = Object.values(chapters).sort((a, b) => {
      const aNum = parseInt(a.chapter_id.split(' ')[1]);
      const bNum = parseInt(b.chapter_id.split(' ')[1]);
      return aNum - bNum;
    });

    const currentIndex = chaptersList.findIndex(ch => ch.id === chapterId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= chaptersList.length) return;

    const currentChapter = chaptersList[currentIndex];
    const targetChapter = chaptersList[newIndex];
    const currentNum = parseInt(currentChapter.chapter_id.split(' ')[1]);
    const targetNum = parseInt(targetChapter.chapter_id.split(' ')[1]);

    try {
      const updates = [
        supabase
          .from('manuscript_chapters')
          .update({ chapter_id: `Chapter ${targetNum}` })
          .eq('id', currentChapter.id),
        supabase
          .from('manuscript_chapters')
          .update({ chapter_id: `Chapter ${currentNum}` })
          .eq('id', targetChapter.id)
      ];

      await Promise.all(updates);

      setChapters(prev => ({
        ...prev,
        [currentChapter.id]: { ...currentChapter, chapter_id: `Chapter ${targetNum}` },
        [targetChapter.id]: { ...targetChapter, chapter_id: `Chapter ${currentNum}` }
      }));

      toast({
        title: "Chapter moved",
        description: "Chapter order has been updated successfully."
      });
    } catch (error) {
      console.error('Error moving chapter:', error);
      toast({
        title: "Error",
        description: "Failed to move chapter. Please try again.",
        variant: "destructive"
      });
    }
  };

  return { handleChapterMove };
};
