
import { useEffect } from 'react';

export const useEditorStyles = () => {
  useEffect(() => {
    // Add styles to handle image alignment
    const style = document.createElement('style');
    style.innerHTML = `
      .ProseMirror {
        > * {
          margin-top: 0.75em;
        }
        
        img {
          max-height: 400px;
          height: auto;
          &.resize-handle {
            position: relative;
            display: block;
            margin-left: auto;
            margin-right: auto;
          }
          &.resize-handle::after {
            content: '';
            position: absolute;
            bottom: -4px;
            right: -4px;
            width: 8px;
            height: 8px;
            border: 2px solid #0f172a;
            border-radius: 2px;
            background: white;
          }
        }

        div[data-text-align='center'] {
          text-align: center;
          
          img {
            margin-left: auto;
            margin-right: auto;
          }
        }

        div[data-text-align='right'] {
          text-align: right;
          
          img {
            margin-left: auto;
          }
        }

        div[data-text-align='left'] {
          text-align: left;
          
          img {
            margin-right: auto;
          }
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
};
