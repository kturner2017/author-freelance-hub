
import React, { useRef } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '../../ui/button';
import { Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ImageUploadButtonProps {
  editor: Editor;
}

const ImageUploadButton = ({ editor }: ImageUploadButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('editor_images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('editor_images')
        .getPublicUrl(filePath);

      editor.chain().focus().setImage({ 
        src: publicUrl,
        alt: file.name,
        title: file.name
      }).run();

    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={triggerFileInput}
        className="h-8 w-8 p-0"
        title="Upload image"
      >
        <Upload className="h-4 w-4" />
      </Button>
    </>
  );
};

export default ImageUploadButton;
