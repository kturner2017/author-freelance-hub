
import { useState } from 'react';
import { useToast } from '../components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FrontMatterContent {
  id: string;
  title: string;
  content: string;
  sort_order: number;
}

export const useFrontMatterManager = (bookId: string | undefined) => {
  const { toast } = useToast();
  const [frontMatterContents, setFrontMatterContents] = useState<FrontMatterContent[]>([]);
  const [selectedFrontMatter, setSelectedFrontMatter] = useState<FrontMatterContent | null>(null);

  const fetchEnabledFrontMatter = async () => {
    if (!bookId) return;
    
    try {
      const { data: options, error: optionsError } = await supabase
        .from('front_matter_options')
        .select('*')
        .eq('book_id', bookId)
        .eq('enabled', true)
        .order('sort_order', { ascending: true });

      if (optionsError) throw optionsError;

      const enabledContents: FrontMatterContent[] = [];
      
      for (const option of options || []) {
        const { data: content, error: contentError } = await supabase
          .from('front_matter_content')
          .select('*')
          .eq('book_id', bookId)
          .eq('front_matter_option_id', option.id)
          .maybeSingle();

        if (contentError && contentError.code !== 'PGRST116') {
          throw contentError;
        }

        enabledContents.push({
          id: option.id,
          title: option.title,
          content: content?.content || '',
          sort_order: option.sort_order
        });
      }

      const sortedContents = enabledContents.sort((a, b) => a.sort_order - b.sort_order);
      setFrontMatterContents(sortedContents);
    } catch (error) {
      console.error('Error fetching front matter:', error);
      toast({
        title: "Error",
        description: "Failed to load front matter content",
        variant: "destructive"
      });
    }
  };

  const handleFrontMatterSelect = async (frontMatterId: string, title: string) => {
    if (!bookId) return;
    
    try {
      const { data, error } = await supabase
        .from('front_matter_content')
        .select('*')
        .eq('book_id', bookId)
        .eq('front_matter_option_id', frontMatterId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      const selectedOption = frontMatterContents.find(fm => fm.id === frontMatterId) || {
        id: frontMatterId,
        title,
        content: '',
        sort_order: frontMatterContents.length
      };

      if (data) {
        setSelectedFrontMatter({
          ...selectedOption,
          content: data.content || ''
        });
      } else {
        const { data: newContent, error: insertError } = await supabase
          .from('front_matter_content')
          .insert({
            book_id: bookId,
            front_matter_option_id: frontMatterId,
            content: ''
          })
          .select()
          .single();

        if (insertError) throw insertError;

        setSelectedFrontMatter(selectedOption);
      }
    } catch (error) {
      console.error('Error loading front matter content:', error);
      toast({
        title: "Error",
        description: "Failed to load front matter content",
        variant: "destructive"
      });
    }
  };

  const handleFrontMatterContentChange = async (content: string) => {
    if (!selectedFrontMatter || !bookId) return;

    try {
      const { error } = await supabase
        .from('front_matter_content')
        .upsert({
          book_id: bookId,
          front_matter_option_id: selectedFrontMatter.id,
          content
        });

      if (error) throw error;

      setSelectedFrontMatter(prev => prev ? { ...prev, content } : null);
      setFrontMatterContents(prev => 
        prev.map(fm => 
          fm.id === selectedFrontMatter.id 
            ? { ...fm, content } 
            : fm
        )
      );
    } catch (error) {
      console.error('Error saving front matter content:', error);
      toast({
        title: "Error",
        description: "Failed to save front matter content",
        variant: "destructive"
      });
    }
  };

  return {
    frontMatterContents,
    selectedFrontMatter,
    setSelectedFrontMatter,
    fetchEnabledFrontMatter,
    handleFrontMatterSelect,
    handleFrontMatterContentChange
  };
};
