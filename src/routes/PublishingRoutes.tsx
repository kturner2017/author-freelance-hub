
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import PublishingSupport from '@/pages/PublishingSupport';
import ForAuthors from '@/pages/ForAuthors';
import LaunchStrategies from '@/pages/LaunchStrategies';
import ContractReview from '@/pages/ContractReview';
import ContractTemplates from '@/pages/ContractTemplates';
import QualityAssurance from '@/pages/QualityAssurance';

export const publishingRoutes = [
  <Route
    key="publishing-support"
    path="/publishing-support"
    element={
      <ProtectedRoute>
        <PublishingSupport />
      </ProtectedRoute>
    }
  />,
  
  <Route
    key="for-authors"
    path="/for-authors"
    element={
      <ProtectedRoute>
        <ForAuthors />
      </ProtectedRoute>
    }
  />,
  
  <Route
    key="launch-strategies"
    path="/launch-strategies"
    element={
      <ProtectedRoute>
        <LaunchStrategies />
      </ProtectedRoute>
    }
  />,
  
  <Route
    key="contract-review"
    path="/contract-review"
    element={
      <ProtectedRoute>
        <ContractReview />
      </ProtectedRoute>
    }
  />,
  
  <Route
    key="contract-templates"
    path="/contract-templates"
    element={
      <ProtectedRoute>
        <ContractTemplates />
      </ProtectedRoute>
    }
  />,

  <Route
    key="quality-assurance"
    path="/quality-assurance"
    element={
      <ProtectedRoute>
        <QualityAssurance />
      </ProtectedRoute>
    }
  />
];
