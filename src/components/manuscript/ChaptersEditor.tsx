
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

const ChaptersEditor = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const { toast } = useToast();
  const [bookData, setBookData] = useState({ title: '', author: '' });
  
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

  const chaptersList = Object.values(chapters).map(chapter => ({
    id: chapter.id,
    title: chapter.chapter_id
  }));

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
        <ManuscriptSidebar bookId={bookId || ''} />
        <ChapterList
          chapters={chapters}
          selectedChapter={selectedChapter}
          onChapterSelect={setSelectedChapter}
          onChapterRename={handleChapterRename}
          onChapterDelete={handleChapterDelete}
          onChapterMove={handleChapterMove}
        />
        <div className="flex-1 bg-white">
          {selectedChapter ? (
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
              Select a chapter to start editing
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChaptersEditor;
