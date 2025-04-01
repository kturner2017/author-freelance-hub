
export interface ReadabilityScores {
  fleschKincaid: number;
  fleschReading: number;
  gunningFog: number;
  colemanLiau: number;
  complexSentences: string[];
  passiveVoice: string[];
  adverbs: string[];
  wordyPhrases: { [key: string]: string };
  longSentences: string[];
  veryLongSentences: string[];
  showVsTell: {
    showingSentences: string[];
    tellingSentences: string[];
    ratio: number;
    totalSentences: number;
    showingCount: number;
    tellingCount: number;
  };
  stats: {
    wordCount: number;
    sentenceCount: number;
    averageWordsPerSentence: number;
    paragraphCount: number;
  };
}

const countSyllables = (word: string): number => {
  word = word.toLowerCase();
  word = word.replace(/(?:[^laeiouy]|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const syllables = word.match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 1; // Ensure at least 1 syllable per word
};

// Find complex sentences (high syllable count, difficult to read)
const findComplexSentences = (sentences: string[]): string[] => {
  return sentences.filter(sentence => {
    const words = sentence.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    if (wordCount < 5) return false; // Too short to be complex
    
    const complexWordCount = words.filter(word => countSyllables(word) > 3).length;
    const complexRatio = complexWordCount / wordCount;
    
    return complexRatio > 0.25 && wordCount > 10;
  });
};

// Find passive voice instances
const findPassiveVoice = (sentences: string[]): string[] => {
  const passivePatterns = [
    /\b(?:am|is|are|was|were|be|been|being)\s+(\w+ed)\b/i,
    /\b(?:has|have|had)\s+been\s+(\w+ed)\b/i,
    /\b(?:will|shall)\s+be\s+(\w+ed)\b/i,
    /\b(?:am|is|are|was|were|be|been|being)\s+(\w+en)\b/i,
    /\b(?:has|have|had)\s+been\s+(\w+en)\b/i,
    /\b(?:will|shall)\s+be\s+(\w+en)\b/i,
  ];
  
  return sentences.filter(sentence => 
    passivePatterns.some(pattern => pattern.test(sentence))
  );
};

// Find adverbs (usually ending in -ly)
const findAdverbs = (text: string): string[] => {
  const adverbPattern = /\b\w+ly\b/gi;
  return (text.match(adverbPattern) || []);
};

// Common wordy phrases and their simpler alternatives
const wordyPhrases: { [key: string]: string } = {
  "in order to": "to",
  "due to the fact that": "because",
  "in spite of the fact that": "although",
  "with regard to": "about",
  "in the event that": "if",
  "in the process of": "during",
  "a majority of": "most",
  "a number of": "many",
  "at this point in time": "now",
  "for the purpose of": "for",
  "in the near future": "soon",
  "it is necessary that": "must",
  "prior to": "before",
  "subsequent to": "after",
  "at the present time": "now",
  "for the reason that": "because",
  "in close proximity to": "near",
  "it is possible that": "maybe",
  "make a decision": "decide",
  "at the conclusion of": "after",
  "on account of": "because",
  "in relation to": "about",
  "not to mention": "besides",
  "in all likelihood": "probably",
  "concerning the matter of": "about",
};

// Find wordy phrases in the text
const findWordyPhrases = (text: string): { [key: string]: string } => {
  const found: { [key: string]: string } = {};
  
  Object.entries(wordyPhrases).forEach(([phrase, alternative]) => {
    if (text.toLowerCase().includes(phrase.toLowerCase())) {
      found[phrase] = alternative;
    }
  });
  
  return found;
};

// Categorize sentences by length
const categorizeSentencesByLength = (sentences: string[]): { longSentences: string[], veryLongSentences: string[] } => {
  const longSentences = [];
  const veryLongSentences = [];
  
  for (const sentence of sentences) {
    const wordCount = sentence.split(/\s+/).filter(Boolean).length;
    
    if (wordCount > 30) {
      veryLongSentences.push(sentence.trim());
    } else if (wordCount > 20) {
      longSentences.push(sentence.trim());
    }
  }
  
  return { longSentences, veryLongSentences };
};

// Analyze text for showing vs telling patterns
const analyzeShowVsTell = (sentences: string[]) => {
  const showingWords = [
    // Sensory details
    'sparkled', 'gleamed', 'thundered', 'rustled', 'trembled', 'shimmered', 'flickered',
    'rumbled', 'echoed', 'whispered', 'roared', 'growled', 'howled',
    // Descriptive adjectives
    'bitter', 'sweet', 'rough', 'smooth', 'sharp', 'crisp', 'freezing', 'scorching',
    'massive', 'tiny', 'ancient', 'fresh', 'vibrant', 'dull', 'brilliant',
    // Action verbs
    'grabbed', 'clutched', 'sprinted', 'slammed', 'dashed', 'lunged', 'crawled',
    'leaped', 'darted', 'stomped', 'shuffled', 'stumbled', 'crept'
  ];
  
  const tellingWords = [
    // State of being
    'felt', 'feel', 'was', 'were', 'had', 'seemed', 'appeared',
    // Emotions told directly
    'was angry', 'was sad', 'was happy', 'was scared', 'was excited',
    // Passive observations
    'watched', 'looked', 'saw', 'heard', 'noticed', 'realized',
    // Qualifiers
    'very', 'really', 'quite', 'rather', 'somewhat', 'extremely'
  ];

  const analysis = {
    showingSentences: [] as string[],
    tellingSentences: [] as string[],
    ratio: 0,
    totalSentences: sentences.length,
    showingCount: 0,
    tellingCount: 0
  };

  sentences.forEach(sentence => {
    const cleanSentence = sentence.trim().toLowerCase();
    let isShowing = false;
    let isTelling = false;
    
    // Check for showing words
    if (showingWords.some(word => cleanSentence.includes(word))) {
      analysis.showingCount++;
      isShowing = true;
      if (!analysis.showingSentences.includes(sentence.trim())) {
        analysis.showingSentences.push(sentence.trim());
      }
    }
    
    // Check for telling words
    if (tellingWords.some(word => cleanSentence.includes(word))) {
      analysis.tellingCount++;
      isTelling = true;
      if (!analysis.tellingSentences.includes(sentence.trim())) {
        analysis.tellingSentences.push(sentence.trim());
      }
    }
  });

  // Calculate ratio (showing / total analyzed sentences)
  const totalAnalyzed = analysis.showingCount + analysis.tellingCount;
  analysis.ratio = totalAnalyzed > 0 ? analysis.showingCount / totalAnalyzed : 0;

  return analysis;
};

const calculateScores = (text: string): ReadabilityScores => {
  // Clean the text first
  const cleanText = text.replace(/\s+/g, ' ').trim();
  
  if (!cleanText) {
    return {
      fleschKincaid: 0,
      fleschReading: 0,
      gunningFog: 0,
      colemanLiau: 0,
      complexSentences: [],
      passiveVoice: [],
      adverbs: [],
      wordyPhrases: {},
      longSentences: [],
      veryLongSentences: [],
      showVsTell: {
        showingSentences: [],
        tellingSentences: [],
        ratio: 0,
        totalSentences: 0,
        showingCount: 0,
        tellingCount: 0
      },
      stats: {
        wordCount: 0,
        sentenceCount: 0,
        averageWordsPerSentence: 0,
        paragraphCount: 0,
      }
    };
  }

  // Split into sentences and words
  const sentences = cleanText.split(/[.!?]+/).filter(Boolean).map(s => s.trim());
  const words = cleanText.split(/\s+/).filter(word => word.length > 0);
  const paragraphs = cleanText.split(/\n\s*\n/).filter(Boolean);
  
  if (words.length === 0 || sentences.length === 0) {
    return {
      fleschKincaid: 0,
      fleschReading: 0,
      gunningFog: 0,
      colemanLiau: 0,
      complexSentences: [],
      passiveVoice: [],
      adverbs: [],
      wordyPhrases: {},
      longSentences: [],
      veryLongSentences: [],
      showVsTell: {
        showingSentences: [],
        tellingSentences: [],
        ratio: 0,
        totalSentences: 0,
        showingCount: 0,
        tellingCount: 0
      },
      stats: {
        wordCount: 0,
        sentenceCount: 0,
        averageWordsPerSentence: 0,
        paragraphCount: 0,
      }
    };
  }

  // Calculate basic metrics
  const totalSyllables = words.reduce((sum, word) => sum + countSyllables(word), 0);
  const avgSentenceLength = words.length / sentences.length;
  const avgSyllablesPerWord = totalSyllables / words.length;

  // Calculate traditional readability scores
  const fleschKincaid = 0.39 * avgSentenceLength + 11.8 * avgSyllablesPerWord - 15.59;
  const fleschReading = 206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord;
  const complexWords = words.filter(word => countSyllables(word) > 2).length;
  const gunningFog = 0.4 * (avgSentenceLength + 100 * (complexWords / words.length));
  const letters = words.join('').length;
  const L = (letters / words.length) * 100; // letters per 100 words
  const S = (sentences.length / words.length) * 100; // sentences per 100 words
  const colemanLiau = 0.0588 * L - 0.296 * S - 15.8;

  // Find Hemingway-like issues
  const complexSentences = findComplexSentences(sentences);
  const passiveVoice = findPassiveVoice(sentences);
  const adverbs = findAdverbs(cleanText);
  const foundWordyPhrases = findWordyPhrases(cleanText);
  const { longSentences, veryLongSentences } = categorizeSentencesByLength(sentences);
  
  // Show vs Tell Analysis
  const showVsTell = analyzeShowVsTell(sentences);

  const scores = {
    fleschKincaid: Math.max(0, Math.min(20, Math.round(fleschKincaid * 10) / 10)),
    fleschReading: Math.max(0, Math.min(100, Math.round(fleschReading * 10) / 10)),
    gunningFog: Math.max(0, Math.min(20, Math.round(gunningFog * 10) / 10)),
    colemanLiau: Math.max(0, Math.min(20, Math.round(colemanLiau * 10) / 10)),
    complexSentences,
    passiveVoice,
    adverbs,
    wordyPhrases: foundWordyPhrases,
    longSentences,
    veryLongSentences,
    showVsTell,
    stats: {
      wordCount: words.length,
      sentenceCount: sentences.length,
      averageWordsPerSentence: Math.round((words.length / sentences.length) * 10) / 10,
      paragraphCount: paragraphs.length,
    }
  };

  return scores;
};

export default calculateScores;
