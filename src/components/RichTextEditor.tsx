
import { EditorContent } from '@tiptap/react';
import EditorToolbar from './editor/EditorToolbar';
import { useVoiceTranscription } from '@/hooks/useVoiceTranscription';
import { useRichTextEditor } from '@/hooks/useRichTextEditor';
import TextAnalysis from './TextAnalysis';
import VersionHistoryPanel from './editor/panels/VersionHistoryPanel';
import FindReplacePanel from './editor/panels/FindReplacePanel';
import FloatingToolbar from './editor/panels/FloatingToolbar';
import CommentsPanel from './editor/panels/CommentsPanel';
import AddCommentPanel from './editor/panels/AddCommentPanel';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  aiAnalysis?: any;
  isAnalyzing?: boolean;
}

const RichTextEditor = ({ content, onChange, aiAnalysis, isAnalyzing }: RichTextEditorProps) => {
  const { 
    editor, 
    readabilityScores, 
    aiAnalysis: editorAiAnalysis, 
    isAnalyzing: editorIsAnalyzing, 
    performAnalysis,
    versionHistory,
    findReplace,
    floatingToolbar,
    comments 
  } = useRichTextEditor({
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

  // Use props values if provided, otherwise use internal state
  const finalAiAnalysis = aiAnalysis || editorAiAnalysis;
  const finalIsAnalyzing = isAnalyzing !== undefined ? isAnalyzing : editorIsAnalyzing;

  const handleAnalyze = () => {
    if (editor) {
      performAnalysis(editor.getText());
    }
  };

  return (
    <div className="space-y-4 relative">
      <EditorToolbar 
        editor={editor}
        isRecording={isRecording}
        onToggleRecording={toggleRecording}
        isModelLoading={isModelLoading}
        onToggleVersionHistory={versionHistory.toggleHistoryPanel}
        onToggleFindReplace={findReplace.toggleFindPanel}
        onToggleFloatingToolbar={floatingToolbar.toggleFloatingToolbar}
        onToggleComments={comments.toggleCommentsPanel}
      />
      
      {/* Version History Panel */}
      {versionHistory.isHistoryOpen && (
        <VersionHistoryPanel 
          versions={versionHistory.versions}
          onRestoreVersion={versionHistory.restoreVersion}
          onAddVersion={versionHistory.addVersion}
          onClose={versionHistory.toggleHistoryPanel}
        />
      )}
      
      {/* Find & Replace Panel */}
      {findReplace.isFindOpen && (
        <FindReplacePanel 
          searchQuery={findReplace.searchQuery}
          replaceText={findReplace.replaceText}
          matches={findReplace.matches}
          currentMatch={findReplace.currentMatch}
          onSearchChange={findReplace.setSearchQuery}
          onReplaceChange={findReplace.setReplaceText}
          onFind={findReplace.find}
          onFindNext={findReplace.findNext}
          onFindPrevious={findReplace.findPrevious}
          onReplaceOne={findReplace.replaceOne}
          onReplaceAll={findReplace.replaceAll}
          onClose={findReplace.toggleFindPanel}
        />
      )}
      
      {/* Comments Panel */}
      {comments.commentsVisible && !comments.isCommentMode && (
        <CommentsPanel 
          comments={comments.comments}
          onResolveComment={comments.resolveComment}
          onReopenComment={comments.reopenComment}
          onDeleteComment={comments.deleteComment}
          onFocusComment={comments.focusOnComment}
          onClose={comments.toggleCommentsPanel}
        />
      )}
      
      {/* Add Comment Panel */}
      {comments.isCommentMode && (
        <AddCommentPanel 
          commentText={comments.commentInputText}
          onCommentTextChange={comments.setCommentInputText}
          onAddComment={comments.addComment}
          onCancel={comments.toggleCommentMode}
        />
      )}
      
      <div className="border rounded-lg relative">
        {/* Floating Toolbar */}
        {floatingToolbar.isFloatingToolbarEnabled && editor && (
          <FloatingToolbar 
            editor={editor}
            position={floatingToolbar.floatingToolbarPosition}
            visible={floatingToolbar.isVisible}
          />
        )}
        
        <EditorContent 
          editor={editor} 
          className="min-h-[600px] bg-white rounded-lg p-4"
        />
      </div>
      
      {editor && (
        <TextAnalysis 
          scores={readabilityScores}
          content={editor.getText()}
          aiAnalysis={finalAiAnalysis}
          isAnalyzing={finalIsAnalyzing}
          onAnalyze={handleAnalyze}
        />
      )}
    </div>
  );
};

export default RichTextEditor;
