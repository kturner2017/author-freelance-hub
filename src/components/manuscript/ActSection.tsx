
import React from 'react';
import { Button } from '../ui/button';
import { ChevronDown, ChevronRight, Folder, File } from 'lucide-react';

interface Box {
  id: string;
  title: string;
  content: string;
  act: 'act1' | 'act2' | 'act3';
}

interface ActSectionProps {
  act: 'act1' | 'act2';
  expanded: boolean;
  boxes: Box[];
  onSectionToggle: () => void;
  onBoxSelect: (box: Box) => void;
}

const ActSection = ({
  act,
  expanded,
  boxes,
  onSectionToggle,
  onBoxSelect,
}: ActSectionProps) => {
  return (
    <div>
      <Button 
        variant="ghost" 
        className="w-full justify-start text-gray-300 hover:bg-gray-700 active:bg-gray-600 transition-colors duration-200 py-1 h-auto"
        onClick={onSectionToggle}
      >
        <div className="flex items-center">
          {expanded ? (
            <ChevronDown className="h-4 w-4 mr-2" />
          ) : (
            <ChevronRight className="h-4 w-4 mr-2" />
          )}
          <Folder className="h-4 w-4 mr-2" />
          Act {act === 'act1' ? 'I' : 'II'}
        </div>
      </Button>
      {expanded && (
        <div className="ml-4 space-y-1">
          {boxes.map(box => (
            <Button 
              key={box.id}
              variant="ghost" 
              className="w-full justify-start text-sm text-gray-400 hover:bg-gray-700 py-1 h-auto"
              onClick={() => onBoxSelect(box)}
            >
              <File className="h-4 w-4 mr-2" />
              {box.title}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActSection;
