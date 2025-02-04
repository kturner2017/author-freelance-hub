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
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex justify-between w-full items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-serif font-bold text-primary">
                Authify
              </Link>
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
              <Link
                to="/for-authors"
                className="inline-flex items-center px-1 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                For Authors
              </Link>
              <Link
                to="/editor"
                className="inline-flex items-center px-1 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Editor
              </Link>
              <Button>Sign In</Button>
            </div>
          </div>

          <div className="flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && isMobile && (
        <div className="sm:hidden absolute w-full bg-white border-b">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/for-authors"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              onClick={toggleMenu}
            >
              For Authors
            </Link>
            <Link
              to="/editor"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              onClick={toggleMenu}
            >
              Editor
            </Link>
            <div className="pl-3 pr-4 py-2">
              <Button className="w-full">Sign In</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;