import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.ts';

interface RequestBody {
  text: string;
}

async function analyzeGrammar(text: string, token: string) {
  console.log('Analyzing grammar with Hugging Face...');
  const response = await fetch(
    "https://api-inference.huggingface.co/models/textattack/roberta-base-CoLA",
    {
      headers: { Authorization: `Bearer ${token}` },
      method: "POST",
      body: JSON.stringify({ inputs: text }),
    }
  );
  
  if (!response.ok) {
    throw new Error(`Grammar analysis failed: ${response.statusText}`);
  }
  
  const result = await response.json();
  console.log('Grammar analysis result:', result);
  return result[0];
}

async function analyzeStyle(text: string, token: string) {
  console.log('Analyzing writing style...');
  const response = await fetch(
    "https://api-inference.huggingface.co/models/cross-encoder/ms-marco-MiniLM-L-4-v2",
    {
      headers: { Authorization: `Bearer ${token}` },
      method: "POST",
      body: JSON.stringify({ inputs: text }),
    }
  );
  
  if (!response.ok) {
    throw new Error(`Style analysis failed: ${response.statusText}`);
  }
  
  const result = await response.json();
  console.log('Style analysis result:', result);
  return result[0];
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
    const { text } = (await req.json()) as RequestBody;
    console.log('Analyzing text:', text.substring(0, 100) + '...');

    if (!text || text.length < 10) {
      throw new Error('Text must be at least 10 characters long');
    }

    const token = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
    if (!token) {
      throw new Error('Hugging Face token not configured');
    }

    const [grammarAnalysis, styleAnalysis] = await Promise.all([
      analyzeGrammar(text, token),
      analyzeStyle(text, token)
    ]);

    const showTellAnalysis = analyzeShowVsTell(text);

    const suggestions = [];
    
    // Grammar suggestions
    if (grammarAnalysis.score < 0.7) {
      suggestions.push('Consider reviewing the text for grammatical accuracy');
    }

    // Style suggestions
    if (styleAnalysis.score < 0.6) {
      suggestions.push('Try varying sentence structure for better readability');
    }

    // Show vs Tell suggestions
    if (showTellAnalysis.ratio < 0.4) {
      suggestions.push('Consider using more descriptive language to show rather than tell');
      suggestions.push('Replace abstract descriptions with concrete sensory details');
    }

    const result = {
      scores: {
        grammar: grammarAnalysis.score,
        style: styleAnalysis.score,
        showVsTell: showTellAnalysis.ratio
      },
      details: {
        showVsTell: showTellAnalysis
      },
      suggestions
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in analyze-text function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      suggestions: ['Analysis service is temporarily unavailable'],
      scores: {
        grammar: 0.8,
        style: 0.5,
        showVsTell: 0.5
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});