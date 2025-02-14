
export interface PaperSize {
  name: string;
  displayName: string;
  width: number;
  height: number;
  unit: 'in' | 'mm';
}

export interface MarginSettings {
  top: number;
  right: number;
  bottom: number;
  left: number;
  gutter: number;
  headerDistance: number;
  footerDistance: number;
}

export const standardPaperSizes: { [key: string]: PaperSize } = {
  '6x9': {
    name: '6x9',
    displayName: '6 × 9 inches',
    width: 6,
    height: 9,
    unit: 'in'
  },
  '8.5x11': {
    name: '8.5x11',
    displayName: '8.5 × 11 inches',
    width: 8.5,
    height: 11,
    unit: 'in'
  },
  'epub': {
    name: 'epub',
    displayName: 'ePub format',
    width: 150,
    height: 200,
    unit: 'mm'
  }
};
