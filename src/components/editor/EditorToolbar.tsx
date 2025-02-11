
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

interface EditorToolbarProps {
  editor: Editor;
  isRecording: boolean;
  isModelLoading: boolean;
  onToggleRecording: () => void;
}

const EditorToolbar = ({ 
  editor, 
  isRecording, 
  isModelLoading,
  onToggleRecording 
}: EditorToolbarProps) => {
  return (
    <div className="bg-gray-100 p-2 rounded-t-lg border-b flex flex-wrap items-center gap-2">
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
