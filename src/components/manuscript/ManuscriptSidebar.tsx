
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { ChevronRight, ChevronDown, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '../ui/switch';

interface FrontMatterOption {
  id: string;
  title: string;
  enabled: boolean;
  sort_order: number;
}

interface ManuscriptSidebarProps {
  bookId: string;
  onFrontMatterSelect: (id: string, title: string) => void;
}

const ManuscriptSidebar = ({ bookId, onFrontMatterSelect }: ManuscriptSidebarProps) => {
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
        .order('sort_order', { ascending: true });

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
        description: `${enabled ? 'Added' : 'Removed'} ${frontMatterOptions.find(opt => opt.id === optionId)?.title}`,
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
                <div className="ml-4 space-y-1">
                  {isLoading ? (
                    <div className="text-sm text-gray-400">Loading...</div>
                  ) : (
                    frontMatterOptions.map(option => (
                      <div key={option.id} className="space-y-1">
                        <div
                          className="flex items-center justify-between p-2 rounded"
                        >
                          <span className={`text-sm ${option.enabled ? 'text-white' : 'text-gray-400'}`}>
                            {option.title}
                          </span>
                          <Switch
                            checked={option.enabled}
                            onCheckedChange={(checked) => handleToggleOption(option.id, checked)}
                          />
                        </div>
                        {option.enabled && (
                          <button
                            onClick={() => onFrontMatterSelect(option.id, option.title)}
                            className="w-full flex items-center px-2 py-1.5 text-sm text-gray-300 hover:bg-white/10 rounded transition-colors"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            {option.title}
                          </button>
                        )}
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
