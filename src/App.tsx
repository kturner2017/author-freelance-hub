import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/editor" element={<ProtectedRoute><Editor /></ProtectedRoute>} />
        <Route path="/editor/books" element={<ProtectedRoute><Editor /></ProtectedRoute>} />
        <Route path="/editor/manuscript/:bookId/boxes" element={<ProtectedRoute><BoxesEditor /></ProtectedRoute>} />
        <Route path="/editor/manuscript/:bookId/chapters" element={<ProtectedRoute><ChaptersEditor /></ProtectedRoute>} />
        <Route path="/for-authors" element={<ProtectedRoute><ForAuthors /></ProtectedRoute>} />
        <Route path="/publishing-support" element={<ProtectedRoute><PublishingSupport /></ProtectedRoute>} />
        <Route path="/professional-network" element={<ProtectedRoute><ProfessionalNetwork /></ProtectedRoute>} />
        <Route path="/professional-network/find" element={<ProtectedRoute><FindProfessional /></ProtectedRoute>} />
        <Route path="/professional-network/apply" element={<ProtectedRoute><FreelancerApplication /></ProtectedRoute>} />
        <Route path="/professional-network/projects" element={<ProtectedRoute><ProjectListing /></ProtectedRoute>} />
        <Route path="/launch-strategies" element={<ProtectedRoute><LaunchStrategies /></ProtectedRoute>} />
        <Route path="/contract-review" element={<ProtectedRoute><ContractReview /></ProtectedRoute>} />
        <Route path="/contract-templates" element={<ProtectedRoute><ContractTemplates /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;