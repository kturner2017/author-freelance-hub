
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../ui/use-toast';
import DashboardLayout from '../layout/DashboardLayout';
import { getTotalWordCount } from '@/utils/wordCount';
import ChapterList from './ChapterList';
import ChapterEditor from './ChapterEditor';
import ChapterToolbar from './ChapterToolbar';
import ManuscriptSidebar from './ManuscriptSidebar';
import { useChapterManagement } from '@/hooks/useChapterManagement';
import { useContentManagement } from '@/hooks/useContentManagement';
import { supabase } from '@/integrations/supabase/client';
import RichTextEditor from '../RichTextEditor';

interface FrontMatterContent {
  id: string;
  title: string;
  content: string;
}

const ChaptersEditor = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const { toast } = useToast();
  const [bookData, setBookData] = useState({ title: '', author: '' });
  const [selectedFrontMatter, setSelectedFrontMatter] = useState<FrontMatterContent | null>(null);
  
  const {
    selectedChapter,
    setSelectedChapter,
    chapters,
    isLoading,
    handleChapterRename,
    handleChapterDelete,
    handleChapterMove,
    handleAddChapter
  } = useChapterManagement(bookId);

  const {
    isAnalyzing,
    aiAnalysis,
    handleContentChange,
    handleSave
  } = useContentManagement();

  const handleFrontMatterSelect = async (frontMatterId: string, title: string) => {
    if (!bookId) return;
    
    try {
      const { data, error } = await supabase
        .from('front_matter_content')
        .select('*')
        .eq('book_id', bookId)
        .eq('front_matter_option_id', frontMatterId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSelectedFrontMatter({
          id: frontMatterId,
          title,
          content: data.content || ''
        });
      } else {
        // Create new front matter content if it doesn't exist
        const { data: newContent, error: insertError } = await supabase
          .from('front_matter_content')
          .insert({
            book_id: bookId,
            front_matter_option_id: frontMatterId,
            content: ''
          })
          .select()
          .single();

        if (insertError) throw insertError;

        setSelectedFrontMatter({
          id: frontMatterId,
          title,
          content: ''
        });
      }
      
      setSelectedChapter(null); // Deselect chapter when front matter is selected
    } catch (error) {
      console.error('Error loading front matter content:', error);
      toast({
        title: "Error",
        description: "Failed to load front matter content",
        variant: "destructive"
      });
    }
  };

  const handleFrontMatterContentChange = async (content: string) => {
    if (!selectedFrontMatter || !bookId) return;

    try {
      const { error } = await supabase
        .from('front_matter_content')
        .upsert({
          book_id: bookId,
          front_matter_option_id: selectedFrontMatter.id,
          content
        });

      if (error) throw error;

      setSelectedFrontMatter(prev => prev ? { ...prev, content } : null);
    } catch (error) {
      console.error('Error saving front matter content:', error);
      toast({
        title: "Error",
        description: "Failed to save front matter content",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const fetchBookData = async () => {
      if (!bookId) return;
      
      const { data, error } = await supabase
        .from('books')
        .select('title, author')
        .eq('id', bookId)
        .single();

      if (error) {
        console.error('Error fetching book data:', error);
        toast({
          title: "Error",
          description: "Failed to load book details",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        setBookData(data);
      }
    };

    fetchBookData();
  }, [bookId, toast]);

  if (isLoading) {
    return (
      <DashboardLayout title="Chapters Editor">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Chapters Editor"
      actions={
        <ChapterToolbar 
          totalWordCount={getTotalWordCount(Object.values(chapters))}
          onSave={() => handleSave(selectedChapter)}
          onAddChapter={handleAddChapter}
        />
      }
    >
      <div className="flex-1 flex">
        <ManuscriptSidebar 
          bookId={bookId || ''} 
          onFrontMatterSelect={handleFrontMatterSelect}
        />
        <ChapterList
          chapters={chapters}
          selectedChapter={selectedChapter}
          onChapterSelect={setSelectedChapter}
          onChapterRename={handleChapterRename}
          onChapterDelete={handleChapterDelete}
          onChapterMove={handleChapterMove}
        />
        <div className="flex-1 bg-white">
          {selectedFrontMatter ? (
            <div className="p-8 max-w-4xl mx-auto">
              <h2 className="text-3xl font-serif font-semibold text-primary-800 mb-8">
                {selectedFrontMatter.title}
              </h2>
              <RichTextEditor
                content={selectedFrontMatter.content}
                onChange={handleFrontMatterContentChange}
              />
            </div>
          ) : selectedChapter ? (
            <ChapterEditor
              key={`chapter-${selectedChapter.id}`}
              chapter={selectedChapter}
              onContentChange={(content) => {
                const updatedChapter = { ...selectedChapter, content };
                setSelectedChapter(updatedChapter);
                handleContentChange(content, updatedChapter);
              }}
              aiAnalysis={aiAnalysis}
              isAnalyzing={isAnalyzing}
            />
          ) : (
            <div className="p-8 text-center text-gray-500">
              Select a chapter or front matter section to start editing
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChaptersEditor;
