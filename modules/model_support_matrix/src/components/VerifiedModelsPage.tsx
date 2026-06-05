/**
 * VerifiedModelsPage - AI Models Verified for OpenVINO
 * Models that run on Intel® Core Ultra™ Processors with OpenVINO™ toolkit
 * Data source: https://docs.openvino.ai/2024/about-openvino/compatibility-and-support/supported-models.html
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, MagnifyingGlassIcon, TableCellsIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { DarkModeToggle } from './DarkModeToggle';
import { RequestModelModal } from './RequestModelModal';

interface VerifiedModelsPageProps {
  onNavigateBack: () => void;
}

interface VerifiedModel {
  name: string;
  category: string;
  framework: string;
  precision: string;
  cpu: boolean;
  gpu: boolean;
  npu: boolean;
}

// Import the full model list
import VERIFIED_MODELS_DATA from '../data/verified_models.json';

// Cast the imported JSON data to the correct type
const VERIFIED_MODELS: VerifiedModel[] = VERIFIED_MODELS_DATA as VerifiedModel[];

// Sample data structure (no longer needed, but kept for reference):
/*
const VERIFIED_MODELS_SAMPLE: VerifiedModel[] = [
  // Action Recognition
  { name: 'i3d-flow', category: 'Action Recognition', framework: 'tf', precision: 'FP16', cpu: false, gpu: true, npu: true },
  { name: 'i3d-flow', category: 'Action Recognition', framework: 'tf', precision: 'FP16-INT8', cpu: false, gpu: true, npu: true },
  { name: 'i3d-flow', category: 'Action Recognition', framework: 'tf', precision: 'FP32', cpu: false, gpu: true, npu: true },
  { name: 'i3d-rgb', category: 'Action Recognition', framework: 'tf', precision: 'FP16', cpu: false, gpu: true, npu: true },
  { name: 'i3d-rgb', category: 'Action Recognition', framework: 'tf', precision: 'FP16-INT8', cpu: false, gpu: true, npu: true },
  { name: 'i3d-rgb', category: 'Action Recognition', framework: 'tf', precision: 'FP32', cpu: false, gpu: true, npu: true },
  { name: 'mc3_18', category: 'Action Recognition', framework: 'pytorch', precision: 'FP32', cpu: true, gpu: true, npu: true },

  // Audio
  { name: 'data2vec2-base', category: 'Audio', framework: 'onnx', precision: 'FP32', cpu: true, gpu: true, npu: true },
  { name: 'data2vec2-base', category: 'Audio', framework: 'onnx', precision: 'FP16', cpu: true, gpu: true, npu: true },
  { name: 'intel_dns', category: 'Audio', framework: 'onnx', precision: 'FP32', cpu: true, gpu: true, npu: true },
  { name: 'intel_dns', category: 'Audio', framework: 'onnx', precision: 'FP16', cpu: true, gpu: true, npu: true },
  { name: 'intel_dns', category: 'Audio', framework: 'onnx', precision: 'INT8', cpu: true, gpu: true, npu: true },
  { name: 'rnnt_encoder', category: 'Audio', framework: 'onnx', precision: 'FP32', cpu: false, gpu: true, npu: true },
  { name: 'rnnt_encoder', category: 'Audio', framework: 'onnx', precision: 'FP16', cpu: false, gpu: true, npu: true },
  { name: 'rnnt_joint', category: 'Audio', framework: 'onnx', precision: 'FP32', cpu: true, gpu: true, npu: true },
  { name: 'rnnt_joint', category: 'Audio', framework: 'onnx', precision: 'FP16', cpu: true, gpu: true, npu: true },
  { name: 'rnnt_prediction', category: 'Audio', framework: 'onnx', precision: 'FP32', cpu: true, gpu: true, npu: true },
  { name: 'rnnt_prediction', category: 'Audio', framework: 'onnx', precision: 'FP16', cpu: true, gpu: true, npu: true },

  // Sound Classification
  { name: 'aclnet', category: 'Sound Classification', framework: 'onnx', precision: 'FP16', cpu: true, gpu: true, npu: true },
  { name: 'aclnet', category: 'Sound Classification', framework: 'onnx', precision: 'FP16-INT8', cpu: true, gpu: true, npu: true },
  { name: 'aclnet', category: 'Sound Classification', framework: 'onnx', precision: 'FP32', cpu: true, gpu: true, npu: true },
  { name: 'aclnet-int8', category: 'Sound Classification', framework: 'onnx', precision: 'FP16-INT8', cpu: false, gpu: false, npu: true },

  // Image Classification (sample)
  { name: 'alexnet', category: 'Image Classification', framework: 'onnx', precision: 'FP16', cpu: true, gpu: true, npu: true },
  { name: 'alexnet', category: 'Image Classification', framework: 'onnx', precision: 'FP16-INT8', cpu: true, gpu: true, npu: true },
  { name: 'alexnet', category: 'Image Classification', framework: 'onnx', precision: 'FP32', cpu: true, gpu: true, npu: true },
  { name: 'alexnet', category: 'Image Classification', framework: 'pytorch', precision: 'FP32', cpu: true, gpu: true, npu: true },
  { name: 'resnet-50', category: 'Image Classification', framework: 'onnx', precision: 'FP16', cpu: true, gpu: true, npu: true },
  { name: 'resnet-50', category: 'Image Classification', framework: 'onnx', precision: 'FP16-INT8', cpu: true, gpu: true, npu: true },
  { name: 'resnet-50', category: 'Image Classification', framework: 'onnx', precision: 'FP32', cpu: true, gpu: true, npu: true },
  { name: 'mobilenet-v2', category: 'Image Classification', framework: 'onnx', precision: 'FP16', cpu: true, gpu: true, npu: true },
  { name: 'mobilenet-v2', category: 'Image Classification', framework: 'onnx', precision: 'FP16-INT8', cpu: true, gpu: true, npu: true },
  { name: 'mobilenet-v2', category: 'Image Classification', framework: 'onnx', precision: 'FP32', cpu: true, gpu: true, npu: true },

  // Object Detection (sample)
  { name: 'yolo_v5l', category: 'Object Detection', framework: 'onnx', precision: 'FP16', cpu: true, gpu: true, npu: true },
  { name: 'yolo_v5l', category: 'Object Detection', framework: 'onnx', precision: 'FP16-INT8', cpu: true, gpu: true, npu: true },
  { name: 'yolo_v5l', category: 'Object Detection', framework: 'onnx', precision: 'FP32', cpu: true, gpu: true, npu: true },
  { name: 'yolo_v8n', category: 'Object Detection', framework: 'onnx', precision: 'FP16', cpu: true, gpu: true, npu: true },
  { name: 'yolo_v8n', category: 'Object Detection', framework: 'onnx', precision: 'FP16-INT8', cpu: true, gpu: true, npu: true },
  { name: 'yolo_v8n', category: 'Object Detection', framework: 'onnx', precision: 'FP32', cpu: true, gpu: true, npu: true },

  // Large Language Model (sample)
  { name: 'GPT-2', category: 'Large Language Model', framework: 'onnx', precision: 'FP16', cpu: true, gpu: true, npu: true },
  { name: 'GPT-2', category: 'Large Language Model', framework: 'onnx', precision: 'FP16-INT8', cpu: false, gpu: true, npu: true },
  { name: 'GPT-2', category: 'Large Language Model', framework: 'onnx', precision: 'FP32', cpu: true, gpu: true, npu: true },
  { name: 'llama-2-7b-chat-hf', category: 'Large Language Model', framework: 'pytorch', precision: 'FP16', cpu: false, gpu: true, npu: true },
  { name: 'llama-2-7b-chat-hf', category: 'Large Language Model', framework: 'pytorch', precision: 'INT8-CW', cpu: false, gpu: true, npu: true },
  { name: 'llama-2-7b-chat-hf', category: 'Large Language Model', framework: 'pytorch', precision: 'INT4-MIXED', cpu: true, gpu: true, npu: true },

];
*/

export const VerifiedModelsPage: React.FC<VerifiedModelsPageProps> = ({ onNavigateBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Get unique categories
  const categories = Array.from(new Set(VERIFIED_MODELS.map(m => m.category))).sort();

  // Filter models first
  const filteredRawModels = VERIFIED_MODELS.filter(model => {
    const matchesSearch = !searchQuery ||
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.framework.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !selectedCategory || model.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Group filtered models by name, then by framework
  interface GroupedModel {
    name: string;
    category: string;
    frameworks: {
      [framework: string]: {
        precisions: string[];
        cpu: boolean;
        gpu: boolean;
        npu: boolean;
      };
    };
  }

  const groupedModelsMap = new Map<string, GroupedModel>();

  filteredRawModels.forEach(model => {
    if (!groupedModelsMap.has(model.name)) {
      groupedModelsMap.set(model.name, {
        name: model.name,
        category: model.category,
        frameworks: {},
      });
    }

    const grouped = groupedModelsMap.get(model.name)!;

    if (!grouped.frameworks[model.framework]) {
      grouped.frameworks[model.framework] = {
        precisions: [],
        cpu: false,
        gpu: false,
        npu: false,
      };
    }

    const fw = grouped.frameworks[model.framework];
    if (!fw.precisions.includes(model.precision)) {
      fw.precisions.push(model.precision);
    }
    fw.cpu = fw.cpu || model.cpu;
    fw.gpu = fw.gpu || model.gpu;
    fw.npu = fw.npu || model.npu;
  });

  const groupedModels = Array.from(groupedModelsMap.values());
  const filteredModels = filteredRawModels; // Keep for table view

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onNavigateBack}
              className="flex items-center text-openvino-purple dark:text-purple-400 hover:underline"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
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
            AI Models Verified for OpenVINO™
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Models that run on Intel® Core Ultra™ Processors with OpenVINO™ toolkit
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-openvino-purple focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Category Filter and View Toggle */}
        <div className="mb-6 flex items-center justify-between">
          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === null
                    ? 'bg-openvino-purple text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
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
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {/* View Toggle */}
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded ${
                viewMode === 'cards'
                  ? 'bg-openvino-purple text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              title="Card view"
            >
              <Squares2X2Icon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded ${
                viewMode === 'table'
                  ? 'bg-openvino-purple text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              title="Table view"
            >
              <TableCellsIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
          {viewMode === 'cards' ? (
            <>
              Showing <span className="font-semibold text-gray-900 dark:text-white">{groupedModels.length}</span> unique models of{' '}
              <span className="font-semibold text-gray-900 dark:text-white">{new Set(VERIFIED_MODELS.map(m => m.name)).size}</span> total
            </>
          ) : (
            <>
              Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredModels.length}</span> of{' '}
              <span className="font-semibold text-gray-900 dark:text-white">{VERIFIED_MODELS.length}</span> model variants
            </>
          )}
        </div>

        {/* Models Display - Cards or Table */}
        {viewMode === 'cards' ? (
          /* Card View - Grouped by Model */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedModels.length > 0 ? (
              groupedModels.map((model, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6 border border-gray-200 dark:border-gray-700"
                >
                  {/* Model Name - Top Layer */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {model.name}
                  </h3>

                  {/* Category - 2nd Layer */}
                  <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-full">
                      {model.category}
                    </span>
                  </div>

                  {/* Framework Sub-cards - 3rd Layer */}
                  <div className="space-y-3">
                    {Object.entries(model.frameworks).map(([framework, details]) => (
                      <div
                        key={framework}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                      >
                        {/* Framework Name */}
                        <div className="font-semibold text-gray-900 dark:text-white mb-2 uppercase text-xs tracking-wide">
                          {framework}
                        </div>

                        {/* Precisions */}
                        <div className="mb-2">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Precisions:</div>
                          <div className="flex flex-wrap gap-1">
                            {details.precisions.map((precision, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded"
                              >
                                {precision}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Device Support */}
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Devices:</div>
                          <div className="flex flex-wrap gap-2">
                            {details.cpu && (
                              <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-medium rounded">
                                CPU
                              </span>
                            )}
                            {details.gpu && (
                              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium rounded">
                                GPU
                              </span>
                            )}
                            {details.npu && (
                              <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-medium rounded">
                                NPU
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-400 dark:text-gray-500 text-lg">No models found</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Try adjusting your search or filter</p>
              </div>
            )}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Model
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Framework
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Precision
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      AI PC CPU
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      AI PC GPU
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      AI PC NPU
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredModels.length > 0 ? (
                    filteredModels.map((model, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {model.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          {model.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          {model.framework}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          {model.precision}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {model.cpu ? (
                            <span className="text-green-600 dark:text-green-400 text-xl">●</span>
                          ) : (
                            <span className="text-gray-300 dark:text-gray-600">○</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {model.gpu ? (
                            <span className="text-green-600 dark:text-green-400 text-xl">●</span>
                          ) : (
                            <span className="text-gray-300 dark:text-gray-600">○</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {model.npu ? (
                            <span className="text-green-600 dark:text-green-400 text-xl">●</span>
                          ) : (
                            <span className="text-gray-300 dark:text-gray-600">○</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="text-gray-400 dark:text-gray-500">
                          <p className="text-lg font-medium">No models found</p>
                          <p className="text-sm mt-1">Try adjusting your search or filter</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Note */}
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-200">
            <strong>✓ Complete Dataset:</strong> Showing all {VERIFIED_MODELS.length} verified models from the official OpenVINO documentation.
            Data sourced from{' '}
            <a
              href="https://docs.openvino.ai/2026/documentation/compatibility-and-support/supported-models.html"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-green-900 dark:hover:text-green-100 font-medium"
            >
              OpenVINO 2026 Documentation
            </a>
            {' '}(CSV file: supported_models_253.csv).
          </p>
        </div>
      </main>

      {/* Request Model Modal */}
      <RequestModelModal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} />
    </div>
  );
};
