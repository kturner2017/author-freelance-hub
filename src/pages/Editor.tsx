
import React from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Editor = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-primary mb-6 font-serif">
            Manuscript Editor
          </h1>
          <div className="max-w-lg mx-auto">
            <div className="p-6 border rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-primary mb-4 font-serif">
                Your Books
              </h2>
              <p className="text-gray-600 mb-6">
                Write and organize your manuscripts
              </p>
              <Button asChild>
                <Link to="/editor/books">Start Writing</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Editor;
