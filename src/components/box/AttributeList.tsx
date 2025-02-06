import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Trash, Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { attributeTypes } from './attributeTypes';

interface Attribute {
  name: string;
  value: string;
}

interface AttributeListProps {
  attributes: Attribute[];
  onAttributeChange: (index: number, field: 'name' | 'value', value: string) => void;
  onRemoveAttribute: (index: number) => void;
  onAddAttribute: () => void;
}

const AttributeList = ({
  attributes,
  onAttributeChange,
  onRemoveAttribute,
  onAddAttribute
}: AttributeListProps) => {
  const getIconForAttribute = (attributeName: string) => {
    const attribute = attributeTypes.find(type => type.name === attributeName);
    return attribute?.icon;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button 
          onClick={onAddAttribute}
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
                onValueChange={(value) => onAttributeChange(index, 'name', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select attribute type">
                    {attribute.name && IconComponent && (
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
                onChange={(e) => onAttributeChange(index, 'value', e.target.value)}
                placeholder="Attribute value"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveAttribute(index)}
              className="text-red-500 hover:text-red-600"
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default AttributeList;