
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Chapter {
  id: string;
  chapter_id: string;
  content: string;
}

export const useContentManagement = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>({});
  const { toast } = useToast();

  const handleContentChange = async (content: string, selectedChapter: Chapter | null) => {
    if (!selectedChapter) return;
    
    console.log('Updating content for chapter:', selectedChapter.id);
    
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-text', {
        body: { text: content }
      });

      if (error) throw error;
      console.log('AI Analysis results:', data);
      setAiAnalysis(data);
    } catch (error) {
      console.error('Error during AI analysis:', error);
      toast({
        title: "Analysis Error",
        description: "There was an error analyzing your text. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async (selectedChapter: Chapter | null) => {
    if (!selectedChapter) return;

    console.log('Saving chapter:', selectedChapter);

    try {
      const { error: updateError } = await supabase
        .from('manuscript_chapters')
        .update({
          content: selectedChapter.content,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedChapter.id);

      if (updateError) throw updateError;

      toast({
        title: "Changes saved",
        description: "Your changes have been saved successfully."
      });
    } catch (error) {
      console.error('Error in save operation:', error);
      toast({
        title: "Error saving changes",
        description: "There was a problem saving your changes. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    isAnalyzing,
    aiAnalysis,
    handleContentChange,
    handleSave
  };
};
