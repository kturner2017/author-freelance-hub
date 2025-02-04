import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Briefcase, Users, Handshake, DollarSign, FileText, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";

const ProfessionalNetwork = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary-100 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6">
            Connect with Publishing Professionals
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Find the right professionals to help bring your book to life. Connect with editors, designers, marketers, and other industry experts.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild>
              <Link to="/professional-network/find">Find Professionals</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/professional-network/apply">Join as a Professional</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Find Professionals</h3>
              <p className="text-gray-600 mb-6">
                Browse through our network of vetted publishing professionals. Filter by expertise, experience, and budget to find the perfect match.
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link to="/professional-network/find">Browse Directory</Link>
              </Button>
            </div>

            <div className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Contract Templates</h3>
              <p className="text-gray-600 mb-6">
                Access professional contract templates for different types of publishing services. Customize them to fit your specific needs.
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link to="/professional-network/contracts/templates">View Templates</Link>
              </Button>
            </div>

            <div className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <ClipboardList className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Active Contracts</h3>
              <p className="text-gray-600 mb-6">
                Manage your ongoing contracts, track milestones, and handle revisions. Keep all your agreements organized in one place.
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link to="/professional-network/contracts/active">View Contracts</Link>
              </Button>
            </div>

            <div className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Post Projects</h3>
              <p className="text-gray-600 mb-6">
                Describe your project needs and receive proposals from qualified professionals. Set your budget and timeline.
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link to="/professional-network/post-project">Create Project</Link>
              </Button>
            </div>

            <div className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Handshake className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Contract Review</h3>
              <p className="text-gray-600 mb-6">
                Get your contracts reviewed by legal professionals. Ensure clear terms and protect both parties involved in the agreement.
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link to="/professional-network/contracts/review">Request Review</Link>
              </Button>
            </div>

            <div className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Secure Payments</h3>
              <p className="text-gray-600 mb-6">
                Handle payments securely through our platform. Set up milestones and release payments as work progresses.
              </p>
              <Button variant="outline" className="w-full">Payment Settings</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfessionalNetwork;