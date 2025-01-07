'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../types/database';
import type { GoalWithMilestones } from '../types/goals';
import EditGoalForm from './EditGoalForm';

export default function GoalList() {
  const [goals, setGoals] = useState<GoalWithMilestones[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set());
  const [editingGoal, setEditingGoal] = useState<GoalWithMilestones | null>(null);

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchGoals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Fetch goals
      const { data: goalsData, error: goalsError } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (goalsError) throw goalsError;

      // Fetch milestones for all goals
      const { data: milestonesData, error: milestonesError } = await supabase
        .from('goal_milestones')
        .select('*')
        .in('goal_id', goalsData.map(g => g.id));

      if (milestonesError) throw milestonesError;

      // Combine goals with their milestones
      const goalsWithMilestones = goalsData.map(goal => ({
        ...goal,
        milestones: milestonesData.filter(m => m.goal_id === goal.id),
      }));

      setGoals(goalsWithMilestones);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch goals');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const toggleMilestone = async (goalId: string, milestone: GoalWithMilestones['milestones'][0]) => {
    try {
      const { error: updateError } = await supabase
        .from('goal_milestones')
        .update({
          completed: !milestone.completed,
          completed_at: !milestone.completed ? new Date().toISOString() : null,
        })
        .eq('id', milestone.id);

      if (updateError) throw updateError;

      // Calculate new progress
      const goal = goals.find(g => g.id === goalId);
      if (goal) {
        const totalMilestones = goal.milestones.length;
        const completedMilestones = goal.milestones.filter(m => 
          m.id === milestone.id ? !m.completed : m.completed
        ).length;
        const progress = Math.round((completedMilestones / totalMilestones) * 100);

        // Update goal progress
        const { error: goalError } = await supabase
          .from('goals')
          .update({
            progress,
            status: progress === 100 ? 'completed' : 'in_progress',
            completed_at: progress === 100 ? new Date().toISOString() : null,
          })
          .eq('id', goalId);

        if (goalError) throw goalError;
      }

      await fetchGoals();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update milestone');
    }
  };

  const toggleGoalExpanded = (goalId: string) => {
    setExpandedGoals(prev => {
      const newSet = new Set(prev);
      if (newSet.has(goalId)) {
        newSet.delete(goalId);
      } else {
        newSet.add(goalId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Loading goals...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-2">No goals created yet</div>
        <p className="text-sm text-gray-400">
          Create your first goal to start tracking your progress
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {goals.map(goal => {
        const isExpanded = expandedGoals.has(goal.id);
        const daysLeft = Math.ceil(
          (new Date(goal.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        
        return (
          <div
            key={goal.id}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{goal.name}</h3>
                      {goal.description && (
                        <p className="text-sm text-gray-500 mt-1">{goal.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <div className="text-xs text-gray-500">
                          {daysLeft > 0 
                            ? `${daysLeft} days left`
                            : 'Past due'
                          }
                        </div>
                        <div className="text-xs text-gray-500">
                          {goal.progress}% complete
                        </div>
                        <div className={`text-xs ${
                          goal.status === 'completed' ? 'text-green-600' :
                          goal.status === 'in_progress' ? 'text-blue-600' :
                          goal.status === 'not_started' ? 'text-gray-600' :
                          'text-gray-400'
                        }`}>
                          {goal.status.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingGoal(goal)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => toggleGoalExpanded(goal.id)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        {isExpanded ? '▼' : '▶'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-2 bg-gray-100 rounded-full">
                <div
                  className="h-2 rounded-full bg-primary transition-all"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>

            {isExpanded && goal.milestones.length > 0 && (
              <div className="border-t">
                <div className="p-4 space-y-2">
                  {goal.milestones.map(milestone => (
                    <div
                      key={milestone.id}
                      className="flex items-start gap-3 p-2 bg-gray-50 rounded"
                    >
                      <button
                        onClick={() => toggleMilestone(goal.id, milestone)}
                        className={`mt-1 h-4 w-4 rounded border transition-colors ${
                          milestone.completed
                            ? 'bg-primary border-primary text-white'
                            : 'border-gray-300 hover:border-primary'
                        }`}
                      >
                        {milestone.completed && '✓'}
                      </button>
                      <div className="flex-1">
                        <div className={`font-medium ${
                          milestone.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                        }`}>
                          {milestone.name}
                        </div>
                        {milestone.description && (
                          <div className={`text-sm ${
                            milestone.completed ? 'text-gray-400 line-through' : 'text-gray-500'
                          }`}>
                            {milestone.description}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {editingGoal && (
        <EditGoalForm
          goal={editingGoal}
          onClose={() => setEditingGoal(null)}
          onGoalUpdated={fetchGoals}
        />
      )}
    </div>
  );
}
