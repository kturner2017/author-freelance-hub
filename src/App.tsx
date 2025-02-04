import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import ForAuthors from './pages/ForAuthors';
import NotFound from './pages/NotFound';
import BooksDashboard from './components/BooksDashboard';
import ManuscriptEditor from './components/ManuscriptEditor';
import PublishingSupport from './pages/PublishingSupport';
import ProfessionalNetwork from './pages/ProfessionalNetwork';
import PostProject from './pages/PostProject';
import FindProfessional from './pages/FindProfessional';
import LaunchStrategies from './pages/LaunchStrategies';
import LaunchStrategyDetail from './pages/LaunchStrategyDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/for-authors" element={<ForAuthors />} />
        <Route path="/editor" element={<BooksDashboard />} />
        <Route path="/editor/manuscript" element={<ManuscriptEditor />} />
        <Route path="/publishing-support" element={<PublishingSupport />} />
        <Route path="/professional-network" element={<ProfessionalNetwork />} />
        <Route path="/professional-network/post-project" element={<PostProject />} />
        <Route path="/professional-network/find" element={<FindProfessional />} />
        <Route path="/launch-strategies" element={<LaunchStrategies />} />
        <Route path="/launch-strategies/:id" element={<LaunchStrategyDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;