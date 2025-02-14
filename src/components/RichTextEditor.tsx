
import { EditorContent } from '@tiptap/react';
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

  const { isRecording, isModelLoading, toggleRecording } = useVoiceTranscription({
    onTranscriptionComplete: (text) => {
      if (editor) {
        editor.commands.insertContent(text);
      }
    }
  });

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
      <EditorToolbar 
        editor={editor}
        isRecording={isRecording}
        onToggleRecording={toggleRecording}
        isModelLoading={isModelLoading}
      />
      <div className="border rounded-lg">
        <EditorContent 
          editor={editor} 
          className="min-h-[600px] bg-white rounded-lg p-4"
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
