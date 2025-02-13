
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProfessionalNetwork from '@/pages/ProfessionalNetwork';
import FindProfessional from '@/pages/FindProfessional';
import FreelancerDetail from '@/pages/FreelancerDetail';
import FreelancerApplication from '@/pages/FreelancerApplication';
import ProjectListing from '@/pages/ProjectListing';
import ProjectDetail from '@/pages/ProjectDetail';
import PostProject from '@/pages/PostProject';
import SecurePayments from '@/pages/SecurePayments';
import PaymentDetails from '@/pages/PaymentDetails';
import PaymentSettings from '@/pages/PaymentSettings';
import InitiatePayment from '@/pages/InitiatePayment';

export const ProfessionalNetworkRoutes = () => {
  return (
    <>
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

      <Route path="/professional-network/projects/:id" element={
        <ProtectedRoute>
          <ProjectDetail />
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
    </>
  );
};
