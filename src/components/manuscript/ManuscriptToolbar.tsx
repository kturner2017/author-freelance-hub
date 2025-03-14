
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
    <div className="h-16 border-b flex items-center px-6 justify-between bg-white text-[#0F172A] shadow-sm">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onBack}
          className="hover:bg-gray-100 text-[#0F172A]"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/')}
          className="hover:bg-gray-100 text-[#0F172A]"
          aria-label="Home"
        >
          <Home className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-lg font-serif font-bold leading-tight text-[#0F172A]">Manuscript Editor</h2>
          <p className="text-sm text-[#1E293B] font-medium leading-tight">
            {editorView === 'boxes' ? 'Box View' : 'Document View'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost"
            size="sm"
            onClick={() => onViewChange('boxes')}
            className={`font-medium ${editorView === 'boxes' 
              ? 'bg-gray-100 text-[#0F172A]' 
              : 'bg-gray-50 hover:bg-gray-100 text-[#0F172A]'
            } border border-gray-200`}
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Boxes
          </Button>
          
          <Button 
            variant="ghost"
            size="sm"
            onClick={() => onViewChange('document')}
            className={`font-medium ${editorView === 'document' 
              ? 'bg-gray-100 text-[#0F172A]' 
              : 'bg-gray-50 hover:bg-gray-100 text-[#0F172A]'
            } border border-gray-200`}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Document
          </Button>
        </div>

        <div className="flex items-center gap-2 ml-2">
          <Button 
            variant="outline"
            className="bg-white text-[#0F172A] border border-gray-200 hover:bg-gray-50 font-medium"
            onClick={onSave}
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          
          <Button 
            variant="outline"
            className="bg-white text-[#0F172A] border border-gray-200 hover:bg-gray-50 font-medium"
            onClick={onAddAct}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Act
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 bg-gray-200" />
        
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="hover:bg-gray-100 text-[#0F172A]" aria-label="Copy">
            <Copy className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-gray-100 text-[#0F172A]" aria-label="Delete">
            <Trash2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-gray-100 text-[#0F172A]" aria-label="Select">
            <CheckSquare className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-gray-100 text-[#0F172A]" aria-label="Settings">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
        
        <Separator orientation="vertical" className="h-6 bg-gray-200" />
        
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onViewModeChange('grid')}
            className={`hover:bg-gray-100 text-[#0F172A] ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onViewModeChange('list')}
            className={`hover:bg-gray-100 text-[#0F172A] ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
            aria-label="List view"
          >
            <List className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManuscriptToolbar;
