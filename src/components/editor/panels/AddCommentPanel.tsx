
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { MessageCircle, X } from 'lucide-react';

interface AddCommentPanelProps {
  commentText: string;
  onCommentTextChange: (text: string) => void;
  onAddComment: () => void;
  onCancel: () => void;
}

const AddCommentPanel = ({
  commentText,
  onCommentTextChange,
  onAddComment,
  onCancel
}: AddCommentPanelProps) => {
  // Use ref to auto-focus textarea
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);
  
  return (
    <Card className="w-80 shadow-md fixed right-4 top-24 z-50 border border-gray-300">
      <CardHeader className="bg-gray-100 py-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Add Comment
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-3">
          <textarea
            ref={textareaRef}
            value={commentText}
            onChange={(e) => onCommentTextChange(e.target.value)}
            placeholder="Type your comment here..."
            className="w-full px-2 py-1 text-sm border rounded h-24 resize-none"
          />
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onCancel}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={onAddComment}
              className="text-xs"
              disabled={!commentText.trim()}
            >
              Add Comment
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddCommentPanel;
