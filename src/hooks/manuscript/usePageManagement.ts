
import { useState, useEffect, RefObject } from 'react';
import { MarginSettings } from '@/types/paper';

export const usePageManagement = (
  editorRef: RefObject<HTMLDivElement>,
  showSinglePage: boolean,
  pageSize: '6x9' | '8.5x11' | 'epub',
  margins: MarginSettings,
  content: string
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getTextAreaHeight = () => {
    if (pageSize === '6x9') {
      return (9 - margins.top - margins.bottom) * 96; // Convert inches to pixels (96dpi)
    } else if (pageSize === '8.5x11') {
      return (11 - margins.top - margins.bottom) * 96;
    } else {
      // ePub format (200mm)
      return (200 - (margins.top + margins.bottom) * 25.4) * (96/25.4); // Convert mm to pixels
    }
  };

  useEffect(() => {
    if (showSinglePage && editorRef.current) {
      const contentDiv = editorRef.current.querySelector('.ProseMirror');
      if (!contentDiv) return;

      requestAnimationFrame(() => {
        const contentHeight = contentDiv.scrollHeight;
        const effectivePageHeight = getTextAreaHeight();
        const calculatedPages = Math.ceil(contentHeight / effectivePageHeight) || 1;
        setTotalPages(calculatedPages);
        // Reset to first page when changing page size or margins
        setCurrentPage(1);
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
