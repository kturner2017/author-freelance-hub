
import React from 'react';
import { Button } from '../../ui/button';
import { ArrowLeft, Files, Home } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';

interface PageViewNavigationProps {
  title: string;
  viewMode: 'page' | 'full';
}

const PageViewNavigation = ({ title, viewMode }: PageViewNavigationProps) => {
  const { bookId, chapterId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 max-w-7xl mx-auto px-4 h-16">
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate(`/editor/manuscript/${bookId}/chapters`)}
                className="hover:bg-gray-100 text-[#0F172A]"
                aria-label="Back to chapters"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Back to Chapters</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                asChild
                className="hover:bg-gray-100 text-[#0F172A]"
                aria-label="Home"
              >
                <Link to="/">
                  <Home className="h-5 w-5" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Go to Home</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <h1 className="text-xl font-semibold">{title}</h1>
      
      <div className="ml-auto">
        <Button variant="outline" asChild>
          <Link to={
            viewMode === 'page'
              ? `/editor/manuscript/${bookId}/chapters/${chapterId}/full-view`
              : `/editor/manuscript/${bookId}/chapters/${chapterId}/page-view`
          }>
            <Files className="h-4 w-4 mr-2" />
            {viewMode === 'page' ? 'Full View' : 'Page View'}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default PageViewNavigation;
