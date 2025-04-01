
import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import ReadabilityChart from './ReadabilityChart';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import type { ReadabilityScores } from '@/utils/readabilityScores';
import { Badge } from './ui/badge';

interface TextAnalysisProps {
  scores: Partial<ReadabilityScores>;
  content: string;
  aiAnalysis: any;
  isAnalyzing: boolean;
  onAnalyze: () => void;
}

const TextAnalysis = ({ scores, content, aiAnalysis, isAnalyzing, onAnalyze }: TextAnalysisProps) => {
  const [activeTab, setActiveTab] = useState('readability');
  
  if (!content) {
    return null;
  }

  // Ensure all required properties are present
  const safeScores: ReadabilityScores = {
    fleschKincaid: scores.fleschKincaid || 0,
    fleschReading: scores.fleschReading || 0,
    gunningFog: scores.gunningFog || 0,
    colemanLiau: scores.colemanLiau || 0,
    complexSentences: scores.complexSentences || [],
    passiveVoice: scores.passiveVoice || [],
    adverbs: scores.adverbs || [],
    wordyPhrases: scores.wordyPhrases || {},
    longSentences: scores.longSentences || [],
    veryLongSentences: scores.veryLongSentences || [],
    stats: scores.stats || {
      wordCount: 0,
      sentenceCount: 0,
      averageWordsPerSentence: 0,
      paragraphCount: 0
    }
  };

  // Count issues for the overview
  const issueCount = {
    complex: safeScores.complexSentences.length,
    passive: safeScores.passiveVoice.length,
    adverbs: safeScores.adverbs.length,
    wordy: Object.keys(safeScores.wordyPhrases).length,
    longSentences: safeScores.longSentences.length,
    veryLongSentences: safeScores.veryLongSentences.length
  };

  const totalIssues = Object.values(issueCount).reduce((sum, count) => sum + count, 0);

  // Calculate readability grade
  const getReadabilityGrade = (): { grade: string; color: string } => {
    const avgScore = (safeScores.fleschKincaid + safeScores.gunningFog + safeScores.colemanLiau) / 3;
    
    if (avgScore <= 6) return { grade: 'Easy to read', color: 'bg-green-500' };
    if (avgScore <= 9) return { grade: 'Fairly easy', color: 'bg-green-400' };
    if (avgScore <= 12) return { grade: 'Average', color: 'bg-yellow-400' };
    if (avgScore <= 15) return { grade: 'Fairly difficult', color: 'bg-orange-400' };
    return { grade: 'Difficult', color: 'bg-red-500' };
  };
  
  const readabilityGrade = getReadabilityGrade();

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
            <p className="text-sm text-gray-600">Hemingway-inspired readability analysis</p>
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
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${readabilityGrade.color}`}></div>
                  <span className="font-medium">{readabilityGrade.grade}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">{totalIssues}</span> potential {totalIssues === 1 ? 'issue' : 'issues'} found
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                <div className="p-2 border rounded-md bg-gray-50">
                  <div className="text-xs text-gray-500">Words</div>
                  <div className="font-medium">{safeScores.stats.wordCount}</div>
                </div>
                <div className="p-2 border rounded-md bg-gray-50">
                  <div className="text-xs text-gray-500">Sentences</div>
                  <div className="font-medium">{safeScores.stats.sentenceCount}</div>
                </div>
                <div className="p-2 border rounded-md bg-gray-50">
                  <div className="text-xs text-gray-500">Paragraphs</div>
                  <div className="font-medium">{safeScores.stats.paragraphCount}</div>
                </div>
                <div className="p-2 border rounded-md bg-gray-50">
                  <div className="text-xs text-gray-500">Avg Words/Sentence</div>
                  <div className="font-medium">{safeScores.stats.averageWordsPerSentence}</div>
                </div>
                <div className="p-2 border rounded-md bg-gray-50">
                  <div className="text-xs text-gray-500">Reading Time</div>
                  <div className="font-medium">{Math.ceil(safeScores.stats.wordCount / 225)} min</div>
                </div>
                <div className="p-2 border rounded-md bg-gray-50">
                  <div className="text-xs text-gray-500">Reading Grade</div>
                  <div className="font-medium">{Math.round(safeScores.fleschKincaid)}</div>
                </div>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="readability">Readability</TabsTrigger>
                <TabsTrigger value="hemingway">Hemingway</TabsTrigger>
                <TabsTrigger value="ai">AI Analysis</TabsTrigger>
              </TabsList>
              
              <TabsContent value="readability">
                <ReadabilityChart scores={safeScores} />
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Score Interpretations</h4>
                  <ul className="text-sm space-y-1">
                    <li><span className="font-medium">Flesch-Kincaid Grade Level:</span> {safeScores.fleschKincaid} - Indicates the US grade level required to understand the text.</li>
                    <li><span className="font-medium">Flesch Reading Ease:</span> {safeScores.fleschReading} - Higher scores indicate easier reading (70-80 is ideal for most audiences).</li>
                    <li><span className="font-medium">Gunning Fog Index:</span> {safeScores.gunningFog} - Estimates years of formal education needed to understand text on first reading.</li>
                    <li><span className="font-medium">Coleman-Liau Index:</span> {safeScores.colemanLiau} - Approximates US grade level needed to comprehend the text.</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="hemingway">
                <div className="space-y-6">
                  {issueCount.veryLongSentences > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <h5 className="font-medium">Very Hard to Read Sentences</h5>
                        <Badge variant="outline" className="ml-auto">{issueCount.veryLongSentences}</Badge>
                      </div>
                      <div className="space-y-2">
                        {safeScores.veryLongSentences.slice(0, 3).map((sentence, index) => (
                          <div key={index} className="p-2 border-l-4 border-red-500 bg-red-50 text-sm">
                            {sentence}
                          </div>
                        ))}
                        {issueCount.veryLongSentences > 3 && (
                          <p className="text-xs text-gray-500">And {issueCount.veryLongSentences - 3} more...</p>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Consider splitting these sentences to improve readability.</p>
                    </div>
                  )}
                  
                  {issueCount.complex > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        <h5 className="font-medium">Complex Sentences</h5>
                        <Badge variant="outline" className="ml-auto">{issueCount.complex}</Badge>
                      </div>
                      <div className="space-y-2">
                        {safeScores.complexSentences.slice(0, 3).map((sentence, index) => (
                          <div key={index} className="p-2 border-l-4 border-orange-500 bg-orange-50 text-sm">
                            {sentence}
                          </div>
                        ))}
                        {issueCount.complex > 3 && (
                          <p className="text-xs text-gray-500">And {issueCount.complex - 3} more...</p>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Try simplifying these sentences for better readability.</p>
                    </div>
                  )}
                  
                  {issueCount.passive > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-blue-500" />
                        <h5 className="font-medium">Passive Voice</h5>
                        <Badge variant="outline" className="ml-auto">{issueCount.passive}</Badge>
                      </div>
                      <div className="space-y-2">
                        {safeScores.passiveVoice.slice(0, 3).map((sentence, index) => (
                          <div key={index} className="p-2 border-l-4 border-blue-500 bg-blue-50 text-sm">
                            {sentence}
                          </div>
                        ))}
                        {issueCount.passive > 3 && (
                          <p className="text-xs text-gray-500">And {issueCount.passive - 3} more...</p>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Consider using active voice for stronger, clearer writing.</p>
                    </div>
                  )}
                  
                  {issueCount.adverbs > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-purple-500" />
                        <h5 className="font-medium">Adverbs</h5>
                        <Badge variant="outline" className="ml-auto">{issueCount.adverbs}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1 p-2 border rounded bg-gray-50">
                        {safeScores.adverbs.slice(0, 15).map((adverb, index) => (
                          <Badge key={index} variant="secondary" className="bg-purple-100">
                            {adverb}
                          </Badge>
                        ))}
                        {issueCount.adverbs > 15 && (
                          <span className="text-xs text-gray-500">And {issueCount.adverbs - 15} more...</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Use stronger verbs instead of adverbs when possible.</p>
                    </div>
                  )}
                  
                  {issueCount.wordy > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-green-500" />
                        <h5 className="font-medium">Wordy Phrases</h5>
                        <Badge variant="outline" className="ml-auto">{issueCount.wordy}</Badge>
                      </div>
                      <div className="space-y-2">
                        {Object.entries(safeScores.wordyPhrases).slice(0, 5).map(([phrase, alternative], index) => (
                          <div key={index} className="grid grid-cols-2 gap-2 p-2 border rounded bg-gray-50">
                            <div className="text-sm font-medium text-red-500">"{phrase}"</div>
                            <div className="text-sm text-green-600">Use: "{alternative}"</div>
                          </div>
                        ))}
                        {issueCount.wordy > 5 && (
                          <p className="text-xs text-gray-500">And {issueCount.wordy - 5} more phrases...</p>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Replace these phrases with concise alternatives.</p>
                    </div>
                  )}
                  
                  {totalIssues === 0 && (
                    <div className="p-4 text-center">
                      <p className="text-green-600 font-medium">Great job! No readability issues detected.</p>
                      <p className="text-sm text-gray-600 mt-1">Your text appears to be clear and easy to read.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="ai">
                {aiAnalysis ? (
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
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-600">Click "Analyze Text" to get AI-powered writing suggestions</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </Card>
    </div>
  );
};

export default TextAnalysis;
