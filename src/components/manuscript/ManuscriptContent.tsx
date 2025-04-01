
import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import BoxEditor from '../BoxEditor';
import RichTextEditor from '../RichTextEditor';
import FileUploader from '../FileUploader';
import TextAnalysis from '../TextAnalysis';
import calculateScores from '@/utils/readabilityScores';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Box {
  id: string;
  title: string;
  content: string;
  act: 'act1' | 'act2' | 'act3';
}

interface ManuscriptContentProps {
  editorView: 'boxes' | 'document';
  viewMode: 'grid' | 'list';
  selectedBox: Box | null;
  selectedAct: 'act1' | 'act2' | 'act3';
  selectedChapter: string;
  documentContent: string;
  boxes: { [key: string]: Box };
  onBoxClick: (box: Box) => void;
  onBoxTitleChange: (title: string) => void;
  onBoxContentChange: (content: string) => void;
  onDocumentContentChange: (content: string) => void;
  onAddBox: () => void;
}

const ManuscriptContent = ({
  editorView,
  viewMode,
  selectedBox,
  selectedAct,
  selectedChapter,
  documentContent,
  boxes,
  onBoxClick,
  onBoxTitleChange,
  onBoxContentChange,
  onDocumentContentChange,
  onAddBox
}: ManuscriptContentProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const { toast } = useToast();

  const handleAnalyze = () => {
    try {
      setIsAnalyzing(true);
      
      // Calculate local analysis instead of API call
      const scores = calculateScores(documentContent);
      
      // Transform the data structure
      const analysis = {
        scores: {
          grammar: 0.8, // Default value since we can't calculate grammar locally
          style: 0.7,   // Default value
          showVsTell: scores.showVsTell.ratio
        },
        details: {
          showVsTell: scores.showVsTell
        },
        suggestions: generateLocalSuggestions(scores)
      };
      
      setAiAnalysis(analysis);
      
      toast({
        title: "Analysis complete",
        description: "Your text has been analyzed successfully"
      });
    } catch (error) {
      console.error('Error analyzing text:', error);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your text",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate suggestions based on the readability scores
  const generateLocalSuggestions = (scores: any): string[] => {
    const suggestions: string[] = [];

    // Show vs Tell suggestions
    if (scores.showVsTell.ratio < 0.4) {
      suggestions.push('Consider using more descriptive language to show rather than tell');
      suggestions.push('Try incorporating more sensory details in your descriptions');
      
      if (scores.showVsTell.tellingSentences.length > 0) {
        suggestions.push('Look for opportunities to replace passive observations with active descriptions');
      }
    }

    // Readability-based suggestions
    const avgReadingLevel = (scores.fleschKincaid + scores.gunningFog + scores.colemanLiau) / 3;
    if (avgReadingLevel > 12) {
      suggestions.push('The text may be difficult to read. Consider simplifying some sentences.');
    }

    // Passive voice suggestions
    if (scores.passiveVoice.length > Math.max(5, scores.stats.sentenceCount * 0.2)) {
      suggestions.push('There are several instances of passive voice. Try using more active voice for clarity.');
    }

    // Long sentences suggestions
    if (scores.longSentences.length + scores.veryLongSentences.length > Math.max(3, scores.stats.sentenceCount * 0.15)) {
      suggestions.push('Consider breaking up long sentences to improve readability.');
    }

    // Adverbs suggestions
    if (scores.adverbs.length > Math.max(10, scores.stats.wordCount * 0.05)) {
      suggestions.push('Try replacing some adverbs with stronger verbs for more impactful writing.');
    }

    // Wordy phrases
    if (Object.keys(scores.wordyPhrases).length > 3) {
      suggestions.push('Look for opportunities to replace wordy phrases with more concise alternatives.');
    }

    return suggestions;
  };

  const getBoxesForAct = (act: 'act1' | 'act2' | 'act3') => {
    return Object.values(boxes).filter(box => box.act === act);
  };

  const getDisplayContent = (content: string) => {
    try {
      const contentObj = JSON.parse(content);
      if (contentObj.text) {
        return contentObj.text;
      }
    } catch {
      // If parsing fails, return the content as is
    }
    return content;
  };

  const readabilityScores = calculateScores(documentContent);

  return (
    <ScrollArea className="flex-1 p-6">
      {editorView === 'document' ? (
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-serif mb-2">Chapter {selectedChapter}</h1>
            <p className="text-gray-500">Write your story below</p>
          </div>
          
          <RichTextEditor
            content={documentContent}
            onChange={onDocumentContentChange}
          />

          <TextAnalysis 
            scores={readabilityScores}
            content={documentContent}
            aiAnalysis={aiAnalysis}
            isAnalyzing={isAnalyzing}
            onAnalyze={handleAnalyze}
          />
        </div>
      ) : selectedBox ? (
        <BoxEditor
          title={selectedBox.title}
          content={selectedBox.content}
          onTitleChange={onBoxTitleChange}
          onContentChange={onBoxContentChange}
        />
      ) : (
        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">
                {selectedAct === 'act1' ? 'Act I' : selectedAct === 'act2' ? 'Act II' : 'Act III'}
              </h3>
              <Button onClick={onAddBox}>
                <Plus className="h-4 w-4 mr-2" />
                Add Box
              </Button>
            </div>
            
            <div className="mb-6">
              <FileUploader 
                boxId={selectedBox?.id || ''} 
                onUploadComplete={() => {
                  // Refresh the box data if needed
                  console.log('File upload completed');
                }}
              />
            </div>

            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
              {getBoxesForAct(selectedAct).map((box) => (
                <Card 
                  key={box.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => onBoxClick(box)}
                >
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">{box.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {getDisplayContent(box.content)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </ScrollArea>
  );
};

export default ManuscriptContent;
