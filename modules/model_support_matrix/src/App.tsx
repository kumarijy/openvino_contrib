import React, { useState, useMemo } from 'react';
import { useModelData } from './hooks/useModelData';
import { useFilters } from './hooks/useFilters';
import { useURLParams } from './hooks/useURLParams';
import {
  calculateStats,
  filterModels,
  sortModels,
  getCategories,
} from './utils/dataHelpers';
import {
  SearchBar,
  FilterPanel,
  ModelTable,
  ModelCard,
  StatsDashboard,
  ViewToggle,
  ModelDetailModal,
  ExportButton,
  VersionComparison,
  DarkModeToggle,
  LandingPage,
  ModelHubPage,
  VerifiedModelsPage,
  OVVPPage,
  RequestModelModal,
} from './components';
import type { ViewMode, SortConfig, Model, ModelCategory } from './types';

const App: React.FC = () => {
  const { models, versions, loading, error } = useModelData();
  const latestVersion = versions[versions.length - 1] || '2026.0';
  const {
    filters,
    setSearchQuery,
    setSelectedVersion,
    toggleCategory,
    setCategories,
    toggleDevice,
    setLoraOnly,
    clearFilters,
    hasActiveFilters,
  } = useFilters(latestVersion);

  const [currentPage, setCurrentPage] = useState<'landing' | 'matrix' | 'modelHub' | 'verifiedModels' | 'ovvp'>('landing');
  const [highlightedModel, setHighlightedModel] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'name',
    direction: 'asc',
  });
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [comparisonVersions, setComparisonVersions] = useState<{
    base: string;
    compare: string;
  }>({
    base: versions.length >= 2 ? versions[versions.length - 2] : versions[0] || '2025.1',
    compare: latestVersion,
  });

  useURLParams({
    filters,
    setSearchQuery,
    setSelectedVersion,
    toggleCategory,
    toggleDevice,
    setLoraOnly,
  });

  const handleSort = (field: 'name' | 'family' | 'category') => {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleCategoryClick = (category: ModelCategory) => {
    // If the category is already the only selected one, clear it
    // Otherwise, set it as the only selected category
    if (filters.selectedCategories.length === 1 && filters.selectedCategories[0] === category) {
      setCategories([]);
    } else {
      setCategories([category]);
    }
    // Scroll to the results
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const filteredModels = useMemo(() => {
    const filtered = filterModels(models, filters);
    return sortModels(filtered, sortConfig.field, sortConfig.direction);
  }, [models, filters, sortConfig]);

  const stats = useMemo(
    () => (models.length > 0 ? calculateStats(models, filters.selectedVersion) : null),
    [models, filters.selectedVersion]
  );

  const categories = useMemo(() => getCategories(models), [models]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-openvino-purple mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading OpenVINO Model Support Matrix...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-openvino-purple text-white rounded-lg hover:bg-opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Page routing
  if (currentPage === 'landing') {
    return (
      <LandingPage
        onNavigateToMatrix={(modelId?: string) => {
          setCurrentPage('matrix');
          if (modelId) {
            setHighlightedModel(modelId);
            setSearchQuery(modelId);
          }
        }}
        onNavigateToModelHub={(modelName?: string) => {
          setCurrentPage('modelHub');
          setHighlightedModel(modelName || null);
        }}
        onNavigateToVerifiedModels={(modelName?: string) => {
          setCurrentPage('verifiedModels');
          setHighlightedModel(modelName || null);
        }}
        onNavigateToOVVP={(modelName?: string) => {
          setCurrentPage('ovvp');
          setHighlightedModel(modelName || null);
        }}
      />
    );
  }

  if (currentPage === 'modelHub') {
    return <ModelHubPage
      onNavigateBack={() => {
        setCurrentPage('landing');
        setHighlightedModel(null);
      }}
      highlightedModel={highlightedModel}
      onHighlightClear={() => setHighlightedModel(null)}
    />;
  }

  if (currentPage === 'verifiedModels') {
    return <VerifiedModelsPage
      onNavigateBack={() => {
        setCurrentPage('landing');
        setHighlightedModel(null);
      }}
      highlightedModel={highlightedModel}
      onHighlightClear={() => setHighlightedModel(null)}
    />;
  }

  if (currentPage === 'ovvp') {
    return <OVVPPage
      onNavigateBack={() => {
        setCurrentPage('landing');
        setHighlightedModel(null);
      }}
      highlightedModel={highlightedModel}
      onHighlightClear={() => setHighlightedModel(null)}
    />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <button
                onClick={() => setCurrentPage('landing')}
                className="text-sm text-openvino-purple dark:text-purple-400 hover:underline mb-2 flex items-center"
              >
                ← Back to Resources
              </button>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                OpenVINO <span className="text-openvino-purple dark:text-purple-400">GenAI</span> Model Support Matrix
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Track AI model support across OpenVINO releases • Version {filters.selectedVersion}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <DarkModeToggle />
              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-green-500 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900 dark:text-green-300 dark:border-green-700 dark:hover:bg-green-800 transition-colors flex items-center"
              >
                <span className="mr-1">➕</span> Request Model
              </button>
              <button
                onClick={() => setShowComparison(!showComparison)}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  showComparison
                    ? 'bg-openvino-purple text-white border-openvino-purple'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {showComparison ? 'Hide' : 'Show'} Comparison
              </button>
              <ExportButton
                models={filteredModels}
                selectedVersion={filters.selectedVersion}
                filterState={{
                  searchQuery: filters.searchQuery,
                  selectedCategories: filters.selectedCategories,
                  selectedDevices: filters.selectedDevices,
                  loraOnly: filters.loraOnly,
                }}
              />
              {!showComparison && <ViewToggle viewMode={viewMode} onChange={setViewMode} />}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Version Comparison View */}
        {showComparison ? (
          <div className="space-y-6">
            {/* Comparison Controls */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Version
                  </label>
                  <select
                    value={comparisonVersions.base}
                    onChange={(e) =>
                      setComparisonVersions((prev) => ({ ...prev, base: e.target.value }))
                    }
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-openvino-purple focus:border-transparent"
                  >
                    {versions.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Compare Version
                  </label>
                  <select
                    value={comparisonVersions.compare}
                    onChange={(e) =>
                      setComparisonVersions((prev) => ({ ...prev, compare: e.target.value }))
                    }
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-openvino-purple focus:border-transparent"
                  >
                    {versions.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Comparison Component */}
            <VersionComparison
              models={models}
              versions={versions}
              baseVersion={comparisonVersions.base}
              compareVersion={comparisonVersions.compare}
            />
          </div>
        ) : (
          <>
            {/* Statistics Dashboard */}
            {stats && (
              <div className="mb-8">
                <StatsDashboard stats={stats} onCategoryClick={handleCategoryClick} />
              </div>
            )}

            {/* Search and Filters Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Filters - Left Sidebar */}
          <div className="lg:col-span-1">
            <FilterPanel
              versions={versions}
              selectedVersion={filters.selectedVersion}
              onVersionChange={setSelectedVersion}
              categories={categories}
              selectedCategories={filters.selectedCategories}
              onCategoryToggle={handleCategoryClick}
              selectedDevices={filters.selectedDevices}
              onDeviceToggle={toggleDevice}
              loraOnly={filters.loraOnly}
              onLoraToggle={setLoraOnly}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search Bar */}
            <SearchBar value={filters.searchQuery} onChange={setSearchQuery} />

            {/* Results Count */}
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>
                Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredModels.reduce((sum, m) => sum + m.variants.length, 0)}</span> of{' '}
                <span className="font-semibold text-gray-900 dark:text-white">{models.reduce((sum, m) => sum + m.variants.length, 0)}</span> variants
              </span>
              {hasActiveFilters && (
                <span className="text-openvino-purple dark:text-purple-400">Active filters applied</span>
              )}
            </div>

            {/* Model Display - Table or Cards */}
            {viewMode === 'table' ? (
              <ModelTable
                models={filteredModels}
                selectedVersion={filters.selectedVersion}
                sortConfig={sortConfig}
                onSort={handleSort}
                onModelClick={setSelectedModel}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredModels.length > 0 ? (
                  filteredModels.map((model) => (
                    <ModelCard
                      key={model.id}
                      model={model}
                      selectedVersion={filters.selectedVersion}
                      onClick={setSelectedModel}
                    />
                  ))
                ) : (
                  <div className="col-span-2 bg-white rounded-lg shadow p-12 text-center">
                    <div className="text-gray-400 text-5xl mb-4">🔍</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No models found</h3>
                    <p className="text-gray-600">Try adjusting your filters or search query</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
          </>
        )}
      </main>

      {/* Model Detail Modal */}
      {selectedModel && (
        <ModelDetailModal
          model={selectedModel}
          versions={versions}
          onClose={() => setSelectedModel(null)}
        />
      )}

      {/* Request Model Modal */}
      <RequestModelModal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} />

      {/* Footer */}
      <footer className="mt-16 pb-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 text-center text-sm text-gray-500">
          <p className="mb-2">
            Built with React + TypeScript + Tailwind CSS
          </p>
          <p>
            Part of the{' '}
            <a
              href="https://github.com/openvinotoolkit/openvino_contrib"
              target="_blank"
              rel="noopener noreferrer"
              className="text-openvino-blue hover:underline"
            >
              OpenVINO Contrib
            </a>{' '}
            project
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
