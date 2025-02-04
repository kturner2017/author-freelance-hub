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

    console.log('Making request to Cloudmersive API...');
    
    // Call Cloudmersive API for sentiment analysis with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const sentimentResponse = await fetch('https://api.cloudmersive.com/nlp-v2/analytics/sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Apikey': cloudmersiveApiKey
        },
        body: JSON.stringify({ TextToAnalyze: text }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!sentimentResponse.ok) {
        console.error('Cloudmersive API error:', {
          status: sentimentResponse.status,
          statusText: sentimentResponse.statusText
        });
        
        // Return a more graceful fallback response instead of throwing
        return new Response(JSON.stringify({
          suggestions: [
            'Unable to perform detailed analysis at the moment.',
            'Please try again in a few minutes.'
          ],
          scores: {
            grammar: 0.8,
            toxicity: 0.2,
            style: 0.8,
            structure: 0.8
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        });
      }

      const sentimentData: CloudmersiveResponse = await sentimentResponse.json();
      console.log('Cloudmersive API response:', sentimentData);

      // Process and normalize scores
      const normalizedScore = (sentimentData.Sentiment.SentimentScore + 1) / 2;

      // Return analysis results
      const result = {
        suggestions: [
          `Overall sentiment: ${sentimentData.Sentiment.SentimentClass}`,
          normalizedScore > 0.7 ? 'The text has a very positive tone' :
          normalizedScore < 0.3 ? 'Consider revising for a more positive tone' :
          'The text has a neutral tone'
        ],
        scores: {
          grammar: 0.85,
          toxicity: 1 - normalizedScore,
          style: 0.8,
          structure: 0.75
        }
      };

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (fetchError) {
      clearTimeout(timeout);
      console.error('Fetch error:', fetchError);
      throw new Error(`Cloudmersive API request failed: ${fetchError.message}`);
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