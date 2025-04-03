
import React from 'react';
import DashboardLayout from '../../layout/DashboardLayout';
import ChapterToolbar from '../ChapterToolbar';
import ManuscriptSidebar from '../ManuscriptSidebar';
import ChapterList from '../ChapterList';
import EditorContentArea from './EditorContentArea';

interface EditorLayoutProps {
  bookId: string | undefined;
  bookData: { title: string; author: string };
  chapters: { [key: string]: any };
  selectedChapter: any;
  selectedFrontMatter: any | null;
  frontMatterContents: any[];
  isGoalExpanded: boolean;
  showTOCGenerator: boolean;
  totalWordCount: number;
  aiAnalysis: any;
  isAnalyzing: boolean;
  title: string;
  onSave: () => void;
  onAddChapter: () => Promise<any>;
  onAddAct: () => void;
  onGenerateTOC: () => void;
  onChapterSelect: (chapter: any) => void;
  onChapterRename: (chapterId: string, newName: string) => void;
  onChapterDelete: (chapterId: string) => void;
  onChapterMove: (chapterId: string, direction: 'up' | 'down') => void;
  onFrontMatterSelect: (frontMatterId: string, title: string) => void;
  setIsGoalExpanded: (expanded: boolean) => void;
  setSelectedChapter: (chapter: any) => void;
  setSelectedFrontMatter: (frontMatter: any) => void;
  setShowTOCGenerator: (show: boolean) => void;
  handleContentChange: (content: string, chapter: any) => void;
  handleFrontMatterContentChange: (content: string) => void;
  handleGenerateTOC: (content: string) => void;
}

const EditorLayout = ({
  bookId,
  bookData,
  chapters,
  selectedChapter,
  selectedFrontMatter,
  frontMatterContents,
  isGoalExpanded,
  showTOCGenerator,
  totalWordCount,
  aiAnalysis,
  isAnalyzing,
  title,
  onSave,
  onAddChapter,
  onAddAct,
  onGenerateTOC,
  onChapterSelect,
  onChapterRename,
  onChapterDelete,
  onChapterMove,
  onFrontMatterSelect,
  setIsGoalExpanded,
  setSelectedChapter,
  setSelectedFrontMatter,
  setShowTOCGenerator,
  handleContentChange,
  handleFrontMatterContentChange,
  handleGenerateTOC
}: EditorLayoutProps) => {
  console.log('Rendering EditorLayout with bookId:', bookId);
  console.log('Selected chapter:', selectedChapter?.id);
  console.log('AI analysis status:', isAnalyzing);
  
  return (
    <DashboardLayout 
      title={title}
      actions={
        <ChapterToolbar 
          totalWordCount={totalWordCount}
          onSave={onSave}
          onAddChapter={onAddChapter}
          onAddAct={onAddAct}
          onGenerateTOC={onGenerateTOC}
        />
      }
    >
      <div className="flex-1 flex">
        <ManuscriptSidebar 
          bookId={bookId || ''} 
          onFrontMatterSelect={onFrontMatterSelect}
          onGenerateTOC={onGenerateTOC}
          activeFrontMatterId={selectedFrontMatter?.id}
        />
        <ChapterList
          chapters={chapters}
          selectedChapter={selectedChapter}
          onChapterSelect={onChapterSelect}
          onChapterRename={onChapterRename}
          onChapterDelete={onChapterDelete}
          onChapterMove={onChapterMove}
        />
        <EditorContentArea 
          bookId={bookId}
          showTOCGenerator={showTOCGenerator}
          selectedFrontMatter={selectedFrontMatter}
          frontMatterContents={frontMatterContents}
          selectedChapter={selectedChapter}
          isGoalExpanded={isGoalExpanded}
          totalWordCount={totalWordCount}
          aiAnalysis={aiAnalysis}
          isAnalyzing={isAnalyzing}
          bookData={bookData}
          chapters={chapters}
          setIsGoalExpanded={setIsGoalExpanded}
          setSelectedChapter={setSelectedChapter}
          setSelectedFrontMatter={setSelectedFrontMatter}
          setShowTOCGenerator={setShowTOCGenerator}
          handleContentChange={handleContentChange}
          handleFrontMatterContentChange={handleFrontMatterContentChange}
          handleGenerateTOC={handleGenerateTOC}
        />
      </div>
    </DashboardLayout>
  );
};

export default EditorLayout;
