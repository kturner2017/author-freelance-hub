
import { useState } from 'react';
import { Editor } from '@tiptap/react';

interface VersionItem {
  id: string;
  content: string;
  timestamp: Date;
  description: string;
}

export const useVersionHistory = (editor: Editor | null) => {
  const [versions, setVersions] = useState<VersionItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const addVersion = (description: string = 'Manual save') => {
    if (!editor) return;
    
    const newVersion: VersionItem = {
      id: crypto.randomUUID(),
      content: editor.getHTML(),
      timestamp: new Date(),
      description
    };
    
    setVersions(prev => [newVersion, ...prev]);
    return newVersion.id;
  };

  const restoreVersion = (versionId: string) => {
    if (!editor) return false;
    
    const version = versions.find(v => v.id === versionId);
    if (!version) return false;
    
    editor.commands.setContent(version.content);
    return true;
  };

  const getVersions = () => versions;

  const toggleHistoryPanel = () => {
    setIsHistoryOpen(prev => !prev);
  };

  return {
    versions,
    addVersion,
    restoreVersion,
    getVersions,
    isHistoryOpen,
    toggleHistoryPanel
  };
};
