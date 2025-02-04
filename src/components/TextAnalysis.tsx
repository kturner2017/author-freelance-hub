import React from 'react';
import { Card } from './ui/card';
import ReadabilityChart from './ReadabilityChart';
import { Loader2 } from 'lucide-react';

interface TextAnalysisProps {
  scores: {
    fleschKincaid: number;
    gunningFog: number;
    colemanLiau: number;
  };
  content: string;
  aiAnalysis: any;
  isAnalyzing: boolean;
}

const TextAnalysis = ({ scores, content, aiAnalysis, isAnalyzing }: TextAnalysisProps) => {
  if (!content) {
    return null;
  }

  return (
    <div className="mt-8 space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Writing Analysis</h3>
        <p className="text-sm text-gray-600 mb-6">AI-powered suggestions to improve your writing</p>

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
                      {Math.round((aiAnalysis.scores.showVsTell || 0) * 100)}%
                    </p>
                  </div>

                  {aiAnalysis.details?.showVsTell?.tellingSentences?.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium mb-2">Telling Sentences:</h5>
                      <ul className="list-disc pl-5 space-y-1">
                        {aiAnalysis.details.showVsTell.tellingSentences.map((sentence: string, index: number) => (
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
                        {Math.round((aiAnalysis.scores.grammar || 0) * 100)}%
                      </p>
                      <p className="text-xs text-gray-500">Measures the grammatical correctness and clarity</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Writing Style</p>
                      <p className="text-2xl font-bold">
                        {Math.round((aiAnalysis.scores.style || 0) * 100)}%
                      </p>
                      <p className="text-xs text-gray-500">Evaluates sentence variety and writing techniques</p>
                    </div>
                  </div>
                </div>

                {aiAnalysis.suggestions?.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Writing Suggestions</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {aiAnalysis.suggestions.map((suggestion: string, index: number) => (
                        <li key={index} className="text-sm text-gray-600">{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6">
              <h4 className="font-medium mb-4">Readability Analysis</h4>
              <ReadabilityChart scores={scores} />
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default TextAnalysis;