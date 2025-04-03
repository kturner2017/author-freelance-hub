
import React from 'react';
import ReadabilityChart from './ReadabilityChart';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2, BarChart2, Pencil, Eye, BookText } from 'lucide-react';
import type { ReadabilityScores } from '@/utils/readabilityScores';

interface TextAnalysisProps {
  scores: ReadabilityScores;
  content: string;
  aiAnalysis?: any;
  isAnalyzing?: boolean;
  onAnalyze?: () => void;
}

const TextAnalysis = ({ scores, content, aiAnalysis, isAnalyzing = false, onAnalyze }: TextAnalysisProps) => {
  if (!scores) return null;
  
  const { stats } = scores;
  
  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Text Analysis</CardTitle>
          {onAnalyze && (
            <Button 
              onClick={onAnalyze}
              size="sm"
              disabled={isAnalyzing || content.length < 10}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Analyze Text
                </>
              )}
            </Button>
          )}
        </div>
        <CardDescription>
          {stats.wordCount} words · {stats.sentenceCount} sentences · {stats.paragraphCount} paragraphs
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="readability" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="readability">
              <BarChart2 className="h-4 w-4 mr-2" />
              Readability
            </TabsTrigger>
            <TabsTrigger value="hemingway">
              <Pencil className="h-4 w-4 mr-2" />
              Hemingway
            </TabsTrigger>
            <TabsTrigger value="showvstell">
              <Eye className="h-4 w-4 mr-2" />
              Show vs Tell
            </TabsTrigger>
            {aiAnalysis && (
              <TabsTrigger value="suggestions">
                <BookText className="h-4 w-4 mr-2" />
                Suggestions
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="readability">
            <div className="space-y-4">
              <ReadabilityChart scores={scores} />
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold mb-1">Readability Scores</h3>
                  <ul className="space-y-1 text-sm">
                    <li className="flex justify-between">
                      <span>Flesch-Kincaid Grade:</span> 
                      <span className="font-semibold">{scores.fleschKincaid.toFixed(1)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Flesch Reading Ease:</span> 
                      <span className="font-semibold">{scores.fleschReading.toFixed(1)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Gunning Fog:</span> 
                      <span className="font-semibold">{scores.gunningFog.toFixed(1)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Coleman-Liau:</span> 
                      <span className="font-semibold">{scores.colemanLiau.toFixed(1)}</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold mb-1">Sentence Stats</h3>
                  <ul className="space-y-1 text-sm">
                    <li className="flex justify-between">
                      <span>Average Words Per Sentence:</span> 
                      <span className="font-semibold">{scores.stats.averageWordsPerSentence.toFixed(1)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Long Sentences:</span> 
                      <span className="font-semibold">{scores.longSentences.length}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Very Long Sentences:</span> 
                      <span className="font-semibold">{scores.veryLongSentences.length}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="hemingway">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold mb-2">Complex Writing</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Passive Voice</span>
                      <span className={`font-semibold text-sm px-2 py-0.5 rounded ${scores.passiveVoice.length > 5 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                        {scores.passiveVoice.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Adverbs</span>
                      <span className={`font-semibold text-sm px-2 py-0.5 rounded ${scores.adverbs.length > 10 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                        {scores.adverbs.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Complex Sentences</span>
                      <span className={`font-semibold text-sm px-2 py-0.5 rounded ${scores.complexSentences.length > 3 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                        {scores.complexSentences.length}
                      </span>
                    </div>
                  </div>
                  
                  {scores.passiveVoice.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-xs font-semibold uppercase text-gray-500 mb-1">Passive Voice Examples</h4>
                      <ul className="text-sm space-y-1 bg-gray-50 p-2 rounded">
                        {scores.passiveVoice.slice(0, 3).map((sentence, idx) => (
                          <li key={idx} className="text-gray-700">{sentence}</li>
                        ))}
                        {scores.passiveVoice.length > 3 && (
                          <li className="text-xs text-gray-500">...and {scores.passiveVoice.length - 3} more</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold mb-2">Wordy Phrases</h3>
                  {Object.keys(scores.wordyPhrases).length > 0 ? (
                    <ul className="text-sm space-y-1 bg-gray-50 p-2 rounded">
                      {Object.entries(scores.wordyPhrases).map(([phrase, alternative], idx) => (
                        <li key={idx} className="flex justify-between">
                          <span className="text-gray-700">"{phrase}"</span>
                          <span className="text-green-600">→ "{alternative}"</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-600">No wordy phrases detected.</p>
                  )}
                  
                  {scores.longSentences.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-xs font-semibold uppercase text-gray-500 mb-1">Long Sentences</h4>
                      <ul className="text-sm space-y-1 bg-gray-50 p-2 rounded">
                        {scores.longSentences.slice(0, 2).map((sentence, idx) => (
                          <li key={idx} className="text-gray-700">{sentence}</li>
                        ))}
                        {scores.longSentences.length > 2 && (
                          <li className="text-xs text-gray-500">...and {scores.longSentences.length - 2} more</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="showvstell">
            <div className="space-y-4">
              <div className="flex space-x-4 mb-4">
                <div className="flex-1 bg-gray-50 rounded p-4">
                  <h3 className="text-sm font-semibold mb-2 flex items-center justify-between">
                    <span>Show vs Tell Ratio</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      scores.showVsTell.ratio >= 0.6 
                        ? 'bg-green-100 text-green-800' 
                        : scores.showVsTell.ratio >= 0.4 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {(scores.showVsTell.ratio * 100).toFixed(0)}%
                    </span>
                  </h3>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        scores.showVsTell.ratio >= 0.6 ? 'bg-green-600' : 
                        scores.showVsTell.ratio >= 0.4 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${scores.showVsTell.ratio * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>More Telling</span>
                    <span>More Showing</span>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Showing: {scores.showVsTell.showingCount}</p>
                      <p className="text-gray-600 text-xs">
                        Uses sensory details, specific actions, and vivid descriptions.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Telling: {scores.showVsTell.tellingCount}</p>
                      <p className="text-gray-600 text-xs">
                        States facts, emotions, or observations directly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold mb-2">Showing Examples</h3>
                  {scores.showVsTell.showingSentences.length > 0 ? (
                    <ul className="text-sm space-y-2 bg-gray-50 p-3 rounded">
                      {scores.showVsTell.showingSentences.slice(0, 3).map((sentence, idx) => (
                        <li key={idx} className="text-gray-700 border-l-2 border-green-400 pl-2">{sentence}</li>
                      ))}
                      {scores.showVsTell.showingSentences.length > 3 && (
                        <li className="text-xs text-gray-500">...and {scores.showVsTell.showingSentences.length - 3} more</li>
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-600">No showing sentences detected.</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold mb-2">Telling Examples</h3>
                  {scores.showVsTell.tellingSentences.length > 0 ? (
                    <ul className="text-sm space-y-2 bg-gray-50 p-3 rounded">
                      {scores.showVsTell.tellingSentences.slice(0, 3).map((sentence, idx) => (
                        <li key={idx} className="text-gray-700 border-l-2 border-amber-400 pl-2">{sentence}</li>
                      ))}
                      {scores.showVsTell.tellingSentences.length > 3 && (
                        <li className="text-xs text-gray-500">...and {scores.showVsTell.tellingSentences.length - 3} more</li>
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-600">No telling sentences detected.</p>
                  )}
                </div>
              </div>
              
              <div className="mt-4 bg-gray-50 p-3 rounded">
                <h3 className="text-sm font-semibold mb-2">How to improve your show vs tell ratio:</h3>
                <ul className="text-sm space-y-1 list-disc pl-5">
                  <li>Replace emotion statements with physical descriptions of how emotions feel</li>
                  <li>Use specific, concrete details instead of abstract concepts</li>
                  <li>Include sensory details (sight, sound, smell, taste, touch)</li>
                  <li>Replace passive observations with active descriptions</li>
                  <li>Show character reactions through dialogue and body language</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          {aiAnalysis && (
            <TabsContent value="suggestions">
              <div className="space-y-4">
                {aiAnalysis.suggestions && aiAnalysis.suggestions.length > 0 ? (
                  <ul className="space-y-2">
                    {aiAnalysis.suggestions.map((suggestion: string, idx: number) => (
                      <li key={idx} className="bg-gray-50 p-3 rounded border-l-4 border-blue-400">
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No AI suggestions available. Click "Analyze Text" to generate suggestions.</p>
                )}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TextAnalysis;
