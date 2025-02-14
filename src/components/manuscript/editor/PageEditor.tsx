
import React from 'react';
import { Button } from '../../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import RichTextEditor from '../../RichTextEditor';
import { cn } from '@/lib/utils';

interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface PageEditorProps {
  editorRef: React.RefObject<HTMLDivElement>;
  showSinglePage: boolean;
  pageSize: '6x9' | '8.5x11';
  margins: Margins;
  currentPage: number;
  totalPages: number;
  content: string;
  onContentChange: (content: string) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const PageEditor = ({
  editorRef,
  showSinglePage,
  pageSize,
  margins,
  currentPage,
  totalPages,
  content,
  onContentChange,
  onPrevPage,
  onNextPage
}: PageEditorProps) => {
  const pageClass = pageSize === '6x9' ? 'w-[6in] h-[9in]' : 'w-[8.5in] h-[11in]';

  return (
    <div className={cn(
      "relative",
      showSinglePage ? 'flex justify-center bg-gray-100 p-8 rounded-lg' : '',
    )}>
      {showSinglePage && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hover:bg-white/80"
          onClick={onPrevPage}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      )}
      
      <div 
        ref={editorRef}
        className={cn(
          "bg-white relative mx-auto transition-all duration-300",
          showSinglePage ? pageClass : '',
          showSinglePage ? 'shadow-2xl' : 'shadow-lg',
        )}
        style={{
          padding: showSinglePage ? `${margins.top}in ${margins.right}in ${margins.bottom}in ${margins.left}in` : undefined,
          height: showSinglePage ? (pageSize === '6x9' ? '9in' : '11in') : 'auto',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          className={cn(
            "absolute inset-0",
            showSinglePage ? 'bg-white' : ''
          )}
          style={{
            transform: showSinglePage ? `translateY(-${(currentPage - 1) * (pageSize === '6x9' ? 9 : 11)}in)` : 'none',
            transition: 'transform 0.3s ease-in-out',
            height: showSinglePage ? `${totalPages * (pageSize === '6x9' ? 9 : 11)}in` : 'auto',
          }}
        >
          <div
            style={{
              minHeight: showSinglePage ? `${(pageSize === '6x9' ? 9 : 11) - margins.top - margins.bottom - 0.25}in` : 'auto',
              height: 'auto',
              overflow: 'visible',
            }}
            className={cn(
              showSinglePage ? 'bg-white' : '',
              'prose max-w-none'
            )}
          >
            <RichTextEditor
              content={content || ''}
              onChange={onContentChange}
            />
          </div>
        </div>
        {showSinglePage && (
          <div className="absolute bottom-2 left-0 right-0 text-center">
            <span className="px-4 py-1 bg-gray-800 text-white text-sm rounded-full">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        )}
      </div>

      {showSinglePage && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hover:bg-white/80"
          onClick={onNextPage}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default PageEditor;
