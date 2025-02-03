import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-serif font-bold text-primary">Authify</h1>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <Button variant="ghost">For Authors</Button>
            <Button variant="ghost">For Professionals</Button>
            <Button variant="ghost">Resources</Button>
            <Button variant="default">Sign In</Button>
          </div>

          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:bg-primary-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Button variant="ghost" className="w-full justify-start">For Authors</Button>
            <Button variant="ghost" className="w-full justify-start">For Professionals</Button>
            <Button variant="ghost" className="w-full justify-start">Resources</Button>
            <Button variant="default" className="w-full justify-start">Sign In</Button>
          </div>
        </div>
      )}
    </nav>
  );
};