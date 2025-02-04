import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.ts';

interface RequestBody {
  text: string;
}

interface CloudmersiveResponse {
  Sentiment: {
    SentimentClass: string;
    SentimentScore: number;
  };
}

interface GrammarAnalysisResponse {
  GrammaticalErrors: Array<{
    Message: string;
    Type: string;
    StartPosition: number;
    Length: number;
  }>;
}

// Common "telling" words that often indicate passive writing
const tellingWords = [
  'felt', 'heard', 'saw', 'noticed', 'realized', 'thought', 'knew', 'believed',
  'wondered', 'decided', 'understood', 'watched', 'looked', 'seemed', 'appeared',
  'was', 'were', 'had', 'could', 'would'
];

// Words that often indicate sensory descriptions (showing)
const sensoryWords = [
  'sparkled', 'gleamed', 'rustled', 'thundered', 'whispered', 'echoed',
  'glowed', 'shimmered', 'danced', 'raced', 'crackled', 'soared',
  'trembled', 'flickered', 'rumbled'
];

function analyzeShowVsTell(text: string) {
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  const analysis = {
    showingSentences: [] as string[],
    tellingSentences: [] as string[],
    suggestions: [] as string[],
    showVsTellRatio: 0
  };

  let showingCount = 0;
  let tellingCount = 0;

  sentences.forEach(sentence => {
    const words = sentence.toLowerCase().split(/\s+/);
    let tellingWordsFound = words.filter(word => tellingWords.includes(word));
    let sensoryWordsFound = words.filter(word => sensoryWords.includes(word));
    
    // Check for passive voice indicators
    const hasPassiveVoice = /\b(am|is|are|was|were|been|being|have|has|had)\s+\w+ed\b/i.test(sentence);
    
    if (tellingWordsFound.length > 0 || hasPassiveVoice) {
      tellingCount++;
      analysis.tellingSentences.push(sentence.trim());
      
      // Generate specific suggestions
      if (hasPassiveVoice) {
        analysis.suggestions.push(`Consider rewriting in active voice: "${sentence.trim()}"`);
      }
      if (tellingWordsFound.length > 0) {
        analysis.suggestions.push(
          `Try showing instead of telling in: "${sentence.trim()}" (telling words: ${tellingWordsFound.join(', ')})`
        );
      }
    }
    
    if (sensoryWordsFound.length > 0) {
      showingCount++;
      analysis.showingSentences.push(sentence.trim());
    }
  });

  // Calculate show vs tell ratio
  const total = showingCount + tellingCount;
  analysis.showVsTellRatio = total > 0 ? showingCount / total : 0;

  // Add general suggestions based on the ratio
  if (analysis.showVsTellRatio < 0.4) {
    analysis.suggestions.push(
      "Your writing could benefit from more showing. Try using more sensory details and active verbs.",
      "Consider describing characters' actions and physical reactions instead of stating their emotions."
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
    const timeout = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      // Parallel requests for different types of analysis
      const [sentimentResponse, grammarResponse] = await Promise.all([
        // Sentiment Analysis
        fetch('https://api.cloudmersive.com/nlp-v2/analytics/sentiment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Apikey': cloudmersiveApiKey
          },
          body: JSON.stringify({ TextToAnalyze: text }),
          signal: controller.signal
        }),
        // Grammar Analysis
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

      const [sentimentData, grammarData]: [CloudmersiveResponse, GrammarAnalysisResponse] = await Promise.all([
        sentimentResponse.json(),
        grammarResponse.json()
      ]);

      console.log('API responses received:', {
        sentiment: sentimentData,
        grammar: grammarData
      });

      // Perform show vs tell analysis
      const showTellAnalysis = analyzeShowVsTell(text);
      const styleAnalysis = analyzeWritingStyle(text);

      // Generate comprehensive suggestions
      const suggestions = [
        // Grammar suggestions
        ...(grammarData.GrammaticalErrors || []).map(error => 
          `Grammar: ${error.Message}`
        ),
        // Show vs Tell suggestions
        ...showTellAnalysis.suggestions,
        // Style suggestions
        ...styleAnalysis.suggestions
      ];

      // Calculate normalized scores
      const grammarScore = grammarData.GrammaticalErrors ? 
        1 - (grammarData.GrammaticalErrors.length / (text.length / 100)) : 0.85;
      const showTellScore = showTellAnalysis.showVsTellRatio;
      const sentimentScore = (sentimentData.Sentiment.SentimentScore + 1) / 2;

      // Return comprehensive analysis results
      const result = {
        suggestions,
        scores: {
          grammar: grammarScore,
          style: styleAnalysis.styleScore,
          showVsTell: showTellScore,
          structure: sentences.length > 1 ? 0.75 : 0.5,
          sentiment: sentimentScore
        },
        details: {
          grammarErrors: grammarData.GrammaticalErrors || [],
          sentiment: sentimentData.Sentiment,
          showVsTell: {
            showingSentences: showTellAnalysis.showingSentences,
            tellingSentences: showTellAnalysis.tellingSentences,
            ratio: showTellAnalysis.showVsTellRatio
          }
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
        style: 0.8,
        showVsTell: 0.5,
        structure: 0.8,
        sentiment: 0.5
      }
    }), {
      status: 200, // Return 200 with fallback data instead of 500
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});