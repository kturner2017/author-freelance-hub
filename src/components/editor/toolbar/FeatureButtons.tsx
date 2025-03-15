
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '../../ui/button';
import { 
  History, 
  Search, 
  SlidersHorizontal, 
  Table, 
  MessageCircle 
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FeatureButtonProps {
  editor: Editor;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export const FeatureButton = ({ editor, icon, label, onClick }: FeatureButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClick}
            className="h-8 w-8 p-0"
            aria-label={label}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const VersionHistoryButton = ({ editor }: { editor: Editor }) => {
  return (
    <FeatureButton
      editor={editor}
      icon={<History className="h-4 w-4" />}
      label="Version History"
      onClick={() => console.log('Version History clicked')}
    />
  );
};

export const FindReplaceButton = ({ editor }: { editor: Editor }) => {
  return (
    <FeatureButton
      editor={editor}
      icon={<Search className="h-4 w-4" />}
      label="Find & Replace"
      onClick={() => console.log('Find & Replace clicked')}
    />
  );
};

export const FloatingToolbarButton = ({ editor }: { editor: Editor }) => {
  return (
    <FeatureButton
      editor={editor}
      icon={<SlidersHorizontal className="h-4 w-4" />}
      label="Floating Toolbar"
      onClick={() => console.log('Floating Toolbar clicked')}
    />
  );
};

export const TableButton = ({ editor }: { editor: Editor }) => {
  return (
    <FeatureButton
      editor={editor}
      icon={<Table className="h-4 w-4" />}
      label="Insert Table"
      onClick={() => console.log('Insert Table clicked')}
    />
  );
};

export const CommentsButton = ({ editor }: { editor: Editor }) => {
  return (
    <FeatureButton
      editor={editor}
      icon={<MessageCircle className="h-4 w-4" />}
      label="Comments"
      onClick={() => console.log('Comments clicked')}
    />
  );
};
