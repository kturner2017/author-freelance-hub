
import React from 'react';
import { Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import FullChapterEditor from './editor/FullChapterEditor';
import PageViewEditor from './editor/PageViewEditor';

interface Chapter {
  id: string;
  chapter_id: string;
  content: string;
  template?: string;
}

interface ChapterEditorProps {
  chapter: Chapter;
  onContentChange: (content: string) => void;
  aiAnalysis: any;
  isAnalyzing: boolean;
}

const ChapterEditor = ({ 
  chapter, 
  onContentChange,
  aiAnalysis,
  isAnalyzing 
}: ChapterEditorProps) => {
  const { bookId } = useParams();
  const location = useLocation();
  
  // Check if we're on the root path for this chapter
  const isRootPath = !location.pathname.includes('/full-view') && 
                     !location.pathname.includes('/page-view');

  if (!bookId) {
    return <Navigate to="/editor/books" replace />;
  }

  // If we're at the root path, render the full view editor directly
  if (isRootPath) {
    return (
      <FullChapterEditor 
        content={chapter.content}
        onContentChange={onContentChange}
      />
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <FullChapterEditor 
            content={chapter.content}
            onContentChange={onContentChange}
          />
        }
      />
      <Route 
        path="full-view" 
        element={
          <FullChapterEditor 
            content={chapter.content}
            onContentChange={onContentChange}
          />
        }
      />
      <Route 
        path="page-view" 
        element={
          <PageViewEditor 
            content={chapter.content}
            onContentChange={onContentChange}
          />
        }
      />
    </Routes>
  );
};

export default ChapterEditor;
