import React, { useState, useEffect } from 'react';
import { useToast } from '../ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import RichTextEditor from '../RichTextEditor';
import TextAnalysis from '../TextAnalysis';
import calculateScores from '@/utils/readabilityScores';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Chapter {
  id: string;
  title: string;
}

const ChaptersEditor = () => {
  const navigate = useNavigate();
  const [chapters, setChapters] = useState<Chapter[]>([{ id: '1', title: 'Chapter 1' }]);
  const [selectedChapter, setSelectedChapter] = useState<string>('1');
  const [documentContent, setDocumentContent] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const loadDocumentContent = async () => {
      console.log('Loading document content for chapter:', selectedChapter);
      setDocumentContent('');
      
      const { data, error } = await supabase
        .from('manuscript_boxes')
        .select('content')
        .eq('chapter_id', selectedChapter)
        .eq('box_id', 'document-content')
        .maybeSingle();

      if (error) {
        console.error('Error loading document content:', error);
        toast({
          title: "Error loading document",
          description: "There was a problem loading your document. Please try again.",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        console.log('Setting document content:', data.content);
        setDocumentContent(data.content || '');
      } else {
        console.log('No existing document content found for this chapter');
        setDocumentContent('');
      }
    };

    loadDocumentContent();
  }, [selectedChapter, toast]);

  const handleSave = async () => {
    try {
      console.log('Saving document content:', documentContent);
      
      const { data: existingDoc, error: fetchError } = await supabase
        .from('manuscript_boxes')
        .select('*')
        .eq('chapter_id', selectedChapter)
        .eq('box_id', 'document-content')
        .maybeSingle();

      if (fetchError) {
        console.error('Error checking for existing document:', fetchError);
        throw fetchError;
      }

      let saveError;
      if (existingDoc) {
        console.log('Updating existing document content');
        const { error } = await supabase
          .from('manuscript_boxes')
          .update({
            content: documentContent,
            updated_at: new Date().toISOString()
          })
          .eq('chapter_id', selectedChapter)
          .eq('box_id', 'document-content');
        saveError = error;
      } else {
        console.log('Creating new document content');
        const { error } = await supabase
          .from('manuscript_boxes')
          .insert({
            box_id: 'document-content',
            title: 'Document Content',
            content: documentContent,
            act: 'act1',
            chapter_id: selectedChapter
          });
        saveError = error;
      }

      if (saveError) {
        console.error('Error saving document content:', saveError);
        throw saveError;
      }

      toast({
        title: "Document saved",
        description: "Your chapter content has been saved successfully."
      });
    } catch (error) {
      console.error('Error in save operation:', error);
      toast({
        title: "Error saving changes",
        description: "There was a problem saving your changes. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddChapter = () => {
    const newId = (chapters.length + 1).toString();
    const newChapter = {
      id: newId,
      title: `Chapter ${newId}`
    };
    setChapters([...chapters, newChapter]);
    toast({
      title: "Chapter added",
      description: `${newChapter.title} has been created.`
    });
  };

  const readabilityScores = calculateScores(documentContent);

  return (
    <div className="h-screen flex flex-col">
      <div className="h-14 border-b flex items-center px-4 justify-between bg-white">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/editor')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-semibold">Chapter Editor</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleSave}>Save</Button>
          <Button onClick={handleAddChapter}>Add Chapter</Button>
          <Button variant="outline" onClick={() => navigate('/editor/manuscript/boxes')}>
            Switch to Boxes View
          </Button>
        </div>
      </div>

      <div className="flex flex-1">
        <div className="w-64 border-r p-4">
          <h3 className="font-semibold mb-4">Chapters</h3>
          <div className="space-y-2">
            {chapters.map((chapter) => (
              <Button
                key={chapter.id}
                variant={selectedChapter === chapter.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedChapter(chapter.id)}
              >
                {chapter.title}
              </Button>
            ))}
          </div>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <RichTextEditor
              content={documentContent}
              onChange={setDocumentContent}
            />
            <TextAnalysis 
              scores={readabilityScores}
              content={documentContent}
            />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ChaptersEditor;