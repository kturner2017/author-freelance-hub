
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
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
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

  const handleComments = () => {
    toast.info("Comments feature", {
      description: "This feature will be available soon"
    });
  };

  const insertTable = (rows: number, cols: number) => {
    editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: true })
      .run();
    
    toast.success("Table inserted", {
      description: `${rows}×${cols} table has been inserted`
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
          
          <MenubarSub>
            <MenubarSubTrigger className="flex items-center gap-2 cursor-pointer">
              <Table className="h-4 w-4" />
              <span>Insert Table</span>
            </MenubarSubTrigger>
            <MenubarSubContent>
              {[2, 3, 4, 5].map(rows => (
                <div key={rows} className="flex items-center gap-2">
                  {[2, 3, 4, 5].map(cols => (
                    <button
                      key={`${rows}-${cols}`}
                      onClick={() => insertTable(rows, cols)}
                      className="w-6 h-6 border m-1 hover:bg-primary hover:border-primary flex items-center justify-center text-xs"
                      title={`${rows}×${cols} table`}
                    >
                      {rows}×{cols}
                    </button>
                  ))}
                </div>
              ))}
            </MenubarSubContent>
          </MenubarSub>
          
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
