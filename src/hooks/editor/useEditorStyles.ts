
import { useEffect } from 'react';

export const useEditorStyles = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .ProseMirror {
        > * {
          margin-top: 0.75em;
        }
        
        img {
          max-height: 400px;
          height: auto;
          cursor: move;
          float: left;
          margin: 0.5em 1em 0.5em 0;
          
          &.resize-handle {
            position: relative;
            display: inline-block;
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
            cursor: nwse-resize;
          }
        }

        div[data-text-align='center'] {
          text-align: center;
          clear: both;
          
          img {
            float: none;
            margin: 0.5em auto;
            display: block;
          }
        }

        div[data-text-align='right'] {
          text-align: right;
          clear: both;
          
          img {
            float: right;
            margin: 0.5em 0 0.5em 1em;
          }
        }

        div[data-text-align='left'] {
          text-align: left;
          clear: both;
          
          img {
            float: left;
            margin: 0.5em 1em 0.5em 0;
          }
        }

        /* Table styling */
        table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 1em 0;
          overflow: hidden;
        }
        
        td, th {
          border: 1px solid #cbd5e1;
          padding: 0.5rem;
          position: relative;
          vertical-align: top;
        }
        
        th {
          background-color: #f8fafc;
          font-weight: bold;
        }
        
        .selectedCell:after {
          background: rgba(200, 200, 255, 0.4);
          content: "";
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          pointer-events: none;
          position: absolute;
          z-index: 2;
        }

        &::after {
          content: '';
          display: table;
          clear: both;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
};
