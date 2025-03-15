
import React from 'react';
import { useParams } from 'react-router-dom';

const EditorHeaderInfo = () => {
  const { bookId } = useParams();
  
  return (
    <div>
      <h2 className="text-lg font-serif font-bold leading-tight text-[#0F172A]">Manuscript Editor</h2>
      <p className="text-sm text-[#1E293B] font-medium leading-tight">
        {bookId ? 'Editor View' : 'Document View'}
      </p>
    </div>
  );
};

export default EditorHeaderInfo;
