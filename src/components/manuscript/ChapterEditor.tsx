import React, { useState, useRef } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import RichTextEditor from '../RichTextEditor';
import TemplateSelector from './TemplateSelector';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import EditorHeader from './EditorHeader';
import MarginControls from './MarginControls';
import { usePageManagement } from '@/hooks/manuscript/usePageManagement';

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
  const [pageSize, setPageSize] = useState<'6x9' | '8.5x11'>('6x9');
  const [showSinglePage, setShowSinglePage] = useState(false);
  const [margins, setMargins] = useState<Margins>({
    top: 1,
    right: 1,
    bottom: 1,
    left: 1
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

  const handleMarginChange = (side: keyof Margins, value: string) => {
    const numValue = parseFloat(value) || 0;
    setMargins(prev => ({
      ...prev,
      [side]: Math.max(0, Math.min(3, numValue))
    }));
  };

  const pageClass = pageSize === '6x9' ? 'w-[6in] h-[9in]' : 'w-[8.5in] h-[11in]';

  return (
    <ScrollArea className="h-full">
      <div className="p-8 max-w-[11in] mx-auto">
        <EditorHeader
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
            className={`${showSinglePage ? pageClass : ''} bg-white shadow-lg relative mx-auto overflow-hidden`}
            style={{
              padding: showSinglePage ? `${margins.top}in ${margins.right}in ${margins.bottom}in ${margins.left}in` : '1rem',
              height: showSinglePage ? (pageSize === '6x9' ? '9in' : '11in') : 'auto',
            }}
          >
            {showSinglePage ? (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  transform: `translateY(-${(currentPage - 1) * 100}%)`,
                  transition: 'transform 0.3s ease-in-out'
                }}
              >
                <div
                  style={{
                    height: `${(pageSize === '6x9' ? 9 : 11) - margins.top - margins.bottom}in`,
                    overflow: 'hidden'
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
    </ScrollArea>
  );
};

export default ChapterEditor;
