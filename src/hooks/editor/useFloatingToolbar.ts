
import { useState } from 'react';
import { Editor } from '@tiptap/react';

export const useFloatingToolbar = (editor: Editor | null) => {
  const [isFloatingToolbarEnabled, setIsFloatingToolbarEnabled] = useState(false);
  const [floatingToolbarPosition, setFloatingToolbarPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const toggleFloatingToolbar = () => {
    const newState = !isFloatingToolbarEnabled;
    setIsFloatingToolbarEnabled(newState);
    
    if (!newState) {
      // Hide toolbar when disabled
      setIsVisible(false);
    }
  };

  const updateFloatingToolbarPosition = () => {
    if (!editor || !isFloatingToolbarEnabled) {
      setIsVisible(false);
      return;
    }

    const { view } = editor;
    const { selection } = view.state;
    
    // Don't show if selection is empty
    if (selection.empty) {
      setIsVisible(false);
      return;
    }

    // Get coordinates of the selection
    const { from, to } = selection;
    const start = view.coordsAtPos(from);
    const end = view.coordsAtPos(to);
    
    // Calculate position (centered above the selection)
    const left = Math.min(start.left, end.left) + Math.abs(end.left - start.left) / 2;
    const top = Math.min(start.top, end.top) - 40; // 40px above selection
    
    setFloatingToolbarPosition({ top, left });
    setIsVisible(true);
  };

  return {
    isFloatingToolbarEnabled,
    floatingToolbarPosition,
    isVisible,
    toggleFloatingToolbar,
    updateFloatingToolbarPosition
  };
};
