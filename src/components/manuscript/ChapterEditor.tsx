
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
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
  const { toast } = useToast();
  const { chapterId } = useParams();

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
        path="/full-view" 
        element={
          <FullChapterEditor 
            content={chapter.content}
            onContentChange={onContentChange}
          />
        }
      />
      <Route 
        path="/page-view" 
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
