
import { useState, useEffect, RefObject } from 'react';

interface PageSize {
  width: number;
  height: number;
}

interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export const usePageManagement = (
  editorRef: RefObject<HTMLDivElement>,
  showSinglePage: boolean,
  pageSize: '6x9' | '8.5x11',
  margins: Margins,
  content: string
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const pageDimensions: { [key: string]: PageSize } = {
    '6x9': { width: 6, height: 9 },
    '8.5x11': { width: 8.5, height: 11 }
  };

  useEffect(() => {
    if (showSinglePage && editorRef.current) {
      const contentDiv = editorRef.current.querySelector('.ProseMirror');
      if (!contentDiv) return;

      // Use requestAnimationFrame to ensure content is rendered
      requestAnimationFrame(() => {
        const contentHeight = contentDiv.scrollHeight;
        const pageHeight = pageDimensions[pageSize].height * 96; // Convert inches to pixels (96dpi)
        const effectivePageHeight = pageHeight - (margins.top + margins.bottom) * 96;
        const calculatedPages = Math.ceil(contentHeight / effectivePageHeight) || 1;
        setTotalPages(calculatedPages);
      });
    }
  }, [showSinglePage, pageSize, content, margins, editorRef]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return {
    currentPage,
    totalPages,
    handleNextPage,
    handlePrevPage,
  };
};
