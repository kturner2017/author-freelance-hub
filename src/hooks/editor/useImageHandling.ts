
import { Editor } from '@tiptap/react';

export const useImageHandling = (view: any) => {
  const handleMouseDown = (event: MouseEvent, img: HTMLImageElement) => {
    let isResizing = false;
    let startX: number;
    let startY: number;
    let startWidth: number;
    let startHeight: number;

    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const newWidth = Math.max(100, startWidth + deltaX);
      const newHeight = Math.max(100, startHeight + deltaY);
      
      img.style.width = `${newWidth}px`;
      img.style.height = `${newHeight}px`;
      
      const node = view.state.doc.nodeAt(view.posAtDOM(img, 0));
      if (node) {
        const pos = view.posAtDOM(img, 0);
        view.dispatch(view.state.tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          width: newWidth,
          height: newHeight
        }));
      }
    };

    const onMouseUp = () => {
      isResizing = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      img.style.cursor = 'pointer';
    };

    // Check if clicking near bottom-right corner (resize handle)
    const rect = img.getBoundingClientRect();
    const cornerSize = 20;
    if (
      event.clientX > rect.right - cornerSize &&
      event.clientY > rect.bottom - cornerSize
    ) {
      isResizing = true;
      startX = event.clientX;
      startY = event.clientY;
      startWidth = img.offsetWidth;
      startHeight = img.offsetHeight;
      
      img.style.cursor = 'nwse-resize';
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      event.preventDefault();
      return true;
    }
    return false;
  };

  return { handleMouseDown };
};
