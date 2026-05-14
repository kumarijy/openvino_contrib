/**
 * ModelDetailModal component for displaying full model information
 */

import React from 'react';
import {
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  Square3Stack3DIcon,
  TagIcon,
  LinkIcon,
  ScaleIcon,
} from '@heroicons/react/24/outline';
import type { Model } from '../types';
import { getVersionSupport, formatDeviceSupport } from '../utils/dataHelpers';

interface ModelDetailModalProps {
  model: Model;
  versions: string[];
  onClose: () => void;
}

export const ModelDetailModal: React.FC<ModelDetailModalProps> = ({
  model,
  versions,
  onClose,
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className={`${getCategoryColor(model.category)} h-2`}></div>
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 id="modal-title" className="text-2xl font-bold text-gray-900">
                  {model.name}
                </h2>
                <p className="mt-1 text-sm text-gray-600">{model.family}</p>
              </div>
              <button
                onClick={onClose}
                className="ml-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                aria-label="Close modal"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={`px-3 py-1 text-sm font-medium rounded-full text-white ${getCategoryColor(model.category)}`}>
                {model.category}
              </span>
              {model.license && (
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800 flex items-center">
                  <ScaleIcon className="h-4 w-4 mr-1" />
                  {model.license}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-12rem)]">
            {/* Description */}
            {model.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{model.description}</p>
              </div>
            )}

            {/* Tags */}
            {model.tags && model.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <TagIcon className="h-5 w-5 mr-2" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {model.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Variants */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Square3Stack3DIcon className="h-5 w-5 mr-2" />
                Model Variants ({model.variants.length})
              </h3>
              <div className="space-y-4">
                {model.variants.map((variant, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-semibold text-gray-900">{variant.size}</span>
                      {variant.huggingfaceId && (
                        <a
                          href={`https://huggingface.co/${variant.huggingfaceId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-openvino-blue hover:underline flex items-center"
                        >
                          <LinkIcon className="h-4 w-4 mr-1" />
                          {variant.huggingfaceId}
                        </a>
                      )}
                    </div>

                    {/* Version Support Table */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Version
                            </th>
                            <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                              Supported
                            </th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Devices
                            </th>
                            <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                              LoRA
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {versions.map((version) => {
                            const vs = getVersionSupport(variant.versionSupport, version);
                            return (
                              <tr key={version} className={vs?.supported ? '' : 'bg-gray-50'}>
                                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {version}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-center">
                                  {vs?.supported ? (
                                    <CheckCircleIcon className="h-5 w-5 text-green-500 mx-auto" />
                                  ) : (
                                    <XCircleIcon className="h-5 w-5 text-gray-300 mx-auto" />
                                  )}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                                  {vs?.supported ? formatDeviceSupport(vs.devices) : '-'}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-center">
                                  {vs?.supported && vs.loraSupport ? (
                                    <CheckCircleIcon className="h-5 w-5 text-green-500 mx-auto" />
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Notes */}
                    {variant.versionSupport.some((vs) => vs.notes) && (
                      <div className="mt-3 space-y-1">
                        {variant.versionSupport
                          .filter((vs) => vs.notes)
                          .map((vs, noteIdx) => (
                            <div key={noteIdx} className="text-sm text-gray-600">
                              <span className="font-medium">{vs.version}:</span> {vs.notes}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <LinkIcon className="h-5 w-5 mr-2" />
                External Links
              </h3>
              <div className="space-y-2">
                {model.homepage && (
                  <a
                    href={model.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-openvino-blue hover:underline"
                  >
                    Homepage →
                  </a>
                )}
                {model.documentation && (
                  <a
                    href={model.documentation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-openvino-blue hover:underline"
                  >
                    Documentation →
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-openvino-purple text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
