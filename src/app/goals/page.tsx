'use client';

import { useState } from 'react';
import AddGoalForm from '../../components/AddGoalForm';
import GoalList from '../../components/GoalList';
import DateDisplay from '../../components/DateDisplay';

export default function GoalsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleGoalAdded = () => {
    // Trigger a refresh of the goal list when a new goal is added
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
                Goals
              </h1>
              <p className="text-gray-600">
                Set and track your long-term goals
              </p>
            </div>
            <DateDisplay />
          </div>
        </div>

        {/* Add Goal Form */}
        <div className="mb-8">
          <AddGoalForm onGoalAdded={handleGoalAdded} />
        </div>

        {/* Goals List */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-700">Your Goals</h2>
            <div className="text-sm text-gray-500">
              Click ▶ to view milestones
            </div>
          </div>
          
          <GoalList key={refreshKey} />
        </div>
      </div>
    </div>
  );
}
