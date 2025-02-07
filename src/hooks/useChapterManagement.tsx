
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Chapter {
  id: string;
  chapter_id: string;
  content: string;
}

export const useChapterManagement = (bookId: string | undefined) => {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [chapters, setChapters] = useState<{ [key: string]: Chapter }>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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
        return;
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
        if (!selectedChapter) {
          const firstChapter = existingChapters[0];
          console.log('Setting initial chapter:', firstChapter);
          setSelectedChapter({
            id: firstChapter.id,
            chapter_id: firstChapter.chapter_id,
            content: firstChapter.content || '',
          });
        }
      } else {
        await createInitialChapter();
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
  };

  const createInitialChapter = async () => {
    const initialChapter = {
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
      return;
    }

    if (newChapter) {
      const chapterData = {
        id: newChapter.id,
        chapter_id: newChapter.chapter_id,
        content: newChapter.content || '',
      };

      setChapters({ [newChapter.id]: chapterData });
      setSelectedChapter(chapterData);
    }
  };

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

      if (selectedChapter?.id === chapterId) {
        setSelectedChapter(prev => prev ? {
          ...prev,
          chapter_id: newName
        } : null);
      }

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

      if (selectedChapter?.id === chapterId) {
        const remainingChapters = Object.values(newChapters);
        setSelectedChapter(remainingChapters.length > 0 ? remainingChapters[0] : null);
      }

      toast({
        title: "Chapter deleted",
        description: "Chapter has been removed successfully."
      });
    } catch (error) {
      console.error('Error deleting chapter:', error);
      toast({
        title: "Error",
        description: "Failed to delete chapter. Please try again.",
        variant: "destructive"
      });
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

      if (selectedChapter?.id === currentChapter.id) {
        setSelectedChapter(prev => prev ? {
          ...prev,
          chapter_id: `Chapter ${targetNum}`
        } : null);
      }

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
    if (!bookId) return;

    const { data: existingChapters } = await supabase
      .from('manuscript_chapters')
      .select('sort_order')
      .eq('book_id', bookId)
      .order('sort_order', { ascending: false })
      .limit(1);

    const nextSortOrder = existingChapters && existingChapters.length > 0 
      ? existingChapters[0].sort_order + 1 
      : 1;

    const newChapterNumber = Object.keys(chapters).length + 1;
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
      return;
    }

    if (data) {
      const chapterData = {
        id: data.id,
        chapter_id: data.chapter_id,
        content: data.content || '',
      };

      setChapters(prevChapters => ({
        ...prevChapters,
        [data.id]: chapterData
      }));

      setSelectedChapter(chapterData);

      toast({
        title: "Chapter added",
        description: "A new chapter has been added."
      });
    }
  };

  useEffect(() => {
    if (bookId) {
      loadChapters();
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
