
import React from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BookOpen, Edit, FileText } from 'lucide-react';

const Editor = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-primary mb-6 font-serif">
            Manuscript Editor
          </h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-50 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-primary mb-2 font-serif">
                Your Books
              </h2>
              <p className="text-gray-600 mb-6 h-12">
                Write and organize your manuscripts
              </p>
              <Button asChild className="w-full">
                <Link to="/editor/books">Start Writing</Link>
              </Button>
            </div>
            
            <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="bg-green-50 p-3 rounded-full">
                  <Edit className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-primary mb-2 font-serif">
                Templates
              </h2>
              <p className="text-gray-600 mb-6 h-12">
                Browse and use pre-made templates
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/editor/templates">View Templates</Link>
              </Button>
            </div>
            
            <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="bg-purple-50 p-3 rounded-full">
                  <FileText className="h-6 w-6 text-purple-500" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-primary mb-2 font-serif">
                Quick Notes
              </h2>
              <p className="text-gray-600 mb-6 h-12">
                Capture ideas and notes quickly
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/editor/notes">Take Notes</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Editor;
