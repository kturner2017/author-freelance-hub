
import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { ScrollArea } from '../../ui/scroll-area';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { History, Check, X } from 'lucide-react';

interface VersionItem {
  id: string;
  timestamp: Date;
  description: string;
}

interface VersionHistoryPanelProps {
  versions: VersionItem[];
  onRestoreVersion: (id: string) => boolean;
  onAddVersion: (description: string) => string;
  onClose: () => void;
}

const VersionHistoryPanel = ({ 
  versions, 
  onRestoreVersion, 
  onAddVersion, 
  onClose 
}: VersionHistoryPanelProps) => {
  const [newVersionName, setNewVersionName] = React.useState('');
  
  const handleAddVersion = () => {
    const description = newVersionName.trim() || 'Manual save';
    const id = onAddVersion(description);
    setNewVersionName('');
    toast.success('Version saved');
  };
  
  const handleRestoreVersion = (id: string) => {
    const success = onRestoreVersion(id);
    if (success) {
      toast.success('Version restored');
    } else {
      toast.error('Failed to restore version');
    }
  };
  
  return (
    <Card className="w-80 shadow-md fixed right-4 top-24 z-50 border border-gray-300">
      <CardHeader className="bg-gray-100 py-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <History className="h-4 w-4" />
            Version History
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newVersionName}
            onChange={(e) => setNewVersionName(e.target.value)}
            placeholder="Version name (optional)"
            className="flex-1 px-2 py-1 text-sm border rounded"
          />
          <Button 
            size="sm" 
            onClick={handleAddVersion}
            className="text-xs py-1"
          >
            Save
          </Button>
        </div>
        
        <ScrollArea className="h-64 pr-2">
          {versions.length === 0 ? (
            <div className="text-center text-gray-500 py-4">No saved versions yet</div>
          ) : (
            <div className="space-y-2">
              {versions.map((version) => (
                <div 
                  key={version.id} 
                  className="p-2 border rounded bg-white hover:bg-gray-50 text-sm"
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{version.description}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRestoreVersion(version.id)}
                      className="h-5 w-5"
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(version.timestamp, 'MMM d, h:mm a')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default VersionHistoryPanel;
