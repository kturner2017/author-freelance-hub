
import { EditorContent } from '@tiptap/react';
import { useEffect } from 'react';
import EditorToolbar from './editor/EditorToolbar';
import { useVoiceTranscription } from '@/hooks/useVoiceTranscription';
import { useRichTextEditor } from '@/hooks/useRichTextEditor';
import TextAnalysis from './TextAnalysis';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const { editor, readabilityScores, aiAnalysis, isAnalyzing, performAnalysis } = useRichTextEditor({
    content,
    onChange
  });

  const { isRecording, isModelLoading, toggleRecording, initializeWhisper } = useVoiceTranscription({
    onTranscriptionComplete: (text) => {
      if (editor) {
        editor.commands.insertContent(text);
      }
    }
  });

  useEffect(() => {
    initializeWhisper();
  }, [initializeWhisper]);

  if (!editor) {
    return null;
  }

  const handleAnalyze = () => {
    if (editor) {
      performAnalysis(editor.getText());
    }
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <EditorToolbar 
          editor={editor}
          isRecording={isRecording}
          onToggleRecording={toggleRecording}
          isModelLoading={isModelLoading}
        />
        <EditorContent 
          editor={editor} 
          className="min-h-[600px] bg-white rounded-b-lg"
        />
      </div>
      {editor && (
        <TextAnalysis 
          scores={readabilityScores}
          content={editor.getText()}
          aiAnalysis={aiAnalysis}
          isAnalyzing={isAnalyzing}
          onAnalyze={handleAnalyze}
        />
      )}
    </div>
  );
};

export default RichTextEditor;
