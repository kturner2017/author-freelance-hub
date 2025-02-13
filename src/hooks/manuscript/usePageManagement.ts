
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

  const getTextAreaHeight = () => {
    if (pageSize === '6x9') {
      return 7; // 9" - 2" (top and bottom margins)
    }
    return 9; // 11" - 2" (top and bottom margins)
  };

  useEffect(() => {
    if (showSinglePage && editorRef.current) {
      const contentDiv = editorRef.current.querySelector('.ProseMirror');
      if (!contentDiv) return;

      requestAnimationFrame(() => {
        const contentHeight = contentDiv.scrollHeight;
        const effectivePageHeight = getTextAreaHeight() * 96; // Convert inches to pixels (96dpi)
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
