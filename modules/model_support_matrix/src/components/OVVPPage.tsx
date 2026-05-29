/**
 * OVVPPage - OpenVINO Validation Program
 * Displays validated models from the OVVP dataset
 */

import React, { useState, useMemo } from 'react';
import { ArrowLeftIcon, TableCellsIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import ovvpData from '../data/ovvp_models.json';

interface OVVPPageProps {
  onNavigateBack: () => void;
}

interface ModelVariant {
  framework: string;
  precision: string;
  paths: string[];
  tags?: string[];
}

interface TopologyModel {
  topology: string;
  models: ModelVariant[];
  tags?: string[];
}

export const OVVPPage: React.FC<OVVPPageProps> = ({ onNavigateBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);
  const [selectedPrecision, setSelectedPrecision] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Parse OVVP data
  const models = useMemo(() => {
    return (ovvpData.scope as TopologyModel[]) || [];
  }, []);

  // Get unique frameworks and precisions
  const frameworks = useMemo(() => {
    const frameworkSet = new Set<string>();
    models.forEach(model => {
      model.models.forEach(variant => {
        frameworkSet.add(variant.framework);
      });
    });
    return Array.from(frameworkSet).sort();
  }, [models]);

  const precisions = useMemo(() => {
    const precisionSet = new Set<string>();
    models.forEach(model => {
      model.models.forEach(variant => {
        precisionSet.add(variant.precision);
      });
    });
    return Array.from(precisionSet).sort();
  }, [models]);

  // Filter models
  const filteredModels = useMemo(() => {
    return models.filter(model => {
      // Search filter
      const matchesSearch = !searchQuery ||
        model.topology.toLowerCase().includes(searchQuery.toLowerCase());

      // Framework filter
      const matchesFramework = !selectedFramework ||
        model.models.some(variant => variant.framework === selectedFramework);

      // Precision filter
      const matchesPrecision = !selectedPrecision ||
        model.models.some(variant => variant.precision === selectedPrecision);

      return matchesSearch && matchesFramework && matchesPrecision;
    });
  }, [models, searchQuery, selectedFramework, selectedPrecision]);

  // Get variant count for a model
  const getVariantCount = (model: TopologyModel) => {
    let count = model.models.length;

    if (selectedFramework) {
      count = model.models.filter(v => v.framework === selectedFramework).length;
    }

    if (selectedPrecision) {
      count = model.models.filter(v =>
        v.precision === selectedPrecision &&
        (!selectedFramework || v.framework === selectedFramework)
      ).length;
    }

    return count;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onNavigateBack}
            className="mb-4 flex items-center text-openvino-purple dark:text-purple-400 hover:underline"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Resources
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            OpenVINO Validation Program (OVVP)
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Validated model topologies ensuring compatibility and performance standards across the OpenVINO ecosystem
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full">
              Version {ovvpData.metadata.version}
            </span>
            <span>{models.length} Model Topologies</span>
            <span>{models.reduce((sum, m) => sum + m.models.length, 0)} Total Variants</span>
          </div>
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
              placeholder="Search model topologies..."
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

          {/* Framework and Precision Filters */}
          <div className="flex flex-wrap gap-2">
            {/* Framework Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Framework:</span>
              <button
                onClick={() => setSelectedFramework(null)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedFramework === null
                    ? 'bg-openvino-purple text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                All
              </button>
              {frameworks.map((framework) => (
                <button
                  key={framework}
                  onClick={() => setSelectedFramework(framework)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedFramework === framework
                      ? 'bg-openvino-purple text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {framework}
                </button>
              ))}
            </div>

            <div className="h-8 w-px bg-gray-300 dark:bg-gray-600" />

            {/* Precision Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Precision:</span>
              <button
                onClick={() => setSelectedPrecision(null)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedPrecision === null
                    ? 'bg-openvino-purple text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                All
              </button>
              {precisions.map((precision) => (
                <button
                  key={precision}
                  onClick={() => setSelectedPrecision(precision)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedPrecision === precision
                      ? 'bg-openvino-purple text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {precision}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredModels.length}</span> of{' '}
          <span className="font-semibold text-gray-900 dark:text-white">{models.length}</span> model topologies
        </div>

        {/* Models Display */}
        {filteredModels.length > 0 ? (
          viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModels.map((model) => {
                const variantCount = getVariantCount(model);
                const displayedVariants = model.models.filter(v =>
                  (!selectedFramework || v.framework === selectedFramework) &&
                  (!selectedPrecision || v.precision === selectedPrecision)
                );

                return (
                  <div
                    key={model.topology}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 p-6 hover:shadow-lg transition-all"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 break-words">
                      {model.topology}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Variants:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{variantCount}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {Array.from(new Set(displayedVariants.map(v => v.framework))).map((fw) => (
                          <span
                            key={fw}
                            className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium rounded"
                          >
                            {fw}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {Array.from(new Set(displayedVariants.map(v => v.precision))).map((prec) => (
                          <span
                            key={prec}
                            className="inline-block px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-medium rounded"
                          >
                            {prec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Model Topology
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Frameworks
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Precisions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Variants
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredModels.map((model) => {
                      const displayedVariants = model.models.filter(v =>
                        (!selectedFramework || v.framework === selectedFramework) &&
                        (!selectedPrecision || v.precision === selectedPrecision)
                      );
                      const variantCount = displayedVariants.length;

                      return (
                        <tr key={model.topology} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {model.topology}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {Array.from(new Set(displayedVariants.map(v => v.framework))).map((fw) => (
                                <span
                                  key={fw}
                                  className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium rounded"
                                >
                                  {fw}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {Array.from(new Set(displayedVariants.map(v => v.precision))).map((prec) => (
                                <span
                                  key={prec}
                                  className="inline-block px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-medium rounded"
                                >
                                  {prec}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-white font-medium">
                              {variantCount}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
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
    </div>
  );
};
