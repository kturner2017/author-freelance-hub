
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
  
  console.log('ChapterEditor rendering with chapter ID:', chapter?.id);
  console.log('Current location:', location.pathname);
  
  // Check if we're on the root path for this chapter
  const isRootPath = !location.pathname.includes('/full-view') && 
                     !location.pathname.includes('/page-view');

  if (!bookId) {
    console.warn('No bookId found in params, redirecting to books');
    return <Navigate to="/editor/books" replace />;
  }

  if (!chapter || !chapter.id) {
    console.warn('No chapter provided to ChapterEditor');
    return <div className="p-4">Loading chapter content...</div>;
  }

  // If we're at the root path, render the full view editor directly
  if (isRootPath) {
    console.log('Rendering FullChapterEditor directly (root path)');
    return (
      <FullChapterEditor 
        content={chapter.content || ''}
        onContentChange={onContentChange}
        aiAnalysis={aiAnalysis}
        isAnalyzing={isAnalyzing}
      />
    );
  }

  console.log('Rendering ChapterEditor Routes');
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <FullChapterEditor 
            content={chapter.content || ''}
            onContentChange={onContentChange}
            aiAnalysis={aiAnalysis}
            isAnalyzing={isAnalyzing}
          />
        }
      />
      <Route 
        path="full-view" 
        element={
          <FullChapterEditor 
            content={chapter.content || ''}
            onContentChange={onContentChange}
            aiAnalysis={aiAnalysis}
            isAnalyzing={isAnalyzing}
          />
        }
      />
      <Route 
        path="page-view" 
        element={
          <PageViewEditor 
            content={chapter.content || ''}
            onContentChange={onContentChange}
          />
        }
      />
    </Routes>
  );
};

export default ChapterEditor;
