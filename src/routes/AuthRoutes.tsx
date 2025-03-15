
import { Route, Navigate } from 'react-router-dom';
import Auth from '@/pages/Auth';
import ProtectedRoute from '@/components/ProtectedRoute';
import BooksDashboard from '@/components/BooksDashboard';
import BoxesEditor from '@/components/manuscript/BoxesEditor';
import ChaptersEditor from '@/components/manuscript/ChaptersEditor';

export const authRoutes = [
  <Route key="auth" path="/auth" element={<Auth />} />,
  
  <Route
    key="editor-books"
    path="/editor/books"
    element={
      <ProtectedRoute>
        <BooksDashboard />
      </ProtectedRoute>
    }
  />,
  
  <Route
    key="editor"
    path="/editor"
    element={
      <ProtectedRoute>
        <Navigate to="/editor/books" replace />
      </ProtectedRoute>
    }
  />,
  
  <Route
    key="editor-boxes"
    path="/editor/manuscript/:bookId/boxes"
    element={
      <ProtectedRoute>
        <BoxesEditor />
      </ProtectedRoute>
    }
  />,
  
  <Route
    key="editor-chapters"
    path="/editor/manuscript/:bookId/chapters/*"
    element={
      <ProtectedRoute>
        <ChaptersEditor />
      </ProtectedRoute>
    }
  />
];
