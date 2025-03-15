
import React from 'react';
import { Badge } from '../../ui/badge';
import { BookOpen } from 'lucide-react';

interface WordCountBadgeProps {
  totalWordCount: number;
}

const WordCountBadge = ({ totalWordCount }: WordCountBadgeProps) => {
  return (
    <Badge variant="outline" className="text-sm bg-gray-50 text-[#0F172A] border border-gray-200 font-medium py-1.5">
      <BookOpen className="h-4 w-4 mr-1.5" />
      Words: {totalWordCount.toLocaleString()}
    </Badge>
  );
};

export default WordCountBadge;
