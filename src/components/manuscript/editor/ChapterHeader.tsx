
import React from 'react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';
import { getWordCount } from '@/utils/wordCount';
import { cn } from '@/lib/utils';

interface ChapterHeaderProps {
  chapterId: string;
  content: string;
  selectedTemplate: string;
  pageSize: '6x9' | '8.5x11';
  showSinglePage: boolean;
  onTemplateClick: () => void;
  onPageSizeChange: (size: '6x9' | '8.5x11') => void;
  onViewModeToggle: () => void;
}

const ChapterHeader = ({
  chapterId,
  content,
  selectedTemplate,
  pageSize,
  showSinglePage,
  onTemplateClick,
  onPageSizeChange,
  onViewModeToggle
}: ChapterHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-3xl font-serif font-semibold text-primary-800">
        {chapterId}
      </h2>
      <div className="flex items-center gap-4">
        <Badge 
          variant="secondary" 
          className="text-sm bg-primary-50 text-primary-700 border-primary-200 cursor-pointer"
          onClick={onTemplateClick}
        >
          Template: {selectedTemplate}
        </Badge>
        <Badge variant="secondary" className="text-sm bg-primary-50 text-primary-700 border-primary-200">
          {getWordCount(content).toLocaleString()} words
        </Badge>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageSizeChange('6x9')}
            className={cn(
              "border-2",
              pageSize === '6x9' ? 'border-primary-500 bg-primary-50' : ''
            )}
          >
            6" x 9"
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageSizeChange('8.5x11')}
            className={cn(
              "border-2",
              pageSize === '8.5x11' ? 'border-primary-500 bg-primary-50' : ''
            )}
          >
            8.5" x 11"
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onViewModeToggle}
            className="flex items-center gap-2"
          >
            {showSinglePage ? (
              <>
                <Maximize2 className="h-4 w-4" />
                Full View
              </>
            ) : (
              <>
                <Minimize2 className="h-4 w-4" />
                Book View
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChapterHeader;
