
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
import TableOfContents from './TableOfContents';

const ChaptersEditor = () => {
  const { bookId } = useParams();
  const { toast } = useToast();
  const [bookData, setBookData] = useState({ title: '', author: '' });
  const [isGoalExpanded, setIsGoalExpanded] = useState(true);
  const [showTOCGenerator, setShowTOCGenerator] = useState(false);

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

  const handleGenerateTOC = async (content: string) => {
    // Find the Table of Contents front matter if it exists
    const { data: tocOptions } = await supabase
      .from('front_matter_options')
      .select('id')
      .eq('book_id', bookId)
      .eq('title', 'Table of Contents')
      .single();
    
    if (tocOptions) {
      // First enable the Table of Contents option if not already enabled
      await supabase
        .from('front_matter_options')
        .update({ enabled: true })
        .eq('id', tocOptions.id);
      
      // Check if content already exists
      const { data: existingContent } = await supabase
        .from('front_matter_content')
        .select('id')
        .eq('front_matter_option_id', tocOptions.id)
        .eq('book_id', bookId);
      
      if (existingContent && existingContent.length > 0) {
        // Update existing content
        await supabase
          .from('front_matter_content')
          .update({ content })
          .eq('id', existingContent[0].id);
      } else {
        // Create new content
        await supabase
          .from('front_matter_content')
          .insert([{
            front_matter_option_id: tocOptions.id,
            book_id: bookId,
            content
          }]);
      }
      
      // Refresh front matter content
      await fetchEnabledFrontMatter();
      
      // Select the TOC front matter
      handleFrontMatterSelect(tocOptions.id, 'Table of Contents');
      setSelectedChapter(null);
      setShowTOCGenerator(false);
      
      toast({
        title: "Table of Contents Generated",
        description: "The TOC has been created and saved to your front matter",
      });
    }
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
          onGenerateTOC={() => setShowTOCGenerator(true)}
        />
      }
    >
      <div className="flex-1 flex">
        <ManuscriptSidebar 
          bookId={bookId || ''} 
          onFrontMatterSelect={handleFrontMatterSelectWithReset}
          onGenerateTOC={() => setShowTOCGenerator(true)}
        />
        <ChapterList
          chapters={chapters}
          selectedChapter={selectedChapter}
          onChapterSelect={(chapter) => {
            setSelectedChapter(chapter);
            setShowTOCGenerator(false);
          }}
          onChapterRename={handleChapterRename}
          onChapterDelete={handleChapterDelete}
          onChapterMove={handleChapterMove}
        />
        <div className="flex-1 bg-white">
          {showTOCGenerator ? (
            <TableOfContents 
              bookTitle={bookData.title}
              chapters={chapters}
              onGenerate={handleGenerateTOC}
            />
          ) : selectedFrontMatter ? (
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
