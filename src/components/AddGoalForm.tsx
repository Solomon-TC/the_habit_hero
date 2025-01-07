'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../types/database';
import type { Goal } from '../types/goals';

type Props = {
  onGoalAdded: () => void;
};

type NewMilestone = {
  name: string;
  description?: string;
};

export default function AddGoalForm({ onGoalAdded }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [milestones, setMilestones] = useState<NewMilestone[]>([]);
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

      // Insert the goal
      const { data: goalData, error: goalError } = await supabase
        .from('goals')
        .insert({
          user_id: user.id,
          name,
          description: description || null,
          target_date: targetDate,
          status: 'not_started',
          progress: 0,
        })
        .select()
        .single();

      if (goalError) throw goalError;

      // Insert milestones if any
      if (milestones.length > 0 && goalData) {
        const { error: milestonesError } = await supabase
          .from('goal_milestones')
          .insert(
            milestones.map(milestone => ({
              goal_id: goalData.id,
              user_id: user.id,
              name: milestone.name,
              description: milestone.description || null,
              completed: false,
            }))
          );

        if (milestonesError) throw milestonesError;
      }

      // Reset form
      setName('');
      setDescription('');
      setTargetDate('');
      setMilestones([]);
      setIsOpen(false);
      onGoalAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create goal');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full p-4 border-2 border-dashed border-primary rounded-lg text-center text-primary hover:bg-primary/5 transition-colors"
      >
        + Add New Goal
      </button>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Create New Goal</h2>
        <button
          onClick={() => setIsOpen(false)}
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
            onClick={() => setIsOpen(false)}
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
            {isLoading ? 'Creating...' : 'Create Goal'}
          </button>
        </div>
      </form>
    </div>
  );
}
