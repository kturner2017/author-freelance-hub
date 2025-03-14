
import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { BookOpen, Home, ArrowLeft, LayoutDashboard, Plus, TableOfContents, Save } from 'lucide-react';
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

  return (
    <div className="flex items-center gap-4 h-16 border-b px-6 justify-between bg-white text-[#0F172A] shadow-sm">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/editor')}
          className="hover:bg-gray-100 text-[#0F172A]"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/')}
          className="hover:bg-gray-100 text-[#0F172A]"
        >
          <Home className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-lg font-serif font-bold leading-tight text-[#0F172A]">Manuscript Editor</h2>
          <p className="text-sm text-[#1E293B] leading-tight">Document View</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Badge variant="outline" className="text-sm bg-gray-50 text-[#0F172A] border border-gray-200">
          <BookOpen className="h-4 w-4 mr-1" />
          Total Words: {totalWordCount.toLocaleString()}
        </Badge>
        
        <TubelightNavbar items={viewItems} className="static transform-none mx-4 mb-0 sm:pt-0" />
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="bg-white text-[#0F172A] border border-gray-200 hover:bg-gray-50"
            onClick={onSave}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
          
          <Button 
            variant="default" 
            className="bg-[#0F172A] hover:bg-[#1E293B] text-white"
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
            className="bg-white text-[#0F172A] border border-gray-200 hover:bg-gray-50"
            onClick={onAddAct}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Act
          </Button>
          
          <Button 
            variant="outline"
            className="bg-white text-[#0F172A] border border-gray-200 hover:bg-gray-50"
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
