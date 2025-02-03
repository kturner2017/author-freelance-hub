import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Pen, BookOpen, Users, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ForAuthors = () => {
  const navigate = useNavigate();

  const handlePublishingSupport = () => {
    navigate('/editor', {
      state: {
        selectedTopics: ['Cover Design', 'Sales', 'Marketing', 'Distribution Channels']
      }
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary-100 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6 animate-fade-in">
            Write Your Story, <br />Find Your Team
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto animate-fade-in animate-fade-in-delay-1">
            Join a community of authors and professionals dedicated to bringing your book to life. From writing to publishing, we're here to support your journey.
          </p>
          <Button 
            size="lg" 
            className="animate-fade-in animate-fade-in-delay-2"
            onClick={() => navigate('/editor')}
          >
            Start Writing Today
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary text-center mb-16">
            Everything You Need to Succeed
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div 
              className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate('/editor')}
            >
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Pen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-bold text-primary mb-2">Writing Tools</h3>
              <p className="text-gray-600">
                Professional-grade editor with formatting tools and templates for every genre.
              </p>
            </div>
            <div 
              className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={handlePublishingSupport}
            >
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-bold text-primary mb-2">Publishing Support</h3>
              <p className="text-gray-600">
                Expert guidance on formatting, cover design, and distribution channels.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-bold text-primary mb-2">Professional Network</h3>
              <p className="text-gray-600">
                Connect with editors, designers, and marketers to perfect your book.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Rocket className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-bold text-primary mb-2">Launch Strategy</h3>
              <p className="text-gray-600">
                Marketing tools and resources to help your book reach its audience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-primary">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
            Ready to Begin Your Author Journey?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of authors who have found success with Authify's comprehensive platform.
          </p>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => navigate('/editor')}
          >
            Create Your Account
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ForAuthors;