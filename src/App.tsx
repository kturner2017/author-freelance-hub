import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import ForAuthors from './pages/ForAuthors';
import NotFound from './pages/NotFound';
import ManuscriptEditor from './components/ManuscriptEditor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/for-authors" element={<ForAuthors />} />
        <Route path="/editor" element={<ManuscriptEditor />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;