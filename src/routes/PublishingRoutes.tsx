
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import PublishingSupport from '@/pages/PublishingSupport';
import ForAuthors from '@/pages/ForAuthors';
import LaunchStrategies from '@/pages/LaunchStrategies';
import ContractReview from '@/pages/ContractReview';
import ContractTemplates from '@/pages/ContractTemplates';
import QualityAssurance from '@/pages/QualityAssurance';

export const PublishingRoutes = () => {
  return (
    <>
      <Route path="/publishing-support" element={
        <ProtectedRoute>
          <PublishingSupport />
        </ProtectedRoute>
      } />
      
      <Route path="/for-authors" element={
        <ProtectedRoute>
          <ForAuthors />
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
    </>
  );
};
