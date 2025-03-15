
import React from 'react';
import { Button } from '../../ui/button';
import { BookOpen, LayoutDashboard } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';

const ViewModeButtons = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();

  return (
    <div className="flex items-center gap-2">
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
  );
};

export default ViewModeButtons;
