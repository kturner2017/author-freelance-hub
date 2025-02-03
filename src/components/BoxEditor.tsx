import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { ImagePlus, Plus } from 'lucide-react';

interface BoxEditorProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
}

const BoxEditor = ({ title, content, onTitleChange, onContentChange }: BoxEditorProps) => {
  const handleImageUpload = () => {
    console.log('Image upload clicked');
    // Implement image upload logic here
  };

  const handleAddAttribute = () => {
    console.log('Add attribute clicked');
    // Implement add attribute logic here
  };

  const handleAddGroup = () => {
    console.log('Add group clicked');
    // Implement add group logic here
  };

  return (
    <div className="space-y-6">
      <Input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="text-2xl font-bold border-none px-0 focus-visible:ring-0"
        placeholder="Enter title..."
      />

      <div className="flex gap-4">
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className="w-full min-h-[100px] text-base border rounded-md p-3 resize-none"
            placeholder="Enter description..."
          />

          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={handleAddAttribute}>
              <Plus className="h-4 w-4 mr-1" />
              Add attribute
            </Button>
            <Button variant="outline" size="sm" onClick={handleAddGroup}>
              <Plus className="h-4 w-4 mr-1" />
              Add group
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            <Card className="p-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">📍</span>
                <Input 
                  placeholder="Point of view" 
                  className="bg-gray-50"
                />
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">⚡</span>
                <Input 
                  placeholder="Superpowers" 
                  className="bg-gray-50"
                />
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">👑</span>
                <Input 
                  placeholder="Leader" 
                  className="bg-gray-50"
                />
              </div>
            </Card>
          </div>
        </div>

        <div className="w-64">
          <Button 
            variant="outline" 
            className="w-full h-32 border-dashed"
            onClick={handleImageUpload}
          >
            <div className="flex flex-col items-center gap-2">
              <ImagePlus className="h-6 w-6" />
              <span>Add Image</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BoxEditor;