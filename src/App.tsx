import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Editor from './pages/Editor';
import ForAuthors from './pages/ForAuthors';
import ProfessionalNetwork from './pages/ProfessionalNetwork';
import ChaptersEditor from './components/manuscript/ChaptersEditor';
import BoxesEditor from './components/manuscript/BoxesEditor';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/for-authors" element={<ForAuthors />} />
          <Route path="/professional-network" element={<ProfessionalNetwork />} />
          <Route path="/editor/manuscript/chapters" element={<ChaptersEditor />} />
          <Route path="/editor/manuscript/boxes" element={<BoxesEditor />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;