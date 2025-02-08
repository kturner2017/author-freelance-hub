
import React, { useEffect, useState } from 'react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Save } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '../ui/use-toast';

interface GoalAreaProps {
  bookId: string;
  currentWordCount: number;
}

const GoalArea = ({ bookId, currentWordCount }: GoalAreaProps) => {
  const [targetWordCount, setTargetWordCount] = useState(50000);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('50000');
  const { toast } = useToast();

  useEffect(() => {
    const fetchGoal = async () => {
      const { data, error } = await supabase
        .from('manuscript_goals')
        .select('target_word_count')
        .eq('book_id', bookId)
        .single();

      if (error) {
        console.error('Error fetching goal:', error);
        return;
      }

      if (data) {
        setTargetWordCount(data.target_word_count);
        setInputValue(data.target_word_count.toString());
      } else {
        // Create default goal if none exists
        const { error: insertError } = await supabase
          .from('manuscript_goals')
          .insert([
            { book_id: bookId, target_word_count: 50000 }
          ]);

        if (insertError) {
          console.error('Error creating default goal:', insertError);
        }
      }
    };

    if (bookId) {
      fetchGoal();
    }
  }, [bookId]);

  const progress = Math.min(Math.round((currentWordCount / targetWordCount) * 100), 100);

  const handleSave = async () => {
    const newTarget = parseInt(inputValue);
    if (isNaN(newTarget) || newTarget <= 0) {
      toast({
        title: "Invalid goal",
        description: "Please enter a valid number greater than 0",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('manuscript_goals')
      .upsert({
        book_id: bookId,
        target_word_count: newTarget
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update goal",
        variant: "destructive"
      });
      return;
    }

    setTargetWordCount(newTarget);
    setIsEditing(false);
    toast({
      title: "Goal updated",
      description: "Your word count goal has been updated"
    });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Word Count Goal</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            {currentWordCount.toLocaleString()} / {targetWordCount.toLocaleString()} words
          </span>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <div className="mt-4">
        {isEditing ? (
          <div className="flex gap-2">
            <Input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-32"
            />
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="w-full"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Goal
          </Button>
        )}
      </div>
    </div>
  );
};

export default GoalArea;
