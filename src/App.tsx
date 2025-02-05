import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Editor from './pages/Editor';
import NotFound from './pages/NotFound';
import Auth from './pages/Auth';
import BoxesEditor from './components/manuscript/BoxesEditor';
import ChaptersEditor from './components/manuscript/ChaptersEditor';

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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;