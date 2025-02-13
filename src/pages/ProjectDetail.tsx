
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar, BookOpen, User2, Tag, FileType } from 'lucide-react';
import { format } from 'date-fns';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-primary">Project not found</h1>
          <Button 
            className="mt-4"
            onClick={() => navigate('/professional-network/projects')}
          >
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/professional-network/projects')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-serif">{project.project_name}</CardTitle>
            <CardDescription className="text-lg">
              A {project.type} project in {project.genre}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-2">
                <User2 className="h-5 w-5 text-primary" />
                <span className="font-medium">Author:</span> {project.author}
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="font-medium">Book Title:</span> {project.book_title}
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                <span className="font-medium">Genre:</span> {project.genre}
              </div>
              <div className="flex items-center gap-2">
                <FileType className="h-5 w-5 text-primary" />
                <span className="font-medium">Project Type:</span> {project.type}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="font-medium">Posted:</span> {format(new Date(project.created_at), 'MMM d, yyyy')}
              </div>
            </div>

            <div className="mt-8">
              <Button className="w-full">Apply for this Project</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDetail;
