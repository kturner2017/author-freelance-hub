
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '../ui/use-toast';
import { getTotalWordCount } from '@/utils/wordCount';
import { useChapterManagement } from '@/hooks/useChapterManagement';
import { useContentManagement } from '@/hooks/useContentManagement';
import { useFrontMatterManager } from '@/hooks/useFrontMatterManager';
import { useActManagement } from '@/hooks/useActManagement';
import { useTOCGenerator } from '@/hooks/useTOCGenerator';
import { supabase } from '@/integrations/supabase/client';
import LoadingEditor from './editor/LoadingEditor';
import EditorLayout from './editor/EditorLayout';

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

  const {
    showTOCGenerator,
    setShowTOCGenerator,
    handleGenerateTOC
  } = useTOCGenerator(bookId, fetchEnabledFrontMatter, handleFrontMatterSelect);

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
    setShowTOCGenerator(false);
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
    return <LoadingEditor />;
  }

  return (
    <EditorLayout
      bookId={bookId}
      bookData={bookData}
      chapters={chapters}
      selectedChapter={selectedChapter}
      selectedFrontMatter={selectedFrontMatter}
      frontMatterContents={frontMatterContents}
      isGoalExpanded={isGoalExpanded}
      showTOCGenerator={showTOCGenerator}
      totalWordCount={totalWordCount}
      aiAnalysis={aiAnalysis}
      isAnalyzing={isAnalyzing}
      title="Chapters Editor"
      onSave={() => handleSave(selectedChapter)}
      onAddChapter={handleAddNewChapter}
      onAddAct={handleAddAct}
      onGenerateTOC={() => setShowTOCGenerator(true)}
      onChapterSelect={(chapter) => {
        setSelectedChapter(chapter);
        setSelectedFrontMatter(null);
        setShowTOCGenerator(false);
      }}
      onChapterRename={handleChapterRename}
      onChapterDelete={handleChapterDelete}
      onChapterMove={handleChapterMove}
      onFrontMatterSelect={handleFrontMatterSelectWithReset}
      setIsGoalExpanded={setIsGoalExpanded}
      setSelectedChapter={setSelectedChapter}
      setSelectedFrontMatter={setSelectedFrontMatter}
      setShowTOCGenerator={setShowTOCGenerator}
      handleContentChange={handleContentChange}
      handleFrontMatterContentChange={handleFrontMatterContentChange}
      handleGenerateTOC={handleGenerateTOC}
    />
  );
};

export default ChaptersEditor;
