import React, { useState, useEffect } from 'react';
import { useToast } from '../ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import calculateScores from '@/utils/readabilityScores';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Plus, BookOpen } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Database } from '@/integrations/supabase/types';
import RichTextEditor from '../RichTextEditor';
import TextAnalysis from '../TextAnalysis';
import DashboardLayout from '../layout/DashboardLayout';
import { getWordCount, getTotalWordCount } from '@/utils/wordCount';
import { Badge } from '../ui/badge';

type ManuscriptChapter = Database['public']['Tables']['manuscript_chapters']['Row'];

interface Chapter {
  id: string;
  chapter_id: string;
  content: string;
}

const ChaptersEditor = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [chapters, setChapters] = useState<{ [key: string]: Chapter }>({});
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadChapters();
  }, [bookId]);

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
        existingChapters.forEach((chapter: ManuscriptChapter) => {
          if (!chaptersMap[chapter.chapter_id]) {
            chaptersMap[chapter.chapter_id] = {
              id: chapter.id,
              chapter_id: chapter.chapter_id,
              content: chapter.content || '',
            };
          }
        });
        
        setChapters(chaptersMap);
        
        const firstChapter = Object.values(chaptersMap)[0];
        if (firstChapter) {
          console.log('Setting initial chapter:', firstChapter);
          setSelectedChapter(firstChapter);
        }
      } else {
        const initialChapter = {
          chapter_id: 'Chapter 1',
          content: '',
          book_id: bookId
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

          setChapters({ [newChapter.chapter_id]: chapterData });
          setSelectedChapter(chapterData);
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
  };

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
    if (!bookId) return;

    try {
      console.log('Saving chapters for book:', bookId);
      const { data: existingChapters, error: fetchError } = await supabase
        .from('manuscript_chapters')
        .select('*')
        .eq('book_id', bookId);

      if (fetchError) {
        console.error('Error fetching existing chapters:', fetchError);
        throw fetchError;
      }

      const existingChapterIds = existingChapters?.map(chapter => chapter.chapter_id) || [];
      const currentChapterIds = Object.keys(chapters);

      const chaptersToDelete = existingChapterIds.filter(id => !currentChapterIds.includes(id));
      const chaptersToUpdate = currentChapterIds.filter(id => existingChapterIds.includes(id));
      const chaptersToInsert = currentChapterIds.filter(id => !existingChapterIds.includes(id));

      console.log('Chapters to update:', chaptersToUpdate);
      console.log('Chapters to insert:', chaptersToInsert);
      console.log('Chapters to delete:', chaptersToDelete);

      if (chaptersToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('manuscript_chapters')
          .delete()
          .eq('book_id', bookId)
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
            content: chapter.content,
            updated_at: new Date().toISOString()
          })
          .eq('book_id', bookId)
          .eq('chapter_id', chapterId);

        if (updateError) {
          console.error(`Error updating chapter ${chapterId}:`, updateError);
          throw updateError;
        }
      }

      if (chaptersToInsert.length > 0) {
        const newChapters = chaptersToInsert.map(chapterId => ({
          book_id: bookId,
          chapter_id: chapterId,
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

  const handleChapterSelect = (chapter: Chapter) => {
    console.log('Selecting chapter:', chapter);
    setSelectedChapter(chapter);
  };

  const handleAddChapter = async () => {
    if (!bookId) return;

    const newChapterNumber = Object.keys(chapters).length + 1;
    const newChapter = {
      chapter_id: `Chapter ${newChapterNumber}`,
      content: '',
      book_id: bookId
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
        [data.chapter_id]: chapterData
      }));

      toast({
        title: "Chapter added",
        description: "A new chapter has been added."
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout 
        title="Chapters Editor"
        subtitle="Manuscript"
      >
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  const totalWordCount = getTotalWordCount(Object.values(chapters));

  const headerActions = (
    <>
      <div className="flex items-center gap-4">
        <Badge variant="secondary" className="text-sm bg-white/10 text-white border-0">
          <BookOpen className="h-4 w-4 mr-1" />
          Total Words: {totalWordCount.toLocaleString()}
        </Badge>
        <Button 
          size="sm"
          onClick={handleSave}
          variant="secondary"
          className="font-medium"
        >
          Save Changes
        </Button>
        <Button 
          size="sm"
          onClick={handleAddChapter}
          variant="secondary"
          className="font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Chapter
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/editor/manuscript/boxes')}
          className="border-white text-white hover:bg-white/10 font-medium"
        >
          Switch to Boxes View
        </Button>
      </div>
    </>
  );

  return (
    <DashboardLayout 
      title="Chapters Editor"
      subtitle="Manuscript"
      actions={headerActions}
    >
      <div className="flex-1 flex">
        <div className="w-72 border-r bg-white shadow-sm">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              {Object.values(chapters).map((chapter) => (
                <Card 
                  key={chapter.id}
                  className={`hover:shadow-lg transition-all cursor-pointer ${
                    selectedChapter?.id === chapter.id ? 'border-primary shadow-md ring-1 ring-primary/20' : ''
                  }`}
                  onClick={() => handleChapterSelect(chapter)}
                >
                  <CardContent className="p-4">
                    <h4 className="text-lg font-serif font-semibold text-primary-800">{chapter.chapter_id}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {getWordCount(chapter.content).toLocaleString()} words
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex-1 bg-white">
          <ScrollArea className="h-full">
            {selectedChapter ? (
              <div className="p-8 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-serif font-semibold text-primary-800">{selectedChapter.chapter_id}</h2>
                  <Badge variant="secondary" className="text-sm bg-primary-50 text-primary-700 border-primary-200">
                    {getWordCount(selectedChapter.content).toLocaleString()} words
                  </Badge>
                </div>
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
              <div className="p-8 text-center text-gray-500">
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
