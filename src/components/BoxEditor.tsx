import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useToast } from './ui/use-toast';
import { 
  Save, 
  Plus, 
  Trash,
  User,
  Heart,
  Brain,
  Shield,
  Sword,
  Star,
  Target,
  Flame,
  Glasses,
  HandMetal,
  Crown,
  Laugh,
  Frown,
  Footprints,
  Hammer,
  Palette,
  Music,
  BookOpen,
  Coins,
  HeartCrack,
  Lightbulb,
  Compass
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

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

  const attributeTypes = [
    { name: 'Physical Appearance', icon: User },
    { name: 'Personality Core', icon: Heart },
    { name: 'Intelligence', icon: Brain },
    { name: 'Defense Mechanism', icon: Shield },
    { name: 'Combat Style', icon: Sword },
    { name: 'Special Ability', icon: Star },
    { name: 'Life Goal', icon: Target },
    { name: 'Passion', icon: Flame },
    { name: 'Knowledge', icon: Glasses },
    { name: 'Skill', icon: HandMetal },
    { name: 'Status', icon: Crown },
    { name: 'Humor', icon: Laugh },
    { name: 'Fear', icon: Frown },
    { name: 'Movement Style', icon: Footprints },
    { name: 'Craft', icon: Hammer },
    { name: 'Artistic Ability', icon: Palette },
    { name: 'Musical Talent', icon: Music },
    { name: 'Education', icon: BookOpen },
    { name: 'Wealth', icon: Coins },
    { name: 'Emotional Wound', icon: HeartCrack },
    { name: 'Innovation', icon: Lightbulb },
    { name: 'Moral Compass', icon: Compass },
    { name: 'Background', icon: User },
    { name: 'Relationship', icon: Heart },
    { name: 'Occupation', icon: Brain }
  ];

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

  const handleAddAttribute = () => {
    setAttributes([...attributes, { name: '', value: '' }]);
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

  const getIconForAttribute = (attributeName: string) => {
    const attribute = attributeTypes.find(type => type.name === attributeName);
    return attribute?.icon || User;
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
            <div className="flex justify-between items-center">
              <Label>Character Attributes</Label>
              <Button 
                onClick={handleAddAttribute}
                variant="outline"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Attribute
              </Button>
            </div>

            {attributes.map((attribute, index) => {
              const IconComponent = getIconForAttribute(attribute.name);
              return (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <Select
                      value={attribute.name}
                      onValueChange={(value) => handleAttributeChange(index, 'name', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select attribute type">
                          {attribute.name && (
                            <div className="flex items-center">
                              <IconComponent className="w-4 h-4 mr-2" />
                              {attribute.name}
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {attributeTypes.map((type) => (
                          <SelectItem key={type.name} value={type.name}>
                            <div className="flex items-center">
                              <type.icon className="w-4 h-4 mr-2" />
                              {type.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Input
                      value={attribute.value}
                      onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                      placeholder="Attribute value"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveAttribute(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
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