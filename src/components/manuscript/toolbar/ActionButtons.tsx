
import React from 'react';
import { Button } from '../../ui/button';
import { Plus, Save, TableOfContents } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';

interface ActionButtonsProps {
  onSave: () => void;
  onAddChapter: () => Promise<any>;
  onAddAct: () => void;
  onGenerateTOC: () => void;
}

const ActionButtons = ({ 
  onSave, 
  onAddChapter, 
  onAddAct, 
  onGenerateTOC 
}: ActionButtonsProps) => {
  return (
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
  );
};

export default ActionButtons;
