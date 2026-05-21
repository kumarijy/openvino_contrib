/**
 * PublicModelsPage component - Displays Public models from Open Model Zoo
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { PublicModelsCategoryPage } from './PublicModelsCategoryPage';

interface PublicModelsPageProps {
  onNavigateBack: () => void;
}

interface ModelInfo {
  name: string;
  description: string;
  link: string;
  category: string;
}

interface CategorizedModels {
  [category: string]: ModelInfo[];
}

export const PublicModelsPage: React.FC<PublicModelsPageProps> = ({ onNavigateBack }) => {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://raw.githubusercontent.com/openvinotoolkit/open_model_zoo/master/models/public/index.md'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch model data');
        }

        const text = await response.text();
        const parsedModels = parseMarkdownIndex(text);
        setModels(parsedModels);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load models');
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  const parseMarkdownIndex = (markdown: string): ModelInfo[] => {
    const models: ModelInfo[] = [];
    const lines = markdown.split('\n');
    let currentCategory = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Match category headers: ## Category Name Models
      const categoryMatch = line.match(/^##\s+(.+Models?)$/);
      if (categoryMatch) {
        currentCategory = categoryMatch[1].trim();
        // Normalize category names
        if (currentCategory.includes('Classification')) currentCategory = 'Classification Models';
        else if (currentCategory.includes('Segmentation') && !currentCategory.includes('Instance') && !currentCategory.includes('3D')) currentCategory = 'Semantic Segmentation Models';
        else if (currentCategory.includes('Instance Segmentation')) currentCategory = 'Instance Segmentation Models';
        else if (currentCategory.includes('3D Semantic Segmentation')) currentCategory = '3D Segmentation Models';
        else if (currentCategory.includes('Object Detection')) currentCategory = 'Object Detection Models';
        else if (currentCategory.includes('Face Detection')) currentCategory = 'Face Detection Models';
        else if (currentCategory.includes('Human Pose')) currentCategory = 'Human Pose Estimation Models';
        else if (currentCategory.includes('Monocular Depth')) currentCategory = 'Monocular Depth Estimation Models';
        else if (currentCategory.includes('Image Inpainting')) currentCategory = 'Image Inpainting Models';
        else if (currentCategory.includes('Style Transfer')) currentCategory = 'Style Transfer Models';
        else if (currentCategory.includes('Action Recognition')) currentCategory = 'Action Recognition Models';
        else if (currentCategory.includes('Colorization')) currentCategory = 'Colorization Models';
        else if (currentCategory.includes('Sound Classification')) currentCategory = 'Sound Classification Models';
        else if (currentCategory.includes('Speech Recognition')) currentCategory = 'Speech Recognition Models';
        else if (currentCategory.includes('Speech Synthesis') || currentCategory.includes('Text to Speech')) currentCategory = 'Speech Synthesis Models';
        else if (currentCategory.includes('Machine Translation')) currentCategory = 'Machine Translation Models';
        else if (currentCategory.includes('Question Answering')) currentCategory = 'Question Answering Models';
        else if (currentCategory.includes('Text Recognition')) currentCategory = 'Text Recognition Models';
        else if (currentCategory.includes('Image Translation')) currentCategory = 'Image Translation Models';
        else if (currentCategory.includes('Optical Character Recognition')) currentCategory = 'Text Recognition Models';
        else if (currentCategory.includes('Place Recognition')) currentCategory = 'Place Recognition Models';
        else if (currentCategory.includes('Image Processing')) currentCategory = 'Image Processing Models';
        else if (currentCategory.includes('Image Retrieval')) currentCategory = 'Image Retrieval Models';
        continue;
      }

      // Match table rows with model links: | Model Name | ... | [model-name](./model-name/README.md) | ...
      const tableMatch = line.match(/\|\s+([^|]+)\s+\|[^|]+\|\s+\[([^\]]+)\]\(\.\/([^\/]+)\/README\.md\)/);
      if (tableMatch && currentCategory) {
        const [, modelName, linkText, folderName] = tableMatch;

        models.push({
          name: folderName.trim(),
          description: `${modelName.trim()} - ${currentCategory}`,
          link: `https://github.com/openvinotoolkit/open_model_zoo/tree/master/models/public/${folderName.trim()}`,
          category: currentCategory,
        });
      }
    }

    return models;
  };

  const categorizeModels = (models: ModelInfo[]): CategorizedModels => {
    const categorized: CategorizedModels = {};

    models.forEach((model) => {
      if (!categorized[model.category]) {
        categorized[model.category] = [];
      }
      categorized[model.category].push(model);
    });

    return categorized;
  };

  const categorizedModels = categorizeModels(models);
  const categories = Object.keys(categorizedModels).sort();

  // If a category is selected, show the category page
  if (selectedCategory && categorizedModels[selectedCategory]) {
    return (
      <PublicModelsCategoryPage
        category={selectedCategory}
        models={categorizedModels[selectedCategory]}
        onNavigateBack={() => setSelectedCategory(null)}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-openvino-purple mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading Public Models...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Models</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
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
            Back to Open Model Zoo
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Public Models
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {models.length} community models optimized for OpenVINO
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 p-8 hover:shadow-xl transition-all hover:scale-105 text-left"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {category}
              </h3>
              <p className="text-3xl font-bold text-openvino-purple dark:text-purple-400 mb-2">
                {categorizedModels[category].length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {categorizedModels[category].length === 1 ? 'model' : 'models'}
              </p>
              <span className="text-sm text-openvino-purple dark:text-purple-400 font-medium">
                Explore →
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};
