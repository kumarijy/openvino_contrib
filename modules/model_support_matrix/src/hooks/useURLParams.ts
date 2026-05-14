/**
 * Custom hook for managing URL search parameters
 */

import { useEffect } from 'react';
import type { FilterState, ModelCategory, DeviceType, OpenVINOVersion } from '../types';

interface UseURLParamsProps {
  filters: FilterState;
  setSearchQuery: (query: string) => void;
  setSelectedVersion: (version: OpenVINOVersion | 'all') => void;
  toggleCategory: (category: ModelCategory) => void;
  toggleDevice: (device: DeviceType) => void;
  setLoraOnly: (value: boolean) => void;
}

/**
 * Hook to sync filter state with URL parameters
 */
export function useURLParams({
  filters,
  setSearchQuery,
  setSelectedVersion,
  toggleCategory,
  toggleDevice,
  setLoraOnly,
}: UseURLParamsProps): void {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const version = params.get('version');
    if (version) {
      setSelectedVersion(version as OpenVINOVersion);
    }

    const search = params.get('search');
    if (search) {
      setSearchQuery(search);
    }

    const categories = params.get('categories');
    if (categories) {
      const categoryList = categories.split(',') as ModelCategory[];
      categoryList.forEach((cat) => {
        if (!filters.selectedCategories.includes(cat)) {
          toggleCategory(cat);
        }
      });
    }

    const devices = params.get('devices');
    if (devices) {
      const deviceList = devices.split(',') as DeviceType[];
      deviceList.forEach((dev) => {
        if (!filters.selectedDevices.includes(dev)) {
          toggleDevice(dev);
        }
      });
    }

    const lora = params.get('lora');
    if (lora === 'true') {
      setLoraOnly(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.selectedVersion !== 'all') {
      params.set('version', filters.selectedVersion);
    }

    if (filters.searchQuery) {
      params.set('search', filters.searchQuery);
    }

    if (filters.selectedCategories.length > 0) {
      params.set('categories', filters.selectedCategories.join(','));
    }

    if (filters.selectedDevices.length > 0) {
      params.set('devices', filters.selectedDevices.join(','));
    }

    if (filters.loraOnly) {
      params.set('lora', 'true');
    }

    const newURL = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    window.history.replaceState({}, '', newURL);
  }, [filters]);
}
