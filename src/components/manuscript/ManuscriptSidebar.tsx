
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '../ui/switch';

interface FrontMatterOption {
  id: string;
  title: string;
  enabled: boolean;
}

interface ManuscriptSidebarProps {
  bookId: string;
}

const ManuscriptSidebar = ({ bookId }: ManuscriptSidebarProps) => {
  const { toast } = useToast();
  const [expandedSections, setExpandedSections] = useState({
    frontMatter: true,
    chapters: false
  });
  const [frontMatterOptions, setFrontMatterOptions] = useState<FrontMatterOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFrontMatterOptions();
  }, [bookId]);

  const fetchFrontMatterOptions = async () => {
    try {
      const { data, error } = await supabase
        .from('front_matter_options')
        .select('*')
        .eq('book_id', bookId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setFrontMatterOptions(data || []);
    } catch (error) {
      console.error('Error fetching front matter options:', error);
      toast({
        title: "Error",
        description: "Failed to load front matter options",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleToggleOption = async (optionId: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('front_matter_options')
        .update({ enabled })
        .eq('id', optionId);

      if (error) throw error;

      setFrontMatterOptions(prev =>
        prev.map(opt =>
          opt.id === optionId ? { ...opt, enabled } : opt
        )
      );

      toast({
        title: "Success",
        description: `${enabled ? 'Enabled' : 'Disabled'} front matter option`,
      });
    } catch (error) {
      console.error('Error updating front matter option:', error);
      toast({
        title: "Error",
        description: "Failed to update front matter option",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-64 bg-[#2c3643] text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Manuscript</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          <div className="space-y-1">
            {/* Front Matter Section */}
            <div>
              <button
                onClick={() => handleToggleSection('frontMatter')}
                className="w-full flex items-center justify-between p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <span className="font-medium">Front Matter</span>
                {expandedSections.frontMatter ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              
              {expandedSections.frontMatter && (
                <div className="ml-4 space-y-2 mt-2">
                  {isLoading ? (
                    <div className="text-sm text-gray-400">Loading...</div>
                  ) : (
                    frontMatterOptions.map(option => (
                      <div
                        key={option.id}
                        className="flex items-center justify-between p-2 hover:bg-white/5 rounded"
                      >
                        <span className="text-sm">{option.title}</span>
                        <Switch
                          checked={option.enabled}
                          onCheckedChange={(checked) => handleToggleOption(option.id, checked)}
                        />
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ManuscriptSidebar;
