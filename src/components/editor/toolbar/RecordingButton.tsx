
import React from 'react';
import { Button } from '../../ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface RecordingButtonProps {
  isRecording: boolean;
  isModelLoading: boolean;
  onToggleRecording: () => void;
}

const RecordingButton = ({ 
  isRecording, 
  isModelLoading, 
  onToggleRecording 
}: RecordingButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggleRecording}
      disabled={isModelLoading}
      className={`h-8 w-8 p-0 ${isRecording ? 'bg-red-200 hover:bg-red-300' : ''}`}
    >
      {isModelLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isRecording ? (
        <MicOff className="h-4 w-4 text-red-600" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};

export default RecordingButton;
