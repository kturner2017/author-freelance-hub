import React, { useState, useRef } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import RichTextEditor from '../RichTextEditor';
import TemplateSelector from './TemplateSelector';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import EditorHeader from './EditorHeader';
import { usePageManagement } from '@/hooks/manuscript/usePageManagement';
import PageFormatControls from './PageFormatControls';
import { standardPaperSizes, type MarginSettings } from '@/types/paper';
import TextAnalysis from '../TextAnalysis';
import { calculateScores } from '@/utils/readabilityScores';

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
  const [pageSize, setPageSize] = useState<'6x9' | '8.5x11'>('6x9');
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

  const getPageClass = () => {
    const currentSize = standardPaperSizes[pageSize];
    if (!currentSize) return '';
    
    if (currentSize.unit === 'in') {
      return `w-[${currentSize.width}in] h-[${currentSize.height}in]`;
    }
    return `w-[${currentSize.width}mm] h-[${currentSize.height}mm]`;
  };

  const getTextAreaDimensions = () => {
    const currentSize = standardPaperSizes[pageSize];
    if (!currentSize) return { width: '4in', height: '7in' };
    
    if (currentSize.unit === 'in') {
      const width = currentSize.width - margins.left - margins.right - margins.gutter;
      const height = currentSize.height - margins.top - margins.bottom;
      return {
        width: `${width}in`,
        height: `${height}in`
      };
    }
    
    const width = currentSize.width - ((margins.left + margins.right + margins.gutter) * 25.4);
    const height = currentSize.height - ((margins.top + margins.bottom) * 25.4);
    return {
      width: `${width}mm`,
      height: `${height}mm`
    };
  };

  const handlePaperSizeChange = (size: string) => {
    if (size === '6x9' || size === '8.5x11') {
      setPageSize(size);
    }
  };

  const getPageHeight = () => {
    const currentSize = standardPaperSizes[pageSize];
    if (!currentSize || currentSize.unit !== 'in') return '7in';
    return `${currentSize.height - margins.top - margins.bottom}in`;
  };

  return (
    <ScrollArea className="h-full">
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

          <div className={`relative ${showSinglePage ? 'flex justify-center' : ''}`}>
            {showSinglePage && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                onClick={handlePrevPage}
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
              {/* Margins guide */}
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
                      key={`editor-${chapter.id}`}
                      content={chapter.content || ''}
                      onChange={onContentChange}
                    />
                  </div>
                </div>
              ) : (
                <RichTextEditor
                  key={`editor-${chapter.id}`}
                  content={chapter.content || ''}
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
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            )}
          </div>
        </div>

        <div className="mt-8">
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
    </ScrollArea>
  );
};

export default ChapterEditor;
