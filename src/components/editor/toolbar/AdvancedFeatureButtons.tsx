
import React from 'react';
import { Editor } from '@tiptap/react';
import { 
  History, 
  Search, 
  SlidersHorizontal, 
  Table, 
  MessageCircle 
} from 'lucide-react';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from "sonner";

interface AdvancedFeatureButtonsProps {
  editor: Editor;
}

const AdvancedFeatureButtons = ({ editor }: AdvancedFeatureButtonsProps) => {
  const handleVersionHistory = () => {
    toast.info("Version History feature", {
      description: "This feature will be available soon"
    });
  };

  const handleFindReplace = () => {
    toast.info("Find and Replace feature", {
      description: "This feature will be available soon"
    });
  };

  const handleFloatingToolbar = () => {
    toast.info("Floating Toolbar feature", {
      description: "This feature will be available soon"
    });
  };

  const handleTable = () => {
    toast.info("Table insertion feature", {
      description: "This feature will be available soon"
    });
  };

  const handleComments = () => {
    toast.info("Comments feature", {
      description: "This feature will be available soon"
    });
  };

  return (
    <Menubar className="border-none bg-transparent p-0">
      <MenubarMenu>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <MenubarTrigger className="p-2 h-8 cursor-pointer">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="sr-only">More Features</span>
              </MenubarTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Advanced Features</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <MenubarContent align="start" className="min-w-[200px]">
          <MenubarItem onClick={handleVersionHistory} className="flex items-center gap-2 cursor-pointer">
            <History className="h-4 w-4" />
            <span>Version History</span>
          </MenubarItem>
          
          <MenubarItem onClick={handleFindReplace} className="flex items-center gap-2 cursor-pointer">
            <Search className="h-4 w-4" />
            <span>Find & Replace</span>
          </MenubarItem>
          
          <MenubarItem onClick={handleFloatingToolbar} className="flex items-center gap-2 cursor-pointer">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Floating Toolbar</span>
          </MenubarItem>
          
          <MenubarSeparator />
          
          <MenubarItem onClick={handleTable} className="flex items-center gap-2 cursor-pointer">
            <Table className="h-4 w-4" />
            <span>Insert Table</span>
          </MenubarItem>
          
          <MenubarItem onClick={handleComments} className="flex items-center gap-2 cursor-pointer">
            <MessageCircle className="h-4 w-4" />
            <span>Comments</span>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default AdvancedFeatureButtons;
