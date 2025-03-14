
import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { BookOpen, Home, ArrowLeft, LayoutDashboard, Plus, TableOfContents } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { TubelightNavbar } from '../ui/tubelight-navbar';

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

  const viewItems = [
    {
      name: 'Document',
      url: `/editor/manuscript/${bookId}/chapters`,
      icon: BookOpen,
    },
    {
      name: 'Boxes',
      url: `/editor/manuscript/${bookId}/boxes`,
      icon: LayoutDashboard,
    }
  ];

  const actionItems = [
    {
      name: 'Save Changes',
      url: '#',
      icon: BookOpen,
      onClick: onSave
    },
    {
      name: 'Add Chapter',
      url: '#',
      icon: Plus,
      onClick: async () => {
        console.log('Add Chapter clicked');
        await onAddChapter();
      }
    },
    {
      name: 'Add Act',
      url: '#',
      icon: Plus,
      onClick: onAddAct
    },
    {
      name: 'Generate TOC',
      url: '#',
      icon: TableOfContents,
      onClick: onGenerateTOC
    }
  ];

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
        
        <TubelightNavbar items={viewItems} className="static transform-none mx-4 mb-0 sm:pt-0" />
        <TubelightNavbar items={actionItems} className="static transform-none mx-4 mb-0 sm:pt-0" />
      </div>
    </div>
  );
};

export default ChapterToolbar;
