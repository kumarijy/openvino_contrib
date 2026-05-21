/**
 * LandingPage component - Entry point showing different OpenVINO model resources
 */

import React from 'react';
import {
  CubeIcon,
  ChartBarIcon,
  CheckBadgeIcon,
  RocketLaunchIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { DarkModeToggle } from './DarkModeToggle';

interface LandingPageProps {
  onNavigateToMatrix: () => void;
  onNavigateToOpenModelZoo: () => void;
}

interface CardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
  onClick?: () => void;
  href?: string;
  isComingSoon?: boolean;
}

const Card: React.FC<CardProps> = ({ title, description, icon, iconColor, onClick, href, isComingSoon }) => {
  const content = (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900 p-8 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
      isComingSoon ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
    }`}>
      <div className={`w-16 h-16 rounded-lg ${iconColor} flex items-center justify-center mb-6`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      {isComingSoon && (
        <span className="inline-block px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm font-medium rounded-full">
          Coming Soon
        </span>
      )}
      {!isComingSoon && (
        <span className="inline-flex items-center text-openvino-purple dark:text-purple-400 font-medium">
          Explore →
        </span>
      )}
    </div>
  );

  if (isComingSoon) {
    return content;
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return (
    <div onClick={onClick} className="block">
      {content}
    </div>
  );
};

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToMatrix, onNavigateToOpenModelZoo }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header with actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-end items-center space-x-3">
          <DarkModeToggle />
          <a
            href="https://jira.devtools.intel.com/secure/CreateIssue.jspa?pid=16990&issuetype=1"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-medium rounded-lg border border-green-500 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900 dark:text-green-300 dark:border-green-700 dark:hover:bg-green-800 transition-colors flex items-center"
          >
            <span className="mr-1">➕</span> Request Model
          </a>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            OpenVINO <span className="text-openvino-purple dark:text-purple-400">Model Resources</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore comprehensive resources for AI model deployment with OpenVINO toolkit
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1: OpenVINO GenAI Model Support */}
          <Card
            title="OpenVINO GenAI Model Support"
            description="Interactive matrix tracking AI model support across OpenVINO GenAI releases with version comparison and filtering."
            icon={<SparklesIcon className="h-8 w-8 text-white" />}
            iconColor="bg-gradient-to-br from-purple-500 to-purple-700"
            onClick={onNavigateToMatrix}
          />

          {/* Card 2: Open Model Zoo */}
          <Card
            title="Open Model Zoo"
            description="Pre-trained deep learning models and demo applications for computer vision, NLP, and more."
            icon={<CubeIcon className="h-8 w-8 text-white" />}
            iconColor="bg-gradient-to-br from-blue-500 to-blue-700"
            onClick={onNavigateToOpenModelZoo}
          />

          {/* Card 3: OpenVINO Model Hub for AI Inference Benchmarks */}
          <Card
            title="OpenVINO Model Hub for AI Inference Benchmarks"
            description="Performance benchmarks and optimization metrics for AI models running on OpenVINO across different hardware."
            icon={<ChartBarIcon className="h-8 w-8 text-white" />}
            iconColor="bg-gradient-to-br from-green-500 to-green-700"
            isComingSoon={true}
          />

          {/* Card 4: AI Models Verified for OpenVINO */}
          <Card
            title="AI Models Verified for OpenVINO"
            description="Curated collection of AI models that have been tested and verified for optimal performance with OpenVINO."
            icon={<CheckBadgeIcon className="h-8 w-8 text-white" />}
            iconColor="bg-gradient-to-br from-teal-500 to-teal-700"
            isComingSoon={true}
          />

          {/* Card 5: OVVP */}
          <Card
            title="OVVP"
            description="OpenVINO Validation Program - ensuring model compatibility and performance standards across the ecosystem."
            icon={<RocketLaunchIcon className="h-8 w-8 text-white" />}
            iconColor="bg-gradient-to-br from-indigo-500 to-indigo-700"
            isComingSoon={true}
          />
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Part of the{' '}
            <a
              href="https://github.com/openvinotoolkit/openvino_contrib"
              target="_blank"
              rel="noopener noreferrer"
              className="text-openvino-purple dark:text-purple-400 hover:underline"
            >
              OpenVINO Contrib
            </a>{' '}
            project
          </p>
        </div>
      </div>
    </div>
  );
};
