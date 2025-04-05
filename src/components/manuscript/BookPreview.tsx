
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, BookOpen, Download, Files, Settings } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';

const BookPreview = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookData, setBookData] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [bookFormat, setBookFormat] = useState<'6x9' | '5x8' | 'a4'>('6x9');
  const [viewMode, setViewMode] = useState<'single' | 'spread'>('single');
  const [fontFamily, setFontFamily] = useState('Georgia');
  const [fontSize, setFontSize] = useState(12);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [margins, setMargins] = useState({
    top: 1,
    right: 1,
    bottom: 1,
    left: 1
  });
  const [isLoading, setIsLoading] = useState(true);
  const [includePageNumbers, setIncludePageNumbers] = useState(true);
  const [includeTableOfContents, setIncludeTableOfContents] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  React.useEffect(() => {
    const fetchBookData = async () => {
      if (!bookId) return;
      
      try {
        setIsLoading(true);
        
        // Fetch book metadata
        const { data: bookData, error: bookError } = await supabase
          .from('books')
          .select('*')
          .eq('id', bookId)
          .single();
          
        if (bookError) throw bookError;
        
        // Fetch chapters - using manuscript_chapters instead of chapters
        const { data: chaptersData, error: chaptersError } = await supabase
          .from('manuscript_chapters')
          .select('*')
          .eq('book_id', bookId)
          .order('sort_order', { ascending: true });
          
        if (chaptersError) throw chaptersError;
        
        setBookData(bookData);
        setChapters(chaptersData || []);
      } catch (error) {
        console.error('Error loading book preview data:', error);
        toast({
          title: "Error loading book",
          description: "There was a problem loading your book preview.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookData();
  }, [bookId, toast]);

  const handleExportToPdf = () => {
    toast({
      title: "Export initiated",
      description: "Your book is being prepared as PDF. This may take a moment.",
    });
    
    // In a real implementation, this would connect to a PDF generation service
    setTimeout(() => {
      toast({
        title: "PDF Ready",
        description: "Your book has been exported successfully as PDF.",
      });
    }, 2000);
  };

  const handleExportToEpub = () => {
    toast({
      title: "Export initiated",
      description: "Your book is being prepared as ePub. This may take a moment.",
    });
    
    // In a real implementation, this would connect to an ePub generation service
    setTimeout(() => {
      toast({
        title: "ePub Ready",
        description: "Your book has been exported successfully as ePub.",
      });
    }, 2000);
  };

  const getPageWidth = () => {
    switch(bookFormat) {
      case '6x9': return '6in';
      case '5x8': return '5in';
      case 'a4': return '210mm';
      default: return '6in';
    }
  };

  const getPageHeight = () => {
    switch(bookFormat) {
      case '6x9': return '9in';
      case '5x8': return '8in';
      case 'a4': return '297mm';
      default: return '9in';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="flex items-center gap-4 max-w-7xl mx-auto px-4 h-16">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/editor/manuscript/${bookId}/chapters`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Book Preview</h1>
          <div className="ml-auto flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Format Settings
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Book Format</h4>
                    <Select value={bookFormat} onValueChange={(value: '6x9' | '5x8' | 'a4') => setBookFormat(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6x9">6" x 9" (Standard)</SelectItem>
                        <SelectItem value="5x8">5" x 8" (Digest)</SelectItem>
                        <SelectItem value="a4">A4 (International)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Font Family</h4>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                        <SelectItem value="Garamond">Garamond</SelectItem>
                        <SelectItem value="Baskerville">Baskerville</SelectItem>
                        <SelectItem value="Palatino">Palatino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Font Size: {fontSize}pt</Label>
                    </div>
                    <Slider 
                      value={[fontSize]} 
                      min={9} 
                      max={18} 
                      step={0.5}
                      onValueChange={(value) => setFontSize(value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Line Height: {lineHeight.toFixed(1)}</Label>
                    </div>
                    <Slider 
                      value={[lineHeight]} 
                      min={1} 
                      max={2} 
                      step={0.1}
                      onValueChange={(value) => setLineHeight(value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Margins (inches)</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-xs">Top: {margins.top}"</Label>
                        <Slider 
                          value={[margins.top]} 
                          min={0.5} 
                          max={2} 
                          step={0.1}
                          onValueChange={(value) => setMargins({...margins, top: value[0]})}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Right: {margins.right}"</Label>
                        <Slider 
                          value={[margins.right]} 
                          min={0.5} 
                          max={2} 
                          step={0.1}
                          onValueChange={(value) => setMargins({...margins, right: value[0]})}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Bottom: {margins.bottom}"</Label>
                        <Slider 
                          value={[margins.bottom]} 
                          min={0.5} 
                          max={2} 
                          step={0.1}
                          onValueChange={(value) => setMargins({...margins, bottom: value[0]})}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Left: {margins.left}"</Label>
                        <Slider 
                          value={[margins.left]} 
                          min={0.5} 
                          max={2} 
                          step={0.1}
                          onValueChange={(value) => setMargins({...margins, left: value[0]})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="page-numbers">Page Numbers</Label>
                      <Switch 
                        id="page-numbers" 
                        checked={includePageNumbers} 
                        onCheckedChange={setIncludePageNumbers}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="table-of-contents">Table of Contents</Label>
                      <Switch 
                        id="table-of-contents" 
                        checked={includeTableOfContents} 
                        onCheckedChange={setIncludeTableOfContents}
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <Tabs defaultValue="single" onValueChange={(value) => setViewMode(value as 'single' | 'spread')}>
              <TabsList>
                <TabsTrigger value="single">Single Page</TabsTrigger>
                <TabsTrigger value="spread">Spread View</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button onClick={handleExportToPdf} className="ml-2">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            
            <Button onClick={handleExportToEpub} variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Export ePub
            </Button>
          </div>
        </div>
      </div>
      
      <ScrollArea className="h-[calc(100vh-4rem)] py-8">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className={viewMode === 'spread' ? 'flex gap-4' : ''}>
              <div 
                className="bg-white shadow-lg border relative mx-auto"
                style={{
                  width: getPageWidth(),
                  height: getPageHeight(),
                  padding: `${margins.top}in ${margins.right}in ${margins.bottom}in ${margins.left}in`,
                  fontFamily,
                  fontSize: `${fontSize}pt`,
                  lineHeight: lineHeight,
                }}
              >
                {includePageNumbers && (
                  <div className="absolute bottom-2 text-center w-full left-0 text-gray-500 text-sm">
                    {currentPage}
                  </div>
                )}
                
                <div className="text-center mb-16">
                  <h1 className="text-3xl font-bold mb-4">{bookData?.title || 'Book Title'}</h1>
                  <h2 className="text-xl mb-2">by</h2>
                  <h3 className="text-2xl">{bookData?.author || 'Author Name'}</h3>
                </div>
                
                {includeTableOfContents && (
                  <div className="mb-16">
                    <h2 className="text-xl font-bold mb-4 text-center">Table of Contents</h2>
                    <ul className="space-y-2">
                      {chapters.map((chapter, index) => (
                        <li key={chapter.id} className="flex justify-between">
                          <span>{chapter.chapter_id || `Chapter ${index + 1}`}</span>
                          <span className="text-gray-500">{index + 1}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div>
                  {/* This would render the actual chapter content */}
                  <p>First chapter content would appear here...</p>
                </div>
              </div>
              
              {viewMode === 'spread' && (
                <div 
                  className="bg-white shadow-lg border relative mx-auto"
                  style={{
                    width: getPageWidth(),
                    height: getPageHeight(),
                    padding: `${margins.top}in ${margins.right}in ${margins.bottom}in ${margins.left}in`,
                    fontFamily,
                    fontSize: `${fontSize}pt`,
                    lineHeight: lineHeight,
                  }}
                >
                  {includePageNumbers && (
                    <div className="absolute bottom-2 text-center w-full left-0 text-gray-500 text-sm">
                      {currentPage + 1}
                    </div>
                  )}
                  
                  <div>
                    <p>Continued content would appear here...</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default BookPreview;
