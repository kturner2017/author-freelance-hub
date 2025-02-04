import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';
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
  const [error, setError] = useState<string | null>(null);

  const analyzeText = async () => {
    if (!content || content.length < 50) {
      setError('Text must be at least 50 characters long for analysis');
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-text', {
        body: { text: content }
      });

      if (error) throw error;
      console.log('AI Analysis results:', data);
      setAiAnalysis(data);
    } catch (error) {
      console.error('Error during AI analysis:', error);
      setError('Failed to analyze text. Please try again later.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getReadabilityFeedback = () => {
    const suggestions = [];
    
    if (scores.fleschKincaid > 12) {
      suggestions.push({
        type: 'warning',
        message: "Your text might be too complex for general readers. Consider:",
        details: [
          "Using shorter words and sentences",
          "Breaking down complex ideas into simpler parts",
          "Avoiding technical jargon unless necessary"
        ]
      });
    }
    
    if (scores.gunningFog > 14) {
      suggestions.push({
        type: 'warning',
        message: "The text could be hard to understand. Try:",
        details: [
          "Using more common words",
          "Shortening sentences to 15-20 words",
          "Explaining complex concepts with examples"
        ]
      });
    }

    if (content) {
      const sentences = content.split(/[.!?]+/).filter(Boolean);
      const longSentences = sentences.filter(s => s.split(' ').length > 25);
      
      if (longSentences.length > 0) {
        suggestions.push({
          type: 'improvement',
          message: `You have ${longSentences.length} long sentence(s). Consider:`,
          details: [
            "Breaking them into smaller, clearer statements",
            "Using punctuation to create natural pauses",
            "Varying sentence length for better rhythm"
          ]
        });
      }

      const paragraphs = content.split('\n\n').filter(Boolean);
      if (paragraphs.some(p => p.split(' ').length > 150)) {
        suggestions.push({
          type: 'structure',
          message: "Some paragraphs are very long. Try:",
          details: [
            "Splitting into smaller paragraphs of 3-4 sentences",
            "Starting each paragraph with a clear topic sentence",
            "Using transition words between paragraphs"
          ]
        });
      }
    }

    return suggestions;
  };

  if (error) {
    return (
      <Card className="mt-4 border-red-200">
        <CardContent className="p-6">
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

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
            {!aiAnalysis && !isAnalyzing && (
              <div className="flex justify-center">
                <Button 
                  onClick={analyzeText}
                  className="bg-primary hover:bg-primary/90"
                  disabled={!content || content.length < 50}
                >
                  Analyze Text
                </Button>
              </div>
            )}
            
            {isAnalyzing ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span className="text-sm text-gray-600">
                  Analyzing your text...
                </span>
              </div>
            ) : (
              <>
                {aiAnalysis && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4">AI Analysis Scores</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Grammar Quality</span>
                            <span>{Math.round(aiAnalysis.scores.grammar * 100)}%</span>
                          </div>
                          <Progress value={aiAnalysis.scores.grammar * 100} className="h-2" />
                          <p className="text-xs text-gray-500 mt-1">
                            Measures the grammatical correctness and clarity of your writing
                          </p>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Writing Style</span>
                            <span>{Math.round(aiAnalysis.scores.style * 100)}%</span>
                          </div>
                          <Progress value={aiAnalysis.scores.style * 100} className="h-2" />
                          <p className="text-xs text-gray-500 mt-1">
                            Evaluates the effectiveness and engagement of your writing style
                          </p>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Sentence Structure</span>
                            <span>{Math.round(aiAnalysis.scores.structure * 100)}%</span>
                          </div>
                          <Progress value={aiAnalysis.scores.structure * 100} className="h-2" />
                          <p className="text-xs text-gray-500 mt-1">
                            Analyzes the construction and flow of your sentences
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-4">AI Writing Suggestions</h3>
                      <ul className="space-y-4">
                        {aiAnalysis.suggestions.map((suggestion, index) => (
                          <li key={index} className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-800 font-medium">{suggestion}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-4">Readability Analysis</h3>
                  <div className="space-y-6">
                    {getReadabilityFeedback().map((feedback, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-800 font-medium mb-2">
                          {feedback.message}
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          {feedback.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="text-sm text-gray-600">
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
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