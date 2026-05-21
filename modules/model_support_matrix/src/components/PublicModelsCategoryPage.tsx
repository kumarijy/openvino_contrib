/**
 * PublicModelsCategoryPage - Shows specific category models
 */

import React, { useState } from 'react';
import { ArrowLeftIcon, TableCellsIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

interface PublicModelsCategoryPageProps {
  category: string;
  models: Array<{
    name: string;
    description: string;
    link: string;
  }>;
  onNavigateBack: () => void;
}

export const PublicModelsCategoryPage: React.FC<PublicModelsCategoryPageProps> = ({
  category,
  models,
  onNavigateBack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const filteredModels = models.filter(
    (model) =>
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            Back to Public Models
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {category}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {models.length} models in this category
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar and View Toggle */}
        <div className="mb-6 flex gap-4">
          <input
            type="text"
            placeholder="Search models..."
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

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredModels.length}</span> of{' '}
          <span className="font-semibold text-gray-900 dark:text-white">{models.length}</span> models
        </div>

        {/* Models Display */}
        {filteredModels.length > 0 ? (
          viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModels.map((model) => (
                <a
                  key={model.name}
                  href={model.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 p-6 hover:shadow-lg transition-all hover:scale-105"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {model.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {model.description}
                  </p>
                  <span className="text-sm text-openvino-purple dark:text-purple-400 font-medium">
                    View Details →
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Model Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredModels.map((model) => (
                    <tr key={model.name} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {model.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {model.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a
                          href={model.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-openvino-purple dark:text-purple-400 hover:underline"
                        >
                          View Details →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No models found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search query</p>
          </div>
        )}
      </main>
    </div>
  );
};
