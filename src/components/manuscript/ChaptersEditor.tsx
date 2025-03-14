
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '../ui/use-toast';
import DashboardLayout from '../layout/DashboardLayout';
import { getTotalWordCount } from '@/utils/wordCount';
import ChapterList from './ChapterList';
import ChapterEditor from './ChapterEditor';
import ChapterToolbar from './ChapterToolbar';
import ManuscriptSidebar from './ManuscriptSidebar';
import GoalArea from './GoalArea';
import { useChapterManagement } from '@/hooks/useChapterManagement';
import { useContentManagement } from '@/hooks/useContentManagement';
import { useFrontMatterManager } from '@/hooks/useFrontMatterManager';
import { useActManagement } from '@/hooks/useActManagement';
import { supabase } from '@/integrations/supabase/client';
import FrontMatterEditor from './FrontMatterEditor';
import FrontMatterPreview from './FrontMatterPreview';

const ChaptersEditor = () => {
  const { bookId } = useParams();
  const { toast } = useToast();
  const [bookData, setBookData] = useState({ title: '', author: '' });
  const [isGoalExpanded, setIsGoalExpanded] = useState(true);

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

  const {
    frontMatterContents,
    selectedFrontMatter,
    setSelectedFrontMatter,
    fetchEnabledFrontMatter,
    handleFrontMatterSelect,
    handleFrontMatterContentChange
  } = useFrontMatterManager(bookId);

  const { handleAddAct } = useActManagement(bookId);

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
    fetchEnabledFrontMatter();
  }, [bookId]);

  const handleFrontMatterSelectWithReset = (frontMatterId: string, title: string) => {
    handleFrontMatterSelect(frontMatterId, title);
    setSelectedChapter(null);
  };

  const handleAddNewChapter = async () => {
    console.log('Handling add new chapter');
    const newChapter = await handleAddChapter();
    if (newChapter) {
      console.log('New chapter created:', newChapter);
      setSelectedChapter(newChapter);
      toast({
        title: "Chapter Added",
        description: "New chapter has been created successfully"
      });
    }
    return newChapter;
  };

  const totalWordCount = getTotalWordCount(Object.values(chapters));

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
          totalWordCount={totalWordCount}
          onSave={() => handleSave(selectedChapter)}
          onAddChapter={handleAddNewChapter}
          onAddAct={handleAddAct}
        />
      }
    >
      <div className="flex-1 flex">
        <ManuscriptSidebar 
          bookId={bookId || ''} 
          onFrontMatterSelect={handleFrontMatterSelectWithReset}
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
            <FrontMatterEditor
              selectedFrontMatter={selectedFrontMatter}
              handleFrontMatterContentChange={handleFrontMatterContentChange}
            />
          ) : !selectedChapter ? (
            <FrontMatterPreview frontMatterContents={frontMatterContents} />
          ) : (
            <div className="flex transition-all duration-200">
              <div className={`flex-1 transition-all duration-200 ${!isGoalExpanded ? 'mr-[-272px]' : ''}`}>
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
              </div>
              <div className="w-72">
                <GoalArea 
                  bookId={bookId || ''} 
                  currentWordCount={totalWordCount}
                  onToggle={(expanded) => setIsGoalExpanded(expanded)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChaptersEditor;
