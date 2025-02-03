import React from 'react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { 
  Bold, 
  Italic, 
  Underline, 
  Quote, 
  Code, 
  List, 
  ListOrdered,
  AlignLeft,
  Link,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Menu,
  Plus,
  Settings
} from 'lucide-react';

const ManuscriptEditor = () => {
  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      <div className="w-64 bg-[#2c3643] text-white flex flex-col">
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          <h1 className="text-xl font-semibold">Manuscript</h1>
          <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700">
                  Front matter
                </Button>
                <div className="ml-4 space-y-2">
                  <Button variant="ghost" className="w-full justify-start text-sm text-gray-400 hover:text-white hover:bg-gray-700">
                    Copyright
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm text-gray-400 hover:text-white hover:bg-gray-700">
                    Table of Contents
                  </Button>
                </div>
              </div>
              
              <div>
                <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700">
                  Body
                </Button>
                <div className="ml-4">
                  <Button variant="ghost" className="w-full justify-start text-sm text-blue-400 hover:text-white hover:bg-blue-600">
                    Chapter 1
                  </Button>
                </div>
              </div>
              
              <div>
                <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700">
                  Back matter
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t border-gray-700">
          <div className="text-sm text-gray-400">0 words</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-14 border-b flex items-center px-4 justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
            <input 
              type="text" 
              placeholder="Chapter title..."
              className="border-none focus:outline-none text-lg"
              defaultValue="Chapter 1"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-3xl mx-auto py-12 px-8">
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-400 mb-8">Begin writing here...</div>
            </div>
          </div>
        </div>

        {/* Bottom Toolbar */}
        <div className="border-t p-2 flex justify-center items-center gap-2 bg-white">
          <div className="flex items-center gap-1 bg-[#2c3643] text-white rounded-md p-1">
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
              <Underline className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 bg-gray-600" />
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
              <List className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 bg-gray-600" />
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
              <Quote className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
              <Code className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
              <Link className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm text-gray-500">
            Select text to apply formatting
          </div>
        </div>
      </div>

      {/* Right Sidebar (collapsed) */}
      <div className="w-12 border-l flex flex-col items-center py-4 space-y-4">
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ManuscriptEditor;