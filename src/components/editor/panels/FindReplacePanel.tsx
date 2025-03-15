
import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Search, ArrowDown, ArrowUp, Check, X } from 'lucide-react';

interface FindReplacePanelProps {
  searchQuery: string;
  replaceText: string;
  matches: number;
  currentMatch: number;
  onSearchChange: (query: string) => void;
  onReplaceChange: (text: string) => void;
  onFind: () => void;
  onFindNext: () => void;
  onFindPrevious: () => void;
  onReplaceOne: () => void;
  onReplaceAll: () => void;
  onClose: () => void;
}

const FindReplacePanel = ({
  searchQuery,
  replaceText,
  matches,
  currentMatch,
  onSearchChange,
  onReplaceChange,
  onFind,
  onFindNext,
  onFindPrevious,
  onReplaceOne,
  onReplaceAll,
  onClose
}: FindReplacePanelProps) => {
  // Use ref to auto-focus search input
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  
  React.useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);
  
  const handleSearchInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        onFindPrevious();
      } else {
        onFindNext();
      }
    }
  };
  
  return (
    <Card className="w-80 shadow-md fixed right-4 top-24 z-50 border border-gray-300">
      <CardHeader className="bg-gray-100 py-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Search className="h-4 w-4" />
            Find & Replace
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={handleSearchInputKeyDown}
                placeholder="Find..."
                className="flex-1 px-2 py-1 text-sm border rounded"
              />
              <Button size="sm" variant="outline" onClick={onFind} className="h-7 px-2">
                <Search className="h-3 w-3" />
              </Button>
            </div>
            
            {matches > 0 && (
              <div className="text-xs text-gray-500 flex justify-between">
                <span>{currentMatch} of {matches} matches</span>
                <div className="flex gap-1">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-5 w-5 p-0" 
                    onClick={onFindPrevious}
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-5 w-5 p-0" 
                    onClick={onFindNext}
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <input
              type="text"
              value={replaceText}
              onChange={(e) => onReplaceChange(e.target.value)}
              placeholder="Replace with..."
              className="w-full px-2 py-1 text-sm border rounded"
            />
            
            <div className="flex gap-2 justify-end">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onReplaceOne}
                className="text-xs py-0 h-7"
                disabled={matches === 0}
              >
                Replace
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onReplaceAll}
                className="text-xs py-0 h-7"
                disabled={matches === 0}
              >
                Replace All
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FindReplacePanel;
