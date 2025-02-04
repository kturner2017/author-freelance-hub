import React, { useState, useEffect } from 'react';
import { useToast } from '../ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import calculateScores from '@/utils/readabilityScores';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { ChevronLeft, Plus, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Database } from '@/integrations/supabase/types';

type ManuscriptChapter = Database['public']['Tables']['manuscript_chapters']['Row'];

interface Chapter {
  id: string;
  chapter_id: string;
  title: string;
  content: string;
}

const INITIAL_CHAPTERS: { [key: string]: Chapter } = {
  'chapter-1': {
    id: 'chapter-1',
    chapter_id: 'chapter-1',
    title: 'New Chapter',
    content: '',
  }
};

const ChaptersEditor = () => {
  const navigate = useNavigate();
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [chapters, setChapters] = useState<{ [key: string]: Chapter }>(INITIAL_CHAPTERS);
  const { toast } = useToast();

  useEffect(() => {
    const loadChapters = async () => {
      const { data, error } = await supabase
        .from('manuscript_chapters')
        .select('*');

      if (error) {
        console.error('Error loading chapters:', error);
        toast({
          title: "Error loading chapters",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      if (data && data.length > 0) {
        const chaptersMap: { [key: string]: Chapter } = {};
        data.forEach((chapter: ManuscriptChapter) => {
          chaptersMap[chapter.chapter_id] = {
            id: chapter.id,
            chapter_id: chapter.chapter_id,
            title: chapter.title,
            content: chapter.content || '',
          };
        });
        setChapters(chaptersMap);
      } else {
        setChapters(INITIAL_CHAPTERS);
      }
    };

    loadChapters();
  }, [toast]);

  const handleSave = async () => {
    try {
      const { data: existingChapters, error: fetchError } = await supabase
        .from('manuscript_chapters')
        .select('*');

      if (fetchError) {
        console.error('Error fetching existing chapters:', fetchError);
        throw fetchError;
      }

      const existingChapterIds = existingChapters?.map(chapter => chapter.chapter_id) || [];
      const currentChapterIds = Object.keys(chapters);

      const chaptersToDelete = existingChapterIds.filter(id => !currentChapterIds.includes(id));
      const chaptersToUpdate = currentChapterIds.filter(id => existingChapterIds.includes(id));
      const chaptersToInsert = currentChapterIds.filter(id => !existingChapterIds.includes(id));

      if (chaptersToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('manuscript_chapters')
          .delete()
          .in('chapter_id', chaptersToDelete);

        if (deleteError) {
          console.error('Error deleting chapters:', deleteError);
          throw deleteError;
        }
      }

      for (const chapterId of chaptersToUpdate) {
        const chapter = chapters[chapterId];
        const { error: updateError } = await supabase
          .from('manuscript_chapters')
          .update({
            title: chapter.title,
            content: chapter.content,
            updated_at: new Date().toISOString()
          })
          .eq('chapter_id', chapterId);

        if (updateError) {
          console.error(`Error updating chapter ${chapterId}:`, updateError);
          throw updateError;
        }
      }

      if (chaptersToInsert.length > 0) {
        const newChapters = chaptersToInsert.map(chapterId => ({
          chapter_id: chapterId,
          title: chapters[chapterId].title,
          content: chapters[chapterId].content,
        }));

        const { error: insertError } = await supabase
          .from('manuscript_chapters')
          .insert(newChapters);

        if (insertError) {
          console.error('Error inserting new chapters:', insertError);
          throw insertError;
        }
      }

      toast({
        title: "Changes saved",
        description: "Your changes have been saved successfully."
      });
    } catch (error) {
      console.error('Error in save operation:', error);
      toast({
        title: "Error saving changes",
        description: "There was a problem saving your changes. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddChapter = () => {
    const newChapterId = `chapter-${Object.keys(chapters).length + 1}`;
    const newChapter: Chapter = {
      id: newChapterId,
      chapter_id: newChapterId,
      title: 'New Chapter',
      content: '',
    };

    setChapters(prevChapters => ({
      ...prevChapters,
      [newChapterId]: newChapter
    }));

    toast({
      title: "Chapter added",
      description: "A new chapter has been added."
    });
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="h-16 border-b flex items-center px-4 justify-between bg-[#0F172A] text-white">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/editor')}
            className="hover:bg-white/10 text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/')}
            className="hover:bg-white/10 text-white"
          >
            <Home className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold leading-tight">Chapters Editor</h2>
            <p className="text-sm text-gray-300 leading-tight">Manuscript</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="sm"
            onClick={handleSave}
            className="bg-white text-[#0F172A] hover:bg-gray-100 transition-colors"
          >
            Save
          </Button>
          <Button 
            size="sm"
            onClick={handleAddChapter}
            className="bg-white text-[#0F172A] hover:bg-gray-100 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Chapter
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/editor/manuscript/boxes')}
            className="border-white text-[#0F172A] bg-white hover:bg-white/90 transition-colors"
          >
            Switch to Boxes View
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold">Chapters</h3>
            <div className="space-y-4">
              {Object.values(chapters).map((chapter) => (
                <Card 
                  key={chapter.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedChapter(chapter)}
                >
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">{chapter.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {chapter.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChaptersEditor;