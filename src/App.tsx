
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Index from './pages/Index';
import Editor from './pages/Editor';
import NotFound from './pages/NotFound';
import Auth from './pages/Auth';
import BoxesEditor from './components/manuscript/BoxesEditor';
import ChaptersEditor from './components/manuscript/ChaptersEditor';
import ProfessionalNetwork from './pages/ProfessionalNetwork';
import PublishingSupport from './pages/PublishingSupport';
import ForAuthors from './pages/ForAuthors';
import LaunchStrategies from './pages/LaunchStrategies';
import ContractReview from './pages/ContractReview';
import ContractTemplates from './pages/ContractTemplates';
import FindProfessional from './pages/FindProfessional';
import FreelancerApplication from './pages/FreelancerApplication';
import ProjectListing from './pages/ProjectListing';
import QualityAssurance from './pages/QualityAssurance';
import ProtectedRoute from './components/ProtectedRoute';
import { supabase } from './integrations/supabase/client';
import BooksDashboard from './components/BooksDashboard';
import FreelancerDetail from './pages/FreelancerDetail';
import PostProject from './pages/PostProject';
import SecurePayments from './pages/SecurePayments';
import PaymentDetails from './pages/PaymentDetails';
import PaymentSettings from './pages/PaymentSettings';
import InitiatePayment from './pages/InitiatePayment';

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
        <Route path="/auth" element={
          isAuthenticated ? <Navigate to="/editor/books" replace /> : <Auth />
        } />
        
        {/* Books Dashboard */}
        <Route path="/editor/books" element={
          <ProtectedRoute>
            <BooksDashboard />
          </ProtectedRoute>
        } />
        
        {/* Redirect /editor to /editor/books */}
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
        
        <Route path="/for-authors" element={
          <ProtectedRoute>
            <ForAuthors />
          </ProtectedRoute>
        } />
        
        <Route path="/publishing-support" element={
          <ProtectedRoute>
            <PublishingSupport />
          </ProtectedRoute>
        } />
        
        <Route path="/professional-network" element={
          <ProtectedRoute>
            <ProfessionalNetwork />
          </ProtectedRoute>
        } />
        
        <Route path="/professional-network/find" element={
          <ProtectedRoute>
            <FindProfessional />
          </ProtectedRoute>
        } />

        <Route path="/professional-network/find/freelancer/:id" element={
          <ProtectedRoute>
            <FreelancerDetail />
          </ProtectedRoute>
        } />
        
        <Route path="/professional-network/apply" element={
          <ProtectedRoute>
            <FreelancerApplication />
          </ProtectedRoute>
        } />
        
        <Route path="/professional-network/projects" element={
          <ProtectedRoute>
            <ProjectListing />
          </ProtectedRoute>
        } />

        <Route path="/professional-network/post-project" element={
          <ProtectedRoute>
            <PostProject />
          </ProtectedRoute>
        } />

        <Route path="/professional-network/secure-payments" element={
          <ProtectedRoute>
            <SecurePayments />
          </ProtectedRoute>
        } />

        <Route path="/professional-network/payments/:id" element={
          <ProtectedRoute>
            <PaymentDetails />
          </ProtectedRoute>
        } />

        <Route path="/professional-network/payment-settings" element={
          <ProtectedRoute>
            <PaymentSettings />
          </ProtectedRoute>
        } />

        <Route path="/professional-network/initiate-payment" element={
          <ProtectedRoute>
            <InitiatePayment />
          </ProtectedRoute>
        } />
        
        <Route path="/launch-strategies" element={
          <ProtectedRoute>
            <LaunchStrategies />
          </ProtectedRoute>
        } />
        
        <Route path="/contract-review" element={
          <ProtectedRoute>
            <ContractReview />
          </ProtectedRoute>
        } />
        
        <Route path="/contract-templates" element={
          <ProtectedRoute>
            <ContractTemplates />
          </ProtectedRoute>
        } />

        <Route path="/quality-assurance" element={
          <ProtectedRoute>
            <QualityAssurance />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
