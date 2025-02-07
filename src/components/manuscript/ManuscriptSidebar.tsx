
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { ChevronRight } from 'lucide-react';
import FrontMatterSection from './FrontMatterSection';
import ChapterListSection from './ChapterListSection';
import ActSection from './ActSection';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Chapter {
  id: string;
  title: string;
}

interface ManuscriptSidebarProps {
  bookData: {
    title: string;
    author: string;
  };
  chapters: Chapter[];
  selectedChapter: string;
  expandedSections: {
    frontMatter: boolean;
    act1: boolean;
    act2: boolean;
    act3: boolean;
  };
  editingChapterId: string | null;
  editingChapterTitle: string;
  boxes: {
    [key: string]: {
      id: string;
      title: string;
      content: string;
      act: 'act1' | 'act2' | 'act3';
    };
  };
  frontMatterOptions: {
    id: string;
    title: string;
    enabled: boolean;
  }[];
  onChapterSelect: (chapterId: string) => void;
  onChapterAdd: () => void;
  onChapterDelete: (chapterId: string) => void;
  onChapterMove: (chapterId: string, direction: 'up' | 'down') => void;
  onChapterEditStart: (chapter: Chapter) => void;
  onChapterEditSave: () => void;
  onChapterEditCancel: () => void;
  onChapterTitleChange: (title: string) => void;
  onSectionToggle: (section: 'frontMatter' | 'act1' | 'act2' | 'act3') => void;
  onBoxSelect: (box: any) => void;
  onFrontMatterOptionToggle: (id: string) => void;
}

const ManuscriptSidebar = ({
  bookData,
  chapters,
  selectedChapter,
  expandedSections,
  editingChapterId,
  editingChapterTitle,
  boxes,
  frontMatterOptions,
  onChapterSelect,
  onChapterAdd,
  onChapterDelete,
  onChapterMove,
  onChapterEditStart,
  onChapterEditSave,
  onChapterEditCancel,
  onChapterTitleChange,
  onSectionToggle,
  onBoxSelect,
  onFrontMatterOptionToggle,
}: ManuscriptSidebarProps) => {
  const { toast } = useToast();
  const [localFrontMatterOptions, setLocalFrontMatterOptions] = useState(frontMatterOptions);
  const bookId = window.location.pathname.split('/')[3]; // Get book ID from URL

  useEffect(() => {
    const fetchFrontMatterOptions = async () => {
      const { data, error } = await supabase
        .from('front_matter_options')
        .select('*')
        .eq('book_id', bookId);

      if (error) {
        console.error('Error fetching front matter options:', error);
        toast({
          title: "Error",
          description: "Failed to load front matter options",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setLocalFrontMatterOptions(data);
      }
    };

    fetchFrontMatterOptions();
  }, [bookId]);

  const handleFrontMatterOptionToggle = async (id: string) => {
    const option = localFrontMatterOptions.find(opt => opt.id === id);
    if (!option) return;

    const { error } = await supabase
      .from('front_matter_options')
      .update({ enabled: !option.enabled })
      .eq('id', id);

    if (error) {
      console.error('Error updating front matter option:', error);
      toast({
        title: "Error",
        description: "Failed to update front matter option",
        variant: "destructive",
      });
      return;
    }

    setLocalFrontMatterOptions(prevOptions =>
      prevOptions.map(opt =>
        opt.id === id ? { ...opt, enabled: !opt.enabled } : opt
      )
    );

    onFrontMatterOptionToggle(id);
  };

  const getBoxesForAct = (act: 'act1' | 'act2' | 'act3') => {
    return Object.values(boxes).filter(box => box.act === act);
  };

  return (
    <div className="w-64 bg-[#2c3643] text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">{bookData.title}</h2>
        <p className="text-sm text-gray-400">by {bookData.author}</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          <div className="space-y-1">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-300 hover:bg-gray-700 active:bg-gray-600 transition-colors duration-200 py-1 h-auto"
            >
              <div className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2" />
                Get Started
              </div>
            </Button>

            <FrontMatterSection
              expanded={expandedSections.frontMatter}
              options={localFrontMatterOptions}
              onToggleExpand={() => onSectionToggle('frontMatter')}
              onOptionToggle={handleFrontMatterOptionToggle}
            />

            <ChapterListSection
              chapters={chapters}
              selectedChapter={selectedChapter}
              editingChapterId={editingChapterId}
              editingChapterTitle={editingChapterTitle}
              onChapterSelect={onChapterSelect}
              onChapterAdd={onChapterAdd}
              onChapterDelete={onChapterDelete}
              onChapterMove={onChapterMove}
              onChapterEditStart={onChapterEditStart}
              onChapterEditSave={onChapterEditSave}
              onChapterEditCancel={onChapterEditCancel}
              onChapterTitleChange={onChapterTitleChange}
            />

            {['act1', 'act2'].map((act) => (
              <ActSection
                key={act}
                act={act as 'act1' | 'act2'}
                expanded={expandedSections[act as keyof typeof expandedSections]}
                boxes={getBoxesForAct(act as 'act1' | 'act2')}
                onSectionToggle={() => onSectionToggle(act as 'act1' | 'act2')}
                onBoxSelect={onBoxSelect}
              />
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ManuscriptSidebar;
