/**
 * ExportButton component for exporting model data
 */

import React, { useState } from 'react';
import { ArrowDownTrayIcon, CheckIcon } from '@heroicons/react/24/outline';
import type { Model, OpenVINOVersion } from '../types';
import { getVersionSupport } from '../utils/dataHelpers';

interface ExportButtonProps {
  models: Model[];
  selectedVersion: OpenVINOVersion | 'all';
  filterState: {
    searchQuery: string;
    selectedCategories: string[];
    selectedDevices: string[];
    loraOnly: boolean;
  };
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  models,
  selectedVersion,
  filterState,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [justCopied, setJustCopied] = useState(false);

  const exportToJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      version: selectedVersion,
      filters: filterState,
      models: models.map((model) => ({
        id: model.id,
        name: model.name,
        family: model.family,
        category: model.category,
        description: model.description,
        license: model.license,
        tags: model.tags,
        homepage: model.homepage,
        variants: model.variants.map((variant) => ({
          size: variant.size,
          huggingfaceId: variant.huggingfaceId,
          versionSupport: variant.versionSupport,
        })),
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `openvino-models-${selectedVersion}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  const exportToCSV = () => {
    const rows: string[][] = [
      [
        'Model',
        'Family',
        'Category',
        'Size',
        'HuggingFace ID',
        'Supported',
        'CPU',
        'GPU',
        'NPU',
        'LoRA Support',
        'License',
        'Homepage',
      ],
    ];

    models.forEach((model) => {
      model.variants.forEach((variant) => {
        const vs = getVersionSupport(variant.versionSupport, selectedVersion);
        rows.push([
          model.name,
          model.family,
          model.category,
          variant.size,
          variant.huggingfaceId || '',
          vs?.supported ? 'Yes' : 'No',
          vs?.devices.cpu ? 'Yes' : 'No',
          vs?.devices.gpu ? 'Yes' : 'No',
          vs?.devices.npu ? 'Yes' : 'No',
          vs?.loraSupport ? 'Yes' : 'No',
          model.license || '',
          model.homepage || '',
        ]);
      });
    });

    const csv = rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `openvino-models-${selectedVersion}-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  const copyShareableURL = () => {
    const params = new URLSearchParams();
    if (selectedVersion !== 'all') params.set('version', selectedVersion);
    if (filterState.searchQuery) params.set('search', filterState.searchQuery);
    if (filterState.selectedCategories.length > 0) {
      params.set('categories', filterState.selectedCategories.join(','));
    }
    if (filterState.selectedDevices.length > 0) {
      params.set('devices', filterState.selectedDevices.join(','));
    }
    if (filterState.loraOnly) params.set('lora', 'true');

    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(url);
    setJustCopied(true);
    setTimeout(() => {
      setJustCopied(false);
      setShowMenu(false);
    }, 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-openvino-purple"
      >
        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
        Export
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
            <div className="py-1" role="menu">
              <button
                onClick={exportToJSON}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Download as JSON
              </button>
              <button
                onClick={exportToCSV}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Download as CSV
              </button>
              <div className="border-t border-gray-100"></div>
              <button
                onClick={copyShareableURL}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                role="menuitem"
              >
                <span>Copy Share Link</span>
                {justCopied && <CheckIcon className="h-4 w-4 text-green-500" />}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
