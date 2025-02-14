
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    // Clean HTML tags from text
    const cleanText = text?.replace(/<[^>]*>/g, '')?.trim();
    console.log('Analyzing text:', cleanText?.substring(0, 100) + '...');

    if (!cleanText || cleanText.length < 10) {
      return new Response(
        JSON.stringify({ error: 'Text must be at least 10 characters long' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const token = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
    if (!token) {
      throw new Error('Hugging Face token not configured');
    }

    const hf = new HfInference(token);
    
    // Grammar analysis using GPT-2 detector
    const grammarResponse = await hf.textClassification({
      model: 'textattack/roberta-base-CoLA',
      inputs: cleanText.slice(0, 500),
    });

    // Style analysis using sentiment model
    const styleResponse = await hf.textClassification({
      model: 'nlptown/bert-base-multilingual-uncased-sentiment',
      inputs: cleanText.slice(0, 500),
    });

    // Enhanced Show vs Tell analysis
    const showTellAnalysis = analyzeShowVsTell(cleanText);
    
    const result = {
      scores: {
        grammar: grammarResponse[0].score,
        style: (parseInt(styleResponse[0].label.split(' ')[0]) / 5),
        showVsTell: showTellAnalysis.ratio,
      },
      details: {
        showVsTell: showTellAnalysis,
      },
      suggestions: generateSuggestions(showTellAnalysis, grammarResponse[0].score)
    };

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-text function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function analyzeShowVsTell(text: string) {
  // Split into sentences, handling multiple punctuation marks
  const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
  
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
}

function generateSuggestions(analysis: any, grammarScore: number): string[] {
  const suggestions: string[] = [];

  // Show vs Tell suggestions
  if (analysis.ratio < 0.4) {
    suggestions.push('Consider using more descriptive language to show rather than tell');
    suggestions.push('Try incorporating more sensory details in your descriptions');
    
    if (analysis.tellingSentences.length > 0) {
      suggestions.push('Look for opportunities to replace passive observations with active descriptions');
    }
  }

  // Grammar-based suggestions
  if (grammarScore < 0.7) {
    suggestions.push('Review the text for grammatical accuracy');
    suggestions.push('Consider simplifying complex sentences for clarity');
  }

  // Balance-based suggestions
  if (analysis.showingCount === 0) {
    suggestions.push('Add some descriptive passages to make your writing more vivid');
  }

  return suggestions;
}
