
import { useEffect, useState } from 'react';
import { useEditor } from '@tiptap/react';
import calculateScores from '@/utils/readabilityScores';
import { useEditorConfig } from './editor/useEditorConfig';
import { useEditorStyles } from './editor/useEditorStyles';
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
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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

  // Function to manually perform full analysis
  const performAnalysis = (text: string) => {
    setIsAnalyzing(true);
    try {
      // Calculate local analysis
      const scores = calculateScores(text);
      
      // Transform the data structure
      const analysis = {
        scores: {
          grammar: 0.8, // Default value since we can't calculate grammar locally
          style: 0.7,   // Default value
          showVsTell: scores.showVsTell.ratio
        },
        details: {
          showVsTell: scores.showVsTell
        },
        suggestions: generateLocalSuggestions(scores)
      };
      
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing text:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate suggestions based on the readability scores
  const generateLocalSuggestions = (scores: any): string[] => {
    const suggestions: string[] = [];

    // Show vs Tell suggestions
    if (scores.showVsTell.ratio < 0.4) {
      suggestions.push('Consider using more descriptive language to show rather than tell');
      suggestions.push('Try incorporating more sensory details in your descriptions');
      
      if (scores.showVsTell.tellingSentences.length > 0) {
        suggestions.push('Look for opportunities to replace passive observations with active descriptions');
      }
    }

    // Readability-based suggestions
    const avgReadingLevel = (scores.fleschKincaid + scores.gunningFog + scores.colemanLiau) / 3;
    if (avgReadingLevel > 12) {
      suggestions.push('The text may be difficult to read. Consider simplifying some sentences.');
    }

    // Passive voice suggestions
    if (scores.passiveVoice.length > Math.max(5, scores.stats.sentenceCount * 0.2)) {
      suggestions.push('There are several instances of passive voice. Try using more active voice for clarity.');
    }

    // Long sentences suggestions
    if (scores.longSentences.length + scores.veryLongSentences.length > Math.max(3, scores.stats.sentenceCount * 0.15)) {
      suggestions.push('Consider breaking up long sentences to improve readability.');
    }

    // Adverbs suggestions
    if (scores.adverbs.length > Math.max(10, scores.stats.wordCount * 0.05)) {
      suggestions.push('Try replacing some adverbs with stronger verbs for more impactful writing.');
    }

    // Wordy phrases
    if (Object.keys(scores.wordyPhrases).length > 3) {
      suggestions.push('Look for opportunities to replace wordy phrases with more concise alternatives.');
    }

    return suggestions;
  };

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
