import { useEffect, useState } from 'react';
import { FileText, Download, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ContractTemplate {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  created_at?: string;
  updated_at?: string;
}

const ContractTemplates = () => {
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const { data, error } = await supabase
          .from('contract_templates')
          .select('*');

        if (error) {
          throw error;
        }

        if (data) {
          setTemplates(data as ContractTemplate[]);
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
        toast.error('Failed to load contract templates');
      }
    };

    fetchTemplates();
  }, []);

  const handleDownload = (template: ContractTemplate) => {
    const element = document.createElement('a');
    const file = new Blob([template.content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${template.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Template downloaded successfully');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-primary mb-2">Contract Templates</h1>
            <p className="text-gray-600">Choose from our pre-approved contract templates for various publishing services.</p>
          </div>
          <Button onClick={() => navigate('/professional-network/contracts/templates/create')}>
            Create Custom Template
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{template.title}</CardTitle>
                <CardDescription className="capitalize">{template.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{template.description}</p>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{template.title}</DialogTitle>
                      </DialogHeader>
                      <div className="whitespace-pre-wrap font-mono text-sm">
                        {template.content}
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    className="w-full"
                    onClick={() => handleDownload(template)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Use Template
                  </Button>
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