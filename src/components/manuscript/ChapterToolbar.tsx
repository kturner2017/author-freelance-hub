
import React from 'react';
import { Separator } from '../ui/separator';
import { useParams } from 'react-router-dom';
import BackNavigationButtons from './toolbar/BackNavigationButtons';
import EditorHeaderInfo from './toolbar/EditorHeaderInfo';
import WordCountBadge from './toolbar/WordCountBadge';
import ViewModeButtons from './toolbar/ViewModeButtons';
import ActionButtons from './toolbar/ActionButtons';

interface ChapterToolbarProps {
  totalWordCount: number;
  onSave: () => void;
  onAddChapter: () => Promise<any>;
  onAddAct: () => void;
  onGenerateTOC: () => void;
}

const ChapterToolbar = ({ 
  totalWordCount, 
  onSave, 
  onAddChapter,
  onAddAct,
  onGenerateTOC
}: ChapterToolbarProps) => {
  return (
    <div className="flex items-center gap-4 h-16 border-b px-6 justify-between bg-white text-[#0F172A] shadow-sm">
      <div className="flex items-center gap-4">
        <BackNavigationButtons />
        <EditorHeaderInfo />
      </div>

      <div className="flex items-center gap-4">
        <WordCountBadge totalWordCount={totalWordCount} />
        
        <div className="flex items-center gap-2 ml-2">
          <ViewModeButtons />
        </div>
        
        <Separator orientation="vertical" className="h-6 bg-gray-200" />
        
        <ActionButtons 
          onSave={onSave}
          onAddChapter={onAddChapter}
          onAddAct={onAddAct}
          onGenerateTOC={onGenerateTOC}
        />
      </div>
    </div>
  );
};

export default ChapterToolbar;
