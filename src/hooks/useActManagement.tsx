
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Act {
  id: string;
  title: string;
  sort_order: number;
}

export const useActManagement = (bookId: string | undefined) => {
  const [acts, setActs] = useState<Act[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadActs = async () => {
    if (!bookId) return;
    
    try {
      const { data, error } = await supabase
        .from('manuscript_acts')
        .select('*')
        .eq('book_id', bookId)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      setActs(data || []);
    } catch (error) {
      console.error('Error loading acts:', error);
      toast({
        title: "Error loading acts",
        description: "Failed to load acts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAct = async () => {
    if (!bookId) return;

    const nextSortOrder = acts.length > 0 
      ? Math.max(...acts.map(act => act.sort_order)) + 1 
      : 1;

    const newAct = {
      book_id: bookId,
      title: `Act ${nextSortOrder}`,
      sort_order: nextSortOrder
    };

    try {
      const { data, error } = await supabase
        .from('manuscript_acts')
        .insert([newAct])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setActs(prev => [...prev, data]);
        toast({
          title: "Act added",
          description: "New act has been created successfully."
        });
      }
    } catch (error) {
      console.error('Error adding act:', error);
      toast({
        title: "Error adding act",
        description: "Failed to create new act. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadActs();
  }, [bookId]);

  return {
    acts,
    isLoading,
    handleAddAct
  };
};
