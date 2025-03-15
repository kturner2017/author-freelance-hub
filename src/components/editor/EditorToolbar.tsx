
import React from 'react';
import { Editor } from '@tiptap/react';
import { Separator } from '../ui/separator';
import TextFormatButtons from './toolbar/TextFormatButtons';
import HeadingButtons from './toolbar/HeadingButtons';
import AlignmentButtons from './toolbar/AlignmentButtons';
import ListButtons from './toolbar/ListButtons';
import FormattingButtons from './toolbar/FormattingButtons';
import ImageUploadButton from './toolbar/ImageUploadButton';
import HistoryButtons from './toolbar/HistoryButtons';
import RecordingButton from './toolbar/RecordingButton';
import AdvancedFeatureButtons from './toolbar/AdvancedFeatureButtons';
import { 
  VersionHistoryButton, 
  FindReplaceButton, 
  FloatingToolbarButton, 
  TableButton, 
  CommentsButton 
} from './toolbar/FeatureButtons';

interface EditorToolbarProps {
  editor: Editor;
  isRecording: boolean;
  isModelLoading: boolean;
  onToggleRecording: () => void;
  onToggleVersionHistory: () => void;
  onToggleFindReplace: () => void;
  onToggleFloatingToolbar: () => void;
  onToggleComments: () => void;
}

const EditorToolbar = ({ 
  editor, 
  isRecording, 
  isModelLoading,
  onToggleRecording,
  onToggleVersionHistory,
  onToggleFindReplace,
  onToggleFloatingToolbar,
  onToggleComments
}: EditorToolbarProps) => {
  if (!editor) {
    return null;
  }

  // Determine if the floating toolbar is active
  const isFloatingToolbarEnabled = editor.storage.floatingToolbar?.isEnabled || false;
  
  return (
    <div className="bg-gray-100 p-2 rounded-lg border flex flex-wrap items-center gap-2">
      <TextFormatButtons editor={editor} />
      
      <Separator orientation="vertical" className="h-6" />
      
      <HeadingButtons editor={editor} />

      <Separator orientation="vertical" className="h-6" />

      <AlignmentButtons editor={editor} />

      <Separator orientation="vertical" className="h-6" />
      
      <ListButtons editor={editor} />

      <Separator orientation="vertical" className="h-6" />

      <FormattingButtons editor={editor} />

      <Separator orientation="vertical" className="h-6" />

      <ImageUploadButton editor={editor} />

      <Separator orientation="vertical" className="h-6" />

      <TableButton editor={editor} />
      
      <Separator orientation="vertical" className="h-6" />
      
      <VersionHistoryButton 
        editor={editor} 
        onClick={onToggleVersionHistory}
        isActive={false}
      />
      
      <FindReplaceButton 
        editor={editor} 
        onClick={onToggleFindReplace}
        isActive={false}
      />
      
      <FloatingToolbarButton 
        editor={editor} 
        onClick={onToggleFloatingToolbar}
        isActive={isFloatingToolbarEnabled}
      />
      
      <CommentsButton 
        editor={editor} 
        onClick={onToggleComments}
        isActive={false}
      />

      <Separator orientation="vertical" className="h-6" />

      <AdvancedFeatureButtons 
        editor={editor} 
        onToggleVersionHistory={onToggleVersionHistory}
        onToggleFindReplace={onToggleFindReplace}
        onToggleFloatingToolbar={onToggleFloatingToolbar}
        onToggleComments={onToggleComments}
        isFloatingToolbarEnabled={isFloatingToolbarEnabled}
      />

      <Separator orientation="vertical" className="h-6" />

      <HistoryButtons editor={editor} />

      <Separator orientation="vertical" className="h-6" />

      <RecordingButton
        isRecording={isRecording}
        isModelLoading={isModelLoading}
        onToggleRecording={onToggleRecording}
      />
    </div>
  );
};

export default EditorToolbar;
