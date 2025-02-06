import React, { useRef, useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Plus, Upload, Image as ImageIcon, ChevronLeft, Home, Briefcase, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from './ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getWordCount } from '@/utils/wordCount';
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
  const [books, setBooks] = useState<any[]>([]);
  const [bookWordCounts, setBookWordCounts] = useState<{[key: string]: number}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState<string>('');
  const [newBook, setNewBook] = useState({
    title: '',
    subtitle: '',
    author: '',
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Auth session:', session);
      
      if (!session) {
        console.log('No session found, redirecting to auth');
        navigate('/auth');
        return;
      }
      
      // Get user's email and set the name (using email before @ as name)
      const userEmail = session.user.email;
      const name = userEmail ? userEmail.split('@')[0] : 'User';
      setUserName(name);
      
      console.log('User authenticated:', session.user.email);
      await fetchBooks();
    } catch (error) {
      console.error('Error checking auth:', error);
      toast({
        title: "Authentication Error",
        description: "Please try logging in again",
        variant: "destructive"
      });
      navigate('/auth');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('No session during fetchBooks, skipping');
        return;
      }

      console.log('Fetching books for user:', session.user.id);
      const { data: books, error } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching books:', error);
        toast({
          title: "Error fetching books",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      console.log('Books fetched:', books);
      setBooks(books || []);
      
      // Fetch word counts for each book
      for (const book of books || []) {
        try {
          console.log('Fetching chapters for book:', book.id);
          const { data: chapters, error: chaptersError } = await supabase
            .from('manuscript_chapters')
            .select('content')
            .eq('book_id', book.id);
            
          if (chaptersError) {
            console.error('Error fetching chapters for book', book.id, ':', chaptersError);
            continue;
          }
          
          console.log('Chapters fetched for book', book.id, ':', chapters?.length || 0);
          const totalWords = chapters?.reduce((sum, chapter) => {
            const chapterContent = chapter.content || '';
            const chapterWords = getWordCount(chapterContent);
            console.log('Chapter content length:', chapterContent.length);
            console.log('Chapter words:', chapterWords);
            return sum + chapterWords;
          }, 0) || 0;
          
          console.log('Total words for book', book.id, ':', totalWords);
          setBookWordCounts(prev => ({
            ...prev,
            [book.id]: totalWords
          }));
        } catch (error) {
          console.error('Error calculating word count for book', book.id, ':', error);
        }
      }
    } catch (error) {
      console.error('Error in fetchBooks:', error);
      toast({
        title: "Error",
        description: "Could not fetch your books",
        variant: "destructive"
      });
    }
  };

  const handleCreateBook = async () => {
    if (!newBook.title || !newBook.author) {
      toast({
        title: "Required fields missing",
        description: "Please fill in the title and author fields.",
        variant: "destructive"
      });
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }

    const { data: book, error } = await supabase
      .from('books')
      .insert([
        {
          ...newBook,
          user_id: session.user.id,
          cover_image_url: coverImage
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating book:', error);
      toast({
        title: "Error creating book",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Book created",
      description: `"${newBook.title}" has been created successfully.`,
    });
    
    setIsDialogOpen(false);
    setNewBook({ title: '', subtitle: '', author: '' });
    setCoverImage(null);
    fetchBooks();
    navigate(`/editor/manuscript/${book.id}/chapters`);
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

  const handleBookClick = (bookId: string) => {
    console.log('Navigating to manuscript editor for book:', bookId);
    navigate(`/editor/manuscript/${bookId}/chapters`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#F1F0FB] text-primary h-16 px-6 flex items-center shadow-sm">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-2xl font-serif font-bold text-primary hover:text-primary-600 transition-colors">
              Authorify
            </Link>
            <Button 
              variant="ghost"
              className="text-base font-medium px-4 py-2 hover:bg-primary-50 hover:text-primary-700 transition-colors"
              asChild
            >
              <Link to="/editor">Editor</Link>
            </Button>
            <Button 
              variant="ghost"
              className="text-base font-medium px-4 py-2 hover:bg-primary-50 hover:text-primary-700 transition-colors"
              asChild
            >
              <Link to="/for-authors">For Authors</Link>
            </Button>
            <Button 
              variant="ghost"
              className="text-base font-medium px-4 py-2 hover:bg-primary-50 hover:text-primary-700 transition-colors"
              asChild
            >
              <Link to="/publishing-support">Publishing Support</Link>
            </Button>
            <Button 
              variant="ghost"
              className="text-base font-medium px-4 py-2 hover:bg-primary-50 hover:text-primary-700 transition-colors"
              asChild
            >
              <Link to="/professional-network">Professional Network</Link>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              asChild
              className="bg-primary hover:bg-primary-600 text-white font-medium shadow-sm hover:shadow transition-all"
            >
              <Link to="/professional-network/projects">
                <Briefcase className="mr-2 h-4 w-4" />
                For Freelancers
              </Link>
            </Button>
            <Button 
              variant="outline"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate('/auth');
              }}
              className="text-primary border-primary hover:bg-primary/10 flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-serif font-bold text-primary">
            {userName}'s Books
          </h1>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Showing {books.length} book{books.length !== 1 ? 's' : ''}
            </span>
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Card className="p-6 flex flex-col items-center justify-center text-center bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer aspect-[6/9]">
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

          <Card 
            className="p-6 flex flex-col items-center justify-center text-center bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer aspect-[6/9]"
            onClick={handleImportClick}
          >
            <Upload className="w-12 h-12 text-primary mb-4" />
            <h3 className="font-medium mb-2">Import book</h3>
            <p className="text-sm text-gray-500">Upload DOCX, PDF, or TXT</p>
          </Card>

          {books.map((book) => (
            <Card 
              key={book.id}
              className="group overflow-hidden cursor-pointer aspect-[6/9] relative perspective hover:z-10 book-card"
              onClick={() => handleBookClick(book.id)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative h-full transform-gpu transition-all duration-300 group-hover:scale-[1.02] group-hover:rotate-y-6 group-hover:translate-x-2 shadow-book">
                {book.cover_image_url ? (
                  <img 
                    src={book.cover_image_url}
                    alt={book.title}
                    className="h-full w-full object-cover rounded-sm"
                  />
                ) : (
                  <div className="h-full bg-gradient-to-br from-primary/5 to-primary/10 p-6 flex flex-col rounded-sm">
                    <h3 className="text-xl font-medium mb-2 text-primary">{book.title}</h3>
                    <p className="text-gray-500 mb-2">{book.author}</p>
                    <p className="text-sm text-gray-400 mt-auto">
                      {bookWordCounts[book.id]?.toLocaleString() || 0} words
                    </p>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <h3 className="text-lg font-medium mb-1">{book.title}</h3>
                  <p className="text-sm text-gray-200">{book.author}</p>
                </div>
                <div className="book-spine"></div>
                <div className="book-pages"></div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BooksDashboard;
