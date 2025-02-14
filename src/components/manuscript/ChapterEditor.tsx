
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ChapterHeader from './editor/ChapterHeader';
import MarginControls from './editor/MarginControls';
import PageEditor from './editor/PageEditor';
import TemplateSelector from './TemplateSelector';

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

interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

const ChapterEditor = ({ 
  chapter, 
  onContentChange,
  aiAnalysis,
  isAnalyzing 
}: ChapterEditorProps) => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState(chapter.template || 'classic');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState<'6x9' | '8.5x11'>('6x9');
  const [showSinglePage, setShowSinglePage] = useState(false);
  const [margins, setMargins] = useState<Margins>({
    top: 1,
    right: 1,
    bottom: 1,
    left: 1
  });
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showSinglePage && editorRef.current) {
      const contentDiv = editorRef.current.querySelector('.ProseMirror');
      const contentHeight = contentDiv ? contentDiv.scrollHeight : 0;
      const pageHeight = pageSize === '6x9' ? 9 * 96 : 11 * 96;
      const effectivePageHeight = pageHeight - (margins.top + margins.bottom) * 96;
      const calculatedPages = Math.ceil(contentHeight / effectivePageHeight);
      setTotalPages(Math.max(1, calculatedPages));
      setCurrentPage(1);
    }
  }, [showSinglePage, pageSize, chapter.content, margins]);

  const handleTemplateSelect = async (templateId: string) => {
    try {
      const { error } = await supabase
        .from('manuscript_chapters')
        .update({ template: templateId })
        .eq('id', chapter.id);

      if (error) throw error;

      setSelectedTemplate(templateId);
      toast({
        title: "Template updated",
        description: "Your chapter formatting has been updated"
      });
    } catch (error) {
      console.error('Error updating template:', error);
      toast({
        title: "Update failed",
        description: "Failed to update chapter template",
        variant: "destructive"
      });
    }
  };

  const handleMarginChange = (side: keyof Margins, value: string) => {
    const numValue = parseFloat(value) || 0;
    setMargins(prev => ({
      ...prev,
      [side]: Math.max(0, Math.min(3, numValue))
    }));
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      if (editorRef.current) {
        editorRef.current.scrollTop = 0;
      }
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      if (editorRef.current) {
        editorRef.current.scrollTop = 0;
      }
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-8 max-w-[11in] mx-auto">
        <ChapterHeader
          chapterId={chapter.chapter_id}
          content={chapter.content}
          selectedTemplate={selectedTemplate}
          pageSize={pageSize}
          showSinglePage={showSinglePage}
          onTemplateClick={() => setShowTemplateSelector(!showTemplateSelector)}
          onPageSizeChange={setPageSize}
          onViewModeToggle={() => setShowSinglePage(!showSinglePage)}
        />

        {showTemplateSelector && (
          <div className="mb-8">
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onTemplateSelect={handleTemplateSelect}
            />
          </div>
        )}

        {showSinglePage && (
          <MarginControls
            margins={margins}
            onMarginChange={handleMarginChange}
          />
        )}

        <PageEditor
          editorRef={editorRef}
          showSinglePage={showSinglePage}
          pageSize={pageSize}
          margins={margins}
          currentPage={currentPage}
          totalPages={totalPages}
          content={chapter.content}
          onContentChange={onContentChange}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
        />
      </div>
    </ScrollArea>
  );
};

export default ChapterEditor;
