
import React, { useState } from 'react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<'6x9' | '8.5x11'>('6x9');
  const [showSinglePage, setShowSinglePage] = useState(false);

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

        <div className={`relative ${showSinglePage ? 'flex justify-center' : ''}`}>
          {showSinglePage && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}
          
          <div className={`${showSinglePage ? pageClass : ''} bg-white shadow-lg relative mx-auto`}>
            <div className={`${showSinglePage ? 'p-8' : ''}`}>
              <RichTextEditor
                key={`editor-${chapter.id}`}
                content={chapter.content || ''}
                onChange={onContentChange}
              />
            </div>
            {showSinglePage && (
              <div className="absolute bottom-4 w-full text-center text-gray-500">
                Page {currentPage}
              </div>
            )}
          </div>

          {showSinglePage && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2"
              onClick={() => setCurrentPage(currentPage + 1)}
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
