import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ManuscriptSidebar from './manuscript/ManuscriptSidebar';
import ManuscriptToolbar from './manuscript/ManuscriptToolbar';
import ManuscriptContent from './manuscript/ManuscriptContent';

interface Box {
  id: string;
  title: string;
  content: string;
  act: 'act1' | 'act2' | 'act3';
}

interface Chapter {
  id: string;
  title: string;
}

const INITIAL_BOXES = {
  'ordinary-world': {
    id: 'ordinary-world',
    title: 'Ordinary World',
    content: 'Bilbo Baggins, a very well-to-do hobbit of Bag End, sits outside his front porch. He smokes a wooden pipe, as usual.',
    act: 'act1' as const
  },
  'call-to-adventure': {
    id: 'call-to-adventure',
    title: 'Call to Adventure',
    content: 'Gandalf arrives and tells him that he\'s looking for someone to share in an adventure that he\'s arranging.',
    act: 'act1' as const
  },
  'refusal-of-call': {
    id: 'refusal-of-call',
    title: 'Refusal of the Call',
    content: 'Bilbo declines, stating that adventures are nasty uncomfortable things that make you late for dinner.',
    act: 'act1' as const
  }
};

const ManuscriptEditor = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editorView, setEditorView] = useState<'boxes' | 'document'>('boxes');
  const [expandedSections, setExpandedSections] = useState({
    'act1': true,
    'act2': false,
    'act3': false
  });
  const [selectedBox, setSelectedBox] = useState<Box | null>(null);
  const [selectedAct, setSelectedAct] = useState<'act1' | 'act2' | 'act3'>('act1');
  const [chapters, setChapters] = useState<Chapter[]>([{ id: '1', title: 'Chapter 1' }]);
  const [selectedChapter, setSelectedChapter] = useState<string>('1');
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [editingChapterTitle, setEditingChapterTitle] = useState('');
  const [documentContent, setDocumentContent] = useState('');
  const { toast } = useToast();

  const bookData = {
    title: "Gomer",
    author: "K. TURNER"
  };

  const [boxes, setBoxes] = useState<{ [key: string]: Box }>(INITIAL_BOXES);

  useEffect(() => {
    const loadBoxes = async () => {
      const { data, error } = await supabase
        .from('manuscript_boxes')
        .select('*')
        .eq('chapter_id', selectedChapter);

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
  }, [selectedChapter]);

  const handleSave = async () => {
    try {
      if (editorView === 'document') {
        console.log('Saving document content:', documentContent);
        
        // Save to manuscript_boxes table as a special "document" box
        const { error: deleteError } = await supabase
          .from('manuscript_boxes')
          .delete()
          .eq('chapter_id', selectedChapter)
          .eq('box_id', 'document-content');

        if (deleteError) {
          console.error('Error deleting existing document content:', deleteError);
          throw deleteError;
        }

        const { error: insertError } = await supabase
          .from('manuscript_boxes')
          .insert({
            box_id: 'document-content',
            title: 'Document Content',
            content: documentContent,
            act: 'act1', // Default act for document content
            chapter_id: selectedChapter
          });

        if (insertError) {
          console.error('Error saving document content:', insertError);
          throw insertError;
        }

        toast({
          title: "Document saved",
          description: "Your chapter content has been saved successfully."
        });
        return;
      }

      console.log('Saving boxes:', boxes);
      
      const boxesArray = Object.values(boxes).map(box => ({
        box_id: box.id,
        title: box.title,
        content: box.content || '',
        act: box.act,
        chapter_id: selectedChapter
      }));

      const { error: deleteError } = await supabase
        .from('manuscript_boxes')
        .delete()
        .eq('chapter_id', selectedChapter);

      if (deleteError) {
        console.error('Error deleting existing boxes:', deleteError);
        toast({
          title: "Error saving changes",
          description: deleteError.message,
          variant: "destructive"
        });
        return;
      }

      const { error: insertError } = await supabase
        .from('manuscript_boxes')
        .insert(boxesArray);

      if (insertError) {
        console.error('Error saving boxes:', insertError);
        toast({
          title: "Error saving changes",
          description: insertError.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Changes saved",
        description: "Your changes have been saved successfully."
      });
      console.log('Changes saved successfully');
    } catch (error) {
      console.error('Error in save operation:', error);
      toast({
        title: "Error saving changes",
        description: "There was a problem saving your changes. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Load document content when chapter changes
  useEffect(() => {
    const loadDocumentContent = async () => {
      const { data, error } = await supabase
        .from('manuscript_boxes')
        .select('content')
        .eq('chapter_id', selectedChapter)
        .eq('box_id', 'document-content')
        .single();

      if (error) {
        console.error('Error loading document content:', error);
        return;
      }

      if (data) {
        setDocumentContent(data.content || '');
        console.log('Loaded document content:', data.content);
      }
    };

    if (editorView === 'document') {
      loadDocumentContent();
    }
  }, [selectedChapter, editorView]);

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
    console.log('Added new chapter:', newChapter);
  };

  const handleDeleteChapter = (chapterId: string) => {
    if (chapters.length <= 1) {
      toast({
        title: "Cannot delete chapter",
        description: "You must have at least one chapter.",
        variant: "destructive"
      });
      return;
    }

    const updatedChapters = chapters.filter(chapter => chapter.id !== chapterId);
    setChapters(updatedChapters);
    if (selectedChapter === chapterId) {
      setSelectedChapter(updatedChapters[0].id);
    }
    toast({
      title: "Chapter deleted",
      description: "The chapter has been removed."
    });
  };

  const handleMoveChapter = (chapterId: string, direction: 'up' | 'down') => {
    const currentIndex = chapters.findIndex(chapter => chapter.id === chapterId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === chapters.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const updatedChapters = [...chapters];
    [updatedChapters[currentIndex], updatedChapters[newIndex]] = 
    [updatedChapters[newIndex], updatedChapters[currentIndex]];
    
    setChapters(updatedChapters);
    toast({
      title: "Chapter moved",
      description: `Chapter moved ${direction}.`
    });
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

    console.log('Added new box:', newBox);
  };

  return (
    <div className="flex h-screen bg-white">
      <ManuscriptSidebar
        bookData={bookData}
        chapters={chapters}
        selectedChapter={selectedChapter}
        expandedSections={expandedSections}
        editingChapterId={editingChapterId}
        editingChapterTitle={editingChapterTitle}
        boxes={boxes}
        onChapterSelect={setSelectedChapter}
        onChapterAdd={handleAddChapter}
        onChapterDelete={handleDeleteChapter}
        onChapterMove={handleMoveChapter}
        onChapterEditStart={(chapter) => {
          setEditingChapterId(chapter.id);
          setEditingChapterTitle(chapter.title);
        }}
        onChapterEditSave={() => {
          if (!editingChapterId) return;
          setChapters(chapters.map(chapter =>
            chapter.id === editingChapterId
              ? { ...chapter, title: editingChapterTitle }
              : chapter
          ));
          setEditingChapterId(null);
          toast({
            title: "Chapter renamed",
            description: "Chapter name has been updated."
          });
        }}
        onChapterEditCancel={() => {
          setEditingChapterId(null);
          setEditingChapterTitle('');
        }}
        onChapterTitleChange={setEditingChapterTitle}
        onSectionToggle={(section) => {
          setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
          }));
          setSelectedAct(section);
          setSelectedBox(null);
        }}
        onBoxSelect={setSelectedBox}
      />

      <div className="flex-1 flex flex-col">
        <ManuscriptToolbar
          bookData={bookData}
          selectedChapter={selectedChapter}
          editorView={editorView}
          viewMode={viewMode}
          onBack={() => navigate(-1)}
          onSave={handleSave}
          onViewChange={setEditorView}
          onViewModeChange={setViewMode}
          onAddAct={() => {
            toast({
              title: "Adding new act",
              description: "This feature is not yet implemented."
            });
          }}
        />

        <ManuscriptContent
          editorView={editorView}
          viewMode={viewMode}
          selectedBox={selectedBox}
          selectedAct={selectedAct}
          selectedChapter={selectedChapter}
          documentContent={documentContent}
          boxes={boxes}
          onBoxClick={setSelectedBox}
          onBoxTitleChange={(title) => {
            if (selectedBox) {
              const updatedBox = { ...selectedBox, title };
              setSelectedBox(updatedBox);
              setBoxes(prevBoxes => ({
                ...prevBoxes,
                [selectedBox.id]: updatedBox
              }));
            }
          }}
          onBoxContentChange={(content) => {
            if (selectedBox) {
              const updatedBox = { ...selectedBox, content };
              setSelectedBox(updatedBox);
              setBoxes(prevBoxes => ({
                ...prevBoxes,
                [selectedBox.id]: updatedBox
              }));
            }
          }}
          onDocumentContentChange={setDocumentContent}
          onAddBox={handleAddBox}
        />
      </div>
    </div>
  );
};

export default ManuscriptEditor;
