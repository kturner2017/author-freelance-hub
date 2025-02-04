import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.ts';

interface RequestBody {
  text: string;
}

// Expanded telling indicators
const tellingWords = [
  // Emotional states
  'felt', 'feel', 'feels', 'feeling',
  'was angry', 'was sad', 'was happy', 'was excited', 'was nervous',
  'wondered', 'thought', 'believed', 'knew', 'realized', 'understood',
  // Passive observations
  'watched', 'looked', 'saw', 'noticed', 'observed',
  'heard', 'listened',
  'seemed', 'appeared',
  // State of being
  'was', 'were', 'had been', 'has been', 'have been',
  'could', 'would', 'might', 'must have',
  // Mental states
  'decided', 'considered', 'contemplated', 'remembered',
  'wanted', 'desired', 'wished', 'hoped',
  // Abstract descriptions
  'very', 'really', 'quite', 'rather', 'somewhat',
  'beautiful', 'ugly', 'nice', 'bad', 'good'
];

// Expanded showing indicators
const showingWords = [
  // Strong verbs
  'sparkled', 'gleamed', 'glowed', 'shimmered', 'blazed', 'flickered',
  'thundered', 'rumbled', 'crashed', 'boomed', 'echoed', 'whispered',
  'rustled', 'swished', 'swooshed', 'whistled', 'hummed',
  'danced', 'pranced', 'stumbled', 'shuffled', 'raced', 'darted',
  'trembled', 'shuddered', 'quivered', 'shook', 'vibrated',
  // Sensory details
  'scarlet', 'crimson', 'azure', 'emerald', 'golden',
  'bitter', 'sweet', 'sour', 'tangy', 'spicy',
  'rough', 'smooth', 'silky', 'gritty', 'sharp',
  'putrid', 'fragrant', 'musty', 'fresh', 'stale',
  // Specific nouns
  'tears', 'sweat', 'blood', 'smile', 'frown', 'grimace',
  'fingers', 'hands', 'feet', 'legs', 'arms', 'shoulders',
  // Action verbs
  'grabbed', 'clutched', 'seized', 'snatched',
  'sprinted', 'jogged', 'limped', 'strutted',
  'slammed', 'tossed', 'hurled', 'threw'
];

// Patterns that often indicate passive voice
const passivePatterns = [
  /\b(am|is|are|was|were|been|being|have|has|had)\s+\w+ed\b/i,
  /\b(am|is|are|was|were|been|being|have|has|had)\s+been\s+\w+ed\b/i,
  /\b(get|gets|got|gotten)\s+\w+ed\b/i
];

function analyzeShowVsTell(text: string) {
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  const analysis = {
    showingSentences: [] as string[],
    tellingSentences: [] as string[],
    suggestions: [] as string[],
    showVsTellRatio: 0,
    detailedAnalysis: {
      passiveVoiceCount: 0,
      emotionalTellingCount: 0,
      sensoryShowingCount: 0,
      strongVerbCount: 0
    }
  };

  let showingCount = 0;
  let tellingCount = 0;

  sentences.forEach(sentence => {
    const words = sentence.toLowerCase().split(/\s+/);
    let isShowing = false;
    let isTelling = false;
    
    // Check for passive voice
    const hasPassiveVoice = passivePatterns.some(pattern => pattern.test(sentence));
    if (hasPassiveVoice) {
      analysis.detailedAnalysis.passiveVoiceCount++;
      isTelling = true;
    }

    // Check for telling words
    const tellingWordsFound = words.filter(word => 
      tellingWords.some(tell => word.includes(tell.toLowerCase()))
    );
    
    if (tellingWordsFound.length > 0) {
      tellingCount++;
      isTelling = true;
      analysis.detailedAnalysis.emotionalTellingCount++;
    }

    // Check for showing words
    const showingWordsFound = words.filter(word =>
      showingWords.some(show => word.includes(show.toLowerCase()))
    );

    if (showingWordsFound.length > 0) {
      showingCount++;
      isShowing = true;
      analysis.detailedAnalysis.sensoryShowingCount++;
      analysis.detailedAnalysis.strongVerbCount += showingWordsFound.length;
    }

    // Categorize the sentence
    if (isTelling) {
      analysis.tellingSentences.push(sentence.trim());
      
      // Generate specific suggestions
      if (hasPassiveVoice) {
        analysis.suggestions.push(`Consider rewriting this passive voice sentence more actively: "${sentence.trim()}"`);
      }
      if (tellingWordsFound.length > 0) {
        const suggestion = `Try showing instead of telling in: "${sentence.trim()}" by replacing telling words (${tellingWordsFound.join(', ')}) with specific actions or descriptions`;
        analysis.suggestions.push(suggestion);
      }
    }
    
    if (isShowing) {
      analysis.showingSentences.push(sentence.trim());
    }
  });

  // Calculate show vs tell ratio
  const total = showingCount + tellingCount;
  analysis.showVsTellRatio = total > 0 ? showingCount / total : 0;

  // Add general suggestions based on the analysis
  if (analysis.showVsTellRatio < 0.4) {
    analysis.suggestions.push(
      "Your writing could benefit from more showing. Try using more sensory details and specific actions.",
      "Consider describing characters' physical reactions and environmental details instead of stating emotions.",
      "Replace abstract adjectives with concrete details that paint a picture."
    );
  }

  if (analysis.detailedAnalysis.passiveVoiceCount > sentences.length * 0.2) {
    analysis.suggestions.push(
      "There's a high percentage of passive voice. Try to make your sentences more active and direct.",
      "Focus on who or what is performing the action in each sentence."
    );
  }

  return analysis;
}

function analyzeWritingStyle(text: string) {
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  const analysis = {
    suggestions: [] as string[],
    styleScore: 0
  };

  // Check sentence variety
  const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
  const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
  const allSimilarLength = sentenceLengths.every(len => 
    Math.abs(len - avgLength) < 3
  );

  if (allSimilarLength) {
    analysis.suggestions.push(
      "Try varying your sentence lengths to create better rhythm in your writing"
    );
  }

  // Check for repeated words at the start of consecutive sentences
  for (let i = 0; i < sentences.length - 1; i++) {
    const currentStart = sentences[i].trim().split(/\s+/)[0].toLowerCase();
    const nextStart = sentences[i + 1].trim().split(/\s+/)[0].toLowerCase();
    if (currentStart === nextStart) {
      analysis.suggestions.push(
        `Consider varying the beginning of consecutive sentences starting with "${currentStart}"`
      );
    }
  }

  return analysis;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = (await req.json()) as RequestBody;
    console.log('Analyzing text:', text.substring(0, 100) + '...');

    if (!text || text.length < 10) {
      throw new Error('Text must be at least 10 characters long');
    }

    const cloudmersiveApiKey = Deno.env.get('CLOUDMERSIVE_API_KEY');
    if (!cloudmersiveApiKey) {
      throw new Error('Cloudmersive API key not configured');
    }

    console.log('Making requests to Cloudmersive API...');
    
    // Create an AbortController for timeouts
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const [sentimentResponse, grammarResponse] = await Promise.all([
        fetch('https://api.cloudmersive.com/nlp-v2/analytics/sentiment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Apikey': cloudmersiveApiKey
          },
          body: JSON.stringify({ TextToAnalyze: text }),
          signal: controller.signal
        }),
        fetch('https://api.cloudmersive.com/nlp-v2/analytics/grammar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Apikey': cloudmersiveApiKey
          },
          body: JSON.stringify({ TextToAnalyze: text }),
          signal: controller.signal
        })
      ]);

      clearTimeout(timeout);

      if (!sentimentResponse.ok || !grammarResponse.ok) {
        console.error('API Error:', {
          sentiment: sentimentResponse.status,
          grammar: grammarResponse.status
        });
        throw new Error('Failed to analyze text');
      }

      const [sentimentData, grammarData] = await Promise.all([
        sentimentResponse.json(),
        grammarResponse.json()
      ]);

      console.log('API responses received:', {
        sentiment: sentimentData,
        grammar: grammarData
      });

      // Perform enhanced show vs tell analysis
      const showTellAnalysis = analyzeShowVsTell(text);

      // Return comprehensive analysis results
      const result = {
        suggestions: [
          ...showTellAnalysis.suggestions,
          ...(grammarData.GrammaticalErrors || []).map(error => 
            `Grammar: ${error.Message}`
          )
        ],
        scores: {
          grammar: grammarData.GrammaticalErrors ? 
            1 - (grammarData.GrammaticalErrors.length / (text.length / 100)) : 0.85,
          showVsTell: showTellAnalysis.showVsTellRatio,
          sentiment: (sentimentData.Sentiment.SentimentScore + 1) / 2
        },
        details: {
          showVsTell: {
            showingSentences: showTellAnalysis.showingSentences,
            tellingSentences: showTellAnalysis.tellingSentences,
            ratio: showTellAnalysis.showVsTellRatio,
            analysis: showTellAnalysis.detailedAnalysis
          },
          grammarErrors: grammarData.GrammaticalErrors || [],
          sentiment: sentimentData.Sentiment
        }
      };

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (fetchError) {
      clearTimeout(timeout);
      console.error('Fetch error:', fetchError);
      throw new Error(`API request failed: ${fetchError.message}`);
    }
  } catch (error) {
    console.error('Error in analyze-text function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      suggestions: [
        'Analysis service is temporarily unavailable.',
        'Please try again later.'
      ],
      scores: {
        grammar: 0.8,
        showVsTell: 0.5,
        sentiment: 0.5
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});