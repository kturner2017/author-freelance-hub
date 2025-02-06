
import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import RichTextEditor from '../RichTextEditor';
import TextAnalysis from '../TextAnalysis';
import calculateScores from '@/utils/readabilityScores';
import { getWordCount } from '@/utils/wordCount';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Chapter {
  id: string;
  chapter_id: string;
  content: string;
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

  const handleAnalyze = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-text', {
        body: { text: chapter.content }
      });

      if (error) throw error;
      
      toast({
        title: "Analysis complete",
        description: "Your text has been analyzed successfully"
      });
    } catch (error) {
      console.error('Error analyzing text:', error);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your text",
        variant: "destructive"
      });
    }
  };
  
  return (
    <ScrollArea className="h-full">
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-serif font-semibold text-primary-800">
            {chapter.chapter_id}
          </h2>
          <Badge variant="secondary" className="text-sm bg-primary-50 text-primary-700 border-primary-200">
            {getWordCount(chapter.content).toLocaleString()} words
          </Badge>
        </div>
        <RichTextEditor
          key={`editor-${chapter.id}`}
          content={chapter.content || ''}
          onChange={onContentChange}
        />
      </div>
    </ScrollArea>
  );
};

export default ChapterEditor;
