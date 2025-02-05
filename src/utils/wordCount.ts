export const getWordCount = (text: string): number => {
  if (!text) return 0;
  // Remove HTML tags if present
  const cleanText = text.replace(/<[^>]*>/g, '');
  // Split by whitespace and filter out empty strings
  return cleanText.split(/\s+/).filter(word => word.length > 0).length;
};

export const getTotalWordCount = (chapters: { content: string }[]): number => {
  return chapters.reduce((total, chapter) => {
    return total + getWordCount(chapter.content || '');
  }, 0);
};