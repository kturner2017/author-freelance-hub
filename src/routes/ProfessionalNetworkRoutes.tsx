
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

export const professionalNetworkRoutes = [
  <Route
    key="professional-network"
    path="/professional-network"
    element={
      <ProtectedRoute>
        <ProfessionalNetwork />
      </ProtectedRoute>
    }
  />,
  
  <Route
    key="find-professional"
    path="/professional-network/find"
    element={
      <ProtectedRoute>
        <FindProfessional />
      </ProtectedRoute>
    }
  />,

  <Route
    key="freelancer-detail"
    path="/professional-network/find/freelancer/:id"
    element={
      <ProtectedRoute>
        <FreelancerDetail />
      </ProtectedRoute>
    }
  />,
  
  <Route
    key="freelancer-application"
    path="/professional-network/apply"
    element={
      <ProtectedRoute>
        <FreelancerApplication />
      </ProtectedRoute>
    }
  />,
  
  <Route
    key="project-listing"
    path="/professional-network/projects"
    element={
      <ProtectedRoute>
        <ProjectListing />
      </ProtectedRoute>
    }
  />,

  <Route
    key="project-detail"
    path="/professional-network/projects/:id"
    element={
      <ProtectedRoute>
        <ProjectDetail />
      </ProtectedRoute>
    }
  />,

  <Route
    key="post-project"
    path="/professional-network/post-project"
    element={
      <ProtectedRoute>
        <PostProject />
      </ProtectedRoute>
    }
  />,

  <Route
    key="secure-payments"
    path="/professional-network/secure-payments"
    element={
      <ProtectedRoute>
        <SecurePayments />
      </ProtectedRoute>
    }
  />,

  <Route
    key="payment-details"
    path="/professional-network/payments/:id"
    element={
      <ProtectedRoute>
        <PaymentDetails />
      </ProtectedRoute>
    }
  />,

  <Route
    key="payment-settings"
    path="/professional-network/payment-settings"
    element={
      <ProtectedRoute>
        <PaymentSettings />
      </ProtectedRoute>
    }
  />,

  <Route
    key="initiate-payment"
    path="/professional-network/initiate-payment"
    element={
      <ProtectedRoute>
        <InitiatePayment />
      </ProtectedRoute>
    }
  />
];
