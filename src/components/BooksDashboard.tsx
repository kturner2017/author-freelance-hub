import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Plus, Upload, Image as ImageIcon, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from './ui/label';

const BooksDashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverImageRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    subtitle: '',
    author: '',
  });

  const handleCreateBook = () => {
    if (!newBook.title || !newBook.author) {
      toast({
        title: "Required fields missing",
        description: "Please fill in the title and author fields.",
        variant: "destructive"
      });
      return;
    }

    console.log('Creating new book:', { ...newBook, coverImage });
    toast({
      title: "Book created",
      description: `"${newBook.title}" has been created successfully.`,
    });
    
    setIsDialogOpen(false);
    setNewBook({ title: '', subtitle: '', author: '' });
    setCoverImage(null);
    navigate('/editor/manuscript');
  };

  const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setCoverImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const allowedFormats = ['docx', 'pdf', 'txt'];

    if (!allowedFormats.includes(fileExtension || '')) {
      toast({
        title: "Invalid file format",
        description: "Please upload a DOCX, PDF, or TXT file.",
        variant: "destructive"
      });
      return;
    }

    console.log('Importing file:', file.name);
    toast({
      title: "Import started",
      description: `Importing ${file.name}...`,
    });

    event.target.value = '';
  };

  const handleBookClick = () => {
    console.log('Navigating to manuscript editor');
    navigate('/editor/manuscript');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0F172A] text-white h-16 px-6 flex items-center">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="hover:bg-white/10 text-white"
            >
              <Home className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-medium">Your Bookshelf</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Controls */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Showing 1 book</span>
            <Button variant="link" className="text-primary hover:text-primary-600">
              View archive
            </Button>
          </div>
          <div className="relative w-64">
            <Input
              type="text"
              placeholder="Search by title..."
              className="pl-4 pr-10"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Hidden file inputs */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".docx,.pdf,.txt"
          onChange={handleFileImport}
        />
        <input
          type="file"
          ref={coverImageRef}
          className="hidden"
          accept="image/*"
          onChange={handleCoverImageUpload}
        />

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Create Book Card */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Card className="p-6 flex flex-col items-center justify-center text-center bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer min-h-[280px]">
                <Plus className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-medium mb-2">Create book</h3>
                <p className="text-sm text-gray-500">Start writing from scratch</p>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create a new book</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    placeholder="Enter book title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={newBook.subtitle}
                    onChange={(e) => setNewBook({ ...newBook, subtitle: e.target.value })}
                    placeholder="Enter subtitle (optional)"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    placeholder="Enter author name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Cover Image</Label>
                  <div 
                    className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
                    onClick={() => coverImageRef.current?.click()}
                  >
                    {coverImage ? (
                      <div className="relative">
                        <img 
                          src={coverImage} 
                          alt="Book cover" 
                          className="max-h-40 mx-auto rounded"
                        />
                        <p className="text-sm text-gray-500 mt-2">Click to change image</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Click to upload cover image</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateBook}>
                  Create Book
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Import Book Card */}
          <Card 
            className="p-6 flex flex-col items-center justify-center text-center bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer min-h-[280px]"
            onClick={handleImportClick}
          >
            <Upload className="w-12 h-12 text-primary mb-4" />
            <h3 className="font-medium mb-2">Import book</h3>
            <p className="text-sm text-gray-500">Upload DOCX, PDF, or TXT</p>
          </Card>

          {/* Example Book Card */}
          <Card 
            className="overflow-hidden cursor-pointer min-h-[280px] flex flex-col hover:shadow-lg transition-shadow"
            onClick={handleBookClick}
          >
            <div className="bg-white p-6 flex-1">
              <h3 className="text-xl font-medium mb-2">Gomer</h3>
              <p className="text-gray-500">K. TURNER</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default BooksDashboard;