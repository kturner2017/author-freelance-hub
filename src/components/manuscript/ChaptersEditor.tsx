import React, { useState, useEffect } from 'react';
import { useToast } from '../ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { getTotalWordCount } from '@/utils/wordCount';
import ChapterList from './ChapterList';
import ChapterEditor from './ChapterEditor';
import ChapterToolbar from './ChapterToolbar';

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
    if (bookId) {
      loadChapters();
    }
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
        existingChapters.forEach((chapter: any) => {
          chaptersMap[chapter.id] = {
            id: chapter.id,
            chapter_id: chapter.chapter_id,
            content: chapter.content || '',
          };
        });
        
        setChapters(chaptersMap);
        // Only set initial chapter if none is selected
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

      setChapters({ [newChapter.id]: chapterData });
      setSelectedChapter(chapterData);
    }
  };

  const handleContentChange = async (content: string) => {
    if (!selectedChapter) return;
    
    console.log('Updating content for chapter:', selectedChapter.id);
    
    // Update local state first
    const updatedChapter = {
      ...selectedChapter,
      content: content
    };
    
    setSelectedChapter(updatedChapter);
    setChapters(prev => ({
      ...prev,
      [updatedChapter.id]: updatedChapter
    }));

    // Trigger AI analysis
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
    if (!bookId || !selectedChapter) return;

    console.log('Saving chapter:', selectedChapter);

    try {
      const { error: updateError } = await supabase
        .from('manuscript_chapters')
        .update({
          content: selectedChapter.content,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedChapter.id);

      if (updateError) throw updateError;

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
        [data.id]: chapterData
      }));

      setSelectedChapter(chapterData);

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

  return (
    <DashboardLayout 
      title="Chapters Editor"
      subtitle="Manuscript"
      actions={
        <ChapterToolbar 
          totalWordCount={totalWordCount}
          onSave={handleSave}
          onAddChapter={handleAddChapter}
          onSwitchView={() => navigate('/editor/manuscript/boxes')}
        />
      }
    >
      <div className="flex-1 flex">
        <ChapterList
          chapters={chapters}
          selectedChapter={selectedChapter}
          onChapterSelect={(chapter) => {
            console.log('Selecting chapter:', chapter);
            setSelectedChapter(chapter);
          }}
        />
        <div className="flex-1 bg-white">
          {selectedChapter ? (
            <ChapterEditor
              key={`chapter-${selectedChapter.id}`}
              chapter={selectedChapter}
              onContentChange={handleContentChange}
              aiAnalysis={aiAnalysis}
              isAnalyzing={isAnalyzing}
            />
          ) : (
            <div className="p-8 text-center text-gray-500">
              Select a chapter to start editing
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChaptersEditor;