
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import RichTextEditor from '../RichTextEditor';
import TextAnalysis from '../TextAnalysis';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TemplateSelector from './TemplateSelector';
import { getWordCount } from '@/utils/wordCount';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

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
      // Calculate total pages based on content height and page size
      const contentHeight = editorRef.current.scrollHeight;
      const pageHeight = pageSize === '6x9' ? 9 * 96 : 11 * 96; // Convert inches to pixels (96dpi)
      const effectivePageHeight = pageHeight - (margins.top + margins.bottom) * 96; // Account for margins
      const calculatedPages = Math.ceil(contentHeight / effectivePageHeight);
      setTotalPages(Math.max(1, calculatedPages));

      // Reset to first page when switching view modes or page sizes
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

  const toggleTemplateSelector = () => {
    setShowTemplateSelector(!showTemplateSelector);
  };

  const handlePageSizeChange = (size: '6x9' | '8.5x11') => {
    setPageSize(size);
  };

  const toggleViewMode = () => {
    setShowSinglePage(!showSinglePage);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      
      // Scroll to top of page
      if (editorRef.current) {
        editorRef.current.scrollTop = 0;
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      
      // Scroll to top of page
      if (editorRef.current) {
        editorRef.current.scrollTop = 0;
      }
    }
  };

  const handleMarginChange = (side: keyof Margins, value: string) => {
    const numValue = parseFloat(value) || 0;
    setMargins(prev => ({
      ...prev,
      [side]: Math.max(0, Math.min(3, numValue)) // Limit margins between 0 and 3 inches
    }));
  };

  const pageClass = pageSize === '6x9' 
    ? 'w-[6in] h-[9in]' 
    : 'w-[8.5in] h-[11in]';

  return (
    <ScrollArea className="h-full">
      <div className="p-8 max-w-[11in] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-serif font-semibold text-primary-800">
            {chapter.chapter_id}
          </h2>
          <div className="flex items-center gap-4">
            <Badge 
              variant="secondary" 
              className="text-sm bg-primary-50 text-primary-700 border-primary-200 cursor-pointer"
              onClick={toggleTemplateSelector}
            >
              Template: {selectedTemplate}
            </Badge>
            <Badge variant="secondary" className="text-sm bg-primary-50 text-primary-700 border-primary-200">
              {getWordCount(chapter.content).toLocaleString()} words
            </Badge>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageSizeChange('6x9')}
                className={pageSize === '6x9' ? 'bg-primary-100' : ''}
              >
                6" x 9"
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageSizeChange('8.5x11')}
                className={pageSize === '8.5x11' ? 'bg-primary-100' : ''}
              >
                8.5" x 11"
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleViewMode}
              >
                {showSinglePage ? 'Full View' : 'Page View'}
              </Button>
            </div>
          </div>
        </div>

        {showTemplateSelector && (
          <div className="mb-8">
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onTemplateSelect={handleTemplateSelect}
            />
          </div>
        )}

        {showSinglePage && (
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div>
              <Label htmlFor="top-margin">Top Margin (inches)</Label>
              <Input
                id="top-margin"
                type="number"
                min="0"
                max="3"
                step="0.25"
                value={margins.top}
                onChange={(e) => handleMarginChange('top', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="right-margin">Right Margin (inches)</Label>
              <Input
                id="right-margin"
                type="number"
                min="0"
                max="3"
                step="0.25"
                value={margins.right}
                onChange={(e) => handleMarginChange('right', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="bottom-margin">Bottom Margin (inches)</Label>
              <Input
                id="bottom-margin"
                type="number"
                min="0"
                max="3"
                step="0.25"
                value={margins.bottom}
                onChange={(e) => handleMarginChange('bottom', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="left-margin">Left Margin (inches)</Label>
              <Input
                id="left-margin"
                type="number"
                min="0"
                max="3"
                step="0.25"
                value={margins.left}
                onChange={(e) => handleMarginChange('left', e.target.value)}
              />
            </div>
          </div>
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
            className={`${showSinglePage ? pageClass : ''} bg-white shadow-lg relative mx-auto`}
            style={{
              padding: showSinglePage ? `${margins.top}in ${margins.right}in ${margins.bottom}in ${margins.left}in` : undefined,
              height: showSinglePage ? (pageSize === '6x9' ? '9in' : '11in') : 'auto',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                transform: showSinglePage ? `translateY(-${(currentPage - 1) * ((pageSize === '6x9' ? 9 : 11) - margins.top - margins.bottom)}in)` : 'none',
                transition: 'transform 0.3s ease-in-out',
                height: showSinglePage ? `${totalPages * (pageSize === '6x9' ? 9 : 11)}in` : 'auto'
              }}
            >
              <RichTextEditor
                key={`editor-${chapter.id}`}
                content={chapter.content || ''}
                onChange={onContentChange}
              />
            </div>
            {showSinglePage && (
              <div className="absolute bottom-4 w-full text-center text-gray-500">
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
