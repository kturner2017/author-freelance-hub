
import React from 'react';
import ChapterEditor from '../ChapterEditor';
import FrontMatterEditor from '../FrontMatterEditor';
import FrontMatterPreview from '../FrontMatterPreview';
import TableOfContents from '../TableOfContents';
import GoalArea from '../GoalArea';

interface EditorContentAreaProps {
  bookId: string | undefined;
  showTOCGenerator: boolean;
  selectedFrontMatter: any;
  frontMatterContents: any[];
  selectedChapter: any;
  isGoalExpanded: boolean;
  totalWordCount: number;
  aiAnalysis: any;
  isAnalyzing: boolean;
  bookData: { title: string; author: string };
  chapters: { [key: string]: any };
  setIsGoalExpanded: (expanded: boolean) => void;
  setSelectedChapter: (chapter: any) => void;
  setSelectedFrontMatter: (frontMatter: any) => void;
  setShowTOCGenerator: (show: boolean) => void;
  handleContentChange: (content: string, chapter: any) => void;
  handleFrontMatterContentChange: (content: string) => void;
  handleGenerateTOC: (content: string) => void;
}

const EditorContentArea = ({
  bookId,
  showTOCGenerator,
  selectedFrontMatter,
  frontMatterContents,
  selectedChapter,
  isGoalExpanded,
  totalWordCount,
  aiAnalysis,
  isAnalyzing,
  bookData,
  chapters,
  setIsGoalExpanded,
  setSelectedChapter,
  handleContentChange,
  handleFrontMatterContentChange,
  handleGenerateTOC
}: EditorContentAreaProps) => {
  return (
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
  );
};

export default EditorContentArea;
