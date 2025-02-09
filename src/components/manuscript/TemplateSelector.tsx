
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Check } from 'lucide-react';

export type ChapterTemplate = {
  id: string;
  name: string;
  font: string;
  preview: string;
};

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
}

const templates: ChapterTemplate[] = [
  {
    id: 'reedsy',
    name: 'Authorify',
    font: 'Merriweather',
    preview: '1'
  },
  {
    id: 'classic',
    name: 'Classic',
    font: 'Crimson',
    preview: '2'
  },
  {
    id: 'romance',
    name: 'Romance',
    font: 'Crimson',
    preview: '3'
  }
];

const TemplateSelector = ({ selectedTemplate, onTemplateSelect }: TemplateSelectorProps) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Choose a template</h2>
      <p className="text-gray-600 mb-6">
        How would you like us to typeset your book? Choose from a range of themes crafted by professional designers.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer relative transition-all ${
              selectedTemplate === template.id
                ? 'ring-2 ring-primary'
                : 'hover:shadow-lg'
            }`}
            onClick={() => onTemplateSelect(template.id)}
          >
            <CardContent className="p-6 text-center">
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-tr">
                  <Check className="h-4 w-4" />
                </div>
              )}
              <div className="text-4xl text-gray-400 mb-4">{template.preview}</div>
              <h3 className="font-semibold text-lg">{template.name}</h3>
              <p className="text-gray-500">{template.font}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
