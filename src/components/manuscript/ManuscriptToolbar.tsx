
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

  const handleViewChange = (view: 'boxes' | 'document') => {
    if (view === 'document') {
      const pathParts = window.location.pathname.split('/');
      const bookId = pathParts[3];
      navigate(`/editor/manuscript/${bookId}/chapters`);
    } else {
      onViewChange(view);
    }
  };

  return (
    <div className="h-16 border-b flex items-center px-4 justify-between bg-[#0F172A] text-white">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onBack}
          className="hover:bg-white/10 text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/')}
          className="hover:bg-white/10 text-white"
        >
          <Home className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold leading-tight">Box View</h2>
          <p className="text-sm text-gray-300 leading-tight">{bookData.title}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-white/20 rounded-lg p-1 mr-4">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-2 text-white hover:bg-white/20 ${editorView === 'boxes' ? 'bg-white/10' : ''}`}
            onClick={() => handleViewChange('boxes')}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Boxes</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-2 text-white hover:bg-white/20 ${editorView === 'document' ? 'bg-white/10' : ''}`}
            onClick={() => handleViewChange('document')}
          >
            <BookOpen className="h-4 w-4" />
            <span>Document</span>
          </Button>
        </div>

        <Button 
          variant="default"
          onClick={onSave}
          className="bg-white text-[#0F172A] hover:bg-gray-100 transition-colors"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
        <Button 
          variant="default"
          onClick={onAddAct}
          className="bg-white text-[#0F172A] hover:bg-gray-100 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Act
        </Button>

        <Separator orientation="vertical" className="h-6 bg-white/20" />
        
        <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white">
          <Copy className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white">
          <Trash2 className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white">
          <CheckSquare className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white">
          <Settings className="h-5 w-5" />
        </Button>
        
        <Separator orientation="vertical" className="h-6 bg-white/20" />
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onViewModeChange('grid')}
          className={`hover:bg-white/10 text-white ${viewMode === 'grid' ? 'bg-white/10' : ''}`}
        >
          <LayoutGrid className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onViewModeChange('list')}
          className={`hover:bg-white/10 text-white ${viewMode === 'list' ? 'bg-white/10' : ''}`}
        >
          <List className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ManuscriptToolbar;
