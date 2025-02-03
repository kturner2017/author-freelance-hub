import React, { useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Plus, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './ui/use-toast';

const BooksDashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleCreateBook = () => {
    navigate('/editor/manuscript');
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

    // Here you would typically handle the file upload
    console.log('Importing file:', file.name);
    toast({
      title: "Import started",
      description: `Importing ${file.name}...`,
    });

    // Reset the input
    event.target.value = '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-serif mb-2">Welcome back</h1>
          <p className="text-gray-300">This is your bookshelf, where you can write, plan, edit and typeset your books</p>
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

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".docx,.pdf,.txt"
          onChange={handleFileImport}
        />

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Create Book Card */}
          <Card className="p-6 flex flex-col items-center justify-center text-center bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer min-h-[280px]" onClick={handleCreateBook}>
            <Plus className="w-12 h-12 text-primary mb-4" />
            <h3 className="font-medium mb-2">Create book</h3>
            <p className="text-sm text-gray-500">Start writing from scratch</p>
          </Card>

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
          <Card className="overflow-hidden cursor-pointer min-h-[280px] flex flex-col">
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