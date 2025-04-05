
import React from 'react';

export interface WordCountBadgeProps {
  totalWordCount: number;
}

const WordCountBadge = ({ totalWordCount }: WordCountBadgeProps) => {
  return (
    <div className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-medium ml-2 flex items-center">
      <span className="whitespace-nowrap">{totalWordCount.toLocaleString()} words</span>
    </div>
  );
};

export default WordCountBadge;
