
import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { standardPaperSizes, type MarginSettings } from '@/types/paper';

interface PageFormatControlsProps {
  margins: MarginSettings;
  onMarginChange: (key: keyof MarginSettings, value: number) => void;
  selectedPaperSize: string;
  onPaperSizeChange: (size: string) => void;
}

const PageFormatControls = ({
  margins,
  onMarginChange,
  selectedPaperSize,
  onPaperSizeChange
}: PageFormatControlsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Paper Size</Label>
        <Select value={selectedPaperSize} onValueChange={onPaperSizeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Standard Sizes</SelectLabel>
              {Object.values(standardPaperSizes).map((size) => (
                <SelectItem key={size.name} value={size.name}>
                  {size.displayName}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="top-margin">Top Margin (in)</Label>
          <Input
            id="top-margin"
            type="number"
            min="0.25"
            max="3"
            step="0.125"
            value={margins.top}
            onChange={(e) => onMarginChange('top', parseFloat(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="right-margin">Right Margin (in)</Label>
          <Input
            id="right-margin"
            type="number"
            min="0.25"
            max="3"
            step="0.125"
            value={margins.right}
            onChange={(e) => onMarginChange('right', parseFloat(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="bottom-margin">Bottom Margin (in)</Label>
          <Input
            id="bottom-margin"
            type="number"
            min="0.25"
            max="3"
            step="0.125"
            value={margins.bottom}
            onChange={(e) => onMarginChange('bottom', parseFloat(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="left-margin">Left Margin (in)</Label>
          <Input
            id="left-margin"
            type="number"
            min="0.25"
            max="3"
            step="0.125"
            value={margins.left}
            onChange={(e) => onMarginChange('left', parseFloat(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="gutter">Gutter (in)</Label>
          <Input
            id="gutter"
            type="number"
            min="0"
            max="1"
            step="0.125"
            value={margins.gutter}
            onChange={(e) => onMarginChange('gutter', parseFloat(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="header-distance">Header Distance (in)</Label>
          <Input
            id="header-distance"
            type="number"
            min="0"
            max="1"
            step="0.125"
            value={margins.headerDistance}
            onChange={(e) => onMarginChange('headerDistance', parseFloat(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="footer-distance">Footer Distance (in)</Label>
          <Input
            id="footer-distance"
            type="number"
            min="0"
            max="1"
            step="0.125"
            value={margins.footerDistance}
            onChange={(e) => onMarginChange('footerDistance', parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default PageFormatControls;
