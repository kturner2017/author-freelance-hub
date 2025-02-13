
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './integrations/supabase/client';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import { AuthRoutes } from './routes/AuthRoutes';
import { ProfessionalNetworkRoutes } from './routes/ProfessionalNetworkRoutes';
import { PublishingRoutes } from './routes/PublishingRoutes';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', session ? 'authenticated' : 'unauthenticated');
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Initial session check:', session ? 'authenticated' : 'unauthenticated');
      setIsAuthenticated(!!session);
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <AuthRoutes />
        <ProfessionalNetworkRoutes />
        <PublishingRoutes />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
