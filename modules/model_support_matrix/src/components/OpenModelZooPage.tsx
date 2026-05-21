/**
 * OpenModelZooPage component - Shows Intel and Public model categories
 */

import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface OpenModelZooPageProps {
  onNavigateBack: () => void;
  onNavigateToIntel: () => void;
  onNavigateToPublic: () => void;
}

interface CategoryCardProps {
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, description, icon, iconColor, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900 p-8 transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer"
    >
      <div className={`w-16 h-16 rounded-lg ${iconColor} flex items-center justify-center mb-6`}>
        <span className="text-4xl">{icon}</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      <span className="inline-flex items-center text-openvino-purple dark:text-purple-400 font-medium">
        Explore →
      </span>
    </div>
  );
};

export const OpenModelZooPage: React.FC<OpenModelZooPageProps> = ({
  onNavigateBack,
  onNavigateToIntel,
  onNavigateToPublic,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <button
          onClick={onNavigateBack}
          className="mb-8 flex items-center text-openvino-purple dark:text-purple-400 hover:underline"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Resources
        </button>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Open Model Zoo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Pre-trained deep learning models and demo applications optimized for OpenVINO
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <CategoryCard
            title="Intel Models"
            description="Models developed and optimized by Intel for OpenVINO toolkit, covering various computer vision and NLP tasks."
            icon="🏢"
            iconColor="bg-gradient-to-br from-blue-500 to-blue-700"
            onClick={onNavigateToIntel}
          />

          <CategoryCard
            title="Public Models"
            description="Community and open-source models converted and optimized for OpenVINO from popular frameworks."
            icon="🌐"
            iconColor="bg-gradient-to-br from-green-500 to-green-700"
            onClick={onNavigateToPublic}
          />
        </div>
      </div>
    </div>
  );
};
