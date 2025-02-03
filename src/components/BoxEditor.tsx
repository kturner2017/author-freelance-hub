import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { ImagePlus, Plus, X, ChevronDown } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface BoxEditorProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
}

interface AttributeWithExplanation {
  attribute: string;
  explanation: string;
}

const PERSONALITY_ATTRIBUTES = [
  { emoji: '😊', label: 'Friendly' },
  { emoji: '🤔', label: 'Analytical' },
  { emoji: '💪', label: 'Determined' },
  { emoji: '🎭', label: 'Dramatic' },
  { emoji: '🦁', label: 'Brave' },
  { emoji: '🎨', label: 'Creative' },
  { emoji: '🤝', label: 'Loyal' },
  { emoji: '🌟', label: 'Charismatic' },
  { emoji: '🧠', label: 'Intelligent' },
  { emoji: '🎯', label: 'Focused' },
  { emoji: '🦋', label: 'Free-spirited' },
  { emoji: '🎭', label: 'Mysterious' },
  { emoji: '⚖️', label: 'Just' },
  { emoji: '🌱', label: 'Nurturing' },
  { emoji: '🔥', label: 'Passionate' },
  { emoji: '🎪', label: 'Entertaining' },
  { emoji: '🎓', label: 'Wise' },
  { emoji: '🌍', label: 'Worldly' },
  { emoji: '🎪', label: 'Adventurous' },
  { emoji: '🎭', label: 'Complex' },
  { emoji: '🌈', label: 'Optimistic' },
  { emoji: '🌙', label: 'Introspective' },
  { emoji: '⚡', label: 'Dynamic' }
];

const BoxEditor = ({ title, content, onTitleChange, onContentChange }: BoxEditorProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<AttributeWithExplanation[]>([]);
  const { toast } = useToast();
  
  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "Error",
            description: "Image size should be less than 5MB",
            variant: "destructive"
          });
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setSelectedImage(result);
          console.log('Image loaded:', result.substring(0, 50) + '...');
        };
        reader.readAsDataURL(file);
      }
    };

    input.click();
  };

  const removeImage = () => {
    setSelectedImage(null);
    console.log('Image removed');
  };

  const handleAddAttribute = () => {
    console.log('Add attribute clicked');
  };

  const handleAttributeSelect = (attribute: string) => {
    if (!selectedAttributes.find(attr => attr.attribute === attribute)) {
      setSelectedAttributes([...selectedAttributes, { attribute, explanation: '' }]);
      console.log('Added attribute:', attribute);
    }
  };

  const handleRemoveAttribute = (attribute: string) => {
    setSelectedAttributes(selectedAttributes.filter(attr => attr.attribute !== attribute));
    console.log('Removed attribute:', attribute);
  };

  const handleExplanationChange = (attribute: string, explanation: string) => {
    setSelectedAttributes(selectedAttributes.map(attr => 
      attr.attribute === attribute ? { ...attr, explanation } : attr
    ));
    console.log('Updated explanation for:', attribute);
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
          <Textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className="w-full min-h-[400px] text-base border rounded-md p-3 resize-vertical leading-relaxed"
            placeholder="Write your story here..."
            style={{ fontFamily: "'Georgia', serif" }}
          />

          <div className="flex gap-2 mt-4">
            <Select onValueChange={handleAttributeSelect}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Add attribute" />
              </SelectTrigger>
              <SelectContent>
                {PERSONALITY_ATTRIBUTES.map((attr) => (
                  <SelectItem key={attr.label} value={attr.label}>
                    <span className="flex items-center gap-2">
                      {attr.emoji} {attr.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 space-y-3">
            {selectedAttributes.map(({ attribute, explanation }) => {
              const attr = PERSONALITY_ATTRIBUTES.find(a => a.label === attribute);
              return (
                <Card key={attribute} className="p-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-sm">{attr?.emoji}</span>
                      <Input 
                        value={attribute}
                        readOnly
                        className="bg-gray-50 w-[150px]"
                      />
                      <Input
                        value={explanation}
                        onChange={(e) => handleExplanationChange(attribute, e.target.value)}
                        placeholder="Explain this attribute..."
                        className="flex-1"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAttribute(attribute)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="w-64">
          {selectedImage ? (
            <div className="relative">
              <img 
                src={selectedImage} 
                alt="Uploaded preview" 
                className="w-full h-32 object-cover rounded-md"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default BoxEditor;