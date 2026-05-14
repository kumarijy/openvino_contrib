/**
 * ModelCard component for displaying models in card layout
 */

import React from 'react';
import {
  CheckCircleIcon,
  CpuChipIcon,
  Square3Stack3DIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import type { Model, OpenVINOVersion } from '../types';
import { getVersionSupport, hasLoRaSupport } from '../utils/dataHelpers';

interface ModelCardProps {
  model: Model;
  selectedVersion: OpenVINOVersion | 'all';
  onClick?: (model: Model) => void;
}

export const ModelCard: React.FC<ModelCardProps> = ({
  model,
  selectedVersion,
  onClick,
}) => {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'LLM': 'bg-blue-500',
      'VLM': 'bg-purple-500',
      'Image Generation': 'bg-pink-500',
      'Video Generation': 'bg-red-500',
      'Speech Recognition': 'bg-green-500',
      'Speech Generation': 'bg-teal-500',
      'Text Embeddings': 'bg-indigo-500',
      'Text Rerank': 'bg-amber-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  const supportedVariants = model.variants.filter((variant) => {
    const vs = getVersionSupport(variant.versionSupport, selectedVersion);
    return vs && vs.supported;
  });

  const hasLora = hasLoRaSupport(model, selectedVersion);

  const deviceSupport = {
    cpu: false,
    gpu: false,
    npu: false,
  };

  supportedVariants.forEach((variant) => {
    const vs = getVersionSupport(variant.versionSupport, selectedVersion);
    if (vs && vs.supported) {
      if (vs.devices.cpu) deviceSupport.cpu = true;
      if (vs.devices.gpu) deviceSupport.gpu = true;
      if (vs.devices.npu) deviceSupport.npu = true;
    }
  });

  return (
    <div
      className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={() => onClick?.(model)}
    >
      {/* Category Bar */}
      <div className={`h-2 ${getCategoryColor(model.category)}`} />

      {/* Card Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{model.name}</h3>
          <p className="text-sm text-gray-600">{model.family}</p>
        </div>

        {/* Description */}
        {model.description && (
          <p className="text-sm text-gray-700 mb-4 line-clamp-2">{model.description}</p>
        )}

        {/* Category Badge */}
        <div className="mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {model.category}
          </span>
        </div>

        {/* Variants */}
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <Square3Stack3DIcon className="h-4 w-4 mr-1.5" />
          <span>
            {supportedVariants.length} variant{supportedVariants.length !== 1 ? 's' : ''}
          </span>
          <span className="mx-2">•</span>
          <span className="text-gray-500">
            {model.variants.map((v) => v.size).join(', ')}
          </span>
        </div>

        {/* Device Support */}
        <div className="flex items-center space-x-2 mb-3">
          <CpuChipIcon className="h-4 w-4 text-gray-500" />
          <div className="flex space-x-1">
            {deviceSupport.cpu && (
              <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">
                CPU
              </span>
            )}
            {deviceSupport.gpu && (
              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                GPU
              </span>
            )}
            {deviceSupport.npu && (
              <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                NPU
              </span>
            )}
            {!deviceSupport.cpu && !deviceSupport.gpu && !deviceSupport.npu && (
              <span className="text-xs text-gray-400">No devices</span>
            )}
          </div>
        </div>

        {/* LoRA Support */}
        {hasLora && (
          <div className="flex items-center text-sm text-green-700 mb-3">
            <CheckCircleIcon className="h-4 w-4 mr-1.5" />
            <span>LoRA Support</span>
          </div>
        )}

        {/* Tags */}
        {model.tags && model.tags.length > 0 && (
          <div className="flex items-start text-xs text-gray-500 mb-4">
            <TagIcon className="h-3.5 w-3.5 mr-1.5 mt-0.5 flex-shrink-0" />
            <div className="flex flex-wrap gap-1">
              {model.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        <div className="flex space-x-3 pt-3 border-t border-gray-200">
          {model.homepage && (
            <a
              href={model.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-openvino-blue hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Homepage
            </a>
          )}
          {model.documentation && (
            <a
              href={model.documentation}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-openvino-blue hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Docs
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
