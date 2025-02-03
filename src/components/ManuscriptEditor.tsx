import React, { useState } from 'react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent } from './ui/card';
import BoxEditor from './BoxEditor';
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
  Menu
} from 'lucide-react';

interface Box {
  id: string;
  title: string;
  content: string;
}

const INITIAL_BOXES = {
  'ordinary-world': {
    id: 'ordinary-world',
    title: 'Ordinary World',
    content: 'Bilbo Baggins, a very well-to-do hobbit of Bag End, sits outside his front porch. He smokes a wooden pipe, as usual.'
  },
  'call-to-adventure': {
    id: 'call-to-adventure',
    title: 'Call to Adventure',
    content: 'Gandalf arrives and tells him that he\'s looking for someone to share in an adventure that he\'s arranging.'
  },
  'refusal-of-call': {
    id: 'refusal-of-call',
    title: 'Refusal of the Call',
    content: 'Bilbo declines, stating that adventures are nasty uncomfortable things that make you late for dinner.'
  }
};

const ManuscriptEditor = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [expandedSections, setExpandedSections] = useState({
    'act1': true,
    'act2': false,
    'act3': false
  });
  const [selectedBox, setSelectedBox] = useState<Box | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleAddAct = () => {
    console.log('Adding new act');
  };

  const handleAddBox = () => {
    console.log('Adding new box');
  };

  const handleBoxClick = (box: Box) => {
    console.log('Box clicked:', box);
    setSelectedBox(box);
  };

  const handleBoxTitleChange = (title: string) => {
    if (selectedBox) {
      setSelectedBox({ ...selectedBox, title });
    }
  };

  const handleBoxContentChange = (content: string) => {
    if (selectedBox) {
      setSelectedBox({ ...selectedBox, content });
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      <div className="w-64 bg-[#2c3643] text-white flex flex-col">
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

              <div className="space-y-1">
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
                    Act I
                  </div>
                </Button>
                {expandedSections.act1 && (
                  <div className="ml-4 space-y-1">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-sm text-gray-400 hover:bg-gray-700 py-1 h-auto"
                      onClick={() => handleBoxClick(INITIAL_BOXES['ordinary-world'])}
                    >
                      Ordinary World
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-sm text-gray-400 hover:bg-gray-700 py-1 h-auto"
                      onClick={() => handleBoxClick(INITIAL_BOXES['call-to-adventure'])}
                    >
                      Call to Adventure
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-sm text-gray-400 hover:bg-gray-700 py-1 h-auto"
                      onClick={() => handleBoxClick(INITIAL_BOXES['refusal-of-call'])}
                    >
                      Refusal of the Call
                    </Button>
                  </div>
                )}
              </div>

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
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-semibold">Manuscript</h2>
          </div>
          <div className="flex items-center gap-2">
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
          {selectedBox ? (
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
                  <h3 className="text-xl font-semibold">Act I</h3>
                  <Button 
                    size="sm"
                    onClick={handleAddBox}
                    className="bg-primary hover:bg-primary-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Box
                  </Button>
                </div>
                
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
                  {Object.values(INITIAL_BOXES).map((box) => (
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