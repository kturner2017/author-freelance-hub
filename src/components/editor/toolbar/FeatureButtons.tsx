
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
import { toast } from "sonner";

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
  const handleClick = () => {
    toast.info("Version History feature", {
      description: "This feature will be available soon"
    });
  };

  return (
    <FeatureButton
      editor={editor}
      icon={<History className="h-4 w-4" />}
      label="Version History"
      onClick={handleClick}
    />
  );
};

export const FindReplaceButton = ({ editor }: { editor: Editor }) => {
  const handleClick = () => {
    toast.info("Find & Replace feature", {
      description: "This feature will be available soon"
    });
  };

  return (
    <FeatureButton
      editor={editor}
      icon={<Search className="h-4 w-4" />}
      label="Find & Replace"
      onClick={handleClick}
    />
  );
};

export const FloatingToolbarButton = ({ editor }: { editor: Editor }) => {
  const handleClick = () => {
    toast.info("Floating Toolbar feature", {
      description: "This feature will be available soon"
    });
  };

  return (
    <FeatureButton
      editor={editor}
      icon={<SlidersHorizontal className="h-4 w-4" />}
      label="Floating Toolbar"
      onClick={handleClick}
    />
  );
};

export const TableButton = ({ editor }: { editor: Editor }) => {
  const handleClick = () => {
    toast.info("Insert Table feature", {
      description: "This feature will be available soon"
    });
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

export const CommentsButton = ({ editor }: { editor: Editor }) => {
  const handleClick = () => {
    toast.info("Comments feature", {
      description: "This feature will be available soon"
    });
  };

  return (
    <FeatureButton
      editor={editor}
      icon={<MessageCircle className="h-4 w-4" />}
      label="Comments"
      onClick={handleClick}
    />
  );
};
