import React, { useState } from 'react';
import { Button } from './ui/button';
import { Upload, Trash2, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './ui/use-toast';

interface FileUploaderProps {
  act: string;
  chapterId: string;
}

const FileUploader = ({ act, chapterId }: FileUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchFiles = async () => {
    const { data, error } = await supabase
      .from('manuscript_files')
      .select('*')
      .eq('act', act)
      .eq('chapter_id', chapterId);

    if (error) {
      console.error('Error fetching files:', error);
      return;
    }

    setFiles(data || []);
  };

  React.useEffect(() => {
    fetchFiles();
  }, [act, chapterId]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      
      if (!file) return;

      // Sanitize filename
      const sanitizedFileName = file.name.replace(/[^\x00-\x7F]/g, '');
      const fileExt = sanitizedFileName.split('.').pop();
      const filePath = `${act}/${chapterId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('manuscript_files')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { error: dbError } = await supabase
        .from('manuscript_files')
        .insert({
          filename: sanitizedFileName,
          file_path: filePath,
          content_type: file.type,
          size: file.size,
          act,
          chapter_id: chapterId,
        });

      if (dbError) {
        throw dbError;
      }

      toast({
        title: "File uploaded",
        description: "Your file has been uploaded successfully."
      });

      fetchFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId: string, filePath: string) => {
    try {
      const { error: storageError } = await supabase.storage
        .from('manuscript_files')
        .remove([filePath]);

      if (storageError) {
        throw storageError;
      }

      const { error: dbError } = await supabase
        .from('manuscript_files')
        .delete()
        .eq('id', fileId);

      if (dbError) {
        throw dbError;
      }

      toast({
        title: "File deleted",
        description: "The file has been removed."
      });

      fetchFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting the file.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="relative"
          disabled={uploading}
        >
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Uploading...' : 'Upload File'}
        </Button>
      </div>

      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-2 border rounded-md"
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{file.filename}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(file.id, file.file_path)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploader;