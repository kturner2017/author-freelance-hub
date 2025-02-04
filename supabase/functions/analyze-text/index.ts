import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function analyzeText(text: string, hf: HfInference) {
  console.log('Starting text analysis with cleaned text:', text.substring(0, 100));
  
  try {
    // Grammar analysis using GPT-2 detector
    const grammarResponse = await hf.textClassification({
      model: 'textattack/roberta-base-CoLA',
      inputs: text.slice(0, 500),
    });
    console.log('Grammar analysis result:', grammarResponse);

    // Style analysis using sentiment model
    const styleResponse = await hf.textClassification({
      model: 'nlptown/bert-base-multilingual-uncased-sentiment',
      inputs: text.slice(0, 500),
    });
    console.log('Style analysis result:', styleResponse);

    // Show vs Tell analysis
    const showTellAnalysis = analyzeShowVsTell(text);
    
    return {
      scores: {
        grammar: grammarResponse[0].score,
        style: (parseInt(styleResponse[0].label.split(' ')[0]) / 5),
        showVsTell: showTellAnalysis.ratio,
      },
      details: {
        showVsTell: {
          ...showTellAnalysis,
          tellingSentences: showTellAnalysis.tellingSentences.map(s => s.trim())
        },
      },
      suggestions: [
        ...(grammarResponse[0].score < 0.7 ? ['Consider reviewing the text for grammatical accuracy'] : []),
        ...(showTellAnalysis.ratio < 0.4 ? [
          'Try to show more through descriptive language rather than telling',
          'Add more sensory details to make your writing more vivid'
        ] : [])
      ]
    };
  } catch (error) {
    console.error('Error during text analysis:', error);
    throw error;
  }
}

function analyzeShowVsTell(text: string) {
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  const showingWords = [
    'sparkled', 'gleamed', 'thundered', 'rustled', 'trembled',
    'bitter', 'sweet', 'rough', 'smooth', 'sharp',
    'grabbed', 'clutched', 'sprinted', 'slammed'
  ];
  
  const tellingWords = [
    'felt', 'feel', 'was angry', 'was sad', 'wondered',
    'watched', 'looked', 'seemed', 'appeared',
    'very', 'really', 'quite', 'rather'
  ];

  const analysis = {
    showingSentences: [] as string[],
    tellingSentences: [] as string[],
    ratio: 0
  };

  let showingCount = 0;
  let tellingCount = 0;

  sentences.forEach(sentence => {
    const words = sentence.toLowerCase().split(/\s+/);
    let isShowing = false;
    let isTelling = false;
    
    if (words.some(word => showingWords.some(show => word.includes(show)))) {
      showingCount++;
      isShowing = true;
      analysis.showingSentences.push(sentence.trim());
    }
    
    if (words.some(word => tellingWords.some(tell => word.includes(tell)))) {
      tellingCount++;
      isTelling = true;
      analysis.tellingSentences.push(sentence.trim());
    }
  });

  analysis.ratio = showingCount / (showingCount + tellingCount) || 0;
  return analysis;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    console.log('Analyzing text:', text.substring(0, 100) + '...');

    if (!text || text.length < 10) {
      throw new Error('Text must be at least 10 characters long');
    }

    const token = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
    if (!token) {
      throw new Error('Hugging Face token not configured');
    }

    const hf = new HfInference(token);
    const result = await analyzeText(text, hf);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-text function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        scores: {
          grammar: 0.8,
          style: 0.7,
          showVsTell: 0.6,
        },
        suggestions: ['Analysis service encountered an error. Please try again later.'],
        details: {
          showVsTell: {
            showingSentences: [],
            tellingSentences: [],
            ratio: 0.6
          }
        }
      }), 
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
