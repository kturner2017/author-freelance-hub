
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { ChevronDown, ChevronRight, FileText } from 'lucide-react';
import { Button } from '../ui/button';

interface FrontMatterOption {
  id: string;
  title: string;
  enabled: boolean;
}

interface FrontMatterSectionProps {
  expanded: boolean;
  options: FrontMatterOption[];
  onToggleExpand: () => void;
  onOptionToggle: (id: string) => void;
}

const FrontMatterSection = ({
  expanded,
  options,
  onToggleExpand,
  onOptionToggle,
}: FrontMatterSectionProps) => {
  return (
    <div className="space-y-1">
      <Button 
        variant="ghost" 
        className="w-full justify-start text-gray-300 hover:bg-gray-700 active:bg-gray-600 transition-colors duration-200 py-1 h-auto"
        onClick={onToggleExpand}
      >
        <div className="flex items-center">
          {expanded ? (
            <ChevronDown className="h-4 w-4 mr-2" />
          ) : (
            <ChevronRight className="h-4 w-4 mr-2" />
          )}
          Front Matter
        </div>
      </Button>
      
      {expanded && (
        <div className="space-y-1 ml-4">
          {options.map((option) => (
            <div
              key={option.id}
              className="flex items-center justify-between px-2 py-1 text-sm text-gray-300 hover:bg-gray-700 rounded-sm"
            >
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-gray-400" />
                <span>{option.title}</span>
              </div>
              <Switch
                checked={option.enabled}
                onCheckedChange={() => onOptionToggle(option.id)}
                className="data-[state=checked]:bg-blue-500"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FrontMatterSection;
