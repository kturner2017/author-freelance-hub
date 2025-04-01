
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import calculateScores from '@/utils/readabilityScores';

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
      // Calculate local analysis instead of API call
      const scores = calculateScores(content);
      
      // Transform the data structure to match what the component expects
      const analysis = {
        scores: {
          grammar: 0.8, // Default value since we can't calculate grammar locally
          style: 0.7,   // Default value
          showVsTell: scores.showVsTell.ratio
        },
        details: {
          showVsTell: scores.showVsTell
        },
        suggestions: generateLocalSuggestions(scores)
      };
      
      console.log('Analysis results:', analysis);
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('Error during text analysis:', error);
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

  // Generate suggestions based on the readability scores
  const generateLocalSuggestions = (scores: any): string[] => {
    const suggestions: string[] = [];

    // Show vs Tell suggestions
    if (scores.showVsTell.ratio < 0.4) {
      suggestions.push('Consider using more descriptive language to show rather than tell');
      suggestions.push('Try incorporating more sensory details in your descriptions');
      
      if (scores.showVsTell.tellingSentences.length > 0) {
        suggestions.push('Look for opportunities to replace passive observations with active descriptions');
      }
    }

    // Readability-based suggestions
    const avgReadingLevel = (scores.fleschKincaid + scores.gunningFog + scores.colemanLiau) / 3;
    if (avgReadingLevel > 12) {
      suggestions.push('The text may be difficult to read. Consider simplifying some sentences.');
    }

    // Passive voice suggestions
    if (scores.passiveVoice.length > Math.max(5, scores.stats.sentenceCount * 0.2)) {
      suggestions.push('There are several instances of passive voice. Try using more active voice for clarity.');
    }

    // Long sentences suggestions
    if (scores.longSentences.length + scores.veryLongSentences.length > Math.max(3, scores.stats.sentenceCount * 0.15)) {
      suggestions.push('Consider breaking up long sentences to improve readability.');
    }

    // Adverbs suggestions
    if (scores.adverbs.length > Math.max(10, scores.stats.wordCount * 0.05)) {
      suggestions.push('Try replacing some adverbs with stronger verbs for more impactful writing.');
    }

    // Wordy phrases
    if (Object.keys(scores.wordyPhrases).length > 3) {
      suggestions.push('Look for opportunities to replace wordy phrases with more concise alternatives.');
    }

    return suggestions;
  };

  return {
    isAnalyzing,
    aiAnalysis,
    handleContentChange,
    handleSave
  };
};
