
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowLeft, User2, Briefcase, DollarSign, GraduationCap, Award } from 'lucide-react';

const FreelancerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: freelancer, isLoading } = useQuery({
    queryKey: ['freelancer', id],
    queryFn: async () => {
      console.log('Fetching freelancer details for ID:', id);
      const { data, error } = await supabase
        .from('freelancers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching freelancer:', error);
        throw error;
      }

      console.log('Fetched freelancer:', data);
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

  if (!freelancer) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-primary">Professional not found</h1>
          <Button 
            className="mt-4"
            onClick={() => navigate('/professional-network/find')}
          >
            Back to Professionals
          </Button>
        </div>
      </div>
    );
  }

  const formatExpertise = (areas: string[]) => {
    return areas.map(area => area.replace('_', ' ')).join(', ');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/professional-network/find')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Professionals
        </Button>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User2 className="w-8 h-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl font-serif">{freelancer.full_name}</CardTitle>
                <CardDescription className="text-lg">
                  {freelancer.headline}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span className="font-medium">${freelancer.hourly_rate}/hr</span>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                About
              </h3>
              <p className="text-gray-700">{freelancer.bio}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Areas of Expertise
              </h3>
              <p className="text-gray-700">{formatExpertise(freelancer.expertise_areas)}</p>
            </div>

            {freelancer.education && freelancer.education.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Education
                </h3>
                <ul className="list-disc list-inside text-gray-700">
                  {freelancer.education.map((edu, index) => (
                    <li key={index}>{edu}</li>
                  ))}
                </ul>
              </div>
            )}

            {freelancer.experience && freelancer.experience.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Experience</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {freelancer.experience.map((exp, index) => (
                    <li key={index}>{exp}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FreelancerDetail;
