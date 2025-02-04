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
