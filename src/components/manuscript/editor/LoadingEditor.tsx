
import React from 'react';
import DashboardLayout from '../../layout/DashboardLayout';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingEditor = () => {
  return (
    <DashboardLayout title="Chapters Editor">
      <div className="flex h-full">
        {/* Sidebar skeleton */}
        <div className="w-56 border-r p-4 flex flex-col gap-4 bg-gray-50">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-38" />
        </div>
        
        {/* Chapters list skeleton */}
        <div className="w-64 border-r p-4 flex flex-col gap-4 bg-white">
          <Skeleton className="h-7 w-40" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-52" />
            <Skeleton className="h-6 w-44" />
          </div>
        </div>
        
        {/* Content area skeleton */}
        <div className="flex-1 p-6 flex flex-col gap-6">
          <Skeleton className="h-10 w-52" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LoadingEditor;
