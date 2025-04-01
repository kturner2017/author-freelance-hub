
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import calculateScores from '@/utils/readabilityScores';

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
      
      // Calculate local analysis instead of API call
      const scores = calculateScores(cleanText);
      
      // Transform the data structure
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
      
      setAiAnalysis(analysis);
      toast({
        title: 'Analysis complete',
        description: 'Your text has been analyzed successfully',
      });
    } catch (error) {
      console.error('Error analyzing text:', error);
      toast({
        title: 'Analysis failed',
        description: 'An error occurred while analyzing your text',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [toast]);

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
    aiAnalysis,
    isAnalyzing,
    performAnalysis
  };
};
