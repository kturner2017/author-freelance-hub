
import { useEffect } from 'react';

export const useEditorStyles = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .resize-handle {
        position: relative;
      }
      .resize-handle::after {
        content: '';
        position: absolute;
        right: 0;
        bottom: 0;
        width: 20px;
        height: 20px;
        cursor: nwse-resize;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 0 0 4px 0;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
};
