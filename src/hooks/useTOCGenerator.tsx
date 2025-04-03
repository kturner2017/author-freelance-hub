
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useTOCGenerator = (bookId: string | undefined, fetchEnabledFrontMatter: () => Promise<void>, handleFrontMatterSelect: (id: string, title: string) => void) => {
  const [showTOCGenerator, setShowTOCGenerator] = useState(false);
  const { toast } = useToast();

  const handleGenerateTOC = async (content: string) => {
    if (!bookId) return;
    
    // Find the Table of Contents front matter if it exists
    const { data: tocOptions } = await supabase
      .from('front_matter_options')
      .select('id')
      .eq('book_id', bookId)
      .eq('title', 'Table of Contents')
      .single();
    
    if (tocOptions) {
      // First enable the Table of Contents option if not already enabled
      await supabase
        .from('front_matter_options')
        .update({ enabled: true })
        .eq('id', tocOptions.id);
      
      // Check if content already exists
      const { data: existingContent } = await supabase
        .from('front_matter_content')
        .select('id')
        .eq('front_matter_option_id', tocOptions.id)
        .eq('book_id', bookId);
      
      if (existingContent && existingContent.length > 0) {
        // Update existing content
        await supabase
          .from('front_matter_content')
          .update({ content })
          .eq('id', existingContent[0].id);
      } else {
        // Create new content
        await supabase
          .from('front_matter_content')
          .insert([{
            front_matter_option_id: tocOptions.id,
            book_id: bookId,
            content
          }]);
      }
      
      // Refresh front matter content
      await fetchEnabledFrontMatter();
      
      // Select the TOC front matter
      handleFrontMatterSelect(tocOptions.id, 'Table of Contents');
      setShowTOCGenerator(false);
      
      toast({
        title: "Table of Contents Generated",
        description: "The TOC has been created and saved to your front matter",
      });
    }
  };

  return {
    showTOCGenerator,
    setShowTOCGenerator,
    handleGenerateTOC
  };
};
