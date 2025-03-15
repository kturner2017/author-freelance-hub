
import { useState } from 'react';
import { Editor } from '@tiptap/react';

interface Comment {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  selectionRange: { from: number, to: number };
  resolved: boolean;
}

export const useCommentsSystem = (editor: Editor | null) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentMode, setIsCommentMode] = useState(false);
  const [commentInputText, setCommentInputText] = useState('');
  const [commentsVisible, setCommentsVisible] = useState(true);
  
  const toggleCommentsPanel = () => {
    setCommentsVisible(prev => !prev);
  };
  
  const toggleCommentMode = () => {
    setIsCommentMode(prev => !prev);
    setCommentInputText('');
  };
  
  const addComment = (authorName: string = 'You') => {
    if (!editor || !commentInputText.trim()) return;
    
    const { from, to } = editor.state.selection;
    if (from === to) return; // Nothing selected
    
    const newComment: Comment = {
      id: crypto.randomUUID(),
      content: commentInputText,
      author: authorName,
      timestamp: new Date(),
      selectionRange: { from, to },
      resolved: false
    };
    
    setComments(prev => [...prev, newComment]);
    setCommentInputText('');
    setIsCommentMode(false);
    
    // Highlight the commented text
    editor.chain().focus().toggleHighlight().run();
  };
  
  const resolveComment = (commentId: string) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, resolved: true } 
          : comment
      )
    );
  };
  
  const reopenComment = (commentId: string) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, resolved: false } 
          : comment
      )
    );
  };
  
  const deleteComment = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };
  
  const focusOnComment = (commentId: string) => {
    if (!editor) return;
    
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return;
    
    editor.commands.setTextSelection({
      from: comment.selectionRange.from,
      to: comment.selectionRange.to
    });
    
    editor.commands.scrollIntoView();
  };
  
  return {
    comments,
    isCommentMode,
    commentInputText,
    commentsVisible,
    setCommentInputText,
    toggleCommentMode,
    toggleCommentsPanel,
    addComment,
    resolveComment,
    reopenComment,
    deleteComment,
    focusOnComment
  };
};
