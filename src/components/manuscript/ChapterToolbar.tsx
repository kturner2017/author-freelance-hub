
import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { BookOpen, Home, ArrowLeft, LayoutDashboard, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface ChapterToolbarProps {
  totalWordCount: number;
  onSave: () => void;
  onAddChapter: () => void;
  onAddAct: () => void;
}

const ChapterToolbar = ({ 
  totalWordCount, 
  onSave, 
  onAddChapter,
  onAddAct
}: ChapterToolbarProps) => {
  const navigate = useNavigate();
  const { bookId } = useParams();

  return (
    <div className="flex items-center gap-4 h-16 border-b px-4 justify-between bg-[#0F172A] text-white">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/editor')}
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
          <p className="text-sm text-gray-300 leading-tight">Document View</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Badge variant="secondary" className="text-sm bg-white/10 text-white border-0">
          <BookOpen className="h-4 w-4 mr-1" />
          Total Words: {totalWordCount.toLocaleString()}
        </Badge>
        
        <div className="flex items-center gap-2 border border-white/20 rounded-lg p-1">
          <Button 
            variant="ghost"
            size="sm"
            className="text-white bg-white/10 hover:bg-white/20"
            onClick={() => navigate(`/editor/manuscript/${bookId}/chapters`)}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Document
          </Button>
          <Button 
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={() => navigate(`/editor/manuscript/${bookId}/boxes`)}
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Boxes
          </Button>
        </div>

        <Button 
          size="sm"
          onClick={onSave}
          className="bg-white text-[#0F172A] hover:bg-gray-100 transition-colors"
        >
          Save Changes
        </Button>
        <Button 
          size="sm"
          onClick={onAddChapter}
          className="bg-white text-[#0F172A] hover:bg-gray-100 transition-colors"
        >
          Add Chapter
        </Button>
        <Button 
          size="sm"
          onClick={onAddAct}
          className="bg-white text-[#0F172A] hover:bg-gray-100 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Act
        </Button>
      </div>
    </div>
  );
};

export default ChapterToolbar;

