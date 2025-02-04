import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, UserRound, Briefcase, DollarSign } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Freelancer = Database['public']['Tables']['freelancers']['Row'];
type SortField = 'full_name' | 'headline' | 'hourly_rate' | 'created_at';
type SortOrder = 'asc' | 'desc';

const FindProfessional = () => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const { data: freelancers, isLoading, error } = useQuery({
    queryKey: ['freelancers', sortField, sortOrder],
    queryFn: async () => {
      console.log('Fetching freelancers with sort:', { sortField, sortOrder });
      const { data, error } = await supabase
        .from('freelancers')
        .select('*')
        .order(sortField, { ascending: sortOrder === 'asc' });

      if (error) {
        console.error('Error fetching freelancers:', error);
        throw error;
      }

      console.log('Fetched freelancers:', data);
      return data;
    },
  });

  if (error) {
    console.error('Query error:', error);
  }

  const toggleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <Button
      variant="ghost"
      onClick={() => toggleSort(field)}
      className="flex items-center gap-2"
    >
      {label}
      <ArrowUpDown className="h-4 w-4" />
    </Button>
  );

  const formatExpertise = (areas: Database["public"]["Enums"]["expertise_area"][]) => {
    return areas.map(area => area.replace('_', ' ')).join(', ');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-primary">
            Find Professionals
          </h1>
          <Button onClick={() => navigate('/professional-network/post-project')}>
            Post a Project
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading professionals...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">Error loading professionals. Please try again.</div>
        ) : !freelancers?.length ? (
          <div className="text-center py-8">No professionals found.</div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><SortButton field="full_name" label="Professional" /></TableHead>
                  <TableHead><SortButton field="headline" label="Expertise" /></TableHead>
                  <TableHead><SortButton field="hourly_rate" label="Rate" /></TableHead>
                  <TableHead>Areas of Expertise</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {freelancers?.map((freelancer) => (
                  <TableRow 
                    key={freelancer.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => navigate(`/professional-network/find/${freelancer.id}`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <UserRound className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{freelancer.full_name}</div>
                          <div className="text-sm text-gray-500">{freelancer.headline}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-500" />
                        <span>{freelancer.bio.substring(0, 100)}...</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span>${freelancer.hourly_rate}/hr</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatExpertise(freelancer.expertise_areas)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindProfessional;