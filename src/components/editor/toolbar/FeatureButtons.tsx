
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
  isActive?: boolean;
}

export const FeatureButton = ({ editor, icon, label, onClick, isActive = false }: FeatureButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isActive ? "default" : "ghost"}
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

export const VersionHistoryButton = ({ 
  editor, 
  isActive, 
  onClick 
}: { 
  editor: Editor; 
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <FeatureButton
      editor={editor}
      icon={<History className="h-4 w-4" />}
      label="Version History"
      onClick={onClick}
      isActive={isActive}
    />
  );
};

export const FindReplaceButton = ({ 
  editor, 
  isActive, 
  onClick 
}: { 
  editor: Editor; 
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <FeatureButton
      editor={editor}
      icon={<Search className="h-4 w-4" />}
      label="Find & Replace"
      onClick={onClick}
      isActive={isActive}
    />
  );
};

export const FloatingToolbarButton = ({ 
  editor, 
  isActive, 
  onClick 
}: { 
  editor: Editor; 
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <FeatureButton
      editor={editor}
      icon={<SlidersHorizontal className="h-4 w-4" />}
      label="Floating Toolbar"
      onClick={onClick}
      isActive={isActive}
    />
  );
};

export const TableButton = ({ editor }: { editor: Editor }) => {
  const handleClick = () => {
    if (editor) {
      editor
        .chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run();
    }
  };

  return (
    <FeatureButton
      editor={editor}
      icon={<Table className="h-4 w-4" />}
      label="Insert Table"
      onClick={handleClick}
    />
  );
};

export const CommentsButton = ({ 
  editor, 
  isActive, 
  onClick 
}: { 
  editor: Editor; 
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <FeatureButton
      editor={editor}
      icon={<MessageCircle className="h-4 w-4" />}
      label="Comments"
      onClick={onClick}
      isActive={isActive}
    />
  );
};
