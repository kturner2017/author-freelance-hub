import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

type SortField = 'project_name' | 'author' | 'book_title' | 'genre' | 'type' | 'created_at';
type SortOrder = 'asc' | 'desc';

const FindProfessional = () => {
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', sortField, sortOrder],
    queryFn: async () => {
      console.log('Fetching projects with sort:', { sortField, sortOrder });
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order(sortField, { ascending: sortOrder === 'asc' });

      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }

      return data;
    },
  });

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

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-serif font-bold text-primary mb-8">
          Find Professionals
        </h1>

        {isLoading ? (
          <div className="text-center py-8">Loading projects...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><SortButton field="project_name" label="Project Name" /></TableHead>
                  <TableHead><SortButton field="author" label="Author" /></TableHead>
                  <TableHead><SortButton field="book_title" label="Book Title" /></TableHead>
                  <TableHead><SortButton field="genre" label="Genre" /></TableHead>
                  <TableHead><SortButton field="type" label="Type" /></TableHead>
                  <TableHead><SortButton field="created_at" label="Posted Date" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects?.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>{project.project_name}</TableCell>
                    <TableCell>{project.author}</TableCell>
                    <TableCell>{project.book_title}</TableCell>
                    <TableCell>{project.genre}</TableCell>
                    <TableCell>{project.type}</TableCell>
                    <TableCell>
                      {new Date(project.created_at).toLocaleDateString()}
                    </TableCell>
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