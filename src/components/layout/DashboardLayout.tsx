import React from 'react';
import { Button } from '../ui/button';
import { ChevronLeft, Plus, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const DashboardLayout = ({ children, title, subtitle, actions }: DashboardLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col">
      <div className="h-24 border-b flex items-center px-8 justify-between bg-gradient-to-r from-primary-900 to-primary-700 text-white shadow-lg">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-white/10 text-white rounded-full transition-all duration-200 ease-in-out"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
              className="hover:bg-white/10 text-white rounded-full transition-all duration-200 ease-in-out"
            >
              <Home className="h-5 w-5" />
            </Button>
          </div>
          <div>
            <h1 className="text-3xl font-serif font-semibold leading-tight tracking-tight text-white">{title}</h1>
            {subtitle && <p className="text-sm text-gray-200 leading-tight mt-1 font-medium">{subtitle}</p>}
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
      <div className="flex-1 overflow-auto bg-gray-50">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;