import React, { useState } from 'react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent } from './ui/card';
import { Toggle } from './ui/toggle';
import BoxEditor from './BoxEditor';
import { useToast } from './ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronDown,
  ChevronRight,
  Plus,
  Settings,
  Copy,
  Trash2,
  CheckSquare,
  LayoutGrid,
  List,
  Menu,
  Folder,
  File,
  BookOpen,
  LayoutDashboard,
  ArrowUp,
  ArrowDown,
  Pencil,
  X,
  Check,
  ArrowLeft,
  Save
} from 'lucide-react';
import FileUploader from './FileUploader';

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
  const { toast } = useToast();

  // Mock book data
  const bookData = {
    title: "Gomer",
    author: "K. TURNER"
  };

  const handleSave = () => {
    toast({
      title: "Changes saved",
      description: "Your changes have been saved successfully."
    });
    console.log('Saving changes');
  };

  const handleBack = () => {
    navigate('/editor');
    console.log('Navigating back to editor');
  };

  const handleAddAct = () => {
    console.log('Adding new act');
    toast({
      title: "Adding new act",
      description: "This feature is not yet implemented."
    });
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

  const startEditingChapter = (chapter: Chapter) => {
    setEditingChapterId(chapter.id);
    setEditingChapterTitle(chapter.title);
  };

  const saveChapterEdit = () => {
    if (!editingChapterId) return;
    
    const updatedChapters = chapters.map(chapter =>
      chapter.id === editingChapterId
        ? { ...chapter, title: editingChapterTitle }
        : chapter
    );
    
    setChapters(updatedChapters);
    setEditingChapterId(null);
    toast({
      title: "Chapter renamed",
      description: "Chapter name has been updated."
    });
  };

  const cancelChapterEdit = () => {
    setEditingChapterId(null);
    setEditingChapterTitle('');
  };

  const toggleSection = (section: 'act1' | 'act2' | 'act3') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
    setSelectedAct(section);
    setSelectedBox(null);
    console.log('Selected act:', section);
  };

  const [boxes, setBoxes] = useState<{ [key: string]: Box }>(INITIAL_BOXES);
  
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

  const handleBoxClick = (box: Box) => {
    console.log('Box clicked:', box);
    setSelectedBox(box);
  };

  const handleBoxTitleChange = (title: string) => {
    if (selectedBox) {
      const updatedBox = { ...selectedBox, title };
      setSelectedBox(updatedBox);
      setBoxes(prevBoxes => ({
        ...prevBoxes,
        [selectedBox.id]: updatedBox
      }));
      console.log('Updated box title:', title);
    }
  };

  const handleBoxContentChange = (content: string) => {
    if (selectedBox) {
      const updatedBox = { ...selectedBox, content };
      setSelectedBox(updatedBox);
      setBoxes(prevBoxes => ({
        ...prevBoxes,
        [selectedBox.id]: updatedBox
      }));
      console.log('Updated box content:', content);
    }
  };

  const getBoxesForAct = (act: 'act1' | 'act2' | 'act3') => {
    return Object.values(boxes).filter(box => box.act === act);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      <div className="w-64 bg-[#2c3643] text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">{bookData.title}</h2>
          <p className="text-sm text-gray-400">by {bookData.author}</p>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2">
            <div className="space-y-1">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-gray-300 hover:bg-gray-700 py-1 h-auto"
              >
                <div className="flex items-center">
                  <ChevronRight className="h-4 w-4 mr-2" />
                  Get Started
                </div>
              </Button>

              {chapters.map((chapter, index) => (
                <div key={chapter.id} className="flex items-center group">
                  {editingChapterId === chapter.id ? (
                    <div className="flex items-center w-full gap-1 pr-2">
                      <input
                        type="text"
                        value={editingChapterTitle}
                        onChange={(e) => setEditingChapterTitle(e.target.value)}
                        className="flex-1 bg-gray-700 text-white px-2 py-1 rounded"
                        autoFocus
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={saveChapterEdit}
                      >
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={cancelChapterEdit}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button 
                        variant="ghost" 
                        className={`flex-1 justify-start text-gray-300 hover:bg-gray-700 py-1 h-auto ${
                          selectedChapter === chapter.id ? 'bg-gray-700' : ''
                        }`}
                        onClick={() => setSelectedChapter(chapter.id)}
                      >
                        <div className="flex items-center">
                          <File className="h-4 w-4 mr-2" />
                          {chapter.title}
                        </div>
                      </Button>
                      <div className="hidden group-hover:flex items-center gap-1 pr-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => startEditingChapter(chapter)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleMoveChapter(chapter.id, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleMoveChapter(chapter.id, 'down')}
                          disabled={index === chapters.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleDeleteChapter(chapter.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}

              <Button 
                variant="ghost" 
                className="w-full justify-start text-gray-300 hover:bg-gray-700 py-1 h-auto"
                onClick={handleAddChapter}
              >
                <div className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Chapter
                </div>
              </Button>

              <Button 
                variant="ghost" 
                className="w-full justify-start text-gray-300 hover:bg-gray-700 py-1 h-auto"
                onClick={() => toggleSection('act1')}
              >
                <div className="flex items-center">
                  {expandedSections.act1 ? (
                    <ChevronDown className="h-4 w-4 mr-2" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-2" />
                  )}
                  <Folder className="h-4 w-4 mr-2" />
                  Act I
                </div>
              </Button>
              {expandedSections.act1 && (
                <div className="ml-4 space-y-1">
                  {getBoxesForAct('act1').map(box => (
                    <Button 
                      key={box.id}
                      variant="ghost" 
                      className="w-full justify-start text-sm text-gray-400 hover:bg-gray-700 py-1 h-auto"
                      onClick={() => handleBoxClick(box)}
                    >
                      <File className="h-4 w-4 mr-2" />
                      {box.title}
                    </Button>
                  ))}
                </div>
              )}

              <Button 
                variant="ghost" 
                className="w-full justify-start text-gray-300 hover:bg-gray-700 py-1 h-auto"
                onClick={() => toggleSection('act2')}
              >
                <div className="flex items-center">
                  {expandedSections.act2 ? (
                    <ChevronDown className="h-4 w-4 mr-2" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-2" />
                  )}
                  <Folder className="h-4 w-4 mr-2" />
                  Act II
                </div>
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-14 border-b flex items-center px-4 justify-between bg-white">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleBack}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-xl font-semibold">{selectedChapter}</h2>
              <p className="text-sm text-gray-500">{bookData.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              onClick={handleSave}
              className="bg-primary hover:bg-primary-600 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
            <div className="flex items-center border rounded-lg p-1 mr-4">
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-2 ${editorView === 'boxes' ? 'bg-gray-100' : ''}`}
                onClick={() => setEditorView('boxes')}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Boxes</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-2 ${editorView === 'document' ? 'bg-gray-100' : ''}`}
                onClick={() => setEditorView('document')}
              >
                <BookOpen className="h-4 w-4" />
                <span>Document</span>
              </Button>
            </div>
            <Button 
              variant="default"
              onClick={handleAddAct}
              className="bg-primary hover:bg-primary-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Act
            </Button>
            <Button variant="ghost" size="icon">
              <Copy className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <CheckSquare className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-gray-100' : ''}
            >
              <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-gray-100' : ''}
            >
              <List className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <ScrollArea className="flex-1 p-6">
          {editorView === 'document' ? (
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg">
                <h1>{selectedChapter}</h1>
                <p className="text-gray-500">Begin writing here...</p>
              </div>
            </div>
          ) : selectedBox ? (
            <BoxEditor
              title={selectedBox.title}
              content={selectedBox.content}
              onTitleChange={handleBoxTitleChange}
              onContentChange={handleBoxContentChange}
            />
          ) : (
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">
                    {selectedAct === 'act1' ? 'Act I' : selectedAct === 'act2' ? 'Act II' : 'Act III'}
                  </h3>
                  <Button 
                    size="sm"
                    onClick={handleAddBox}
                    className="bg-primary hover:bg-primary-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Box
                  </Button>
                </div>
                
                {/* File Uploader */}
                <div className="mb-6">
                  <FileUploader 
                    act={selectedAct} 
                    chapterId={selectedChapter}
                  />
                </div>

                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
                  {getBoxesForAct(selectedAct).map((box) => (
                    <Card 
                      key={box.id}
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleBoxClick(box)}
                    >
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">{box.title}</h4>
                        <p className="text-sm text-gray-600">{box.content}</p>
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

export default ManuscriptEditor;