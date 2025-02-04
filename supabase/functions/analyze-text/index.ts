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

      // Process and normalize scores
      const normalizedScore = (sentimentData.Sentiment.SentimentScore + 1) / 2;
      
      // Generate writing suggestions
      const suggestions = [];
      
      // Add grammar-based suggestions
      if (grammarData.GrammaticalErrors && grammarData.GrammaticalErrors.length > 0) {
        suggestions.push(
          ...grammarData.GrammaticalErrors.map(error => 
            `Grammar: ${error.Message} (at position ${error.StartPosition})`
          )
        );
      }

      // Add sentiment-based suggestions
      suggestions.push(
        `Overall tone: ${sentimentData.Sentiment.SentimentClass}`,
        normalizedScore > 0.7 ? 'The text has a very positive tone' :
        normalizedScore < 0.3 ? 'Consider revising for a more positive tone' :
        'The text has a neutral tone'
      );

      // Add writing style suggestions based on text analysis
      const sentences = text.split(/[.!?]+/).filter(Boolean);
      if (sentences.some(s => s.trim().length > 50)) {
        suggestions.push('Consider breaking down some longer sentences for better readability');
      }

      // Return comprehensive analysis results
      const result = {
        suggestions,
        scores: {
          grammar: grammarData.GrammaticalErrors ? 
            1 - (grammarData.GrammaticalErrors.length / (text.length / 100)) : 0.85,
          style: 0.8,
          structure: sentences.length > 1 ? 0.75 : 0.5,
          sentiment: normalizedScore
        },
        details: {
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
        toxicity: 0.2,
        style: 0.8,
        structure: 0.8
      }
    }), {
      status: 200, // Return 200 with fallback data instead of 500
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});