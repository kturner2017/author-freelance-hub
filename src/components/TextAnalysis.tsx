
import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import ReadabilityChart from './ReadabilityChart';
import { Loader2, RefreshCw } from 'lucide-react';
import type { ReadabilityScores } from '@/utils/readabilityScores';

interface TextAnalysisProps {
  scores: Partial<ReadabilityScores>;
  content: string;
  aiAnalysis: any;
  isAnalyzing: boolean;
  onAnalyze: () => void;
}

const TextAnalysis = ({ scores, content, aiAnalysis, isAnalyzing, onAnalyze }: TextAnalysisProps) => {
  if (!content) {
    return null;
  }

  // Ensure all required properties are present
  const safeScores: ReadabilityScores = {
    fleschKincaid: scores.fleschKincaid || 0,
    fleschReading: scores.fleschReading || 0,
    gunningFog: scores.gunningFog || 0,
    colemanLiau: scores.colemanLiau || 0
  };

  // Safely access aiAnalysis properties with default values
  const showVsTellScore = aiAnalysis?.scores?.showVsTell || 0;
  const grammarScore = aiAnalysis?.scores?.grammar || 0;
  const styleScore = aiAnalysis?.scores?.style || 0;
  const tellingSentences = aiAnalysis?.details?.showVsTell?.tellingSentences || [];
  const suggestions = aiAnalysis?.suggestions || [];

  return (
    <div className="mt-8 space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Writing Analysis</h3>
            <p className="text-sm text-gray-600">AI-powered suggestions to improve your writing</p>
          </div>
          <Button 
            onClick={onAnalyze}
            disabled={isAnalyzing}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'Analyze Text'}
          </Button>
        </div>

        {isAnalyzing ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {aiAnalysis && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Show vs Tell Analysis</h4>
                  <p className="text-sm text-gray-600 mb-4">Balance between descriptive and narrative writing</p>
                  
                  <div className="mb-4">
                    <h5 className="text-sm font-medium mb-1">Show vs Tell Ratio</h5>
                    <p className="text-2xl font-bold">
                      {Math.round(showVsTellScore * 100)}%
                    </p>
                  </div>

                  {tellingSentences.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium mb-2">Telling Sentences:</h5>
                      <ul className="list-disc pl-5 space-y-1">
                        {tellingSentences.map((sentence: string, index: number) => (
                          <li key={index} className="text-sm text-gray-600">{sentence}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-2">AI Analysis Scores</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Grammar Quality</p>
                      <p className="text-2xl font-bold">
                        {Math.round(grammarScore * 100)}%
                      </p>
                      <p className="text-xs text-gray-500">Measures the grammatical correctness and clarity</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Writing Style</p>
                      <p className="text-2xl font-bold">
                        {Math.round(styleScore * 100)}%
                      </p>
                      <p className="text-xs text-gray-500">Evaluates sentence variety and writing techniques</p>
                    </div>
                  </div>
                </div>

                {suggestions.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Writing Suggestions</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {suggestions.map((suggestion: string, index: number) => (
                        <li key={index} className="text-sm text-gray-600">{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6">
              <h4 className="font-medium mb-4">Readability Analysis</h4>
              <ReadabilityChart scores={safeScores} />
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default TextAnalysis;
