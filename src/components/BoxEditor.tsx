import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useToast } from './ui/use-toast';
import { Save } from 'lucide-react';
import FileUploader from './FileUploader';
import AttributeList from './box/AttributeList';

interface Attribute {
  name: string;
  value: string;
}

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
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setLocalTitle(title);
    setLocalContent(content);
    
    try {
      const contentObj = JSON.parse(content);
      if (contentObj.attributes) {
        setAttributes(contentObj.attributes);
      }
    } catch {
      console.log('Content is plain text');
    }
  }, [title, content]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTitle(e.target.value);
    onTitleChange(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setLocalContent(newContent);
    onContentChange(newContent);
  };

  const handleAttributeChange = (index: number, field: 'name' | 'value', value: string) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
    
    const contentObj = {
      text: localContent,
      attributes: newAttributes
    };
    onContentChange(JSON.stringify(contentObj));
  };

  const handleRemoveAttribute = (index: number) => {
    const newAttributes = attributes.filter((_, i) => i !== index);
    setAttributes(newAttributes);
    
    const contentObj = {
      text: localContent,
      attributes: newAttributes
    };
    onContentChange(JSON.stringify(contentObj));
  };

  const handleAddAttribute = () => {
    setAttributes([...attributes, { name: '', value: '' }]);
  };

  const handleSave = () => {
    const contentObj = {
      text: localContent,
      attributes: attributes
    };
    onContentChange(JSON.stringify(contentObj));
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

          <div>
            <Label htmlFor="content">Description</Label>
            <Textarea
              id="content"
              value={localContent}
              onChange={handleContentChange}
              className="mt-1 min-h-[100px]"
              placeholder="Enter character description..."
            />
          </div>

          <div className="space-y-4">
            <Label>Files</Label>
            <FileUploader boxId={title} />
          </div>

          <div className="space-y-4">
            <Label>Character Attributes</Label>
            <AttributeList
              attributes={attributes}
              onAttributeChange={handleAttributeChange}
              onRemoveAttribute={handleRemoveAttribute}
              onAddAttribute={handleAddAttribute}
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