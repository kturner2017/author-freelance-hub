
import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import Editor from '@/pages/Editor';
import ChaptersEditor from '@/components/manuscript/ChaptersEditor';
import BoxesEditor from '@/components/manuscript/BoxesEditor';
import BooksDashboard from '@/components/BooksDashboard';
import BookPreview from '@/components/manuscript/BookPreview';

export const publishingRoutes = (
  <>
    <Route path="/editor" element={<ProtectedRoute><Editor /></ProtectedRoute>} />
    <Route path="/editor/books" element={<ProtectedRoute><BooksDashboard /></ProtectedRoute>} />
    <Route path="/editor/manuscript/:bookId/chapters" element={<ProtectedRoute><ChaptersEditor /></ProtectedRoute>} />
    <Route path="/editor/manuscript/:bookId/boxes" element={<ProtectedRoute><BoxesEditor /></ProtectedRoute>} />
    <Route path="/editor/manuscript/:bookId/book-preview" element={<ProtectedRoute><BookPreview /></ProtectedRoute>} />
  </>
);
