/**
 * ModelHubPage - OpenVINO Model Hub for AI Inference Benchmarks
 * Models extracted from OpenVINO documentation and tutorials
 */

import React, { useState } from 'react';
import { ArrowLeftIcon, TableCellsIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { DarkModeToggle } from './DarkModeToggle';
import { RequestModelModal } from './RequestModelModal';

interface ModelHubPageProps {
  onNavigateBack: () => void;
}

interface ModelInfo {
  name: string;
  category: string;
}

// Models from Intel OpenVINO Model Hub
// Source: https://www.intel.com/content/www/us/en/developer/tools/openvino-toolkit/model-hub.html
const SUPPORTED_MODELS: ModelInfo[] = [
  // LLM Models
  { name: 'BERT-Base-Cased', category: 'LLM' },
  { name: 'DeepSeek-R1-Distill-Llama-8B', category: 'LLM' },
  { name: 'DeepSeek-R1-Distill-Qwen-1.5B', category: 'LLM' },
  { name: 'GPT-0SS-20B', category: 'LLM' },
  { name: 'Llama-2-7B-chat', category: 'LLM' },
  { name: 'Llama3-8B-Chat', category: 'LLM' },
  { name: 'Llama3.2-3B-Instruct', category: 'LLM' },
  { name: 'Mistral-7B-Instruct-v0.3', category: 'LLM' },
  { name: 'Phi-4-Mini-Instruct', category: 'LLM' },
  { name: 'Qwen3-30B-A3B', category: 'LLM' },
  { name: 'Qwen3-8B', category: 'LLM' },

  // Vision Models
  { name: 'Detectron-v2', category: 'Vision' },
  { name: 'MobileNetV2', category: 'Vision' },
  { name: 'ResNet-50', category: 'Vision' },
  { name: 'SSD-ResNet34-1200', category: 'Vision' },
  { name: 'Ultralytics YOLO11', category: 'Vision' },

  // Multimodal Models
  { name: 'FLUX-1-schnell', category: 'Multimodal' },
  { name: 'Gemma3-4B', category: 'Multimodal' },
  { name: 'MiniCPM-V-2_6', category: 'Multimodal' },
  { name: 'Qwen2.5-VL-7B-Instruct', category: 'Multimodal' },

  // Diffusion Models
  { name: 'StableDiffusion-V1-5', category: 'Diffusion' },
];

export const ModelHubPage: React.FC<ModelHubPageProps> = ({ onNavigateBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Get unique categories
  const categories = Array.from(new Set(SUPPORTED_MODELS.map(m => m.category))).sort();

  // Filter models
  const filteredModels = SUPPORTED_MODELS.filter(model => {
    const matchesSearch = !searchQuery ||
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !selectedCategory || model.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onNavigateBack}
              className="flex items-center text-openvino-purple dark:text-purple-400 hover:underline"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Resources
            </button>
            <div className="flex items-center space-x-3">
              <DarkModeToggle />
              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-green-500 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900 dark:text-green-300 dark:border-green-700 dark:hover:bg-green-800 transition-colors flex items-center"
              >
                <span className="mr-1">➕</span> Request Model
              </button>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            OpenVINO Model Hub for AI Inference Benchmarks
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive collection of AI models optimized for Intel hardware with OpenVINO
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 space-y-4">
          {/* Search and View Toggle */}
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-openvino-purple focus:border-transparent text-gray-900 dark:text-white"
            />
            <div className="flex bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-4 py-3 flex items-center ${
                  viewMode === 'cards'
                    ? 'bg-openvino-purple text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-3 flex items-center ${
                  viewMode === 'table'
                    ? 'bg-openvino-purple text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <TableCellsIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-openvino-purple text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-openvino-purple text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredModels.length}</span> of{' '}
          <span className="font-semibold text-gray-900 dark:text-white">{SUPPORTED_MODELS.length}</span> models
        </div>

        {/* Models Display */}
        {filteredModels.length > 0 ? (
          viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModels.map((model) => (
                <div
                  key={model.name}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 p-6 hover:shadow-lg transition-all"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {model.name}
                  </h3>
                  <div>
                    <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-full">
                      {model.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Model
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredModels.map((model, idx) => (
                    <tr key={`${model.name}-${idx}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {model.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-full">
                          {model.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No models found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </main>

      {/* Request Model Modal */}
      <RequestModelModal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} />
    </div>
  );
};
