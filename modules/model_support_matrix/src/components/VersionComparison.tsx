/**
 * VersionComparison component for comparing model support across versions
 */

import React, { useMemo } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  PlusCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import type { Model, OpenVINOVersion } from '../types';
import { getVersionSupport } from '../utils/dataHelpers';

interface VersionComparisonProps {
  models: Model[];
  versions: OpenVINOVersion[];
  baseVersion: OpenVINOVersion;
  compareVersion: OpenVINOVersion;
}

interface ComparisonResult {
  model: Model;
  variant: {
    size: string;
    huggingfaceId?: string;
  };
  baseSupported: boolean;
  compareSupported: boolean;
  status: 'new' | 'removed' | 'unchanged' | 'devices-changed';
  baseDevices?: { cpu: boolean; gpu: boolean; npu: boolean };
  compareDevices?: { cpu: boolean; gpu: boolean; npu: boolean };
}

export const VersionComparison: React.FC<VersionComparisonProps> = ({
  models,
  baseVersion,
  compareVersion,
}) => {
  const [filterStatus, setFilterStatus] = React.useState<ComparisonResult['status'] | null>(null);

  const comparison = useMemo<ComparisonResult[]>(() => {
    const results: ComparisonResult[] = [];

    models.forEach((model) => {
      model.variants.forEach((variant) => {
        const baseVs = getVersionSupport(variant.versionSupport, baseVersion);
        const compareVs = getVersionSupport(variant.versionSupport, compareVersion);

        const baseSupported = baseVs?.supported || false;
        const compareSupported = compareVs?.supported || false;

        let status: ComparisonResult['status'] = 'unchanged';
        if (!baseSupported && compareSupported) {
          status = 'new';
        } else if (baseSupported && !compareSupported) {
          status = 'removed';
        } else if (baseSupported && compareSupported) {
          const devicesChanged =
            baseVs?.devices.cpu !== compareVs?.devices.cpu ||
            baseVs?.devices.gpu !== compareVs?.devices.gpu ||
            baseVs?.devices.npu !== compareVs?.devices.npu;
          if (devicesChanged) {
            status = 'devices-changed';
          }
        }

        results.push({
          model,
          variant: {
            size: variant.size,
            huggingfaceId: variant.huggingfaceId,
          },
          baseSupported,
          compareSupported,
          status,
          baseDevices: baseVs?.devices,
          compareDevices: compareVs?.devices,
        });
      });
    });

    return results.sort((a, b) => {
      const statusOrder = { new: 0, removed: 1, 'devices-changed': 2, unchanged: 3 };
      return statusOrder[a.status] - statusOrder[b.status];
    });
  }, [models, baseVersion, compareVersion]);

  const stats = useMemo(() => {
    return {
      new: comparison.filter((c) => c.status === 'new').length,
      removed: comparison.filter((c) => c.status === 'removed').length,
      devicesChanged: comparison.filter((c) => c.status === 'devices-changed').length,
      unchanged: comparison.filter((c) => c.status === 'unchanged').length,
    };
  }, [comparison]);

  const getStatusBadge = (status: ComparisonResult['status']) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <PlusCircleIcon className="h-4 w-4 mr-1" />
            New
          </span>
        );
      case 'removed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="h-4 w-4 mr-1" />
            Removed
          </span>
        );
      case 'devices-changed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ArrowRightIcon className="h-4 w-4 mr-1" />
            Changed
          </span>
        );
      default:
        return null;
    }
  };

  const formatDevices = (devices?: { cpu: boolean; gpu: boolean; npu: boolean }) => {
    if (!devices) return '-';
    const parts: string[] = [];
    if (devices.cpu) parts.push('CPU');
    if (devices.gpu) parts.push('GPU');
    if (devices.npu) parts.push('NPU');
    return parts.join(', ') || '-';
  };

  const handleStatClick = (status: ComparisonResult['status'] | null) => {
    setFilterStatus(filterStatus === status ? null : status);
  };

  const filteredComparison = filterStatus
    ? comparison.filter((c) => c.status === filterStatus)
    : comparison;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Version Comparison</h2>
        <div className="flex items-center justify-center space-x-4 text-lg">
          <span className="font-medium text-gray-700">{baseVersion}</span>
          <ArrowRightIcon className="h-6 w-6 text-gray-400" />
          <span className="font-medium text-gray-700">{compareVersion}</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => handleStatClick('new')}
          className={`bg-white rounded-lg shadow p-4 text-left transition-all hover:shadow-lg hover:scale-105 ${
            filterStatus === 'new' ? 'ring-2 ring-green-500' : ''
          }`}
        >
          <div className="text-3xl font-bold text-green-600 mb-1">{stats.new}</div>
          <div className="text-sm text-gray-600">New Models</div>
        </button>
        <button
          onClick={() => handleStatClick('removed')}
          className={`bg-white rounded-lg shadow p-4 text-left transition-all hover:shadow-lg hover:scale-105 ${
            filterStatus === 'removed' ? 'ring-2 ring-red-500' : ''
          }`}
        >
          <div className="text-3xl font-bold text-red-600 mb-1">{stats.removed}</div>
          <div className="text-sm text-gray-600">Removed</div>
        </button>
        <button
          onClick={() => handleStatClick('devices-changed')}
          className={`bg-white rounded-lg shadow p-4 text-left transition-all hover:shadow-lg hover:scale-105 ${
            filterStatus === 'devices-changed' ? 'ring-2 ring-yellow-500' : ''
          }`}
        >
          <div className="text-3xl font-bold text-yellow-600 mb-1">{stats.devicesChanged}</div>
          <div className="text-sm text-gray-600">Device Changes</div>
        </button>
        <button
          onClick={() => handleStatClick('unchanged')}
          className={`bg-white rounded-lg shadow p-4 text-left transition-all hover:shadow-lg hover:scale-105 ${
            filterStatus === 'unchanged' ? 'ring-2 ring-gray-500' : ''
          }`}
        >
          <div className="text-3xl font-bold text-gray-600 mb-1">{stats.unchanged}</div>
          <div className="text-sm text-gray-600">Unchanged</div>
        </button>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filterStatus && (
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Filtering by: <span className="font-medium">{filterStatus === 'devices-changed' ? 'Device Changes' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}</span>
            </span>
            <button
              onClick={() => setFilterStatus(null)}
              className="text-sm text-openvino-purple hover:underline"
            >
              Clear filter
            </button>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Model
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Size
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {baseVersion} Devices
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {compareVersion} Devices
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredComparison.map((item, idx) => (
                <tr key={idx} className={item.status === 'unchanged' ? 'bg-gray-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.model.name}</div>
                    <div className="text-sm text-gray-500">{item.model.family}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                      {item.variant.size}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {item.baseSupported ? (
                        <>
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-sm text-gray-600">
                            {formatDevices(item.baseDevices)}
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircleIcon className="h-5 w-5 text-gray-300 mr-2" />
                          <span className="text-sm text-gray-400">Not supported</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {item.compareSupported ? (
                        <>
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-sm text-gray-600">
                            {formatDevices(item.compareDevices)}
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircleIcon className="h-5 w-5 text-gray-300 mr-2" />
                          <span className="text-sm text-gray-400">Not supported</span>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
