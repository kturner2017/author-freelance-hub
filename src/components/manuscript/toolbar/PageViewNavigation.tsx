
import React from 'react';
import { Button } from '../../ui/button';
import { ArrowLeft, Files } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

interface PageViewNavigationProps {
  title: string;
  viewMode: 'page' | 'full';
}

const PageViewNavigation = ({ title, viewMode }: PageViewNavigationProps) => {
  const { bookId, chapterId } = useParams();

  return (
    <div className="flex items-center gap-4 max-w-7xl mx-auto px-4 h-16">
      <Button variant="ghost" size="icon" asChild>
        <Link to={`/editor/manuscript/${bookId}/chapters`}>
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </Button>
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
