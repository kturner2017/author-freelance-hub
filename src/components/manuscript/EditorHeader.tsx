
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { getWordCount } from '@/utils/wordCount';

interface EditorHeaderProps {
  chapterId: string;
  content: string;
  selectedTemplate: string;
  pageSize: '6x9' | '8.5x11';
  showSinglePage: boolean;
  onTemplateClick: () => void;
  onPageSizeChange: (size: '6x9' | '8.5x11') => void;
  onViewModeToggle: () => void;
}

const EditorHeader = ({
  chapterId,
  content,
  selectedTemplate,
  pageSize,
  showSinglePage,
  onTemplateClick,
  onPageSizeChange,
  onViewModeToggle
}: EditorHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-3xl font-serif font-semibold text-primary-800">
        {chapterId}
      </h2>
      <div className="flex items-center gap-4">
        <Badge 
          variant="secondary" 
          className="text-sm bg-primary-50 text-primary-700 border-primary-200 cursor-pointer"
          onClick={onTemplateClick}
        >
          Template: {selectedTemplate}
        </Badge>
        <Badge variant="secondary" className="text-sm bg-primary-50 text-primary-700 border-primary-200">
          {getWordCount(content).toLocaleString()} words
        </Badge>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageSizeChange('6x9')}
            className={pageSize === '6x9' ? 'bg-primary-100' : ''}
          >
            6" x 9"
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageSizeChange('8.5x11')}
            className={pageSize === '8.5x11' ? 'bg-primary-100' : ''}
          >
            8.5" x 11"
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onViewModeToggle}
          >
            {showSinglePage ? 'Full View' : 'Page View'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditorHeader;
