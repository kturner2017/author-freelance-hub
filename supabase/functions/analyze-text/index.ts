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

    // Call Cloudmersive API for sentiment analysis
    const sentimentResponse = await fetch('https://api.cloudmersive.com/nlp-v2/analytics/sentiment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Apikey': cloudmersiveApiKey
      },
      body: JSON.stringify({ TextToAnalyze: text })
    });

    if (!sentimentResponse.ok) {
      throw new Error(`Cloudmersive API error: ${sentimentResponse.statusText}`);
    }

    const sentimentData: CloudmersiveResponse = await sentimentResponse.json();
    console.log('Cloudmersive API response:', sentimentData);

    // Process and normalize scores
    const normalizedScore = (sentimentData.Sentiment.SentimentScore + 1) / 2; // Convert from [-1,1] to [0,1]

    // Return analysis results
    const result = {
      suggestions: [
        `Overall sentiment: ${sentimentData.Sentiment.SentimentClass}`,
        normalizedScore > 0.7 ? 'The text has a very positive tone' :
        normalizedScore < 0.3 ? 'Consider revising for a more positive tone' :
        'The text has a neutral tone'
      ],
      scores: {
        grammar: 0.85, // Placeholder - could be enhanced with additional Cloudmersive APIs
        toxicity: 1 - normalizedScore, // Inverse of sentiment score
        style: 0.8, // Placeholder
        structure: 0.75 // Placeholder
      }
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in analyze-text function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});