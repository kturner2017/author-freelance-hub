
import React from 'react';
import { Button } from '../../ui/button';
import { BookOpen, LayoutDashboard } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';

const ViewModeButtons = () => {
  const { bookId } = useParams();

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className="bg-gray-50 hover:bg-gray-100 text-[#0F172A] border border-gray-200 font-medium"
            >
              <Link to={`/editor/manuscript/${bookId}/chapters`}>
                <BookOpen className="h-4 w-4 mr-2" />
                Document
              </Link>
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
              asChild
              className="bg-gray-50 hover:bg-gray-100 text-[#0F172A] border border-gray-200 font-medium"
            >
              <Link to={`/editor/manuscript/${bookId}/boxes`}>
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Boxes
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View Boxes Mode</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ViewModeButtons;
