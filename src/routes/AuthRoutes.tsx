
import { Route, Navigate } from 'react-router-dom';
import Auth from '@/pages/Auth';
import ProtectedRoute from '@/components/ProtectedRoute';
import BooksDashboard from '@/components/BooksDashboard';
import BoxesEditor from '@/components/manuscript/BoxesEditor';
import ChaptersEditor from '@/components/manuscript/ChaptersEditor';

export const AuthRoutes = () => {
  return (
    <>
      <Route path="/auth" element={
        <Auth />
      } />
      
      <Route path="/editor/books" element={
        <ProtectedRoute>
          <BooksDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/editor" element={
        <ProtectedRoute>
          <Navigate to="/editor/books" replace />
        </ProtectedRoute>
      } />
      
      <Route path="/editor/manuscript/:bookId/boxes" element={
        <ProtectedRoute>
          <BoxesEditor />
        </ProtectedRoute>
      } />
      
      <Route path="/editor/manuscript/:bookId/chapters" element={
        <ProtectedRoute>
          <ChaptersEditor />
        </ProtectedRoute>
      } />
    </>
  );
};
