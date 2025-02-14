
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
      !showSinglePage ? 'max-w-[8.5in] mx-auto' : 'flex justify-center bg-gray-100 p-8 rounded-lg',
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
          "bg-white relative transition-all duration-300",
          showSinglePage ? pageClass : 'w-full',
          showSinglePage ? 'shadow-2xl' : 'shadow-lg rounded-lg',
        )}
        style={{
          padding: `${showSinglePage ? margins.top : 1}in ${showSinglePage ? margins.right : 1}in ${showSinglePage ? margins.bottom : 1}in ${showSinglePage ? margins.left : 1}in`,
          height: showSinglePage ? (pageSize === '6x9' ? '9in' : '11in') : 'auto',
          position: 'relative',
          overflow: showSinglePage ? 'hidden' : 'visible',
        }}
      >
        <div
          className={cn(
            showSinglePage ? "absolute inset-0" : "relative",
            "bg-white"
          )}
          style={{
            transform: showSinglePage ? `translateY(-${(currentPage - 1) * (pageSize === '6x9' ? 9 : 11)}in)` : 'none',
            transition: 'transform 0.3s ease-in-out',
            height: showSinglePage ? `${totalPages * (pageSize === '6x9' ? 9 : 11)}in` : 'auto',
            overflow: showSinglePage ? 'hidden' : 'visible',
          }}
        >
          <div
            style={{
              minHeight: showSinglePage ? `${(pageSize === '6x9' ? 9 : 11) - margins.top - margins.bottom - 0.25}in` : 'auto',
              height: 'auto',
            }}
            className="prose max-w-none"
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
