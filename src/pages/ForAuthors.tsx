import React from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ForAuthors = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl font-bold text-primary mb-6 font-serif">
            Transform Your Writing Journey
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover the tools, resources, and support you need to bring your story to life.
            From manuscript development to publishing success, we're here to help.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/editor">Start Writing</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/publishing-support">Get Support</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Manuscript Editor */}
          <div className="p-6 border rounded-lg shadow-sm animate-fade-in animate-fade-in-delay-1">
            <h3 className="text-xl font-bold text-primary mb-4 font-serif">
              Manuscript Editor
            </h3>
            <p className="text-gray-600 mb-4">
              A powerful editor designed specifically for authors, with tools for
              organizing chapters, scenes, and character development.
            </p>
            <Button variant="link" asChild>
              <Link to="/editor">Open Editor →</Link>
            </Button>
          </div>

          {/* Publishing Support */}
          <div className="p-6 border rounded-lg shadow-sm animate-fade-in animate-fade-in-delay-2">
            <h3 className="text-xl font-bold text-primary mb-4 font-serif">
              Publishing Support
            </h3>
            <p className="text-gray-600 mb-4">
              Expert guidance on the publishing process, from manuscript preparation
              to finding the right publisher or self-publishing path.
            </p>
            <Button variant="link" asChild>
              <Link to="/publishing-support">Learn More →</Link>
            </Button>
          </div>

          {/* Professional Network */}
          <div className="p-6 border rounded-lg shadow-sm animate-fade-in animate-fade-in-delay-3">
            <h3 className="text-xl font-bold text-primary mb-4 font-serif">
              Professional Network
            </h3>
            <p className="text-gray-600 mb-4">
              Connect with editors, cover designers, marketers, and other professionals
              to help bring your book to market.
            </p>
            <Button variant="link" asChild>
              <Link to="/professional-network">Browse Network →</Link>
            </Button>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center py-16 bg-primary-100 rounded-lg animate-fade-in">
          <h2 className="text-3xl font-bold text-primary mb-6 font-serif">
            Ready to Start Your Author Journey?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community of writers and get access to all the tools and
            resources you need to succeed.
          </p>
          <Button size="lg">
            Get Started Today
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ForAuthors;