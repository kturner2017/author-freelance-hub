import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Editor from "@/pages/Editor";
import ForAuthors from "@/pages/ForAuthors";
import PublishingSupport from "@/pages/PublishingSupport";
import ProfessionalNetwork from "@/pages/ProfessionalNetwork";
import FindProfessional from "@/pages/FindProfessional";
import FreelancerApplication from "@/pages/FreelancerApplication";
import FreelancerDetail from "@/pages/FreelancerDetail";
import PostProject from "@/pages/PostProject";
import ProjectListing from "@/pages/ProjectListing";
import ContractTemplates from "@/pages/ContractTemplates";
import ActiveContracts from "@/pages/ActiveContracts";
import ContractReview from "@/pages/ContractReview";
import LaunchStrategies from "@/pages/LaunchStrategies";
import LaunchStrategyDetail from "@/pages/LaunchStrategyDetail";
import ProjectDetail from "@/pages/ProjectDetail";
import NotFound from "@/pages/NotFound";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/for-authors" element={<ForAuthors />} />
          <Route path="/publishing-support" element={<PublishingSupport />} />
          <Route path="/professional-network" element={<ProfessionalNetwork />} />
          <Route path="/professional-network/find" element={<FindProfessional />} />
          <Route path="/professional-network/apply" element={<FreelancerApplication />} />
          <Route path="/professional-network/freelancer/:id" element={<FreelancerDetail />} />
          <Route path="/professional-network/post-project" element={<PostProject />} />
          <Route path="/professional-network/projects" element={<ProjectListing />} />
          <Route path="/professional-network/contracts/templates" element={<ContractTemplates />} />
          <Route path="/professional-network/contracts/active" element={<ActiveContracts />} />
          <Route path="/professional-network/contracts/review" element={<ContractReview />} />
          <Route path="/launch-strategies" element={<LaunchStrategies />} />
          <Route path="/launch-strategies/:id" element={<LaunchStrategyDetail />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;