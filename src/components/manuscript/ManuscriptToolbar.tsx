
import React from 'react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { useNavigate } from 'react-router-dom';
import { TubelightNavbar } from '../ui/tubelight-navbar';
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

  const menuItems = [
    {
      name: 'Boxes',
      url: '#',
      icon: LayoutDashboard,
      onClick: () => onViewChange('boxes')
    },
    {
      name: 'Document',
      url: '#',
      icon: BookOpen,
      onClick: () => onViewChange('document')
    }
  ];

  const actionItems = [
    {
      name: 'Save',
      url: '#',
      icon: Save,
      onClick: onSave
    },
    {
      name: 'Add Act',
      url: '#',
      icon: Plus,
      onClick: onAddAct
    }
  ];

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
          <h2 className="text-lg font-semibold leading-tight">Manuscript Editor</h2>
          <p className="text-sm text-gray-300 leading-tight">{editorView === 'boxes' ? 'Box View' : 'Document View'}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <TubelightNavbar items={menuItems} className="static transform-none mx-4 mb-0 sm:pt-0" />
        <TubelightNavbar items={actionItems} className="static transform-none mx-4 mb-0 sm:pt-0" />

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
