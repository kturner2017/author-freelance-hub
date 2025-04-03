
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
      
      // Calculate local analysis
      const scores = calculateScores(cleanText);
      
      // Transform the data structure with enhanced analysis
      const analysis = {
        scores: {
          grammar: 0.8, // Default value since we can't calculate grammar locally
          style: 0.7,   // Default value
          showVsTell: scores.showVsTell.ratio,
          readability: (scores.fleschReading / 100), // Normalize to 0-1 scale
          complexity: Math.min(1, Math.max(0, ((scores.fleschKincaid + scores.gunningFog + scores.colemanLiau) / 3) / 20)) // Normalize to 0-1 scale
        },
        details: {
          showVsTell: scores.showVsTell,
          passiveVoice: scores.passiveVoice,
          adverbs: scores.adverbs,
          complexSentences: scores.complexSentences,
          wordyPhrases: scores.wordyPhrases,
          longSentences: scores.longSentences
        },
        suggestions: generateEnhancedSuggestions(scores)
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

  // Generate enhanced suggestions based on the readability scores
  const generateEnhancedSuggestions = (scores: any): string[] => {
    const suggestions: string[] = [];

    // Show vs Tell suggestions
    if (scores.showVsTell.ratio < 0.4) {
      suggestions.push('Consider using more descriptive language to show rather than tell');
      suggestions.push('Try incorporating more sensory details (sight, sound, smell, taste, touch) in your descriptions');
      
      if (scores.showVsTell.tellingSentences.length > 0) {
        suggestions.push('Replace statements like "She felt sad" with descriptions of how sadness physically manifests');
        suggestions.push('Show character emotions through their actions, dialogue, and body language');
      }
    }

    // Readability-based suggestions
    const avgReadingLevel = (scores.fleschKincaid + scores.gunningFog + scores.colemanLiau) / 3;
    if (avgReadingLevel > 12) {
      suggestions.push('The text may be difficult to read. Consider simplifying some sentences.');
      suggestions.push('Try varying sentence length to improve flow and readability.');
    }

    // Passive voice suggestions
    if (scores.passiveVoice.length > Math.max(5, scores.stats.sentenceCount * 0.2)) {
      suggestions.push('There are several instances of passive voice. Try using more active voice for clarity.');
      suggestions.push('Rewrite passive sentences to clearly show who is performing the action.');
    }

    // Long sentences suggestions
    if (scores.longSentences.length + scores.veryLongSentences.length > Math.max(3, scores.stats.sentenceCount * 0.15)) {
      suggestions.push('Consider breaking up long sentences to improve readability.');
      suggestions.push('Try mixing short, medium, and long sentences for better rhythm.');
    }

    // Adverbs suggestions
    if (scores.adverbs.length > Math.max(10, scores.stats.wordCount * 0.05)) {
      suggestions.push('Replace some adverbs with stronger verbs for more impactful writing.');
      suggestions.push('Instead of "walk quickly," try "dash," "sprint," or "hurry."');
    }

    // Wordy phrases
    if (Object.keys(scores.wordyPhrases).length > 3) {
      suggestions.push('Look for opportunities to replace wordy phrases with more concise alternatives.');
      const examples = Object.entries(scores.wordyPhrases).slice(0, 2);
      if (examples.length > 0) {
        const exampleText = examples.map(([phrase, alternative]) => `"${phrase}" → "${alternative}"`).join(', ');
        suggestions.push(`Replace wordy phrases like ${exampleText}`);
      }
    }

    return suggestions;
  };

  return {
    aiAnalysis,
    isAnalyzing,
    performAnalysis
  };
};
