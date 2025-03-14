
import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { BookOpen, Home, ArrowLeft, LayoutDashboard, Plus, TableOfContents, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface ChapterToolbarProps {
  totalWordCount: number;
  onSave: () => void;
  onAddChapter: () => Promise<any>;
  onAddAct: () => void;
  onGenerateTOC: () => void;
}

const ChapterToolbar = ({ 
  totalWordCount, 
  onSave, 
  onAddChapter,
  onAddAct,
  onGenerateTOC
}: ChapterToolbarProps) => {
  const navigate = useNavigate();
  const { bookId } = useParams();

  return (
    <div className="flex items-center gap-4 h-16 border-b px-6 justify-between bg-white text-[#0F172A] shadow-sm">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/editor')}
          className="hover:bg-gray-100 text-[#0F172A]"
          aria-label="Back to editor"
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
          <p className="text-sm text-[#1E293B] font-medium leading-tight">Document View</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Badge variant="outline" className="text-sm bg-gray-50 text-[#0F172A] border border-gray-200 font-medium py-1.5">
          <BookOpen className="h-4 w-4 mr-1.5" />
          Total Words: {totalWordCount.toLocaleString()}
        </Badge>
        
        <div className="flex items-center gap-2 ml-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(`/editor/manuscript/${bookId}/chapters`)}
            className="bg-gray-50 hover:bg-gray-100 text-[#0F172A] border border-gray-200 font-medium"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Document
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(`/editor/manuscript/${bookId}/boxes`)}
            className="bg-gray-50 hover:bg-gray-100 text-[#0F172A] border border-gray-200 font-medium"
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Boxes
          </Button>
        </div>
        
        <div className="flex items-center gap-2 ml-2">
          <Button 
            variant="outline" 
            className="bg-white text-[#0F172A] border border-gray-200 hover:bg-gray-50 font-medium"
            onClick={onSave}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
          
          <Button 
            variant="default" 
            className="bg-[#0F172A] hover:bg-[#1E293B] text-white font-medium"
            onClick={async () => {
              console.log('Add Chapter clicked');
              await onAddChapter();
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Chapter
          </Button>
          
          <Button 
            variant="outline"
            className="bg-white text-[#0F172A] border border-gray-200 hover:bg-gray-50 font-medium"
            onClick={onAddAct}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Act
          </Button>
          
          <Button 
            variant="outline"
            className="bg-white text-[#0F172A] border border-gray-200 hover:bg-gray-50 font-medium"
            onClick={onGenerateTOC}
          >
            <TableOfContents className="h-4 w-4 mr-2" />
            Generate TOC
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChapterToolbar;
