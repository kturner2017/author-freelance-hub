export interface ReadabilityScores {
  fleschKincaid: number;
  fleschReading: number;
  gunningFog: number;
  colemanLiau: number;
}

const countSyllables = (word: string): number => {
  word = word.toLowerCase();
  word = word.replace(/(?:[^laeiouy]|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const syllables = word.match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 0;
};

const calculateScores = (text: string): ReadabilityScores => {
  if (!text.trim()) {
    return {
      fleschKincaid: 0,
      fleschReading: 0,
      gunningFog: 0,
      colemanLiau: 0
    };
  }

  // Split into sentences and words
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  const words = text.split(/\s+/).filter(word => word.length > 0);
  
  if (words.length === 0 || sentences.length === 0) {
    return {
      fleschKincaid: 0,
      fleschReading: 0,
      gunningFog: 0,
      colemanLiau: 0
    };
  }

  // Calculate basic metrics
  const totalSyllables = words.reduce((sum, word) => sum + countSyllables(word), 0);
  const avgSentenceLength = words.length / sentences.length;
  const avgSyllablesPerWord = totalSyllables / words.length;

  // Calculate Flesch-Kincaid Grade Level
  const fleschKincaid = 0.39 * avgSentenceLength + 11.8 * avgSyllablesPerWord - 15.59;

  // Calculate Flesch Reading Ease
  const fleschReading = 206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord;

  // Calculate Gunning Fog Index
  const complexWords = words.filter(word => countSyllables(word) > 2).length;
  const gunningFog = 0.4 * (avgSentenceLength + 100 * (complexWords / words.length));

  // Calculate Coleman-Liau Index
  const letters = words.join('').length;
  const L = (letters / words.length) * 100; // letters per 100 words
  const S = (sentences.length / words.length) * 100; // sentences per 100 words
  const colemanLiau = 0.0588 * L - 0.296 * S - 15.8;

  return {
    fleschKincaid: Math.max(0, Math.min(20, Math.round(fleschKincaid * 10) / 10)),
    fleschReading: Math.max(0, Math.min(100, Math.round(fleschReading * 10) / 10)),
    gunningFog: Math.max(0, Math.min(20, Math.round(gunningFog * 10) / 10)),
    colemanLiau: Math.max(0, Math.min(20, Math.round(colemanLiau * 10) / 10))
  };
};

export default calculateScores;