
import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { BookOpen, Home, ArrowLeft, LayoutDashboard, Plus, TableOfContents, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Separator } from '../ui/separator';

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
  const navigate = useNavigate();
  const { bookId } = useParams();

  return (
    <div className="flex items-center gap-4 h-16 border-b px-6 justify-between bg-white text-[#0F172A] shadow-sm">
      <div className="flex items-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/editor/books')}
                className="hover:bg-gray-100 text-[#0F172A]"
                aria-label="Back to editor"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Back to Books</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/')}
                className="hover:bg-gray-100 text-[#0F172A]"
                aria-label="Home"
              >
                <Home className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Go to Home</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div>
          <h2 className="text-lg font-serif font-bold leading-tight text-[#0F172A]">Manuscript Editor</h2>
          <p className="text-sm text-[#1E293B] font-medium leading-tight">Document View</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Badge variant="outline" className="text-sm bg-gray-50 text-[#0F172A] border border-gray-200 font-medium py-1.5">
          <BookOpen className="h-4 w-4 mr-1.5" />
          Words: {totalWordCount.toLocaleString()}
        </Badge>
        
        <div className="flex items-center gap-2 ml-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate(`/editor/manuscript/${bookId}/chapters`)}
                  className="bg-gray-50 hover:bg-gray-100 text-[#0F172A] border border-gray-200 font-medium"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Document
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Document Mode</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate(`/editor/manuscript/${bookId}/boxes`)}
                  className="bg-gray-50 hover:bg-gray-100 text-[#0F172A] border border-gray-200 font-medium"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Boxes
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Boxes Mode</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Separator orientation="vertical" className="h-6 bg-gray-200" />
        
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="bg-white text-[#0F172A] border border-gray-200 hover:bg-gray-50 font-medium"
                  onClick={onSave}
                  aria-label="Save Changes"
                >
                  <Save className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save Changes</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="default" 
                  size="icon"
                  className="bg-[#0F172A] hover:bg-[#1E293B] text-white font-medium"
                  onClick={async () => {
                    console.log('Add Chapter clicked');
                    await onAddChapter();
                  }}
                  aria-label="Add Chapter"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add Chapter</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline"
                  size="icon"
                  className="bg-white text-[#0F172A] border border-gray-200 hover:bg-gray-50 font-medium"
                  onClick={onAddAct}
                  aria-label="Add Act"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add Act</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline"
                  size="icon"
                  className="bg-white text-[#0F172A] border border-gray-200 hover:bg-gray-50 font-medium"
                  onClick={onGenerateTOC}
                  aria-label="Generate TOC"
                >
                  <TableOfContents className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Generate Table of Contents</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default ChapterToolbar;
