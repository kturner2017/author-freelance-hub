
import { useEffect, useState } from 'react';
import { useEditor } from '@tiptap/react';
import calculateScores from '@/utils/readabilityScores';
import { useEditorConfig } from './editor/useEditorConfig';
import { useEditorStyles } from './editor/useEditorStyles';
import { useAIAnalysis } from './editor/useAIAnalysis';
import { useVersionHistory } from './editor/useVersionHistory';
import { useFindReplace } from './editor/useFindReplace';
import { useFloatingToolbar } from './editor/useFloatingToolbar';
import { useCommentsSystem } from './editor/useCommentsSystem';

interface UseRichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export const useRichTextEditor = ({ content, onChange }: UseRichTextEditorProps) => {
  const [readabilityScores, setReadabilityScores] = useState(calculateScores(''));
  const { aiAnalysis, isAnalyzing, performAnalysis } = useAIAnalysis();
  const { getExtensions, getEditorProps } = useEditorConfig();

  // Add editor styles
  useEditorStyles();

  const editor = useEditor({
    extensions: getExtensions(),
    content: content,
    editorProps: getEditorProps(),
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      onChange(newContent);
      
      const plainText = editor.getText();
      const scores = calculateScores(plainText);
      setReadabilityScores(scores);
      
      // Update floating toolbar position when content changes
      if (floatingToolbarFeature.isFloatingToolbarEnabled) {
        floatingToolbarFeature.updateFloatingToolbarPosition();
      }
    },
    onSelectionUpdate: ({ editor }) => {
      // Update floating toolbar position when selection changes
      if (floatingToolbarFeature.isFloatingToolbarEnabled) {
        floatingToolbarFeature.updateFloatingToolbarPosition();
      }
    },
  });

  // Initialize all feature hooks with the editor
  const versionHistoryFeature = useVersionHistory(editor);
  const findReplaceFeature = useFindReplace(editor);
  const floatingToolbarFeature = useFloatingToolbar(editor);
  const commentsFeature = useCommentsSystem(editor);

  useEffect(() => {
    if (editor && content) {
      // Only update content if it's different to avoid cursor jumping
      if (editor.getHTML() !== content) {
        editor.commands.setContent(content);
        const plainText = editor.getText();
        const scores = calculateScores(plainText);
        setReadabilityScores(scores);
      }
    }
  }, [content, editor]);

  return {
    editor,
    readabilityScores,
    aiAnalysis,
    isAnalyzing,
    performAnalysis,
    // Version history
    versionHistory: versionHistoryFeature,
    // Find & Replace
    findReplace: findReplaceFeature,
    // Floating toolbar
    floatingToolbar: floatingToolbarFeature,
    // Comments
    comments: commentsFeature
  };
};
