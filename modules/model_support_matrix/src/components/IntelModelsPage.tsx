/**
 * IntelModelsPage component - Displays Intel models from Open Model Zoo
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { IntelModelsCategoryPage } from './IntelModelsCategoryPage';

interface IntelModelsPageProps {
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

export const IntelModelsPage: React.FC<IntelModelsPageProps> = ({ onNavigateBack }) => {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://raw.githubusercontent.com/openvinotoolkit/open_model_zoo/master/models/intel/index.md'
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

    for (const line of lines) {
      // Match toctree entries: "   model-name <omz_models_model_...>"
      // or "   model-name (composite) <omz_models_model_...>"
      const match = line.match(/^\s+([a-z0-9\-]+(?:\s+\(composite\))?)\s+<([^>]+)>/);
      if (match) {
        const [, name, reference] = match;
        const cleanName = name.replace(/\s+\(composite\)/, '').trim();

        // Categorize based on model name patterns - order matters!
        let category = 'Other Models';

        // Face-related models
        if (cleanName.includes('face-detection')) {
          category = 'Face Detection Models';
        } else if (cleanName.includes('face') && (cleanName.includes('recognition') || cleanName.includes('reidentification'))) {
          category = 'Face Recognition Models';
        } else if (cleanName.includes('facial-landmarks') || (cleanName.includes('landmarks') && !cleanName.includes('detection'))) {
          category = 'Face Recognition Models';
        } else if (cleanName.includes('head-pose') || cleanName.includes('gaze')) {
          category = 'Gaze Estimation Models';
        } else if (cleanName.includes('age') || cleanName.includes('gender') || cleanName.includes('emotion')) {
          category = 'Face Recognition Models';
        }
        // Person-related models
        else if (cleanName.includes('person-detection') || cleanName.includes('pedestrian-detection')) {
          category = 'Person Detection Models';
        } else if (cleanName.includes('person-reidentification')) {
          category = 'Person Re-Identification Models';
        } else if (cleanName.includes('person-attributes')) {
          category = 'Attribute Recognition Models';
        } else if (cleanName.includes('human-pose')) {
          category = 'Human Pose Estimation Models';
        }
        // Text-related models
        else if (cleanName.includes('text-detection') || cleanName.includes('horizontal-text')) {
          category = 'Text Detection Models';
        } else if (cleanName.includes('handwritten') || cleanName.includes('formula') || cleanName.includes('score')) {
          category = 'Handwriting Recognition Models';
        } else if (cleanName.includes('license-plate')) {
          category = 'License Plate Recognition Models';
        }
        // Object detection - vehicles, products, general objects
        else if (cleanName.includes('vehicle-detection') || cleanName.includes('person-vehicle-bike') ||
                 cleanName.includes('product-detection') || cleanName.includes('smartlab-object-detection') ||
                 cleanName.includes('weld-porosity') || cleanName.includes('yolo')) {
          category = 'Object Detection Models';
        } else if (cleanName.includes('pedestrian-and-vehicle')) {
          category = 'Object Detection Models';
        }
        // Segmentation
        else if (cleanName.includes('instance-segmentation')) {
          category = 'Instance Segmentation Models';
        } else if (cleanName.includes('semantic-segmentation') || cleanName.includes('road-segmentation') || cleanName.includes('icnet')) {
          category = 'Semantic Segmentation Models';
        }
        // Action and Sign Language
        else if (cleanName.includes('action-recognition') || cleanName.includes('driver-action')) {
          category = 'Action Recognition Models';
        } else if (cleanName.includes('sign-language') || cleanName.includes('asl-recognition') || cleanName.includes('common-sign')) {
          category = 'Sign Language Recognition Models';
        }
        // NLP and Translation
        else if (cleanName.includes('bert')) {
          category = 'NLP Models';
        } else if (cleanName.includes('translation')) {
          category = 'Machine Translation Models';
        }
        // Audio
        else if (cleanName.includes('noise-suppression')) {
          category = 'Sound Processing Models';
        }
        // Other specialized
        else if (cleanName.includes('retrieval')) {
          category = 'Image Retrieval Models';
        } else if (cleanName.includes('faster-rcnn') || cleanName.includes('resnet') && cleanName.includes('binary')) {
          category = 'Classification Models';
        }

        models.push({
          name: cleanName,
          description: `Intel optimized model for ${cleanName.replace(/-/g, ' ')}`,
          link: `https://github.com/openvinotoolkit/open_model_zoo/tree/master/models/intel/${cleanName}`,
          category: category,
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
      <IntelModelsCategoryPage
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
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading Intel Models...</p>
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
            Intel Models
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {models.length} models optimized by Intel for OpenVINO
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
