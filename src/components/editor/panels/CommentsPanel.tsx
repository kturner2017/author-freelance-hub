
import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { ScrollArea } from '../../ui/scroll-area';
import { format } from 'date-fns';
import { MessageCircle, Check, X, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';

interface Comment {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  resolved: boolean;
}

interface CommentsPanelProps {
  comments: Comment[];
  onResolveComment: (id: string) => void;
  onReopenComment: (id: string) => void;
  onDeleteComment: (id: string) => void;
  onFocusComment: (id: string) => void;
  onClose: () => void;
}

const CommentsPanel = ({
  comments,
  onResolveComment,
  onReopenComment,
  onDeleteComment,
  onFocusComment,
  onClose
}: CommentsPanelProps) => {
  const [activeTab, setActiveTab] = useState<'all' | 'open' | 'resolved'>('all');
  
  const filteredComments = comments.filter(comment => {
    if (activeTab === 'all') return true;
    if (activeTab === 'open') return !comment.resolved;
    if (activeTab === 'resolved') return comment.resolved;
    return true;
  });
  
  return (
    <Card className="w-80 shadow-md fixed right-4 top-24 z-50 border border-gray-300">
      <CardHeader className="bg-gray-100 py-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Comments ({comments.length})
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="w-full mb-2">
            <TabsTrigger value="all" className="flex-1 text-xs">All</TabsTrigger>
            <TabsTrigger value="open" className="flex-1 text-xs">Open</TabsTrigger>
            <TabsTrigger value="resolved" className="flex-1 text-xs">Resolved</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <CommentsList 
              comments={filteredComments} 
              onResolveComment={onResolveComment}
              onReopenComment={onReopenComment}
              onDeleteComment={onDeleteComment}
              onFocusComment={onFocusComment}
            />
          </TabsContent>
          
          <TabsContent value="open" className="mt-0">
            <CommentsList 
              comments={filteredComments} 
              onResolveComment={onResolveComment}
              onReopenComment={onReopenComment}
              onDeleteComment={onDeleteComment}
              onFocusComment={onFocusComment}
            />
          </TabsContent>
          
          <TabsContent value="resolved" className="mt-0">
            <CommentsList 
              comments={filteredComments} 
              onResolveComment={onResolveComment}
              onReopenComment={onReopenComment}
              onDeleteComment={onDeleteComment}
              onFocusComment={onFocusComment}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface CommentsListProps {
  comments: Comment[];
  onResolveComment: (id: string) => void;
  onReopenComment: (id: string) => void;
  onDeleteComment: (id: string) => void;
  onFocusComment: (id: string) => void;
}

const CommentsList = ({
  comments,
  onResolveComment,
  onReopenComment,
  onDeleteComment,
  onFocusComment
}: CommentsListProps) => {
  return (
    <ScrollArea className="h-64 pr-2">
      {comments.length === 0 ? (
        <div className="text-center text-gray-500 py-4">No comments</div>
      ) : (
        <div className="space-y-2">
          {comments.map((comment) => (
            <div 
              key={comment.id} 
              className={`p-2 border rounded text-sm ${comment.resolved ? 'bg-gray-50' : 'bg-white'}`}
              onClick={() => onFocusComment(comment.id)}
            >
              <div className="flex justify-between items-start mb-1">
                <div>
                  <span className="font-medium">{comment.author}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    {format(comment.timestamp, 'MMM d, h:mm a')}
                  </span>
                </div>
                <div className="flex gap-1">
                  {comment.resolved ? (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onReopenComment(comment.id);
                      }}
                      className="h-5 w-5"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onResolveComment(comment.id);
                      }}
                      className="h-5 w-5"
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteComment(comment.id);
                    }}
                    className="h-5 w-5"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className={comment.resolved ? 'text-gray-500' : ''}>
                {comment.content}
              </div>
              {comment.resolved && (
                <div className="text-xs italic text-gray-500 mt-1">
                  Resolved
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  );
};

export default CommentsPanel;
