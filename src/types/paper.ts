
export interface PaperSize {
  name: string;
  width: number;
  height: number;
  displayName: string;
  unit: 'in' | 'mm'
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

export const standardPaperSizes: Record<string, PaperSize> = {
  '6x9': {
    name: '6x9',
    width: 6,
    height: 9,
    displayName: '6" x 9" (Novel)',
    unit: 'in'
  },
  '8.5x11': {
    name: '8.5x11',
    width: 8.5,
    height: 11,
    displayName: '8.5" x 11" (Letter)',
    unit: 'in'
  },
  'a4': {
    name: 'a4',
    width: 210,
    height: 297,
    displayName: 'A4',
    unit: 'mm'
  },
  'a5': {
    name: 'a5',
    width: 148,
    height: 210,
    displayName: 'A5',
    unit: 'mm'
  }
};

export const defaultMarginSettings: MarginSettings = {
  top: 1,
  right: 1,
  bottom: 1,
  left: 1,
  gutter: 0,
  headerDistance: 0.5,
  footerDistance: 0.5
};
