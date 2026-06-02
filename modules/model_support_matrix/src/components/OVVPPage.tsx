/**
 * OVVPPage - OpenVINO Validation Program
 * Displays validated models from the OVVP dataset
 * Fetches data dynamically from GitHub
 */

import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeftIcon, TableCellsIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

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

interface OVVPData {
  metadata: {
    version?: string;
    info?: string;
    tags?: string[];
  };
  scope: TopologyModel[];
}

export const OVVPPage: React.FC<OVVPPageProps> = ({ onNavigateBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);
  const [selectedPrecision, setSelectedPrecision] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // State for data fetching
  const [ovvpData, setOvvpData] = useState<OVVPData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch OVVP data from GitHub
  useEffect(() => {
    const fetchOVVPData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/data/public-openvino.json');

        if (!response.ok) {
          throw new Error(`Failed to fetch OVVP data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setOvvpData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load OVVP data');
        console.error('Error fetching OVVP data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOVVPData();
  }, []);

  // Function to categorize models based on topology name
  const categorizeModel = (topology: string): string => {
    const name = topology.toLowerCase();

    // Object Detection
    if (name.includes('detection') || name.includes('ssd') || name.includes('yolo') ||
        name.includes('rcnn') || name.includes('retinanet')) {
      return 'Object Detection';
    }

    // Segmentation
    if (name.includes('segmentation') || name.includes('mask') || name.includes('unet') ||
        name.includes('icnet')) {
      return 'Segmentation';
    }

    // Image Processing & Enhancement
    if (name.includes('denoise') || name.includes('sharpen') || name.includes('blur') ||
        name.includes('super-resolution') || name.includes('srgan') || name.includes('esrgan')) {
      return 'Image Processing';
    }

    // NLP & Language Models
    if (name.includes('bert') || name.includes('gpt') || name.includes('xlnet') ||
        name.includes('transformer') || name.includes('translation') || name.includes('nlp')) {
      return 'NLP';
    }

    // Face Recognition & Analysis
    if (name.includes('face') || name.includes('facial') || name.includes('landmarks')) {
      return 'Face Analysis';
    }

    // Person/Human Analysis
    if (name.includes('person') || name.includes('human') || name.includes('pose') ||
        name.includes('gaze') || name.includes('action-recognition')) {
      return 'Human Analysis';
    }

    // Text Recognition & OCR
    if (name.includes('text') || name.includes('ocr') || name.includes('handwritten')) {
      return 'Text Recognition';
    }

    // Speech & Audio
    if (name.includes('speech') || name.includes('audio') || name.includes('noise-suppression') ||
        name.includes('tts') || name.includes('text-to-speech')) {
      return 'Speech & Audio';
    }

    // Recommendation Systems
    if (name.includes('recommendation') || name.includes('dlrm') || name.includes('ncf') ||
        name.includes('wide') || name.includes('deep')) {
      return 'Recommendation';
    }

    // Generative Models
    if (name.includes('gan') || name.includes('vae') || name.includes('generative') ||
        name.includes('style')) {
      return 'Generative AI';
    }

    // 3D & Depth
    if (name.includes('3d') || name.includes('depth') || name.includes('vnet')) {
      return '3D & Depth';
    }

    // Time Series & Sequence
    if (name.includes('tcn') || name.includes('time-series') || name.includes('forecasting') ||
        name.includes('sequence')) {
      return 'Time Series';
    }

    // Classification
    if (name.includes('classification') || name.includes('resnet') || name.includes('mobilenet') ||
        name.includes('efficientnet') || name.includes('inception')) {
      return 'Classification';
    }

    // Vehicle Analysis
    if (name.includes('vehicle') || name.includes('license-plate')) {
      return 'Vehicle Analysis';
    }

    // Default
    return 'Other';
  };

  // Parse OVVP data and add categories
  const models = useMemo(() => {
    return (ovvpData?.scope || []).map(model => ({
      ...model,
      category: categorizeModel(model.topology)
    }));
  }, [ovvpData]);

  // Get unique categories from models
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(models.map(m => m.category)));
    return uniqueCategories.sort();
  }, [models]);

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

      // Category filter
      const matchesCategory = !selectedCategory || model.category === selectedCategory;

      // Framework filter
      const matchesFramework = !selectedFramework ||
        model.models.some(variant => variant.framework === selectedFramework);

      // Precision filter
      const matchesPrecision = !selectedPrecision ||
        model.models.some(variant => variant.precision === selectedPrecision);

      return matchesSearch && matchesCategory && matchesFramework && matchesPrecision;
    });
  }, [models, searchQuery, selectedCategory, selectedFramework, selectedPrecision]);

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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-openvino-purple mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading OVVP data from GitHub...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-red-900 dark:text-red-200 mb-2">Failed to Load OVVP Data</h3>
            <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
            <p className="text-sm text-red-600 dark:text-red-400 mb-4">
              Make sure the data file exists at:<br />
              <code className="bg-red-100 dark:bg-red-900 px-2 py-1 rounded text-xs">
                https://github.com/kumarijy/openvino_contrib/blob/master/modules/model_support_matrix/src/data/ovvp_models.json
              </code>
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-openvino-purple text-white rounded-lg hover:bg-opacity-90"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

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
              Version {ovvpData?.metadata?.version || 'N/A'}
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

          {/* Category, Framework and Precision Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <label htmlFor="category-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Category:
              </label>
              <select
                id="category-filter"
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-openvino-purple focus:border-transparent text-gray-900 dark:text-white"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Framework Filter */}
            <div className="flex items-center gap-2">
              <label htmlFor="framework-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Framework:
              </label>
              <select
                id="framework-filter"
                value={selectedFramework || ''}
                onChange={(e) => setSelectedFramework(e.target.value || null)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-openvino-purple focus:border-transparent text-gray-900 dark:text-white"
              >
                <option value="">All Frameworks</option>
                {frameworks.map((framework) => (
                  <option key={framework} value={framework}>
                    {framework}
                  </option>
                ))}
              </select>
            </div>

            {/* Precision Filter */}
            <div className="flex items-center gap-2">
              <label htmlFor="precision-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Precision:
              </label>
              <select
                id="precision-filter"
                value={selectedPrecision || ''}
                onChange={(e) => setSelectedPrecision(e.target.value || null)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-openvino-purple focus:border-transparent text-gray-900 dark:text-white"
              >
                <option value="">All Precisions</option>
                {precisions.map((precision) => (
                  <option key={precision} value={precision}>
                    {precision}
                  </option>
                ))}
              </select>
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
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 break-words">
                      {model.topology}
                    </h3>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">
                      {model.category}
                    </div>
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
                        Category
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
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {model.category}
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
