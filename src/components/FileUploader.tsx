import React, { useState } from 'react';
import { Button } from './ui/button';
import { Upload, Trash2, FileText, Image, FileArchive } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './ui/use-toast';

interface FileUploaderProps {
  boxId: string;
}

const FileUploader = ({ boxId }: FileUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchFiles = async () => {
    console.log('Fetching files for box:', boxId);
    const { data, error } = await supabase
      .from('manuscript_files')
      .select('*')
      .eq('box_id', boxId);

    if (error) {
      console.error('Error fetching files:', error);
      return;
    }

    setFiles(data || []);
    console.log('Files fetched:', data);
  };

  React.useEffect(() => {
    fetchFiles();
  }, [boxId]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      
      if (!file) return;

      // Check file count
      if (files.length >= 5) {
        toast({
          title: "Upload limit reached",
          description: "Maximum of 5 files allowed per box.",
          variant: "destructive"
        });
        return;
      }

      // Sanitize filename
      const sanitizedFileName = file.name.replace(/[^\x00-\x7F]/g, '');
      const fileExt = sanitizedFileName.split('.').pop();
      const filePath = `${boxId}/${crypto.randomUUID()}.${fileExt}`;

      console.log('Uploading file:', { filePath, contentType: file.type });

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
          box_id: boxId,
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

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith('image/')) return Image;
    if (contentType.startsWith('application/')) return FileArchive;
    return FileText;
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
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Uploading...' : 'Upload File'}
        </Button>
        <span className="text-sm text-gray-500">
          {files.length}/5 files uploaded
        </span>
      </div>

      <div className="space-y-2">
        {files.map((file) => {
          const FileIcon = getFileIcon(file.content_type);
          return (
            <div
              key={file.id}
              className="flex items-center justify-between p-2 border rounded-md"
            >
              <div className="flex items-center gap-2">
                <FileIcon className="h-4 w-4 text-gray-500" />
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
          );
        })}
      </div>
    </div>
  );
};

export default FileUploader;