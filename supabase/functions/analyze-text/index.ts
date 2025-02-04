import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  text: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { text } = await req.json() as RequestBody;
    console.log('Analyzing text:', text.substring(0, 100) + '...');

    const models = [
      'textattack/roberta-base-CoLA',
      'SkolkovoInstitute/roberta_toxicity_classifier',
      'cointegrated/roberta-large-cola-krishna2020',
      'textattack/distilbert-base-cased-CoLA'
    ];

    const analysisResults = await Promise.all(models.map(async (model) => {
      try {
        const response = await fetch(
          `https://api-inference.huggingface.co/models/${model}`,
          {
            headers: {
              Authorization: `Bearer ${Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')}`,
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ inputs: text }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(`Analysis result from ${model}:`, result);
        return { model, result };
      } catch (error) {
        console.error(`Error analyzing with model ${model}:`, error);
        return { model, result: null };
      }
    }));

    const suggestions = [];
    let grammarScore = 0.5;
    let toxicityScore = 0;
    let styleScore = 0.5;
    let structureScore = 0.5;
    
    // Process grammar analysis
    if (analysisResults[0]?.result) {
      grammarScore = analysisResults[0].result[0]?.[1] || 0.5;
      if (grammarScore < 0.8) {
        suggestions.push("Consider reviewing your grammar and sentence structure.");
      }
    }

    // Process toxicity analysis
    if (analysisResults[1]?.result) {
      toxicityScore = analysisResults[1].result[0]?.score || 0;
      if (toxicityScore > 0.3) {
        suggestions.push("Some phrases might come across as too strong or negative. Consider softening your tone.");
      }
    }

    // Process writing style analysis
    if (analysisResults[2]?.result) {
      styleScore = analysisResults[2].result[0]?.[1] || 0.5;
      if (styleScore < 0.7) {
        suggestions.push("Your writing style could be more engaging. Try varying sentence length and structure.");
      }
    }

    // Process sentence structure analysis
    if (analysisResults[3]?.result) {
      structureScore = analysisResults[3].result[0]?.[1] || 0.5;
      if (structureScore < 0.75) {
        suggestions.push("Some sentences might be too complex. Consider breaking them into smaller, clearer statements.");
      }
    }

    return new Response(
      JSON.stringify({
        suggestions,
        scores: {
          grammar: grammarScore,
          toxicity: 1 - toxicityScore, // Invert toxicity score so higher is better
          style: styleScore,
          structure: structureScore
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error analyzing text:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze text',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})