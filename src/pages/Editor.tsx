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
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Choose what you want to work on today
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-6 border rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-primary mb-4 font-serif">
                Chapters
              </h2>
              <p className="text-gray-600 mb-6">
                Write and organize your manuscript chapters
              </p>
              <Button asChild>
                <Link to="/editor/manuscript/chapters">Open Chapters Editor</Link>
              </Button>
            </div>
            <div className="p-6 border rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-primary mb-4 font-serif">
                Story Boxes
              </h2>
              <p className="text-gray-600 mb-6">
                Manage character profiles, plot points, and world-building details
              </p>
              <Button asChild>
                <Link to="/editor/manuscript/boxes">Open Story Boxes</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Editor;