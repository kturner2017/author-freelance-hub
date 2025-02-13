
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
      const contentHeight = contentDiv ? contentDiv.scrollHeight : 0;
      const pageHeight = pageDimensions[pageSize].height * 96; // Convert inches to pixels (96dpi)
      const effectivePageHeight = pageHeight - (margins.top + margins.bottom) * 96;
      const calculatedPages = Math.ceil(contentHeight / effectivePageHeight);
      setTotalPages(Math.max(1, calculatedPages));
      setCurrentPage(1);
    }
  }, [showSinglePage, pageSize, content, margins]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      if (editorRef.current) {
        editorRef.current.scrollTop = 0;
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      if (editorRef.current) {
        editorRef.current.scrollTop = 0;
      }
    }
  };

  return {
    currentPage,
    totalPages,
    handleNextPage,
    handlePrevPage,
  };
};
