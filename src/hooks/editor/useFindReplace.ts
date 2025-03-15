
import { useState, useCallback } from 'react';
import { Editor } from '@tiptap/react';

export const useFindReplace = (editor: Editor | null) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [isFindOpen, setIsFindOpen] = useState(false);
  const [matches, setMatches] = useState<number>(0);
  const [currentMatch, setCurrentMatch] = useState<number>(0);

  const toggleFindPanel = () => {
    setIsFindOpen(prev => !prev);
  };

  const find = useCallback(() => {
    if (!editor || !searchQuery) {
      setMatches(0);
      setCurrentMatch(0);
      return;
    }

    // Get text content
    const text = editor.getText();
    
    // Find all matches
    const regex = new RegExp(searchQuery, 'gi');
    const matchesArray = [...text.matchAll(regex)];
    setMatches(matchesArray.length);
    
    if (matchesArray.length > 0) {
      setCurrentMatch(1);
      
      // Find and select the first match
      const selection = editor.state.selection;
      const foundPos = text.toLowerCase().indexOf(searchQuery.toLowerCase());
      
      if (foundPos !== -1) {
        editor.commands.setTextSelection({
          from: foundPos,
          to: foundPos + searchQuery.length
        });
      }
    }
  }, [editor, searchQuery]);

  const findNext = useCallback(() => {
    if (!editor || matches === 0) return;
    
    const text = editor.getText();
    const regex = new RegExp(searchQuery, 'gi');
    const matchesArray = [...text.matchAll(regex)];
    
    if (matchesArray.length > 0) {
      const nextMatchIdx = currentMatch % matchesArray.length;
      setCurrentMatch(nextMatchIdx + 1);
      
      // Find position of next match
      let count = 0;
      let lastIndex = 0;
      
      for (let i = 0; i <= nextMatchIdx; i++) {
        const result = regex.exec(text.slice(lastIndex));
        if (result) {
          if (i === nextMatchIdx) {
            // This is our match
            const foundPos = lastIndex + result.index;
            editor.commands.setTextSelection({
              from: foundPos,
              to: foundPos + searchQuery.length
            });
          }
          lastIndex += result.index + searchQuery.length;
          regex.lastIndex = 0;
        }
      }
    }
  }, [editor, searchQuery, matches, currentMatch]);

  const findPrevious = useCallback(() => {
    if (!editor || matches === 0) return;
    
    const text = editor.getText();
    const regex = new RegExp(searchQuery, 'gi');
    const matchesArray = [...text.matchAll(regex)];
    
    if (matchesArray.length > 0) {
      let prevMatchIdx = currentMatch - 2;
      if (prevMatchIdx < 0) prevMatchIdx = matchesArray.length - 1;
      
      setCurrentMatch(prevMatchIdx + 1);
      
      // Similar logic to findNext but for previous match
      let count = 0;
      let lastIndex = 0;
      
      for (let i = 0; i <= prevMatchIdx; i++) {
        const result = regex.exec(text.slice(lastIndex));
        if (result) {
          if (i === prevMatchIdx) {
            const foundPos = lastIndex + result.index;
            editor.commands.setTextSelection({
              from: foundPos,
              to: foundPos + searchQuery.length
            });
          }
          lastIndex += result.index + searchQuery.length;
          regex.lastIndex = 0;
        }
      }
    }
  }, [editor, searchQuery, matches, currentMatch]);

  const replaceOne = useCallback(() => {
    if (!editor || !searchQuery) return;
    
    const selection = editor.state.selection;
    if (selection.empty) return;
    
    // Check if selection matches our search query
    const selectedText = editor.state.doc.textBetween(
      selection.from,
      selection.to,
      ''
    );
    
    if (selectedText.toLowerCase() === searchQuery.toLowerCase()) {
      editor.commands.deleteSelection();
      editor.commands.insertContent(replaceText);
      find(); // Find next match
    }
  }, [editor, searchQuery, replaceText, find]);

  const replaceAll = useCallback(() => {
    if (!editor || !searchQuery) return;
    
    const text = editor.getText();
    const regex = new RegExp(searchQuery, 'gi');
    
    // Get HTML content to preserve formatting
    let html = editor.getHTML();
    
    // Replace all occurrences in HTML while preserving tags
    html = html.replace(regex, replaceText);
    
    // Set new content
    editor.commands.setContent(html);
    
    // Clear matches since we've replaced everything
    setMatches(0);
    setCurrentMatch(0);
  }, [editor, searchQuery, replaceText]);

  return {
    searchQuery,
    setSearchQuery,
    replaceText,
    setReplaceText,
    find,
    findNext,
    findPrevious,
    replaceOne,
    replaceAll,
    matches,
    currentMatch,
    isFindOpen,
    toggleFindPanel
  };
};
