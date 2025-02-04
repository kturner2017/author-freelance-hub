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
      <div className="h-20 border-b flex items-center px-6 justify-between bg-[#0F172A] text-white">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-white/10 text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/')}
            className="hover:bg-white/10 text-white"
          >
            <Home className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-serif font-semibold leading-tight">{title}</h1>
            {subtitle && <p className="text-sm text-gray-300 leading-tight">{subtitle}</p>}
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

export default DashboardLayout;