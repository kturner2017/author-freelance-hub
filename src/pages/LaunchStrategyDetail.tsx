import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Clock, DollarSign, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const LaunchStrategyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: strategy, isLoading } = useQuery({
    queryKey: ['launch-strategy', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('launch_strategies')
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-8 w-3/4 mb-6" />
          <Skeleton className="h-32 w-full mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!strategy) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl font-bold text-primary">Strategy not found</h1>
          <Button 
            className="mt-4"
            onClick={() => navigate('/launch-strategies')}
          >
            Back to Strategies
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/launch-strategies')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Strategies
        </Button>

        <h1 className="text-4xl font-serif font-bold text-primary mb-6">
          {strategy.title}
        </h1>

        <Card className="p-6 mb-8">
          <p className="text-xl text-gray-600 mb-6">{strategy.summary}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-primary mr-2" />
              <span className="text-gray-600">Timeline: {strategy.timeline}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-primary mr-2" />
              <span className="text-gray-600">Cost: {strategy.estimated_cost}</span>
            </div>
          </div>
        </Card>

        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold text-primary mb-4">Strategy Details</h2>
          <p className="text-gray-600 mb-8">{strategy.description}</p>

          <h2 className="text-2xl font-bold text-primary mb-4">Key Benefits</h2>
          <ul className="space-y-3">
            {strategy.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LaunchStrategyDetail;