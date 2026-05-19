/**
 * StatsDashboard component for displaying model statistics
 */

import React from 'react';
import {
  CubeIcon,
  RectangleStackIcon,
  CpuChipIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';
import type { Stats, ModelCategory } from '../types';

interface StatsDashboardProps {
  stats: Stats;
  onCategoryClick?: (category: ModelCategory) => void;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between mb-2">
      <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
    </div>
    <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
);

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats, onCategoryClick }) => {
  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<CubeIcon className="h-6 w-6 text-openvino-purple" />}
          label="Total Models"
          value={stats.totalModels}
          color="bg-purple-50"
        />
        <StatCard
          icon={<CpuChipIcon className="h-6 w-6 text-green-600" />}
          label="CPU Support"
          value={stats.deviceCoverage.cpu}
          color="bg-green-50"
        />
        <StatCard
          icon={<CpuChipIcon className="h-6 w-6 text-blue-600" />}
          label="GPU Support"
          value={stats.deviceCoverage.gpu}
          color="bg-blue-50"
        />
        <StatCard
          icon={<BoltIcon className="h-6 w-6 text-purple-600" />}
          label="NPU Support"
          value={stats.deviceCoverage.npu}
          color="bg-purple-50"
        />
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <RectangleStackIcon className="h-5 w-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Models by Category</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats.modelsByCategory).map(([category, count]) => {
            if (count === 0) return null;

            const colors: Record<string, string> = {
              'LLM': 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700',
              'VLM': 'text-purple-600 bg-purple-50 hover:bg-purple-100 hover:text-purple-700',
              'Image Generation': 'text-pink-600 bg-pink-50 hover:bg-pink-100 hover:text-pink-700',
              'Video Generation': 'text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700',
              'Speech Recognition': 'text-green-600 bg-green-50 hover:bg-green-100 hover:text-green-700',
              'Speech Generation': 'text-teal-600 bg-teal-50 hover:bg-teal-100 hover:text-teal-700',
              'Text Embeddings': 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700',
              'Text Rerank': 'text-amber-600 bg-amber-50 hover:bg-amber-100 hover:text-amber-700',
            };

            const colorClass = colors[category] || 'text-gray-600 bg-gray-50 hover:bg-gray-100';

            return (
              <button
                key={category}
                onClick={() => onCategoryClick?.(category as ModelCategory)}
                className={`p-4 rounded-lg ${colorClass} transition-all duration-200 hover:shadow-lg hover:scale-110 hover:-translate-y-1 cursor-pointer text-left group`}
                aria-label={`Filter by ${category}`}
              >
                <div className="text-2xl font-bold mb-1 group-hover:text-3xl transition-all duration-200">{count}</div>
                <div className="text-sm font-medium group-hover:text-base group-hover:font-semibold transition-all duration-200">{category}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
