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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/editor/books" element={<Editor />} />
        <Route path="/editor/manuscript/:bookId/boxes" element={<BoxesEditor />} />
        <Route path="/editor/manuscript/:bookId/chapters" element={<ChaptersEditor />} />
        <Route path="/for-authors" element={<ForAuthors />} />
        <Route path="/publishing-support" element={<PublishingSupport />} />
        <Route path="/professional-network" element={<ProfessionalNetwork />} />
        <Route path="/professional-network/find" element={<FindProfessional />} />
        <Route path="/professional-network/apply" element={<FreelancerApplication />} />
        <Route path="/professional-network/projects" element={<ProjectListing />} />
        <Route path="/launch-strategies" element={<LaunchStrategies />} />
        <Route path="/contract-review" element={<ContractReview />} />
        <Route path="/contract-templates" element={<ContractTemplates />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;