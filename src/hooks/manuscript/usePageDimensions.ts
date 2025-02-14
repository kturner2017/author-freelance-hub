
import { standardPaperSizes, MarginSettings } from '@/types/paper';

export const usePageDimensions = (pageSize: '6x9' | '8.5x11' | 'epub', margins: MarginSettings) => {
  const getPageClass = () => {
    const currentSize = standardPaperSizes[pageSize];
    if (!currentSize) return '';
    
    if (currentSize.unit === 'in') {
      return `w-[${currentSize.width}in] h-[${currentSize.height}in]`;
    }
    return `w-[${currentSize.width}mm] h-[${currentSize.height}mm]`;
  };

  const getTextAreaDimensions = () => {
    const currentSize = standardPaperSizes[pageSize];
    if (!currentSize) return { width: '4in', height: '7in' };
    
    if (currentSize.unit === 'in') {
      const width = currentSize.width - margins.left - margins.right - margins.gutter;
      const height = currentSize.height - margins.top - margins.bottom;
      return {
        width: `${width}in`,
        height: `${height}in`
      };
    }
    
    // For ePub format (mm)
    const width = currentSize.width - (margins.left + margins.right + margins.gutter) * 25.4;
    const height = currentSize.height - (margins.top + margins.bottom) * 25.4;
    return {
      width: `${width}mm`,
      height: `${height}mm`
    };
  };

  const getPageHeight = () => {
    const currentSize = standardPaperSizes[pageSize];
    if (!currentSize) return '7in';
    
    if (currentSize.unit === 'in') {
      return `${currentSize.height - margins.top - margins.bottom}in`;
    }
    // For ePub format (mm)
    return `${currentSize.height - (margins.top + margins.bottom) * 25.4}mm`;
  };

  return {
    getPageClass,
    getTextAreaDimensions,
    getPageHeight
  };
};
