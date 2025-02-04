import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, Shield, Clock } from "lucide-react";

const ContractReview = () => {
  const reviewServices = [
    {
      title: "Basic Legal Review",
      description: "Standard contract review by a publishing industry legal professional.",
      price: "$299",
      turnaround: "3-5 business days",
      features: [
        "Contract terms analysis",
        "Rights and obligations review",
        "Basic recommendations",
        "One revision round"
      ]
    },
    {
      title: "Comprehensive Review",
      description: "Detailed analysis and customization of your publishing contract.",
      price: "$599",
      turnaround: "5-7 business days",
      features: [
        "In-depth contract analysis",
        "Custom clause recommendations",
        "Rights negotiation support",
        "Two revision rounds",
        "30-minute consultation"
      ]
    },
    {
      title: "Premium Review & Negotiation",
      description: "Full-service contract review and negotiation support.",
      price: "$999",
      turnaround: "7-10 business days",
      features: [
        "Complete contract analysis",
        "Custom clause drafting",
        "Full negotiation support",
        "Unlimited revisions",
        "60-minute consultation",
        "Priority support"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">Contract Review Services</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get your publishing contracts reviewed by legal professionals who specialize in the publishing industry.
            Protect your rights and ensure fair terms.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviewServices.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-primary">{service.price}</span>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{service.turnaround}</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <Shield className="w-5 h-5 text-primary mt-0.5" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button className="w-full">Request Review</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContractReview;