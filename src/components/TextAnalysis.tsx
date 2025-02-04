import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import type { ReadabilityScores } from '@/utils/readabilityScores';
import { supabase } from '@/integrations/supabase/client';

interface TextAnalysisProps {
  scores: ReadabilityScores;
  content: string;
}

interface AIAnalysis {
  suggestions: string[];
  scores: {
    grammar: number;
    toxicity: number;
    style: number;
    structure: number;
  };
}

const TextAnalysis = ({ scores, content }: TextAnalysisProps) => {
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const analyzeText = async () => {
      if (!content || content.length < 50) return;
      
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
      } finally {
        setIsAnalyzing(false);
      }
    };

    const debounceTimeout = setTimeout(analyzeText, 1000);
    return () => clearTimeout(debounceTimeout);
  }, [content]);

  const getReadabilityFeedback = () => {
    const suggestions = [];
    
    if (scores.fleschKincaid > 12) {
      suggestions.push("Consider simplifying your language - the text might be too complex for general readers.");
    }
    
    if (scores.gunningFog > 14) {
      suggestions.push("Try using shorter sentences and simpler words to improve readability.");
    }

    if (content) {
      const sentences = content.split(/[.!?]+/).filter(Boolean);
      const longSentences = sentences.filter(s => s.split(' ').length > 25);
      
      if (longSentences.length > 0) {
        suggestions.push(`You have ${longSentences.length} sentence(s) that are quite long. Consider breaking them into smaller parts.`);
      }

      const paragraphs = content.split('\n\n').filter(Boolean);
      if (paragraphs.some(p => p.split(' ').length > 150)) {
        suggestions.push("Some paragraphs are very long. Consider breaking them into smaller paragraphs for better readability.");
      }
    }

    return suggestions;
  };

  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardHeader>
          <CardTitle>Writing Analysis</CardTitle>
          <CardDescription>
            AI-powered suggestions to improve your writing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {isAnalyzing ? (
              <div className="text-sm text-gray-600">
                Analyzing your text...
              </div>
            ) : (
              <>
                {aiAnalysis && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">AI Analysis Scores</h3>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Grammar Quality</span>
                            <span>{Math.round(aiAnalysis.scores.grammar * 100)}%</span>
                          </div>
                          <Progress value={aiAnalysis.scores.grammar * 100} />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Writing Style</span>
                            <span>{Math.round(aiAnalysis.scores.style * 100)}%</span>
                          </div>
                          <Progress value={aiAnalysis.scores.style * 100} />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Sentence Structure</span>
                            <span>{Math.round(aiAnalysis.scores.structure * 100)}%</span>
                          </div>
                          <Progress value={aiAnalysis.scores.structure * 100} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">AI Suggestions</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        {aiAnalysis.suggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm text-gray-600">{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-2">Readability Analysis</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    {getReadabilityFeedback().map((suggestion, index) => (
                      <li key={index} className="text-sm text-gray-600">{suggestion}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TextAnalysis;