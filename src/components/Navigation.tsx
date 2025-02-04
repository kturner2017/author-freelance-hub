import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';
import useMobile from '@/hooks/use-mobile';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMobile();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-lg border-b shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex justify-between w-full items-center">
            <div className="flex-shrink-0">
              <Link 
                to="/" 
                className="text-2xl font-serif font-bold text-primary hover:text-primary/90 transition-colors"
              >
                Authify
              </Link>
            </div>
            
            <div className="hidden sm:flex sm:items-center sm:space-x-6">
              <Link
                to="/for-authors"
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors"
              >
                For Authors
              </Link>
              <Link
                to="/editor"
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors"
              >
                Editor
              </Link>
              <Button 
                size="sm"
                className="ml-4 shadow-sm hover:shadow-md transition-all"
              >
                Sign In
              </Button>
            </div>
          </div>

          <div className="flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              className="text-gray-600 hover:text-primary"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && isMobile && (
        <div className="sm:hidden absolute w-full bg-white/95 backdrop-blur-lg border-b shadow-sm">
          <div className="px-4 pt-2 pb-3 space-y-2">
            <Link
              to="/for-authors"
              className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
              onClick={toggleMenu}
            >
              For Authors
            </Link>
            <Link
              to="/editor"
              className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
              onClick={toggleMenu}
            >
              Editor
            </Link>
            <div className="px-3 py-2">
              <Button 
                className="w-full shadow-sm hover:shadow-md transition-all"
                size="sm"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;