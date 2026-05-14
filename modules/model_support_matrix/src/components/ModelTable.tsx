/**
 * ModelTable component for displaying models in a sortable table
 */

import React, { useMemo } from 'react';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import type { Model, OpenVINOVersion, SortConfig } from '../types';
import { getVersionSupport, formatDeviceSupport } from '../utils/dataHelpers';

interface ModelTableProps {
  models: Model[];
  selectedVersion: OpenVINOVersion | 'all';
  sortConfig: SortConfig;
  onSort: (field: 'name' | 'family' | 'category') => void;
  onModelClick?: (model: Model) => void;
}

export const ModelTable: React.FC<ModelTableProps> = ({
  models,
  selectedVersion,
  sortConfig,
  onSort,
  onModelClick,
}) => {
  const SortIcon: React.FC<{ field: string }> = ({ field }) => {
    if (sortConfig.field !== field) {
      return <ChevronUpIcon className="h-4 w-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ChevronUpIcon className="h-4 w-4 text-openvino-purple" />
    ) : (
      <ChevronDownIcon className="h-4 w-4 text-openvino-purple" />
    );
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      'LLM': 'bg-blue-100 text-blue-800',
      'VLM': 'bg-purple-100 text-purple-800',
      'Image Generation': 'bg-pink-100 text-pink-800',
      'Video Generation': 'bg-red-100 text-red-800',
      'Speech Recognition': 'bg-green-100 text-green-800',
      'Speech Generation': 'bg-teal-100 text-teal-800',
      'Text Embeddings': 'bg-indigo-100 text-indigo-800',
      'Text Rerank': 'bg-amber-100 text-amber-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const tableData = useMemo(() => {
    return models.flatMap((model) =>
      model.variants.map((variant) => {
        const versionSupport = getVersionSupport(
          variant.versionSupport,
          selectedVersion
        );
        return {
          model,
          variant,
          versionSupport,
        };
      })
    );
  }, [models, selectedVersion]);

  if (models.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="text-gray-400 text-5xl mb-4">🔍</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No models found</h3>
        <p className="text-gray-600">Try adjusting your filters or search query</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Model</span>
                  <SortIcon field="name" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('family')}
              >
                <div className="flex items-center space-x-1">
                  <span>Family</span>
                  <SortIcon field="family" />
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('category')}
              >
                <div className="flex items-center space-x-1">
                  <span>Category</span>
                  <SortIcon field="category" />
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Devices
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                LoRA
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                HuggingFace ID
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableData.map(({ model, variant, versionSupport }, idx) => (
              <tr
                key={`${model.id}-${variant.size}-${idx}`}
                className={`hover:bg-gray-50 ${onModelClick ? 'cursor-pointer' : ''}`}
                onClick={() => onModelClick?.(model)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{model.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{model.family}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                    {variant.size}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${getCategoryBadgeColor(
                      model.category
                    )}`}
                  >
                    {model.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {versionSupport && versionSupport.supported ? (
                    <div className="text-sm text-gray-600">
                      {formatDeviceSupport(versionSupport.devices)}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {versionSupport && versionSupport.supported ? (
                    versionSupport.loraSupport ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 text-gray-300 mx-auto" />
                    )
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {variant.huggingfaceId ? (
                    <a
                      href={`https://huggingface.co/${variant.huggingfaceId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-openvino-blue hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {variant.huggingfaceId}
                    </a>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Showing {tableData.length} variant{tableData.length !== 1 ? 's' : ''} from{' '}
          {models.length} model{models.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};
