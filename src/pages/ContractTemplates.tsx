import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

const ContractTemplates = () => {
  const templates = [
    {
      title: "Standard Editing Agreement",
      description: "A comprehensive contract for book editing services, including developmental editing, copy editing, and proofreading.",
      type: "Editing"
    },
    {
      title: "Book Cover Design Contract",
      description: "Agreement for cover design services, including rights, revisions, and final deliverables.",
      type: "Design"
    },
    {
      title: "Marketing Services Agreement",
      description: "Contract for book marketing and promotion services, including social media, advertising, and PR.",
      type: "Marketing"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-primary mb-2">Contract Templates</h1>
            <p className="text-gray-600">Choose from our pre-approved contract templates for various publishing services.</p>
          </div>
          <Button>Create Custom Template</Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{template.title}</CardTitle>
                <CardDescription>{template.type}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{template.description}</p>
                <div className="flex gap-2">
                  <Button variant="outline" className="w-full">Preview</Button>
                  <Button className="w-full">Use Template</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContractTemplates;