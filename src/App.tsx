import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import ForAuthors from './pages/ForAuthors';
import NotFound from './pages/NotFound';
import BooksDashboard from './components/BooksDashboard';
import ChaptersEditor from './components/manuscript/ChaptersEditor';
import BoxesEditor from './components/manuscript/BoxesEditor';
import PublishingSupport from './pages/PublishingSupport';
import ProfessionalNetwork from './pages/ProfessionalNetwork';
import PostProject from './pages/PostProject';
import FindProfessional from './pages/FindProfessional';
import FreelancerDetail from './pages/FreelancerDetail';
import ProjectDetail from './pages/ProjectDetail';
import LaunchStrategies from './pages/LaunchStrategies';
import LaunchStrategyDetail from './pages/LaunchStrategyDetail';
import FreelancerApplication from './pages/FreelancerApplication';
import ContractTemplates from './pages/ContractTemplates';
import ActiveContracts from './pages/ActiveContracts';
import ContractReview from './pages/ContractReview';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/for-authors" element={<ForAuthors />} />
        <Route path="/editor" element={<BooksDashboard />} />
        <Route path="/editor/manuscript" element={<ChaptersEditor />} />
        <Route path="/editor/manuscript/boxes" element={<BoxesEditor />} />
        <Route path="/publishing-support" element={<PublishingSupport />} />
        <Route path="/professional-network" element={<ProfessionalNetwork />} />
        <Route path="/professional-network/post-project" element={<PostProject />} />
        <Route path="/professional-network/find" element={<FindProfessional />} />
        <Route path="/professional-network/find/freelancer/:id" element={<FreelancerDetail />} />
        <Route path="/professional-network/find/:id" element={<ProjectDetail />} />
        <Route path="/professional-network/apply" element={<FreelancerApplication />} />
        <Route path="/professional-network/contracts/templates" element={<ContractTemplates />} />
        <Route path="/professional-network/contracts/active" element={<ActiveContracts />} />
        <Route path="/professional-network/contracts/review" element={<ContractReview />} />
        <Route path="/launch-strategies" element={<LaunchStrategies />} />
        <Route path="/launch-strategies/:id" element={<LaunchStrategyDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;