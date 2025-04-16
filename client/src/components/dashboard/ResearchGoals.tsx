import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckIcon } from '@/lib/icons';
import { formatDate } from '@/lib/utils';

interface Goal {
  id: number;
  description: string;
  isCompleted: boolean;
  completedDate?: Date;
  dueDate?: Date;
}

interface ResearchGoalsProps {
  goals: Goal[];
  startDate: Date;
  endDate: Date;
  onEditGoals?: () => void;
  onToggleGoal: (id: number, completed: boolean) => void;
}

const ResearchGoals: React.FC<ResearchGoalsProps> = ({
  goals,
  startDate,
  endDate,
  onEditGoals,
  onToggleGoal
}) => {
  const completedGoals = goals.filter(goal => goal.isCompleted);
  const progress = goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0;
  
  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-neutral-200">
        <h3 className="font-semibold text-lg">Research Goals</h3>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-medium">Weekly Progress</h4>
            <p className="text-sm text-neutral-500">
              {formatDate(startDate)} - {formatDate(endDate)}
            </p>
          </div>
          <Button 
            variant="link" 
            className="text-primary-600 hover:underline p-0"
            onClick={onEditGoals}
          >
            Edit Goals
          </Button>
        </div>
        
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="flex items-center">
            <Progress value={progress} className="h-4 flex-1 mr-4" />
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          
          {/* Goal Details */}
          <div className="space-y-3">
            {goals.map(goal => (
              <div key={goal.id} className="flex items-start">
                <button
                  className={`flex-shrink-0 w-5 h-5 rounded-full border-2 border-primary-600 mr-3 flex items-center justify-center ${
                    goal.isCompleted ? 'bg-primary-600 text-white' : ''
                  }`}
                  onClick={() => onToggleGoal(goal.id, !goal.isCompleted)}
                >
                  {goal.isCompleted && <CheckIcon className="w-3 h-3" />}
                </button>
                <div>
                  <p className="text-sm font-medium">{goal.description}</p>
                  {goal.isCompleted && goal.completedDate ? (
                    <p className="text-xs text-neutral-500">Completed on {formatDate(goal.completedDate)}</p>
                  ) : goal.dueDate ? (
                    <p className="text-xs text-neutral-500">Due by {formatDate(goal.dueDate)}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ResearchGoals;
