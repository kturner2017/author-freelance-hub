import React, { useState, useRef } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import EditorHeader from './EditorHeader';
import { usePageManagement } from '@/hooks/manuscript/usePageManagement';
import PageFormatControls from './PageFormatControls';
import { MarginSettings } from '@/types/paper';
import TextAnalysis from '../TextAnalysis';
import calculateScores from '@/utils/readabilityScores';
import TemplateSelector from './TemplateSelector';
import PageView from './PageView';
import { usePageDimensions } from '@/hooks/manuscript/usePageDimensions';

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
  const [selectedTemplate, setSelectedTemplate] = useState(chapter.template || 'classic');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [pageSize, setPageSize] = useState<'6x9' | '8.5x11' | 'epub'>('6x9');
  const [showSinglePage, setShowSinglePage] = useState(false);
  const [margins, setMargins] = useState<MarginSettings>({
    top: 1,
    right: 1,
    bottom: 1,
    left: 1,
    gutter: 0,
    headerDistance: 0.5,
    footerDistance: 0.5
  });
  const editorRef = useRef<HTMLDivElement>(null);

  const { currentPage, totalPages, handleNextPage, handlePrevPage } = usePageManagement(
    editorRef,
    showSinglePage,
    pageSize,
    margins,
    chapter.content
  );

  const { getPageClass, getTextAreaDimensions, getPageHeight } = usePageDimensions(pageSize, margins);

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

  const handleMarginChange = (key: keyof MarginSettings, value: number) => {
    setMargins(prev => ({
      ...prev,
      [key]: Math.max(0.25, Math.min(3, value))
    }));
  };

  const handlePaperSizeChange = (size: string) => {
    if (size === '6x9' || size === '8.5x11' || size === 'epub') {
      setPageSize(size as '6x9' | '8.5x11' | 'epub');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-8 max-w-[11in] mx-auto space-y-8">
          <EditorHeader
            chapterId={chapter.chapter_id}
            content={chapter.content}
            selectedTemplate={selectedTemplate}
            pageSize={pageSize}
            showSinglePage={showSinglePage}
            onTemplateClick={() => setShowTemplateSelector(!showTemplateSelector)}
            onPageSizeChange={handlePaperSizeChange}
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

          <div className="space-y-8">
            {showSinglePage && (
              <PageFormatControls
                margins={margins}
                onMarginChange={handleMarginChange}
                selectedPaperSize={pageSize}
                onPaperSizeChange={handlePaperSizeChange}
              />
            )}

            <PageView 
              editorRef={editorRef}
              showSinglePage={showSinglePage}
              pageSize={pageSize}
              margins={margins}
              currentPage={currentPage}
              totalPages={totalPages}
              content={chapter.content}
              chapterId={chapter.id}
              onContentChange={onContentChange}
              onNextPage={handleNextPage}
              onPrevPage={handlePrevPage}
              getPageClass={getPageClass}
              getTextAreaDimensions={getTextAreaDimensions}
              getPageHeight={getPageHeight}
            />
          </div>
        </div>
      </ScrollArea>

      <div className="sticky bottom-0 w-full border-t border-gray-200 bg-gray-50 shadow-lg">
        <div className="max-w-[11in] mx-auto p-8">
          <TextAnalysis 
            scores={calculateScores(chapter.content)}
            content={chapter.content}
            aiAnalysis={aiAnalysis}
            isAnalyzing={isAnalyzing}
            onAnalyze={() => {
              console.log('Analyzing content...');
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChapterEditor;
