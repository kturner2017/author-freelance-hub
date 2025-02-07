
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../ui/use-toast';
import DashboardLayout from '../layout/DashboardLayout';
import { getTotalWordCount } from '@/utils/wordCount';
import ChapterList from './ChapterList';
import ChapterEditor from './ChapterEditor';
import ChapterToolbar from './ChapterToolbar';
import ManuscriptSidebar from './ManuscriptSidebar';
import { useChapterManagement } from '@/hooks/useChapterManagement';
import { useContentManagement } from '@/hooks/useContentManagement';
import { supabase } from '@/integrations/supabase/client';
import RichTextEditor from '../RichTextEditor';

interface FrontMatterContent {
  id: string;
  title: string;
  content: string;
  sort_order: number;
}

const ChaptersEditor = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const { toast } = useToast();
  const [bookData, setBookData] = useState({ title: '', author: '' });
  const [frontMatterContents, setFrontMatterContents] = useState<FrontMatterContent[]>([]);
  const [selectedFrontMatter, setSelectedFrontMatter] = useState<FrontMatterContent | null>(null);
  
  const {
    selectedChapter,
    setSelectedChapter,
    chapters,
    isLoading,
    handleChapterRename,
    handleChapterDelete,
    handleChapterMove,
    handleAddChapter
  } = useChapterManagement(bookId);

  const {
    isAnalyzing,
    aiAnalysis,
    handleContentChange,
    handleSave
  } = useContentManagement();

  const fetchEnabledFrontMatter = async () => {
    if (!bookId) return;
    
    try {
      console.log('Fetching front matter for book:', bookId);
      const { data: options, error: optionsError } = await supabase
        .from('front_matter_options')
        .select('*')
        .eq('book_id', bookId)
        .eq('enabled', true)
        .order('sort_order', { ascending: true });

      if (optionsError) throw optionsError;

      console.log('Enabled front matter options:', options);
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

        console.log(`Front matter content for option ${option.id}:`, content);
        enabledContents.push({
          id: option.id,
          title: option.title,
          content: content?.content || '',
          sort_order: option.sort_order
        });
      }

      const sortedContents = enabledContents.sort((a, b) => a.sort_order - b.sort_order);
      console.log('Sorted front matter contents:', sortedContents);
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
      
      setSelectedChapter(null);
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

  useEffect(() => {
    const fetchBookData = async () => {
      if (!bookId) return;
      
      const { data, error } = await supabase
        .from('books')
        .select('title, author')
        .eq('id', bookId)
        .single();

      if (error) {
        console.error('Error fetching book data:', error);
        toast({
          title: "Error",
          description: "Failed to load book details",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        setBookData(data);
      }
    };

    fetchBookData();
    fetchEnabledFrontMatter();
  }, [bookId]);

  if (isLoading) {
    return (
      <DashboardLayout title="Chapters Editor">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Chapters Editor"
      actions={
        <ChapterToolbar 
          totalWordCount={getTotalWordCount(Object.values(chapters))}
          onSave={() => handleSave(selectedChapter)}
          onAddChapter={handleAddChapter}
        />
      }
    >
      <div className="flex-1 flex">
        <ManuscriptSidebar 
          bookId={bookId || ''} 
          onFrontMatterSelect={handleFrontMatterSelect}
        />
        <ChapterList
          chapters={chapters}
          selectedChapter={selectedChapter}
          onChapterSelect={setSelectedChapter}
          onChapterRename={handleChapterRename}
          onChapterDelete={handleChapterDelete}
          onChapterMove={handleChapterMove}
        />
        <div className="flex-1 bg-white">
          {selectedFrontMatter ? (
            <div className="p-8 max-w-4xl mx-auto">
              <h2 className="text-3xl font-serif font-semibold text-primary-800 mb-8">
                {selectedFrontMatter.title}
              </h2>
              <RichTextEditor
                content={selectedFrontMatter.content}
                onChange={handleFrontMatterContentChange}
              />
            </div>
          ) : !selectedChapter ? (
            <div className="max-w-4xl mx-auto p-8">
              {frontMatterContents.map((fm) => (
                <div key={fm.id} className="mb-12">
                  <h2 className="text-3xl font-serif font-semibold text-primary-800 mb-8">
                    {fm.title}
                  </h2>
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: fm.content }} />
                </div>
              ))}
              {frontMatterContents.length === 0 && (
                <div className="text-center text-gray-500">
                  Select a chapter or front matter section to start editing
                </div>
              )}
            </div>
          ) : (
            <ChapterEditor
              key={`chapter-${selectedChapter.id}`}
              chapter={selectedChapter}
              onContentChange={(content) => {
                const updatedChapter = { ...selectedChapter, content };
                setSelectedChapter(updatedChapter);
                handleContentChange(content, updatedChapter);
              }}
              aiAnalysis={aiAnalysis}
              isAnalyzing={isAnalyzing}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChaptersEditor;

