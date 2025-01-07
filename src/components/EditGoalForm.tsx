'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../types/database';
import type { GoalWithMilestones } from '../types/goals';

type Props = {
  goal: GoalWithMilestones;
  onClose: () => void;
  onGoalUpdated: () => void;
};

export default function EditGoalForm({ goal, onClose, onGoalUpdated }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(goal.name);
  const [description, setDescription] = useState(goal.description || '');
  const [targetDate, setTargetDate] = useState(goal.target_date);
  const [milestones, setMilestones] = useState<{ name: string; description?: string }[]>(
    goal.milestones.map(m => ({
      name: m.name,
      description: m.description || undefined,
    }))
  );
  const [newMilestoneName, setNewMilestoneName] = useState('');
  const [newMilestoneDescription, setNewMilestoneDescription] = useState('');

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const addMilestone = () => {
    if (newMilestoneName.trim()) {
      setMilestones([
        ...milestones,
        {
          name: newMilestoneName.trim(),
          description: newMilestoneDescription.trim() || undefined,
        },
      ]);
      setNewMilestoneName('');
      setNewMilestoneDescription('');
    }
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Update the goal
      const { error: goalError } = await supabase
        .from('goals')
        .update({
          name,
          description: description || null,
          target_date: targetDate,
        })
        .eq('id', goal.id);

      if (goalError) throw goalError;

      // Delete existing milestones
      const { error: deleteError } = await supabase
        .from('goal_milestones')
        .delete()
        .eq('goal_id', goal.id);

      if (deleteError) throw deleteError;

      // Insert new milestones
      if (milestones.length > 0) {
        const { error: milestonesError } = await supabase
          .from('goal_milestones')
          .insert(
            milestones.map(milestone => ({
              goal_id: goal.id,
              user_id: user.id,
              name: milestone.name,
              description: milestone.description || null,
              completed: false,
            }))
          );

        if (milestonesError) throw milestonesError;
      }

      onGoalUpdated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update goal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Edit Goal</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Goal Name *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                placeholder="e.g., Learn to Play Guitar"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                rows={2}
                placeholder="Optional description of your goal"
              />
            </div>

            <div>
              <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700">
                Target Date *
              </label>
              <input
                type="date"
                id="targetDate"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Milestones
              </label>
              
              <div className="space-y-2">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded-md">
                    <div className="flex-1">
                      <div className="font-medium">{milestone.name}</div>
                      {milestone.description && (
                        <div className="text-sm text-gray-500">{milestone.description}</div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <div className="space-y-2">
                  <input
                    type="text"
                    value={newMilestoneName}
                    onChange={(e) => setNewMilestoneName(e.target.value)}
                    placeholder="Milestone name"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                  <input
                    type="text"
                    value={newMilestoneDescription}
                    onChange={(e) => setNewMilestoneDescription(e.target.value)}
                    placeholder="Milestone description (optional)"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={addMilestone}
                    className="w-full p-2 text-sm border-2 border-dashed border-gray-300 rounded text-gray-600 hover:border-primary hover:text-primary"
                  >
                    + Add Milestone
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
