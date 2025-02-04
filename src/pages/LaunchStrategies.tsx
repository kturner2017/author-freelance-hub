import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const LaunchStrategies = () => {
  const navigate = useNavigate();
  
  const { data: strategies, isLoading } = useQuery({
    queryKey: ['launch-strategies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('launch_strategies')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-20 w-full mb-4" />
                <Skeleton className="h-4 w-1/2" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-serif font-bold text-primary mb-8">
          Book Launch Strategies
        </h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {strategies?.map((strategy) => (
            <Card 
              key={strategy.id}
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/launch-strategies/${strategy.id}`)}
            >
              <h2 className="text-xl font-bold text-primary mb-3">{strategy.title}</h2>
              <p className="text-gray-600 mb-4">{strategy.summary}</p>
              <p className="text-sm text-primary">
                Estimated Cost: {strategy.estimated_cost}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LaunchStrategies;