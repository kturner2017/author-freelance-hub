import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useToast } from './ui/use-toast';
import { Save } from 'lucide-react';
import ReadabilityChart from './ReadabilityChart';
import calculateScores from '@/utils/readabilityScores';

interface BoxEditorProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
}

const BoxEditor = ({ 
  title, 
  content, 
  onTitleChange, 
  onContentChange 
}: BoxEditorProps) => {
  const [localTitle, setLocalTitle] = useState(title);
  const [localContent, setLocalContent] = useState(content);
  const [readabilityScores, setReadabilityScores] = useState(calculateScores(''));
  const { toast } = useToast();

  useEffect(() => {
    setLocalTitle(title);
    setLocalContent(content);
  }, [title, content]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTitle(e.target.value);
    onTitleChange(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setLocalContent(newContent);
    onContentChange(newContent);
    setReadabilityScores(calculateScores(newContent));
  };

  const handleSave = () => {
    onTitleChange(localTitle);
    onContentChange(localContent);
    toast({
      title: "Changes saved",
      description: "Your box has been updated successfully."
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={localTitle}
              onChange={handleTitleChange}
              className="mt-1"
            />
          </div>

          <ReadabilityChart scores={readabilityScores} />

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={localContent}
              onChange={handleContentChange}
              className="mt-1 min-h-[200px]"
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BoxEditor;