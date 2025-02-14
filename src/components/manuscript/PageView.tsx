
import React from 'react';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import RichTextEditor from '../RichTextEditor';
import { MarginSettings } from '@/types/paper';

interface PageViewProps {
  editorRef: React.RefObject<HTMLDivElement>;
  showSinglePage: boolean;
  pageSize: '6x9' | '8.5x11' | 'epub';
  margins: MarginSettings;
  currentPage: number;
  totalPages: number;
  content: string;
  chapterId: string;
  onContentChange: (content: string) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
  getPageClass: () => string;
  getTextAreaDimensions: () => { width: string; height: string };
  getPageHeight: () => string;
}

const PageView = ({
  editorRef,
  showSinglePage,
  pageSize,
  margins,
  currentPage,
  totalPages,
  content,
  chapterId,
  onContentChange,
  onNextPage,
  onPrevPage,
  getPageClass,
  getTextAreaDimensions,
  getPageHeight,
}: PageViewProps) => {
  return (
    <div className={`relative ${showSinglePage ? 'flex justify-center' : ''}`}>
      {showSinglePage && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
          onClick={onPrevPage}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      )}
      
      <div 
        ref={editorRef}
        className={`${showSinglePage ? getPageClass() : ''} bg-[#F5F5F5] shadow-lg relative mx-auto`}
        style={{
          height: showSinglePage ? undefined : 'auto',
          boxSizing: 'border-box',
          position: 'relative',
          backgroundColor: showSinglePage ? '#E8E8E8' : undefined
        }}
      >
        {showSinglePage && (
          <div
            className="absolute inset-0"
            style={{
              border: '1px solid rgba(0,0,0,0.2)',
              margin: `${margins.top}in ${margins.right}in ${margins.bottom}in ${margins.left}in`,
              pointerEvents: 'none',
              backgroundColor: 'rgba(0,0,0,0.03)'
            }}
          />
        )}
        
        {showSinglePage ? (
          <div
            style={{
              position: 'absolute',
              top: `${margins.top}in`,
              left: `${margins.left}in`,
              ...getTextAreaDimensions(),
              overflow: 'hidden',
              backgroundColor: '#FFFFFF',
              height: getPageHeight()
            }}
          >
            <div
              className="ProseMirror-wrapper"
              style={{
                height: '100%',
                transform: `translateY(-${(currentPage - 1) * 100}%)`,
                transition: 'transform 0.3s ease-in-out',
              }}
            >
              <RichTextEditor
                key={`editor-${chapterId}`}
                content={content || ''}
                onChange={onContentChange}
              />
            </div>
          </div>
        ) : (
          <RichTextEditor
            key={`editor-${chapterId}`}
            content={content || ''}
            onChange={onContentChange}
          />
        )}
        
        {showSinglePage && (
          <div className="absolute bottom-2 left-0 right-0 text-center text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
        )}
      </div>

      {showSinglePage && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
          onClick={onNextPage}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default PageView;
