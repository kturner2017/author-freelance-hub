import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload, X, FileText, Image } from 'lucide-react';

type ProjectForm = {
  projectName: string;
  author: string;
  bookTitle: string;
  genre: string;
  type: string;
};

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const PostProject = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<ProjectForm>();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    if (files.length + selectedFiles.length > MAX_FILES) {
      toast.error(`You can only upload up to ${MAX_FILES} files`);
      return;
    }

    const invalidFiles = selectedFiles.filter(file => file.size > MAX_FILE_SIZE);
    if (invalidFiles.length > 0) {
      toast.error('Some files are too large. Maximum size is 10MB per file.');
      return;
    }

    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  const uploadFiles = async (projectId: string) => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', projectId);

      const { error } = await supabase.functions.invoke('upload-project-file', {
        body: formData,
      });

      if (error) {
        console.error('Upload error:', error);
        throw new Error(`Failed to upload ${file.name}`);
      }
    });

    try {
      await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const onSubmit = async (data: ProjectForm) => {
    try {
      setUploading(true);

      // First, create the project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          project_name: data.projectName,
          author: data.author,
          book_title: data.bookTitle,
          genre: data.genre,
          type: data.type,
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Then upload all files
      if (files.length > 0) {
        await uploadFiles(project.id);
      }

      toast.success('Project created successfully!');
      navigate('/professional-network');
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-8">
        <h1 className="text-4xl font-serif font-bold text-primary mb-8">
          Post a New Project
        </h1>

        <Card className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  {...register("projectName", { required: true })}
                  className={errors.projectName ? "border-red-500" : ""}
                />
                {errors.projectName && (
                  <p className="text-red-500 text-sm mt-1">Project name is required</p>
                )}
              </div>

              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  {...register("author", { required: true })}
                  className={errors.author ? "border-red-500" : ""}
                />
                {errors.author && (
                  <p className="text-red-500 text-sm mt-1">Author is required</p>
                )}
              </div>

              <div>
                <Label htmlFor="bookTitle">Book Title</Label>
                <Input
                  id="bookTitle"
                  {...register("bookTitle", { required: true })}
                  className={errors.bookTitle ? "border-red-500" : ""}
                />
                {errors.bookTitle && (
                  <p className="text-red-500 text-sm mt-1">Book title is required</p>
                )}
              </div>

              <div>
                <Label htmlFor="genre">Genre</Label>
                <Input
                  id="genre"
                  {...register("genre", { required: true })}
                  className={errors.genre ? "border-red-500" : ""}
                />
                {errors.genre && (
                  <p className="text-red-500 text-sm mt-1">Genre is required</p>
                )}
              </div>

              <div>
                <Label htmlFor="type">Project Type</Label>
                <Input
                  id="type"
                  {...register("type", { required: true })}
                  className={errors.type ? "border-red-500" : ""}
                />
                {errors.type && (
                  <p className="text-red-500 text-sm mt-1">Project type is required</p>
                )}
              </div>

              <div className="space-y-4">
                <Label>Project Files (Max 5 files, 10MB each)</Label>
                
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('fileInput')?.click()}
                    disabled={files.length >= MAX_FILES || uploading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Add Files
                  </Button>
                  <input
                    id="fileInput"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                </div>

                {files.length > 0 && (
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div className="flex items-center gap-2">
                          {getFileIcon(file)}
                          <span className="text-sm">{file.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          disabled={uploading}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/professional-network')}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading ? 'Creating Project...' : 'Create Project'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PostProject;