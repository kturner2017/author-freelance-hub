
import React from 'react';
import { Button } from '../../ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';

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
  const buttonLabel = isModelLoading 
    ? "Loading speech recognition..." 
    : (isRecording ? "Stop recording" : "Start voice dictation");
  
  console.log('Rendering RecordingButton with state:', { isRecording, isModelLoading });
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              console.log('Recording button clicked');
              onToggleRecording();
            }}
            disabled={isModelLoading}
            className={`h-8 w-8 p-0 relative ${isRecording ? 'bg-red-200 hover:bg-red-300' : ''}`}
          >
            {isModelLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isRecording ? (
              <>
                <MicOff className="h-4 w-4 text-red-600" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </>
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{buttonLabel}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RecordingButton;
