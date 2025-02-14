
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
  const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
  
  const showingWords = {
    // Sensory Details - Visual
    'sparkled': 'Indicates light reflecting or shimmering',
    'gleamed': 'Shows bright reflection of light',
    'shimmered': 'Describes a wavering light effect',
    'flickered': 'Shows unsteady or wavering movement of light',
    'glistened': 'Indicates shining with reflected light, often wet surfaces',
    
    // Sensory Details - Auditory
    'thundered': 'Describes loud, deep sound',
    'rustled': 'Shows soft sound of movement',
    'echoed': 'Indicates sound reflecting off surfaces',
    'whispered': 'Describes soft, hushed speaking',
    'roared': 'Shows loud, powerful sound',
    'growled': 'Indicates deep, threatening sound',
    'howled': 'Shows loud, prolonged crying or wailing sound',
    'murmured': 'Describes soft, continuous sound',
    
    // Sensory Details - Touch
    'rough': 'Describes uneven or coarse texture',
    'smooth': 'Shows even, unbroken surface',
    'sharp': 'Indicates pointed or cutting quality',
    'soft': 'Describes gentle or yielding texture',
    'freezing': 'Shows extreme cold sensation',
    'scorching': 'Indicates intense heat',
    
    // Action Verbs
    'grabbed': 'Shows sudden, forceful taking',
    'clutched': 'Indicates tight, desperate holding',
    'sprinted': 'Shows fast running',
    'slammed': 'Describes forceful closing or hitting',
    'dashed': 'Shows quick, sudden movement',
    'lunged': 'Indicates sudden forward movement',
    'crawled': 'Shows slow movement on hands and knees',
    'leaped': 'Describes jumping movement',
    'darted': 'Shows quick, sudden movement',
    'stomped': 'Indicates forceful stepping',
    'shuffled': 'Shows slow, dragging movement',
    'stumbled': 'Describes unsteady movement',
    'crept': 'Shows slow, stealthy movement',
    
    // Descriptive Adjectives
    'massive': 'Shows great size or bulk',
    'tiny': 'Indicates very small size',
    'ancient': 'Shows great age',
    'fresh': 'Indicates newness or recent origin',
    'vibrant': 'Shows bright, strong color or energy',
    'dull': 'Indicates lack of brightness or interest',
    'brilliant': 'Shows bright, intense quality',
    
    // Weather/Environment
    'misty': 'Shows foggy or unclear conditions',
    'stormy': 'Indicates violent weather',
    'humid': 'Shows moisture in air',
    'crisp': 'Indicates sharp, clear conditions',
    
    // Emotional Expression Through Action
    'trembled': 'Shows physical manifestation of fear/emotion',
    'beamed': 'Indicates showing happiness through facial expression',
    'slouched': 'Shows physical manifestation of defeat/tiredness',
    'fidgeted': 'Indicates nervous movement'
  };
  
  const tellingWords = {
    // State of Being
    'was': 'Direct statement of existence',
    'were': 'Direct statement of plural existence',
    'had': 'Direct statement of possession',
    'seemed': 'Indirect observation',
    'appeared': 'Indirect observation',
    'felt': 'Direct statement of emotion',
    'feel': 'Direct statement of current emotion',
    
    // Direct Emotion Statements
    'was angry': 'Direct statement of anger',
    'was sad': 'Direct statement of sadness',
    'was happy': 'Direct statement of happiness',
    'was scared': 'Direct statement of fear',
    'was excited': 'Direct statement of excitement',
    'was nervous': 'Direct statement of nervousness',
    
    // Passive Observations
    'watched': 'Passive observation',
    'looked': 'Passive observation',
    'saw': 'Passive observation',
    'heard': 'Passive auditory observation',
    'noticed': 'Passive observation',
    'realized': 'Internal recognition',
    'thought': 'Internal processing',
    'knew': 'Direct statement of knowledge',
    
    // Qualifiers
    'very': 'Intensifier that weakens description',
    'really': 'Intensifier that weakens description',
    'quite': 'Modifier that weakens impact',
    'rather': 'Modifier that weakens impact',
    'somewhat': 'Modifier that weakens impact',
    'extremely': 'Intensifier that weakens description',
    
    // Mental States
    'understood': 'Direct statement of comprehension',
    'believed': 'Direct statement of belief',
    'wondered': 'Direct statement of curiosity',
    'decided': 'Direct statement of decision making',
    
    // General States
    'it was': 'Non-specific scene setting',
    'there was': 'Non-specific scene setting',
    'there were': 'Non-specific scene setting',
    'started to': 'Indirect action description',
    'began to': 'Indirect action description',
    
    // Abstract Descriptions
    'beautiful': 'Non-specific positive description',
    'ugly': 'Non-specific negative description',
    'nice': 'Non-specific positive description',
    'bad': 'Non-specific negative description',
    'good': 'Non-specific positive description'
  };

  const analysis = {
    showingSentences: [] as string[],
    tellingSentences: [] as string[],
    ratio: 0,
    totalSentences: sentences.length,
    showingCount: 0,
    tellingCount: 0,
    showingWordsFound: {} as Record<string, string>,
    tellingWordsFound: {} as Record<string, string>
  };

  sentences.forEach(sentence => {
    const cleanSentence = sentence.trim().toLowerCase();
    let isShowing = false;
    let isTelling = false;
    
    // Check for showing words
    Object.entries(showingWords).forEach(([word, meaning]) => {
      if (cleanSentence.includes(word)) {
        analysis.showingCount++;
        isShowing = true;
        analysis.showingWordsFound[word] = meaning;
        if (!analysis.showingSentences.includes(sentence.trim())) {
          analysis.showingSentences.push(sentence.trim());
        }
      }
    });
    
    // Check for telling words
    Object.entries(tellingWords).forEach(([word, meaning]) => {
      if (cleanSentence.includes(word)) {
        analysis.tellingCount++;
        isTelling = true;
        analysis.tellingWordsFound[word] = meaning;
        if (!analysis.tellingSentences.includes(sentence.trim())) {
          analysis.tellingSentences.push(sentence.trim());
        }
      }
    });
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
      suggestions.push('Consider converting emotional statements into physical manifestations');
    }

    // Add specific examples based on telling words found
    if (Object.keys(analysis.tellingWordsFound).length > 0) {
      suggestions.push('Try replacing telling words with showing alternatives:');
      Object.entries(analysis.tellingWordsFound).forEach(([word, meaning]) => {
        if (word === 'was angry') {
          suggestions.push('Instead of "was angry", try "fists clenched, face reddening"');
        } else if (word === 'was sad') {
          suggestions.push('Instead of "was sad", try "shoulders slumped, eyes welling with tears"');
        } else if (word === 'was scared') {
          suggestions.push('Instead of "was scared", try "heart pounding, hands trembling"');
        }
      });
    }
  }

  // Grammar-based suggestions
  if (grammarScore < 0.7) {
    suggestions.push('Review the text for grammatical accuracy');
    suggestions.push('Consider simplifying complex sentences for clarity');
  }

  // Balance-based suggestions
  if (analysis.showingCount === 0) {
    suggestions.push('Add descriptive passages to make your writing more vivid');
    suggestions.push('Include sensory details to engage readers');
  }

  return suggestions;
}

