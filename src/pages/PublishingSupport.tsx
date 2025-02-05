import React from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen, Target, Users, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PublishingSupport = () => {
  const services = [
    {
      title: "Contract Review",
      description: "Get your publishing contracts reviewed by legal professionals who specialize in the publishing industry.",
      icon: BookOpen,
      link: "/contract-review"
    },
    {
      title: "Launch Strategy",
      description: "Develop a comprehensive launch strategy to maximize your book's market impact.",
      icon: Target,
      link: "/launch-strategies"
    },
    {
      title: "Professional Network",
      description: "Connect with editors, designers, and marketers to bring your book to life.",
      icon: Users,
      link: "/professional-network"
    },
    {
      title: "Quality Assurance",
      description: "Ensure your manuscript meets industry standards with our professional review service.",
      icon: Award,
      link: "/professional-network/find"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">
            Publishing Support Services
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From manuscript to market, we provide comprehensive support services to help you 
            navigate the publishing journey successfully.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <Card 
              key={index}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-6">
                  {service.description}
                </CardDescription>
                <Button asChild variant="outline" className="w-full">
                  <Link to={service.link} className="flex items-center justify-center gap-2">
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-secondary p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Need Personalized Guidance?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our publishing experts are here to help you navigate your unique publishing journey.
            Schedule a consultation to discuss your specific needs.
          </p>
          <Button size="lg">
            Schedule Consultation
          </Button>
        </div>
      </main>
    </div>
  );
};

export default PublishingSupport;