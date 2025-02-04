import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Loader2 } from 'lucide-react';
import type { ReadabilityScores } from '@/types/readability';

export interface TextAnalysisProps {
  scores: ReadabilityScores;
  content: string;
  aiAnalysis: any;
  isAnalyzing: boolean;
}

const TextAnalysis = ({ scores, content, aiAnalysis, isAnalyzing }: TextAnalysisProps) => {
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
    }

    return suggestions;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Writing Analysis</CardTitle>
          <CardDescription>
            Real-time AI-powered suggestions to improve your writing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {isAnalyzing && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span className="text-sm text-gray-600">
                  Analyzing your text...
                </span>
              </div>
            )}

            {aiAnalysis && !isAnalyzing && (
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
                        Measures the grammatical correctness and clarity
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Show vs Tell Ratio</span>
                        <span>{Math.round(aiAnalysis.scores.showVsTell * 100)}%</span>
                      </div>
                      <Progress value={aiAnalysis.scores.showVsTell * 100} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">
                        Balance between descriptive and narrative writing
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Writing Style</span>
                        <span>{Math.round(aiAnalysis.scores.style * 100)}%</span>
                      </div>
                      <Progress value={aiAnalysis.scores.style * 100} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">
                        Evaluates sentence variety and writing techniques
                      </p>
                    </div>
                  </div>
                </div>

                {aiAnalysis.details?.showVsTell && (
                  <div>
                    <h3 className="font-semibold mb-4">Show vs Tell Analysis</h3>
                    <div className="space-y-4">
                      {aiAnalysis.details.showVsTell.tellingSentences.length > 0 && (
                        <div className="bg-yellow-50 rounded-lg p-4">
                          <p className="font-medium text-sm mb-2">Telling Sentences:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            {aiAnalysis.details.showVsTell.tellingSentences.map((sentence: string, idx: number) => (
                              <li key={idx} className="text-sm text-gray-600">{sentence}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {aiAnalysis.details.showVsTell.showingSentences.length > 0 && (
                        <div className="bg-green-50 rounded-lg p-4">
                          <p className="font-medium text-sm mb-2">Strong Descriptive Sentences:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            {aiAnalysis.details.showVsTell.showingSentences.map((sentence: string, idx: number) => (
                              <li key={idx} className="text-sm text-gray-600">{sentence}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {aiAnalysis.suggestions && aiAnalysis.suggestions.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-4">Writing Suggestions</h3>
                    <ul className="space-y-4">
                      {aiAnalysis.suggestions.map((suggestion: string, index: number) => (
                        <li key={index} className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-800">{suggestion}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TextAnalysis;