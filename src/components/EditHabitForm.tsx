'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../types/database';

type Habit = Database['public']['Tables']['habits']['Row'];
type HabitFrequency = 'daily' | 'weekly' | 'monthly';

type Props = {
  habit: Habit;
  onClose: () => void;
  onHabitUpdated: () => void;
};

export default function EditHabitForm({ habit, onClose, onHabitUpdated }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(habit.title);
  const [description, setDescription] = useState(habit.description || '');
  const [frequency, setFrequency] = useState<HabitFrequency>(habit.frequency as HabitFrequency);
  const [targetDays, setTargetDays] = useState<number[]>(habit.target_days);
  const [reminderTime, setReminderTime] = useState(habit.reminder_time || '');

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const habitData: Database['public']['Tables']['habits']['Update'] = {
        title,
        description: description || null,
        frequency,
        target_days: targetDays,
        reminder_time: reminderTime || null,
      };

      const { error: updateError } = await supabase
        .from('habits')
        .update(habitData)
        .eq('id', habit.id);

      if (updateError) throw updateError;

      onHabitUpdated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update habit');
    } finally {
      setIsLoading(false);
    }
  };

  const getMaxTargetDays = () => {
    switch (frequency) {
      case 'daily':
        return 1;
      case 'weekly':
        return 7;
      case 'monthly':
        return 31;
      default:
        return 1;
    }
  };

  const handleDayToggle = (day: number) => {
    if (targetDays.includes(day)) {
      setTargetDays(targetDays.filter(d => d !== day));
    } else {
      setTargetDays([...targetDays, day].sort((a, b) => a - b));
    }
  };

  const getDayLabel = (day: number) => {
    if (frequency === 'weekly') {
      return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day];
    }
    return day.toString();
  };

  const renderDaySelectors = () => {
    const maxDays = getMaxTargetDays();
    const days = Array.from({ length: maxDays }, (_, i) => i + 1);

    if (frequency === 'daily') {
      return null;
    }

    return (
      <div className="mt-2 flex flex-wrap gap-2">
        {days.map(day => (
          <button
            key={day}
            type="button"
            onClick={() => handleDayToggle(day)}
            className={`px-3 py-1 rounded-full text-sm ${
              targetDays.includes(day)
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {getDayLabel(day - 1)}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Edit Habit</h2>
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
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Habit Name *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                placeholder="e.g., Morning Meditation"
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
                placeholder="Optional description of your habit"
              />
            </div>

            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                Frequency *
              </label>
              <select
                id="frequency"
                value={frequency}
                onChange={(e) => {
                  const newFreq = e.target.value as typeof frequency;
                  setFrequency(newFreq);
                  // Reset target days when frequency changes
                  setTargetDays(newFreq === 'daily' ? [1] : []);
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Target Days {frequency !== 'daily' ? `(Select ${frequency === 'weekly' ? 'days of the week' : 'dates'})` : ''}*
              </label>
              {renderDaySelectors()}
              {targetDays.length === 0 && frequency !== 'daily' && (
                <p className="mt-1 text-sm text-red-500">Please select at least one day</p>
              )}
            </div>

            <div>
              <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700">
                Daily Reminder Time
              </label>
              <input
                type="time"
                id="reminderTime"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
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
                disabled={isLoading || (frequency !== 'daily' && targetDays.length === 0)}
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
