import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '../../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Superscript, 
  Subscript, 
  Palette, 
  Type, 
  TextQuote,
  AlignJustify 
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
import { cn } from '@/lib/utils';

interface AdvancedFormattingButtonsProps {
  editor: Editor;
}

const fontFamilies = [
  { name: 'Default', value: '' },
  { name: 'Serif', value: 'serif' },
  { name: 'Sans-serif', value: 'sans-serif' },
  { name: 'Monospace', value: 'monospace' },
  { name: 'Cursive', value: 'cursive' },
  { name: 'Fantasy', value: 'fantasy' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Times', value: '"Times New Roman", Times, serif' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'Courier', value: '"Courier New", Courier, monospace' },
];

const colorPresets = [
  { name: 'Default', value: 'inherit' },
  { name: 'Black', value: '#000000' },
  { name: 'Gray', value: '#6b7280' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Lime', value: '#84cc16' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Sky', value: '#0ea5e9' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Fuchsia', value: '#d946ef' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Rose', value: '#f43f5e' },
];

const highlightColors = [
  { name: 'Default', value: 'inherit' },
  { name: 'Yellow', value: '#fef08a' },
  { name: 'Lime', value: '#d9f99d' },
  { name: 'Cyan', value: '#a5f3fc' },
  { name: 'Violet', value: '#ddd6fe' },
  { name: 'Pink', value: '#fbcfe8' },
  { name: 'Red', value: '#fecaca' },
  { name: 'Orange', value: '#fed7aa' },
  { name: 'Green', value: '#bbf7d0' },
  { name: 'Blue', value: '#bfdbfe' },
];

const AdvancedFormattingButtons = ({ editor }: AdvancedFormattingButtonsProps) => {
  const [customColor, setCustomColor] = useState('#000000');
  const [customHighlightColor, setCustomHighlightColor] = useState('#FFFF00');

  const applyFontFamily = (fontFamily: string) => {
    if (fontFamily === '') {
      editor.chain().focus().unsetFontFamily().run();
    } else {
      editor.chain().focus().setFontFamily(fontFamily).run();
    }
  };

  const applyTextColor = (color: string) => {
    if (color === 'inherit') {
      editor.chain().focus().unsetColor().run();
    } else {
      editor.chain().focus().setColor(color).run();
    }
  };

  const applyHighlightColor = (color: string) => {
    if (color === 'inherit') {
      editor.chain().focus().unsetHighlight().run();
    } else {
      editor.chain().focus().setHighlight({ color }).run();
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              className={cn(
                'h-8 w-8 p-0',
                editor.isActive('superscript') && 'bg-muted'
              )}
            >
              <Superscript className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Superscript</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              className={cn(
                'h-8 w-8 p-0',
                editor.isActive('subscript') && 'bg-muted'
              )}
            >
              <Subscript className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Subscript</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              className={cn(
                'h-8 w-8 p-0',
                editor.isActive({ textAlign: 'justify' }) && 'bg-muted'
              )}
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Justify text</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Popover>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Palette className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Colors</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <PopoverContent className="w-64 p-2">
          <Tabs defaultValue="text">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="text">Text Color</TabsTrigger>
              <TabsTrigger value="highlight">Highlight</TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="space-y-2">
              <div className="grid grid-cols-5 gap-1 mb-2">
                {colorPresets.map((color) => (
                  <button
                    key={color.value}
                    className="w-full h-6 rounded border border-gray-200 cursor-pointer transition-transform hover:scale-110"
                    style={{ 
                      backgroundColor: color.value === 'inherit' ? 'transparent' : color.value,
                      border: color.value === 'inherit' ? '1px dashed #ccc' : '1px solid #e5e7eb' 
                    }}
                    onClick={() => applyTextColor(color.value)}
                    title={color.name}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-10 h-8 cursor-pointer"
                />
                <Button 
                  size="sm"
                  variant="secondary" 
                  onClick={() => applyTextColor(customColor)}
                  className="flex-1"
                >
                  Apply Custom Color
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="highlight" className="space-y-2">
              <div className="grid grid-cols-5 gap-1 mb-2">
                {highlightColors.map((color) => (
                  <button
                    key={color.value}
                    className="w-full h-6 rounded border border-gray-200 cursor-pointer transition-transform hover:scale-110"
                    style={{ 
                      backgroundColor: color.value === 'inherit' ? 'transparent' : color.value,
                      border: color.value === 'inherit' ? '1px dashed #ccc' : '1px solid #e5e7eb' 
                    }}
                    onClick={() => applyHighlightColor(color.value)}
                    title={color.name}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="color"
                  value={customHighlightColor}
                  onChange={(e) => setCustomHighlightColor(e.target.value)}
                  className="w-10 h-8 cursor-pointer"
                />
                <Button 
                  size="sm"
                  variant="secondary" 
                  onClick={() => applyHighlightColor(customHighlightColor)}
                  className="flex-1"
                >
                  Apply Custom Highlight
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>

      <Popover>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Type className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Font Family</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <PopoverContent className="w-48 p-0">
          <div className="max-h-80 overflow-y-auto p-1">
            {fontFamilies.map((font) => (
              <Button
                key={font.value}
                variant="ghost"
                size="sm"
                onClick={() => applyFontFamily(font.value)}
                className="w-full justify-start mb-1 h-auto py-2"
                style={{ fontFamily: font.value || 'inherit' }}
              >
                {font.name}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default AdvancedFormattingButtons;
