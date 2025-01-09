'use client';

import { useState } from 'react';
import AddHabitForm from '../../components/AddHabitForm';
import HabitList from '../../components/HabitList';
import DateDisplay from '../../components/DateDisplay';
import HabitStats from '../../components/HabitStats';

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
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Habit Tracker
              </h1>
              <p className="text-gray-600">
                Track your habits and build lasting routines
              </p>
            </div>
            <DateDisplay />
          </div>

          {/* Stats Overview */}
          <div className="mt-6">
            <HabitStats key={refreshKey} />
          </div>
        </div>

        {/* Add Habit Form */}
        <div className="mb-8">
          <AddHabitForm onHabitAdded={handleHabitAdded} />
        </div>

        {/* Habits List */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Today's Habits</h2>
              <p className="text-sm text-gray-500 mt-1">
                Check off your habits as you complete them
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
          
          <HabitList key={refreshKey} />
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Daily habits need to be completed every day, weekly habits on specific days of the week,
            <br />
            and monthly habits on chosen dates of each month.
          </p>
        </div>
      </div>
    </div>
  );
}
