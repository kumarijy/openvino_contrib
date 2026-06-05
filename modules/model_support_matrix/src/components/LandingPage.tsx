/**
 * LandingPage component - Entry point showing different OpenVINO model resources
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  ChartBarIcon,
  CheckBadgeIcon,
  RocketLaunchIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { DarkModeToggle } from './DarkModeToggle';
import { RequestModelModal } from './RequestModelModal';

interface LandingPageProps {
  onNavigateToMatrix: (modelId?: string) => void;
  onNavigateToModelHub: (modelName?: string) => void;
  onNavigateToVerifiedModels: (modelName?: string) => void;
  onNavigateToOVVP: (modelName?: string) => void;
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

interface SearchResult {
  title: string;
  description: string;
  source: string;
  category?: string;
  modelId?: string;
  action: (modelId?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToMatrix, onNavigateToModelHub, onNavigateToVerifiedModels, onNavigateToOVVP }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchData, setSearchData] = useState<{
    genai: any[];
    modelHub: any[];
    verified: any[];
    ovvp: any[];
  }>({ genai: [], modelHub: [], verified: [], ovvp: [] });

  // Load all data sources
  useEffect(() => {
    const loadData = async () => {
      try {
        const [genaiRes, modelHubRes, verifiedRes, ovvpRes] = await Promise.all([
          fetch('/data/genai_models.json').then(r => r.json()).catch(() => ({ models: [] })),
          fetch('/data/model_hub.json').then(r => r.json()).catch(() => ({ models: [] })),
          fetch('/data/verified_models.json').then(r => r.json()).catch(() => ({ models: [] })),
          fetch('/data/ovvp_models.json').then(r => r.json()).catch(() => ({ models: [] })),
        ]);

        setSearchData({
          genai: genaiRes.models || [],
          modelHub: modelHubRes.models || [],
          verified: verifiedRes.models || [],
          ovvp: ovvpRes.models || [],
        });
      } catch (error) {
        console.error('Error loading search data:', error);
      }
    };
    loadData();
  }, []);

  // Search across all data
  const searchResults = useMemo<SearchResult[]>(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];
    const maxResults = 10;

    // Search GenAI models
    searchData.genai.forEach((model: any) => {
      if (results.length >= maxResults) return;
      const matchName = model.name?.toLowerCase().includes(query);
      const matchFamily = model.family?.toLowerCase().includes(query);
      const matchCategory = model.category?.toLowerCase().includes(query);
      const matchDesc = model.description?.toLowerCase().includes(query);

      if (matchName || matchFamily || matchCategory || matchDesc) {
        results.push({
          title: model.name,
          description: model.description || `${model.family} - ${model.category}`,
          source: 'GenAI Model Support',
          category: model.category,
          modelId: model.id || model.name,
          action: onNavigateToMatrix,
        });
      }
    });

    // Search Model Hub
    searchData.modelHub.forEach((model: any) => {
      if (results.length >= maxResults) return;
      const matchName = model.name?.toLowerCase().includes(query);
      const matchCategory = model.category?.toLowerCase().includes(query);

      if (matchName || matchCategory) {
        results.push({
          title: model.name,
          description: `Model Hub - ${model.category}`,
          source: 'Model Hub for AI Inference',
          category: model.category,
          modelId: model.name,
          action: onNavigateToModelHub,
        });
      }
    });

    // Search Verified Models
    searchData.verified.forEach((model: any) => {
      if (results.length >= maxResults) return;
      const matchName = model.model_name?.toLowerCase().includes(query);
      const matchTask = model.task?.toLowerCase().includes(query);

      if (matchName || matchTask) {
        results.push({
          title: model.model_name,
          description: `Verified - ${model.task || 'AI Model'}`,
          source: 'Verified Models',
          category: model.task,
          modelId: model.model_name,
          action: onNavigateToVerifiedModels,
        });
      }
    });

    // Search OVVP
    searchData.ovvp.forEach((model: any) => {
      if (results.length >= maxResults) return;
      const matchName = model.name?.toLowerCase().includes(query);
      const matchFramework = model.framework?.toLowerCase().includes(query);

      if (matchName || matchFramework) {
        results.push({
          title: model.name,
          description: `OVVP - ${model.framework || 'Model'}`,
          source: 'OVVP',
          category: model.framework,
          modelId: model.name,
          action: onNavigateToOVVP,
        });
      }
    });

    return results;
  }, [searchQuery, searchData, onNavigateToMatrix, onNavigateToModelHub, onNavigateToVerifiedModels, onNavigateToOVVP]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header with actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-end items-center space-x-3">
          <DarkModeToggle />
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-green-500 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900 dark:text-green-300 dark:border-green-700 dark:hover:bg-green-800 transition-colors flex items-center"
          >
            <span className="mr-1">➕</span> Request Model
          </button>
        </div>
      </div>

      {/* Request Model Modal */}
      <RequestModelModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            OpenVINO <span className="text-openvino-purple dark:text-purple-400">Model Resources</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Explore comprehensive resources for AI model deployment with OpenVINO toolkit
          </p>

          {/* Universal Search */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all resources (models, frameworks, tasks...)"
                className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-openvino-purple focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
                <div className="p-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400 px-3 py-2 font-medium">
                    Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                  </div>
                  {searchResults.map((result, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        result.action(result.modelId);
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white mb-1">
                            {result.title}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {result.description}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs px-2 py-0.5 bg-openvino-purple bg-opacity-10 text-openvino-purple dark:text-purple-400 rounded-full">
                              {result.source}
                            </span>
                            {result.category && (
                              <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                                {result.category}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-openvino-purple dark:text-purple-400 ml-2">→</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {searchQuery.trim() && searchResults.length === 0 && (
              <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 z-50">
                <div className="text-center text-gray-600 dark:text-gray-400">
                  <MagnifyingGlassIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No results found for "{searchQuery}"</p>
                  <p className="text-sm mt-1">Try searching for model names, frameworks, or tasks</p>
                </div>
              </div>
            )}
          </div>
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

          {/* Card 2: OpenVINO Model Hub for AI Inference Benchmarks */}
          <Card
            title="OpenVINO Model Hub for AI Inference Benchmarks"
            description="60+ AI models verified and optimized for OpenVINO inference across computer vision, NLP, and generative AI tasks."
            icon={<ChartBarIcon className="h-8 w-8 text-white" />}
            iconColor="bg-gradient-to-br from-green-500 to-green-700"
            onClick={onNavigateToModelHub}
          />

          {/* Card 3: AI Models Verified for OpenVINO */}
          <Card
            title="AI Models Verified for OpenVINO"
            description="Models that run on Intel® Core Ultra™ Processors - tested and verified for optimal performance with OpenVINO."
            icon={<CheckBadgeIcon className="h-8 w-8 text-white" />}
            iconColor="bg-gradient-to-br from-teal-500 to-teal-700"
            onClick={onNavigateToVerifiedModels}
          />

          {/* Card 4: OVVP */}
          <Card
            title="OVVP"
            description="OpenVINO Validation Program - ensuring model compatibility and performance standards across the ecosystem."
            icon={<RocketLaunchIcon className="h-8 w-8 text-white" />}
            iconColor="bg-gradient-to-br from-indigo-500 to-indigo-700"
            onClick={onNavigateToOVVP}
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
