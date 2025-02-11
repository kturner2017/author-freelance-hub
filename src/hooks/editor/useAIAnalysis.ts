
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAIAnalysis = () => {
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const performAnalysis = useCallback(async (text: string) => {
    const cleanText = text.trim();
    if (cleanText.length < 10) {
      toast({
        title: 'Text too short',
        description: 'Please write at least 10 characters before analyzing',
        variant: 'default',
      });
      return;
    }
    
    try {
      setIsAnalyzing(true);
      const { data, error } = await supabase.functions.invoke('analyze-text', {
        body: { text: cleanText },
      });

      if (error) {
        console.error('Analysis error:', error);
        toast({
          title: 'Analysis failed',
          description: error.message || 'There was an error analyzing your text',
          variant: 'destructive',
        });
        return;
      }

      setAiAnalysis(data);
      toast({
        title: 'Analysis complete',
        description: 'Your text has been analyzed successfully',
      });
    } catch (error) {
      console.error('Error analyzing text:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [toast]);

  return {
    aiAnalysis,
    isAnalyzing,
    performAnalysis
  };
};
