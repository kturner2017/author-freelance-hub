
import React, { useState } from 'react';
import { ScrollArea } from '../../ui/scroll-area';
import { Button } from '../../ui/button';
import { ArrowLeft, Files } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import PageEditor from './PageEditor';
import MarginControls from './MarginControls';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface PageViewEditorProps {
  content: string;
  onContentChange: (content: string) => void;
}

const PageViewEditor = ({ content, onContentChange }: PageViewEditorProps) => {
  const { bookId, chapterId } = useParams();
  const [pageSize, setPageSize] = useState<'6x9' | '8.5x11'>('6x9');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [margins, setMargins] = useState({
    top: 1,
    right: 1,
    bottom: 1,
    left: 1
  });

  const handleMarginChange = (side: 'top' | 'right' | 'bottom' | 'left', value: string) => {
    const numValue = parseFloat(value) || 0;
    setMargins(prev => ({
      ...prev,
      [side]: Math.max(0, Math.min(3, numValue))
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="flex items-center gap-4 max-w-7xl mx-auto px-4 h-16">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/editor/manuscript/${bookId}/chapters`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">Page View</h1>
          <div className="ml-auto">
            <Button variant="outline" asChild>
              <Link to={`/editor/manuscript/${bookId}/chapters/${chapterId}/full-view`}>
                <Files className="h-4 w-4 mr-2" />
                Full View
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 h-[calc(100vh-4rem)]">
        <div className="max-w-5xl mx-auto py-8 px-4">
          <div className="mb-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-48">
                <Select value={pageSize} onValueChange={(value: '6x9' | '8.5x11') => setPageSize(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select page size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6x9">6" x 9"</SelectItem>
                    <SelectItem value="8.5x11">8.5" x 11"</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <MarginControls margins={margins} onMarginChange={handleMarginChange} />
          </div>
          <div className="bg-gray-100 rounded-lg p-8">
            <PageEditor
              editorRef={null}
              showSinglePage={true}
              pageSize={pageSize}
              margins={margins}
              currentPage={currentPage}
              totalPages={totalPages}
              content={content}
              onContentChange={onContentChange}
              onPrevPage={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              onNextPage={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PageViewEditor;
