
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft, 
  BookOpen, 
  Download, 
  Files, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

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
  const [totalPages, setTotalPages] = useState(1);
  const [frontMatterContents, setFrontMatterContents] = useState<any[]>([]);
  const [coverImageUploadOpen, setCoverImageUploadOpen] = useState(false);
  const [uploadedCoverImage, setUploadedCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
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
        
        // Fetch front matter content
        const { data: frontMatterData, error: frontMatterError } = await supabase
          .from('front_matter_content')
          .select('*')
          .eq('book_id', bookId)
          .order('created_at', { ascending: true });
          
        if (frontMatterError) throw frontMatterError;
        
        setBookData(bookData);
        setChapters(chaptersData || []);
        setFrontMatterContents(frontMatterData || []);
        
        // If the book has a cover image, set it as the preview
        if (bookData?.cover_image_url) {
          setCoverImagePreview(bookData.cover_image_url);
        }
        
        // Calculate total pages based on content
        const estimatedPages = Math.max(1, Math.ceil((chaptersData?.length || 0) * 2.5));
        setTotalPages(estimatedPages);
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

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file for the cover.",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Cover image must be less than 5MB.",
        variant: "destructive"
      });
      return;
    }
    
    setUploadedCoverImage(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setCoverImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadCoverImage = async () => {
    if (!uploadedCoverImage || !bookId) return;
    
    try {
      setIsUploading(true);
      
      // Create a unique filename
      const fileExt = uploadedCoverImage.name.split('.').pop();
      const fileName = `cover_${bookId}_${Date.now()}.${fileExt}`;
      const filePath = `book_covers/${fileName}`;
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('book_covers')
        .upload(filePath, uploadedCoverImage);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('book_covers')
        .getPublicUrl(filePath);
      
      // Update the book record with the cover image URL
      const { error: updateError } = await supabase
        .from('books')
        .update({ cover_image_url: publicUrl })
        .eq('id', bookId);
        
      if (updateError) throw updateError;
      
      toast({
        title: "Cover uploaded",
        description: "Your book cover has been updated successfully.",
      });
      
      // Close the dialog
      setCoverImageUploadOpen(false);
    } catch (error) {
      console.error('Error uploading cover image:', error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your cover image.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Function to calculate what content should be shown on the current page
  const getCurrentPageContent = () => {
    // Cover page
    if (currentPage === 1) {
      return {
        type: 'cover',
        content: null
      };
    }
    
    // Copyright page
    if (currentPage === 2) {
      return {
        type: 'copyright',
        content: null
      };
    }
    
    // Table of contents
    if (currentPage === 3 && includeTableOfContents) {
      return {
        type: 'toc',
        content: null
      };
    }
    
    // Calculate offset for frontmatter and chapters
    const tocOffset = includeTableOfContents ? 1 : 0;
    const pageOffset = 2 + tocOffset; // Cover + Copyright + TOC (if included)
    
    // Front matter pages
    if (frontMatterContents.length > 0 && currentPage <= pageOffset + frontMatterContents.length) {
      const frontMatterIndex = currentPage - pageOffset - 1;
      return {
        type: 'frontmatter',
        content: frontMatterContents[frontMatterIndex]
      };
    }
    
    // Calculate further offset for chapter pages
    const frontMatterOffset = frontMatterContents.length;
    const chapterPageStart = pageOffset + frontMatterOffset + 1;
    
    // Chapter content (assuming each chapter starts on a new page)
    if (chapters.length > 0 && currentPage >= chapterPageStart) {
      const chapterIndex = Math.floor((currentPage - chapterPageStart) / 2);
      
      if (chapterIndex < chapters.length) {
        return {
          type: 'chapter',
          content: chapters[chapterIndex],
          isChapterStart: (currentPage - chapterPageStart) % 2 === 0
        };
      }
    }
    
    // If we've gone past all content
    return {
      type: 'blank',
      content: null
    };
  };

  const pageContent = getCurrentPageContent();

  // Function to render page content based on type
  const renderPageContent = () => {
    switch (pageContent.type) {
      case 'cover':
        return (
          <div className="text-center flex flex-col justify-center h-full">
            {coverImagePreview ? (
              <img 
                src={coverImagePreview} 
                alt={bookData?.title || 'Book Cover'} 
                className="max-h-full max-w-full mx-auto object-contain" 
              />
            ) : (
              <>
                <h1 className="text-3xl font-bold mb-4">{bookData?.title || 'Book Title'}</h1>
                <h2 className="text-xl mb-2">by</h2>
                <h3 className="text-2xl">{bookData?.author || 'Author Name'}</h3>
              </>
            )}
          </div>
        );
        
      case 'copyright':
        return (
          <div className="text-sm h-full flex flex-col justify-center">
            <p className="mb-4">Copyright © {new Date().getFullYear()} {bookData?.author || 'Author Name'}</p>
            <p className="mb-4">All rights reserved.</p>
            <p>No part of this publication may be reproduced, distributed, or transmitted in any form or by any means, including photocopying, recording, or other electronic or mechanical methods, without the prior written permission of the publisher, except in the case of brief quotations embodied in critical reviews and certain other noncommercial uses permitted by copyright law.</p>
          </div>
        );
        
      case 'toc':
        return (
          <div className="h-full">
            <h2 className="text-xl font-bold mb-4 text-center">Table of Contents</h2>
            <ul className="space-y-2">
              {frontMatterContents.map((item, index) => (
                <li key={`fm-${item.id}`} className="flex justify-between">
                  <span>{item.title}</span>
                  <span className="text-gray-500">{index + 4}</span>
                </li>
              ))}
              {chapters.map((chapter, index) => (
                <li key={chapter.id} className="flex justify-between">
                  <span>{chapter.chapter_id || `Chapter ${index + 1}`}</span>
                  <span className="text-gray-500">{frontMatterContents.length + index + 4}</span>
                </li>
              ))}
            </ul>
          </div>
        );
        
      case 'frontmatter':
        return (
          <div className="h-full">
            <h2 className="text-xl font-bold mb-4 text-center">{pageContent.content?.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: pageContent.content?.content || '' }} />
          </div>
        );
        
      case 'chapter':
        return (
          <div className="h-full">
            {pageContent.isChapterStart && (
              <h2 className="text-xl font-bold mb-4 text-center">
                {pageContent.content?.chapter_id || `Chapter ${chapters.indexOf(pageContent.content) + 1}`}
              </h2>
            )}
            <div dangerouslySetInnerHTML={{ __html: pageContent.content?.content || '' }} />
          </div>
        );
        
      case 'blank':
        return <div className="h-full"></div>;
        
      default:
        return <div className="h-full"></div>;
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
            <Dialog open={coverImageUploadOpen} onOpenChange={setCoverImageUploadOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  {coverImagePreview ? 'Change Cover' : 'Add Cover'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{coverImagePreview ? 'Update Book Cover' : 'Add Book Cover'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelection}
                    accept="image/*"
                  />
                  
                  {coverImagePreview ? (
                    <div className="relative mx-auto border rounded-md overflow-hidden" style={{ maxWidth: '200px' }}>
                      <img 
                        src={coverImagePreview} 
                        alt="Cover preview" 
                        className="w-full h-auto"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        onClick={triggerFileInput}
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50"
                      onClick={triggerFileInput}
                    >
                      <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                      <p className="text-sm text-gray-500 mb-1">Click to upload a cover image</p>
                      <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setCoverImageUploadOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUploadCoverImage}
                      disabled={!uploadedCoverImage || isUploading}
                    >
                      {isUploading ? 'Uploading...' : 'Save Cover'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
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
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center w-full max-w-4xl mb-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={prevPage} 
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={nextPage} 
                  disabled={currentPage >= totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
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
                  {includePageNumbers && currentPage > 2 && (
                    <div className="absolute bottom-2 text-center w-full left-0 text-gray-500 text-sm">
                      {currentPage}
                    </div>
                  )}
                  
                  {renderPageContent()}
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
                    {includePageNumbers && currentPage > 2 && (
                      <div className="absolute bottom-2 text-center w-full left-0 text-gray-500 text-sm">
                        {currentPage + 1}
                      </div>
                    )}
                    
                    <div className="h-full flex items-center justify-center text-gray-300">
                      {currentPage + 1 <= totalPages ? (
                        <div>Next page content</div>
                      ) : (
                        <div>End of book</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default BookPreview;
