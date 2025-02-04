import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import type { ReadabilityScores } from '@/utils/readabilityScores';

interface TextAnalysisProps {
  scores: ReadabilityScores;
  content: string;
}

const TextAnalysis = ({ scores, content }: TextAnalysisProps) => {
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

    if (suggestions.length === 0) {
      suggestions.push("Your text appears to be well-structured and readable. Great job!");
    }

    return suggestions;
  };

  const getGrammarSuggestions = () => {
    const suggestions = [];
    
    // Basic patterns to check (this is simplified - for real grammar checking you'd want to use a proper NLP library)
    const commonErrors = [
      { pattern: /\s+,/g, suggestion: "Remove spaces before commas" },
      { pattern: /\s+\./g, suggestion: "Remove spaces before periods" },
      { pattern: /\b(their|there|they're|your|you're|its|it's|whose|who's)\b/gi, 
        suggestion: "Double-check common confusable words (their/there/they're, your/you're, its/it's)" },
      { pattern: /\b(affect|effect|accept|except|advice|advise)\b/gi,
        suggestion: "Verify usage of commonly confused words (affect/effect, accept/except, advice/advise)" },
      { pattern: /\b(alot)\b/gi, suggestion: "'A lot' should be written as two words" },
    ];

    commonErrors.forEach(({ pattern, suggestion }) => {
      if (pattern.test(content)) {
        suggestions.push(suggestion);
      }
    });

    if (suggestions.length === 0) {
      suggestions.push("No common grammar issues detected.");
    }

    return suggestions;
  };

  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardHeader>
          <CardTitle>Writing Analysis</CardTitle>
          <CardDescription>
            Suggestions to improve your writing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Readability Suggestions</h3>
              <ul className="list-disc pl-6 space-y-2">
                {getReadabilityFeedback().map((suggestion, index) => (
                  <li key={index} className="text-sm text-gray-600">{suggestion}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Grammar & Style Check</h3>
              <ul className="list-disc pl-6 space-y-2">
                {getGrammarSuggestions().map((suggestion, index) => (
                  <li key={index} className="text-sm text-gray-600">{suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TextAnalysis;