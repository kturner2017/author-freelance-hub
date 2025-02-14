
import React from 'react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface MarginControlsProps {
  margins: Margins;
  onMarginChange: (side: keyof Margins, value: string) => void;
}

const MarginControls = ({ margins, onMarginChange }: MarginControlsProps) => {
  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      <div>
        <Label htmlFor="top-margin">Top Margin (inches)</Label>
        <Input
          id="top-margin"
          type="number"
          min="0"
          max="3"
          step="0.25"
          value={margins.top}
          onChange={(e) => onMarginChange('top', e.target.value)}
          className="border-primary-200"
        />
      </div>
      <div>
        <Label htmlFor="right-margin">Right Margin (inches)</Label>
        <Input
          id="right-margin"
          type="number"
          min="0"
          max="3"
          step="0.25"
          value={margins.right}
          onChange={(e) => onMarginChange('right', e.target.value)}
          className="border-primary-200"
        />
      </div>
      <div>
        <Label htmlFor="bottom-margin">Bottom Margin (inches)</Label>
        <Input
          id="bottom-margin"
          type="number"
          min="0"
          max="3"
          step="0.25"
          value={margins.bottom}
          onChange={(e) => onMarginChange('bottom', e.target.value)}
          className="border-primary-200"
        />
      </div>
      <div>
        <Label htmlFor="left-margin">Left Margin (inches)</Label>
        <Input
          id="left-margin"
          type="number"
          min="0"
          max="3"
          step="0.25"
          value={margins.left}
          onChange={(e) => onMarginChange('left', e.target.value)}
          className="border-primary-200"
        />
      </div>
    </div>
  );
};

export default MarginControls;
