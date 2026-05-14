/**
 * Custom hook for loading and managing model data
 */

import { useState, useEffect } from 'react';
import type { Model, OpenVINOVersion } from '../types';

interface ModelData {
  versions: OpenVINOVersion[];
  models: Model[];
}

interface UseModelDataReturn {
  models: Model[];
  versions: OpenVINOVersion[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to load model data from JSON file
 */
export function useModelData(): UseModelDataReturn {
  const [models, setModels] = useState<Model[]>([]);
  const [versions, setVersions] = useState<OpenVINOVersion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/data/models.json');

        if (!response.ok) {
          throw new Error(`Failed to load model data: ${response.statusText}`);
        }

        const data: ModelData = await response.json();

        if (mounted) {
          setModels(data.models || []);
          setVersions(data.versions || []);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Unknown error loading data'));
          console.error('Error loading model data:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    models,
    versions,
    loading,
    error,
  };
}
