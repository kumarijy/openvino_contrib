/**
 * Custom hook for managing filter state
 */

import { useState, useCallback, useMemo } from 'react';
import type { FilterState, ModelCategory, DeviceType, OpenVINOVersion } from '../types';

interface UseFiltersReturn {
  filters: FilterState;
  setSearchQuery: (query: string) => void;
  setSelectedVersion: (version: OpenVINOVersion | 'all') => void;
  toggleCategory: (category: ModelCategory) => void;
  setCategories: (categories: ModelCategory[]) => void;
  toggleDevice: (device: DeviceType) => void;
  setLoraOnly: (value: boolean) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const defaultFilters: FilterState = {
  searchQuery: '',
  selectedVersion: 'all',
  selectedCategories: [],
  selectedDevices: [],
  loraOnly: false,
};

/**
 * Hook to manage filter state and operations
 */
export function useFilters(initialVersion?: OpenVINOVersion): UseFiltersReturn {
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    selectedVersion: initialVersion || 'all',
  });

  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const setSelectedVersion = useCallback((version: OpenVINOVersion | 'all') => {
    setFilters((prev) => ({ ...prev, selectedVersion: version }));
  }, []);

  const toggleCategory = useCallback((category: ModelCategory) => {
    setFilters((prev) => {
      const categories = prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter((c) => c !== category)
        : [...prev.selectedCategories, category];
      return { ...prev, selectedCategories: categories };
    });
  }, []);

  const setCategories = useCallback((categories: ModelCategory[]) => {
    setFilters((prev) => ({ ...prev, selectedCategories: categories }));
  }, []);

  const toggleDevice = useCallback((device: DeviceType) => {
    setFilters((prev) => {
      const devices = prev.selectedDevices.includes(device)
        ? prev.selectedDevices.filter((d) => d !== device)
        : [...prev.selectedDevices, device];
      return { ...prev, selectedDevices: devices };
    });
  }, []);

  const setLoraOnly = useCallback((value: boolean) => {
    setFilters((prev) => ({ ...prev, loraOnly: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      ...defaultFilters,
      selectedVersion: filters.selectedVersion,
    });
  }, [filters.selectedVersion]);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.searchQuery !== '' ||
      filters.selectedCategories.length > 0 ||
      filters.selectedDevices.length > 0 ||
      filters.loraOnly
    );
  }, [filters]);

  return {
    filters,
    setSearchQuery,
    setSelectedVersion,
    toggleCategory,
    setCategories,
    toggleDevice,
    setLoraOnly,
    clearFilters,
    hasActiveFilters,
  };
}
