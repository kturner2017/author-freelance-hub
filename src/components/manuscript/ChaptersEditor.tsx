import React, { useState, useEffect } from 'react';
import { useToast } from '../ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import calculateScores from '@/utils/readabilityScores';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Database } from '@/integrations/supabase/types';
import RichTextEditor from '../RichTextEditor';
import TextAnalysis from '../TextAnalysis';
import DashboardLayout from '../layout/DashboardLayout';
import type { ReadabilityScores } from '@/types/readability';

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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>({}); // Initialize as empty object

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
        // Select the first chapter by default
        const firstChapter = Object.values(chaptersMap)[0];
        if (firstChapter) {
          setSelectedChapter(firstChapter);
        }
      } else {
        setChapters(INITIAL_CHAPTERS);
        // Select the initial chapter by default
        setSelectedChapter(INITIAL_CHAPTERS['chapter-1']);
      }
    };

    loadChapters();
  }, [toast]);

  const handleContentChange = async (content: string) => {
    if (!selectedChapter) return;
    
    const updatedChapter = {
      ...selectedChapter,
      content: content
    };
    
    setSelectedChapter(updatedChapter);
    setChapters(prev => ({
      ...prev,
      [updatedChapter.chapter_id]: updatedChapter
    }));

    // Trigger AI analysis whenever content changes
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-text', {
        body: { text: content }
      });

      if (error) throw error;
      console.log('AI Analysis results:', data);
      setAiAnalysis(data);
    } catch (error) {
      console.error('Error during AI analysis:', error);
      toast({
        title: "Analysis Error",
        description: "There was an error analyzing your text. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

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

  const handleChapterSelect = (chapter: Chapter) => {
    console.log('Selecting chapter:', chapter);
    setSelectedChapter(chapter);
  };

  const headerActions = (
    <>
      <Button 
        size="sm"
        onClick={handleSave}
        className="bg-white text-primary hover:bg-gray-100 transition-colors"
      >
        Save
      </Button>
      <Button 
        size="sm"
        onClick={handleAddChapter}
        className="bg-white text-primary hover:bg-gray-100 transition-colors"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Chapter
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => navigate('/editor/manuscript/boxes')}
        className="border-white text-white hover:bg-white/10 transition-colors"
      >
        Switch to Boxes View
      </Button>
    </>
  );

  return (
    <DashboardLayout 
      title="Chapters Editor"
      subtitle="Manuscript"
      actions={headerActions}
    >
      <div className="flex-1 flex">
        <div className="w-64 border-r bg-gray-50">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              {Object.values(chapters).map((chapter) => (
                <Card 
                  key={chapter.id}
                  className={`hover:shadow-lg transition-shadow cursor-pointer ${
                    selectedChapter?.id === chapter.id ? 'border-blue-500 shadow-md' : ''
                  }`}
                  onClick={() => handleChapterSelect(chapter)}
                >
                  <CardContent className="p-4">
                    <h4 className="font-semibold">{chapter.title}</h4>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex-1">
          <ScrollArea className="h-full">
            {selectedChapter ? (
              <div className="p-6 max-w-4xl mx-auto">
                <h2 className="text-3xl font-serif mb-6">{selectedChapter.title}</h2>
                <RichTextEditor
                  content={selectedChapter.content}
                  onChange={handleContentChange}
                />
                <TextAnalysis 
                  scores={calculateScores(selectedChapter.content)}
                  content={selectedChapter.content}
                  aiAnalysis={aiAnalysis}
                  isAnalyzing={isAnalyzing}
                />
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                Select a chapter to start editing
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChaptersEditor;
