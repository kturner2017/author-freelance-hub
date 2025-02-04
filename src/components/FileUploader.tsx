import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface FileUploaderProps {
  boxId: string;
  onUploadComplete?: () => void;
}

const FileUploader = ({ boxId, onUploadComplete }: FileUploaderProps) => {
  const { toast } = useToast();
  console.log('FileUploader mounted for box:', boxId);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log('Files dropped:', acceptedFiles);
    
    for (const file of acceptedFiles) {
      try {
        // First check if we've hit the limit
        const { data: existingFiles, error: countError } = await supabase
          .from('manuscript_files')
          .select('id')
          .eq('box_id', boxId);

        if (countError) throw countError;
        
        if (existingFiles && existingFiles.length >= 5) {
          toast({
            title: "Upload limit reached",
            description: "Maximum 5 files allowed per box",
            variant: "destructive"
          });
          return;
        }

        const filePath = `${boxId}/${file.name}`;
        console.log('Uploading file to path:', filePath);

        // Upload file to storage
        const { error: uploadError } = await supabase.storage
          .from('manuscript_files')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Create database record
        const { error: dbError } = await supabase
          .from('manuscript_files')
          .insert({
            box_id: boxId,
            filename: file.name,
            file_path: filePath,
            content_type: file.type,
            size: file.size
          });

        if (dbError) throw dbError;

        toast({
          title: "File uploaded",
          description: `${file.name} has been uploaded successfully`
        });

        if (onUploadComplete) {
          onUploadComplete();
        }

      } catch (error) {
        console.error('Upload error:', error);
        toast({
          title: "Upload failed",
          description: "There was an error uploading your file",
          variant: "destructive"
        });
      }
    }
  }, [boxId, toast, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxSize: 5000000 // 5MB
  });

  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'}`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
      <p className="text-sm text-gray-600">
        {isDragActive ? 
          "Drop files here..." : 
          "Drag & drop files here, or click to select"}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        Supports images, PDF, DOC, DOCX, TXT (max 5MB)
      </p>
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-2"
        onClick={(e) => {
          e.stopPropagation();
          const input = document.querySelector('input[type="file"]') as HTMLInputElement;
          if (input) {
            input.click();
          }
        }}
      >
        Select Files
      </Button>
    </div>
  );
};

export default FileUploader;