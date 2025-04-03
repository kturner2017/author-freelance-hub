
import React from 'react';
import DashboardLayout from '../../layout/DashboardLayout';

const LoadingEditor = () => {
  return (
    <DashboardLayout title="Chapters Editor">
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    </DashboardLayout>
  );
};

export default LoadingEditor;
