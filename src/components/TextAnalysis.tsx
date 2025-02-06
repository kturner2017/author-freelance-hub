
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

  // Examples of how to rewrite telling sentences
  const tellingToShowingExamples = {
    // Emotions
    "was angry": "His fists clenched and his face reddened",
    "felt sad": "Tears welled up in her eyes as her shoulders slumped",
    "was scared": "Her heart pounded against her ribs and her hands trembled",
    "was happy": "A broad smile lit up her face as she bounced on her toes",
    "was nervous": "She fidgeted with her sleeve, her eyes darting around the room",
    "felt excited": "She couldn't stop pacing, her words tumbling out in rapid bursts",
    
    // Physical States
    "was tired": "Dark circles shadowed his eyes, and he dragged his feet with each step",
    "felt cold": "Her teeth chattered as she wrapped her arms tightly around herself",
    "was hot": "Sweat beaded on his forehead, his shirt clinging to his back",
    "looked sick": "Her face had taken on an ashen pallor, and she swayed slightly with each step",
    
    // Personality Traits
    "was intelligent": "She solved the crossword puzzle in record time, barely glancing at the clues",
    "was rude": "He cut off the speaker mid-sentence and rolled his eyes",
    "was kind": "She spent her lunch break helping the new intern learn the filing system",
    
    // Weather/Environment
    "it was raining": "Raindrops drummed against the windows, creating rivers down the glass",
    "it was cold": "Frost crystallized on the windows, and breath came out in visible puffs",
    "it was noisy": "Car horns blared and construction equipment rumbled, the cacophony echoing off building walls",
    
    // Time of Day
    "it was morning": "Golden sunlight crept across the floor as coffee makers gurgled to life",
    "it was night": "Street lamps cast pools of yellow light on the empty sidewalks",
    "it was getting late": "Long shadows stretched across the ground as the sun dipped below the horizon",
    
    // Movement
    "walked slowly": "He shuffled forward, one hesitant step at a time",
    "ran quickly": "Her feet pounded against the pavement as she sprinted",
    "moved quietly": "She crept forward on tiptoes, carefully avoiding the creaky floorboards",
    
    // Sensory Experiences
    "the food was delicious": "The chocolate melted on her tongue, releasing waves of rich, sweet flavor",
    "the music was loud": "The bass vibrated through the floorboards and rattled the windows",
    "it smelled bad": "A pungent odor assaulted his nostrils, making his eyes water"
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
                      <h5 className="text-sm font-medium mb-2">Telling Sentences with Examples:</h5>
                      <div className="space-y-4">
                        {tellingSentences.map((sentence: string, index: number) => {
                          // Find matching example if available
                          const matchingTellingPhrase = Object.keys(tellingToShowingExamples).find(
                            phrase => sentence.toLowerCase().includes(phrase.toLowerCase())
                          );
                          const showingExample = matchingTellingPhrase 
                            ? tellingToShowingExamples[matchingTellingPhrase as keyof typeof tellingToShowingExamples]
                            : null;

                          return (
                            <div key={index} className="border-l-4 border-gray-200 pl-4">
                              <p className="text-sm text-red-600 mb-1">"{sentence}"</p>
                              {showingExample && (
                                <p className="text-sm text-green-600">
                                  Try instead: "{showingExample}"
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
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

