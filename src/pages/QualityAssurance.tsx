
import React from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Star, BookOpen, Shield, ChevronLeft, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const QualityAssurance = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">
            Industry-Leading Quality Assurance
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Trusted by award-winning authors worldwide, our platform sets the standard for professional writing software.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="flex items-start gap-4">
                <Award className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Award-Winning Authors</h3>
                  <p className="text-gray-600">
                    Our platform has been the choice of numerous award-winning authors, including Pulitzer Prize recipients and New York Times bestsellers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <div className="flex items-start gap-4">
                <Star className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Professional Standards</h3>
                  <p className="text-gray-600">
                    Built-in style guides, formatting tools, and industry-standard manuscript formatting ensure your work meets professional publishing requirements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <div className="flex items-start gap-4">
                <BookOpen className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Advanced Writing Tools</h3>
                  <p className="text-gray-600">
                    From our AI-powered readability analysis to character development tools, we provide everything you need to craft compelling narratives.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Reliable & Secure</h3>
                  <p className="text-gray-600">
                    Enterprise-grade security, automatic backups, and version control ensure your work is always safe and accessible.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-secondary p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Ready to Experience Professional-Grade Writing Software?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of successful authors who trust our platform for their writing journey.
          </p>
          <Button size="lg" asChild>
            <Link to="/editor">Start Writing Now</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default QualityAssurance;
