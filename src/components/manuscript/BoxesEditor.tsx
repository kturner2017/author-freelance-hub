import React, { useState, useEffect } from 'react';
import { useToast } from '../ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Card, CardContent } from '../ui/card';
import { ChevronLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BoxEditor from '../BoxEditor';
import FileUploader from '../FileUploader';

interface Box {
  id: string;
  title: string;
  content: string;
  act: 'act1' | 'act2' | 'act3';
}

const INITIAL_BOXES = {
  'box-1': {
    id: 'box-1',
    title: 'New Box',
    content: '',
    act: 'act1' as const
  }
};

const BoxesEditor = () => {
  const navigate = useNavigate();
  const [selectedAct, setSelectedAct] = useState<'act1' | 'act2' | 'act3'>('act1');
  const [selectedBox, setSelectedBox] = useState<Box | null>(null);
  const [boxes, setBoxes] = useState<{ [key: string]: Box }>(INITIAL_BOXES);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { toast } = useToast();

  useEffect(() => {
    const loadBoxes = async () => {
      console.log('Loading boxes for act:', selectedAct);
      
      const { data, error } = await supabase
        .from('manuscript_boxes')
        .select('*')
        .eq('act', selectedAct)
        .neq('box_id', 'document-content');

      if (error) {
        console.error('Error loading boxes:', error);
        toast({
          title: "Error loading boxes",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      if (data && data.length > 0) {
        const boxesMap: { [key: string]: Box } = {};
        data.forEach(box => {
          boxesMap[box.box_id] = {
            id: box.box_id,
            title: box.title,
            content: box.content || '',
            act: box.act as 'act1' | 'act2' | 'act3'
          };
        });
        setBoxes(boxesMap);
        console.log('Loaded boxes from Supabase:', boxesMap);
      } else {
        setBoxes(INITIAL_BOXES);
        console.log('No boxes in Supabase, using initial sample boxes:', INITIAL_BOXES);
      }
    };

    loadBoxes();
  }, [selectedAct, toast]);

  const handleSave = async () => {
    try {
      console.log('Saving boxes:', boxes);
      
      const { data: existingBoxes, error: fetchError } = await supabase
        .from('manuscript_boxes')
        .select('*')
        .eq('act', selectedAct);

      if (fetchError) {
        console.error('Error fetching existing boxes:', fetchError);
        throw fetchError;
      }

      const existingBoxIds = existingBoxes?.map(box => box.box_id) || [];
      const currentBoxIds = Object.keys(boxes);

      const boxesToDelete = existingBoxIds.filter(id => !currentBoxIds.includes(id));
      const boxesToUpdate = currentBoxIds.filter(id => existingBoxIds.includes(id));
      const boxesToInsert = currentBoxIds.filter(id => !existingBoxIds.includes(id));

      if (boxesToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('manuscript_boxes')
          .delete()
          .eq('act', selectedAct)
          .in('box_id', boxesToDelete);

        if (deleteError) {
          console.error('Error deleting boxes:', deleteError);
          throw deleteError;
        }
      }

      for (const boxId of boxesToUpdate) {
        const box = boxes[boxId];
        const { error: updateError } = await supabase
          .from('manuscript_boxes')
          .update({
            title: box.title,
            content: box.content,
            act: box.act,
            updated_at: new Date().toISOString()
          })
          .eq('act', selectedAct)
          .eq('box_id', boxId);

        if (updateError) {
          console.error(`Error updating box ${boxId}:`, updateError);
          throw updateError;
        }
      }

      if (boxesToInsert.length > 0) {
        const newBoxes = boxesToInsert.map(boxId => ({
          box_id: boxId,
          title: boxes[boxId].title,
          content: boxes[boxId].content || '',
          act: boxes[boxId].act,
          chapter_id: '1' // Default chapter
        }));

        const { error: insertError } = await supabase
          .from('manuscript_boxes')
          .insert(newBoxes);

        if (insertError) {
          console.error('Error inserting new boxes:', insertError);
          throw insertError;
        }
      }

      toast({
        title: "Changes saved",
        description: "Your changes have been saved successfully."
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

  const handleAddBox = () => {
    const newBoxId = `box-${Object.keys(boxes).length + 1}`;
    const newBox: Box = {
      id: newBoxId,
      title: 'New Box',
      content: '',
      act: selectedAct
    };

    setBoxes(prevBoxes => ({
      ...prevBoxes,
      [newBoxId]: newBox
    }));

    toast({
      title: "Box added",
      description: "A new box has been added to the selected act."
    });
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="h-16 border-b flex items-center px-4 justify-between bg-white">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/editor')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-semibold">Boxes Editor</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleSave}>Save</Button>
          <Button onClick={handleAddBox}>Add Box</Button>
          <Button variant="outline" onClick={() => navigate('/editor/manuscript')}>
            Switch to Chapters View
          </Button>
        </div>
      </div>

      <div className="flex flex-1">
        <div className="w-64 border-r p-4">
          <h3 className="font-semibold mb-4">Acts</h3>
          <div className="space-y-2">
            {(['act1', 'act2', 'act3'] as const).map((act) => (
              <Button
                key={act}
                variant={selectedAct === act ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setSelectedAct(act);
                  setSelectedBox(null);
                }}
              >
                {act === 'act1' ? 'Act I' : act === 'act2' ? 'Act II' : 'Act III'}
              </Button>
            ))}
          </div>
        </div>

        <ScrollArea className="flex-1 p-6">
          {selectedBox ? (
            <BoxEditor
              title={selectedBox.title}
              content={selectedBox.content}
              onTitleChange={(title) => {
                const updatedBox = { ...selectedBox, title };
                setSelectedBox(updatedBox);
                setBoxes(prevBoxes => ({
                  ...prevBoxes,
                  [selectedBox.id]: updatedBox
                }));
              }}
              onContentChange={(content) => {
                const updatedBox = { ...selectedBox, content };
                setSelectedBox(updatedBox);
                setBoxes(prevBoxes => ({
                  ...prevBoxes,
                  [selectedBox.id]: updatedBox
                }));
              }}
            />
          ) : (
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">
                    {selectedAct === 'act1' ? 'Act I' : selectedAct === 'act2' ? 'Act II' : 'Act III'}
                  </h3>
                  <Button onClick={handleAddBox}>
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
                  {Object.values(boxes)
                    .filter(box => box.act === selectedAct)
                    .map((box) => (
                      <Card 
                        key={box.id}
                        className="hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => setSelectedBox(box)}
                      >
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2">{box.title}</h4>
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {box.content}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default BoxesEditor;
