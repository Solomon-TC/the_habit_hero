'use client';

import { useState } from 'react';
import AddHabitForm from '../../components/AddHabitForm';
import HabitList from '../../components/HabitList';
import DateDisplay from '../../components/DateDisplay';

export default function HabitsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleHabitAdded = () => {
    // Trigger a refresh of the habit list when a new habit is added
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Daily Habits
          </h1>
          <p className="text-gray-600">
            Track your daily habits and build lasting routines
          </p>
        </div>

        {/* Add Habit Form */}
        <div className="mb-8">
          <AddHabitForm onHabitAdded={handleHabitAdded} />
        </div>

        {/* Habits List */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-700">Today's Progress</h2>
            <DateDisplay />
          </div>
          
          <HabitList key={refreshKey} />
        </div>
      </div>
    </div>
  );
}
