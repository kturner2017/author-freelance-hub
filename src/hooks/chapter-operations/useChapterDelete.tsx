
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Chapter } from '@/types/manuscript';

export const useChapterDelete = (
  chapters: { [key: string]: Chapter },
  setChapters: React.Dispatch<React.SetStateAction<{ [key: string]: Chapter }>>
) => {
  const { toast } = useToast();

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

  return { handleChapterDelete };
};
