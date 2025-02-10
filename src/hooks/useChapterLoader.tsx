
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Chapter, ChapterCreate } from '@/types/manuscript';

export const useChapterLoader = (bookId: string | undefined) => {
  const [chapters, setChapters] = useState<{ [key: string]: Chapter }>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const createInitialChapter = async () => {
    if (!bookId) return null;
    
    const initialChapter: ChapterCreate = {
      chapter_id: 'Chapter 1',
      content: '',
      book_id: bookId,
      sort_order: 1
    };
    
    console.log('Creating initial chapter:', initialChapter);
    const { data: newChapter, error: insertError } = await supabase
      .from('manuscript_chapters')
      .insert([initialChapter])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating initial chapter:', insertError);
      toast({
        title: "Error creating chapter",
        description: insertError.message,
        variant: "destructive"
      });
      return null;
    }

    if (newChapter) {
      const chapterData: Chapter = {
        id: newChapter.id,
        chapter_id: newChapter.chapter_id,
        content: newChapter.content || '',
      };
      return chapterData;
    }
    return null;
  };

  const loadChapters = async () => {
    if (!bookId) return;
    setIsLoading(true);
    console.log('Loading chapters for book:', bookId);
    
    try {
      const { data: existingChapters, error } = await supabase
        .from('manuscript_chapters')
        .select('*')
        .eq('book_id', bookId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading chapters:', error);
        toast({
          title: "Error loading chapters",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }

      console.log('Loaded chapters:', existingChapters);
      
      if (existingChapters && existingChapters.length > 0) {
        const chaptersMap: { [key: string]: Chapter } = {};
        existingChapters.forEach((chapter: any) => {
          chaptersMap[chapter.id] = {
            id: chapter.id,
            chapter_id: chapter.chapter_id,
            content: chapter.content || '',
          };
        });
        
        setChapters(chaptersMap);
        return existingChapters[0];
      } else {
        const initialChapter = await createInitialChapter();
        if (initialChapter) {
          setChapters({ [initialChapter.id]: initialChapter });
          return initialChapter;
        }
      }
    } catch (error) {
      console.error('Error in loadChapters:', error);
      toast({
        title: "Error",
        description: "Failed to load chapters. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  useEffect(() => {
    if (bookId) {
      loadChapters();
    }
  }, [bookId]);

  return {
    chapters,
    setChapters,
    isLoading,
    loadChapters
  };
};
