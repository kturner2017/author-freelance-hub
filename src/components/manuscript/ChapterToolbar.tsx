
import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { BookOpen } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface ChapterToolbarProps {
  totalWordCount: number;
  onSave: () => void;
  onAddChapter: () => void;
}

const ChapterToolbar = ({ 
  totalWordCount, 
  onSave, 
  onAddChapter
}: ChapterToolbarProps) => {
  const navigate = useNavigate();
  const { bookId } = useParams();

  const handleSwitchView = () => {
    navigate(`/editor/manuscript/${bookId}/boxes`);
  };

  return (
    <div className="flex items-center gap-4">
      <Badge variant="secondary" className="text-sm bg-white/10 text-white border-0">
        <BookOpen className="h-4 w-4 mr-1" />
        Total Words: {totalWordCount.toLocaleString()}
      </Badge>
      <Button 
        size="sm"
        onClick={onSave}
        variant="secondary"
        className="font-medium"
      >
        Save Changes
      </Button>
      <Button 
        size="sm"
        onClick={onAddChapter}
        variant="secondary"
        className="font-medium"
      >
        Add Chapter
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleSwitchView}
        className="border-white text-white hover:bg-white/10 font-medium"
      >
        Switch to Boxes View
      </Button>
    </div>
  );
};

export default ChapterToolbar;

