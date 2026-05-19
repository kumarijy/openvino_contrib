/**
 * FilterPanel component for version, category, device, and LoRA filters
 */

import React from 'react';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { ModelCategory, DeviceType, OpenVINOVersion } from '../types';

interface FilterPanelProps {
  versions: OpenVINOVersion[];
  selectedVersion: OpenVINOVersion | 'all';
  onVersionChange: (version: OpenVINOVersion | 'all') => void;
  categories: ModelCategory[];
  selectedCategories: ModelCategory[];
  onCategoryToggle: (category: ModelCategory) => void;
  selectedDevices: DeviceType[];
  onDeviceToggle: (device: DeviceType) => void;
  loraOnly: boolean;
  onLoraToggle: (value: boolean) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  'LLM': 'bg-blue-100 text-blue-800 border-blue-200',
  'VLM': 'bg-purple-100 text-purple-800 border-purple-200',
  'Image Generation': 'bg-pink-100 text-pink-800 border-pink-200',
  'Video Generation': 'bg-red-100 text-red-800 border-red-200',
  'Speech Recognition': 'bg-green-100 text-green-800 border-green-200',
  'Speech Generation': 'bg-teal-100 text-teal-800 border-teal-200',
  'Text Embeddings': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Text Rerank': 'bg-amber-100 text-amber-800 border-amber-200',
};

const DEVICE_ICONS: Record<DeviceType, string> = {
  'CPU': '🖥️',
  'GPU': '🎮',
  'NPU': '⚡',
};

export const FilterPanel: React.FC<FilterPanelProps> = ({
  versions,
  selectedVersion,
  onVersionChange,
  categories,
  selectedCategories,
  onCategoryToggle,
  selectedDevices,
  onDeviceToggle,
  loraOnly,
  onLoraToggle,
  hasActiveFilters,
  onClearFilters,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FunnelIcon className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-openvino-purple dark:text-purple-400 hover:text-openvino-purple/80 dark:hover:text-purple-300 flex items-center"
          >
            <XMarkIcon className="h-4 w-4 mr-1" />
            Clear Filters
          </button>
        )}
      </div>

      {/* Version Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          OpenVINO Version
        </label>
        <select
          value={selectedVersion}
          onChange={(e) => onVersionChange(e.target.value as OpenVINOVersion | 'all')}
          className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-openvino-purple dark:focus:ring-purple-400 focus:border-transparent"
        >
          <option value="all">All Versions</option>

          {/* Group versions by year */}
          <optgroup label="2024 Releases">
            {versions.filter(v => v.startsWith('2024')).map((version) => (
              <option key={version} value={version}>
                {version}
              </option>
            ))}
          </optgroup>

          <optgroup label="2025 Releases">
            {versions.filter(v => v.startsWith('2025')).map((version) => (
              <option key={version} value={version}>
                {version}
              </option>
            ))}
          </optgroup>

          <optgroup label="2026 Releases">
            {versions.filter(v => v.startsWith('2026')).map((version) => (
              <option key={version} value={version}>
                {version}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Categories
        </label>
        <div className="space-y-2">
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category);
            const colorClass = CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-800 border-gray-200';

            return (
              <button
                key={category}
                onClick={() => onCategoryToggle(category)}
                className={`w-full text-left px-3 py-2 rounded-lg border text-sm font-medium transition-all hover:shadow-md ${
                  isSelected
                    ? colorClass
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Device Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Device Support
        </label>
        <div className="flex gap-2">
          {(['CPU', 'GPU', 'NPU'] as DeviceType[]).map((device) => {
            const isSelected = selectedDevices.includes(device);
            return (
              <button
                key={device}
                onClick={() => onDeviceToggle(device)}
                className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-openvino-purple text-white border-openvino-purple'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <span className="mr-1">{DEVICE_ICONS[device]}</span>
                {device}
              </button>
            );
          })}
        </div>
      </div>

      {/* LoRA Filter */}
      <div>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={loraOnly}
            onChange={(e) => onLoraToggle(e.target.checked)}
            className="w-4 h-4 text-openvino-purple border-gray-300 rounded focus:ring-openvino-purple"
          />
          <span className="ml-2 text-sm text-gray-700">
            LoRA Support Only
          </span>
        </label>
      </div>
    </div>
  );
};
