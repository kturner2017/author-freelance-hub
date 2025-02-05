import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Editor from '@/pages/Editor';
import NotFound from '@/pages/NotFound';
import ProfessionalNetwork from '@/pages/ProfessionalNetwork';
import FindProfessional from '@/pages/FindProfessional';
import FreelancerDetail from '@/pages/FreelancerDetail';
import FreelancerApplication from '@/pages/FreelancerApplication';
import PostProject from '@/pages/PostProject';
import ProjectDetail from '@/pages/ProjectDetail';
import ContractTemplates from '@/pages/ContractTemplates';
import ContractReview from '@/pages/ContractReview';
import ActiveContracts from '@/pages/ActiveContracts';
import LaunchStrategies from '@/pages/LaunchStrategies';
import LaunchStrategyDetail from '@/pages/LaunchStrategyDetail';
import PublishingSupport from '@/pages/PublishingSupport';
import ForAuthors from '@/pages/ForAuthors';
import ChaptersEditor from '@/components/manuscript/ChaptersEditor';
import BooksDashboard from '@/components/BooksDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/editor/books" element={<BooksDashboard />} />
        <Route path="/editor/manuscript/:bookId/chapters" element={<ChaptersEditor />} />
        <Route path="/professional-network" element={<ProfessionalNetwork />} />
        <Route path="/professional-network/find" element={<FindProfessional />} />
        <Route path="/professional-network/find/freelancer/:id" element={<FreelancerDetail />} />
        <Route path="/professional-network/apply" element={<FreelancerApplication />} />
        <Route path="/professional-network/post-project" element={<PostProject />} />
        <Route path="/professional-network/project/:id" element={<ProjectDetail />} />
        <Route path="/professional-network/contracts/templates" element={<ContractTemplates />} />
        <Route path="/professional-network/contracts/review" element={<ContractReview />} />
        <Route path="/professional-network/contracts/active" element={<ActiveContracts />} />
        <Route path="/launch-strategies" element={<LaunchStrategies />} />
        <Route path="/launch-strategies/:id" element={<LaunchStrategyDetail />} />
        <Route path="/publishing-support" element={<PublishingSupport />} />
        <Route path="/for-authors" element={<ForAuthors />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;