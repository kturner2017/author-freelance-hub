
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Folder, 
  Save, 
  AlignLeft, 
  BookOpen,
  Download
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useParams, Link } from 'react-router-dom';
import WordCountBadge from './toolbar/WordCountBadge';
import ViewModeButtons from './toolbar/ViewModeButtons';

interface ChapterToolbarProps {
  totalWordCount: number;
  onSave: () => void;
  onAddChapter: () => void;
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
  const { bookId } = useParams();

  return (
    <div className="flex items-center gap-2">
      <ViewModeButtons />
      
      <Separator orientation="vertical" className="h-6" />
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onAddChapter}
              className="bg-gray-50 hover:bg-gray-100 text-[#0F172A] border border-gray-200 font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Chapter
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add a new chapter</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onAddAct}
              className="bg-gray-50 hover:bg-gray-100 text-[#0F172A] border border-gray-200 font-medium"
            >
              <Folder className="h-4 w-4 mr-2" />
              Add Act
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add a new act</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <Separator orientation="vertical" className="h-6" />
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onGenerateTOC}
              className="bg-gray-50 hover:bg-gray-100 text-[#0F172A] border border-gray-200 font-medium"
            >
              <AlignLeft className="h-4 w-4 mr-2" />
              Generate TOC
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Generate Table of Contents</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className="bg-gray-50 hover:bg-gray-100 text-[#0F172A] border border-gray-200 font-medium"
            >
              <Link to={`/editor/manuscript/${bookId}/book-preview`}>
                <BookOpen className="h-4 w-4 mr-2" />
                Book Preview
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Preview your book for export</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <Separator orientation="vertical" className="h-6" />
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="default" 
              size="sm" 
              onClick={onSave}
              className="bg-[#0F172A] hover:bg-[#1E293B] text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save changes</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <WordCountBadge totalWordCount={totalWordCount} />
    </div>
  );
};

export default ChapterToolbar;
