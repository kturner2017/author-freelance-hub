
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Chapter } from '@/types/manuscript';

export const useChapterRename = (
  chapters: { [key: string]: Chapter },
  setChapters: React.Dispatch<React.SetStateAction<{ [key: string]: Chapter }>>
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

  return { handleChapterRename };
};
