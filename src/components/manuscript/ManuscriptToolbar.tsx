import React from 'react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  LayoutDashboard,
  BookOpen,
  Plus,
  Copy,
  Trash2,
  CheckSquare,
  Settings,
  LayoutGrid,
  List,
  Home
} from 'lucide-react';

interface ManuscriptToolbarProps {
  bookData: {
    title: string;
  };
  selectedChapter: string;
  editorView: 'boxes' | 'document';
  viewMode: 'grid' | 'list';
  onBack: () => void;
  onSave: () => void;
  onViewChange: (view: 'boxes' | 'document') => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onAddAct: () => void;
}

const ManuscriptToolbar = ({
  bookData,
  selectedChapter,
  editorView,
  viewMode,
  onBack,
  onSave,
  onViewChange,
  onViewModeChange,
  onAddAct
}: ManuscriptToolbarProps) => {
  const navigate = useNavigate();

  return (
    <div className="h-14 border-b flex items-center px-4 justify-between bg-white">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/')}
          className="hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
          title="Go to Home"
        >
          <Home className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onBack}
          className="hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
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
          onClick={onSave}
          className="bg-primary hover:bg-primary-600 active:scale-95 transition-all duration-200 flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save
        </Button>
        <div className="flex items-center border rounded-lg p-1 mr-4">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-2 ${editorView === 'boxes' ? 'bg-gray-100' : ''}`}
            onClick={() => onViewChange('boxes')}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Boxes</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-2 ${editorView === 'document' ? 'bg-gray-100' : ''}`}
            onClick={() => onViewChange('document')}
          >
            <BookOpen className="h-4 w-4" />
            <span>Document</span>
          </Button>
        </div>
        <Button 
          variant="default"
          onClick={onAddAct}
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
          onClick={() => onViewModeChange('grid')}
          className={viewMode === 'grid' ? 'bg-gray-100' : ''}
        >
          <LayoutGrid className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onViewModeChange('list')}
          className={viewMode === 'list' ? 'bg-gray-100' : ''}
        >
          <List className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ManuscriptToolbar;