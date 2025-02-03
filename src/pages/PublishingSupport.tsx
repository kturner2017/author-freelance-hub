import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, DollarSign, Megaphone, Globe } from "lucide-react";

const PublishingSupport = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <section className="py-20 px-4 bg-gradient-to-b from-primary-100 to-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6 text-center">
            Publishing Support
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-2xl mx-auto text-center">
            Comprehensive support to help you bring your book to market successfully
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Cover Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Professional cover design services to make your book stand out on the shelves and in digital marketplaces.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Sales Strategy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Develop effective pricing and sales strategies to maximize your book's revenue potential.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <Megaphone className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Marketing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Comprehensive marketing support including social media, email campaigns, and promotional events.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Distribution Channels</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Access to major distribution channels including online retailers, bookstores, and libraries.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PublishingSupport;