
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Chapter } from '@/types/manuscript';

export const useChapterAdd = (
  chapters: { [key: string]: Chapter },
  setChapters: React.Dispatch<React.SetStateAction<{ [key: string]: Chapter }>>,
  bookId: string | undefined
) => {
  const { toast } = useToast();

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

  return { handleAddChapter };
};
