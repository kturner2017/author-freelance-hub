import React from 'react';
import Navigation from '../Navigation';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

const DashboardLayout = ({
  children,
  title,
  subtitle,
  actions,
  className
}: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <header className="border-b border-gray-200 bg-[#FFFFFF] shadow-sm">
        <div className="container mx-auto px-8 h-16">
          <div className="flex items-center justify-between h-full">
            <div>
              <h1 className="text-[#0F172A] font-serif font-bold text-2xl">
                {title}
              </h1>
              {subtitle && (
                <p className="text-[#1E293B] font-sans text-sm mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-4">
                {actions}
              </div>
            )}
          </div>
        </div>
      </header>
      <main className={cn("flex-1 bg-gray-50", className)}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;