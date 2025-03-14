
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Chapter } from '@/types/manuscript';

export const useChapterOperations = (
  chapters: { [key: string]: Chapter },
  setChapters: React.Dispatch<React.SetStateAction<{ [key: string]: Chapter }>>,
  bookId: string | undefined
) => {
  const { toast } = useToast();

  const handleChapterRename = async (chapterId: string, newName: string) => {
    try {
      const { error } = await supabase
        .from('manuscript_chapters')
        .update({ chapter_id: newName })
        .eq('id', chapterId);

      if (error) throw error;

      setChapters(prev => ({
        ...prev,
        [chapterId]: {
          ...prev[chapterId],
          chapter_id: newName
        }
      }));

      toast({
        title: "Chapter renamed",
        description: "Chapter name has been updated successfully."
      });
    } catch (error) {
      console.error('Error renaming chapter:', error);
      toast({
        title: "Error",
        description: "Failed to rename chapter. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleChapterDelete = async (chapterId: string) => {
    try {
      const { error } = await supabase
        .from('manuscript_chapters')
        .delete()
        .eq('id', chapterId);

      if (error) throw error;

      const newChapters = { ...chapters };
      delete newChapters[chapterId];
      setChapters(newChapters);

      toast({
        title: "Chapter deleted",
        description: "Chapter has been removed successfully."
      });

      return Object.values(newChapters)[0] || null;
    } catch (error) {
      console.error('Error deleting chapter:', error);
      toast({
        title: "Error",
        description: "Failed to delete chapter. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  };

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

  const handleAddChapter = async () => {
    if (!bookId) return null;
    
    console.log('Adding new chapter for book:', bookId);
    
    try {
      const { data: existingChapters } = await supabase
        .from('manuscript_chapters')
        .select('sort_order, chapter_id')
        .eq('book_id', bookId)
        .order('sort_order', { ascending: false })
        .limit(1);

      const nextSortOrder = existingChapters && existingChapters.length > 0 
        ? existingChapters[0].sort_order + 1 
        : 1;
      
      // Get the highest chapter number to ensure we don't create duplicate chapter numbers
      const chapterNumbers = Object.values(chapters).map(ch => {
        const match = ch.chapter_id.match(/Chapter (\d+)/);
        return match ? parseInt(match[1]) : 0;
      });
      
      const highestNumber = chapterNumbers.length > 0 ? Math.max(...chapterNumbers) : 0;
      const newChapterNumber = highestNumber + 1;
      
      const newChapter = {
        chapter_id: `Chapter ${newChapterNumber}`,
        content: '',
        book_id: bookId,
        sort_order: nextSortOrder
      };

      console.log('Creating new chapter:', newChapter);
      
      const { data, error } = await supabase
        .from('manuscript_chapters')
        .insert([newChapter])
        .select()
        .single();

      if (error) {
        console.error('Error creating chapter:', error);
        toast({
          title: "Error creating chapter",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }

      if (data) {
        console.log('New chapter created:', data);
        const chapterData: Chapter = {
          id: data.id,
          chapter_id: data.chapter_id,
          content: data.content || '',
        };

        setChapters(prevChapters => ({
          ...prevChapters,
          [data.id]: chapterData
        }));

        toast({
          title: "Chapter added",
          description: "A new chapter has been added."
        });

        return chapterData;
      }
    } catch (error) {
      console.error('Error in handleAddChapter:', error);
      toast({
        title: "Error",
        description: "Failed to add new chapter. Please try again.",
        variant: "destructive"
      });
    }
    
    return null;
  };

  return {
    handleChapterRename,
    handleChapterDelete,
    handleChapterMove,
    handleAddChapter
  };
};
