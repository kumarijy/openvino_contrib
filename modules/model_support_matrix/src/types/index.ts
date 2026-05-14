/**
 * Core type definitions for the OpenVINO Model Support Matrix
 */

/**
 * Model categories supported by OpenVINO GenAI
 */
export type ModelCategory =
  | 'LLM'
  | 'VLM'
  | 'Image Generation'
  | 'Video Generation'
  | 'Speech Recognition'
  | 'Speech Generation'
  | 'Text Embeddings'
  | 'Text Rerank';

/**
 * Supported compute devices
 */
export type DeviceType = 'CPU' | 'GPU' | 'NPU';

/**
 * OpenVINO GenAI version string (e.g., "2024.5", "2025.0")
 */
export type OpenVINOVersion = string;

/**
 * Model size variant (e.g., "1B", "7B", "70B", "base", "large")
 */
export type ModelSize = string;

/**
 * Device support information for a model
 */
export interface DeviceSupport {
  cpu: boolean;
  gpu: boolean;
  npu: boolean;
}

/**
 * Version-specific support information
 */
export interface VersionSupport {
  version: OpenVINOVersion;
  supported: boolean;
  devices: DeviceSupport;
  loraSupport: boolean;
  notes?: string;
}

/**
 * Model variant (different sizes or configurations of the same model)
 */
export interface ModelVariant {
  size: ModelSize;
  huggingfaceId?: string;
  versionSupport: VersionSupport[];
}

/**
 * Complete model information
 */
export interface Model {
  id: string;
  name: string;
  family: string;
  category: ModelCategory;
  description?: string;
  variants: ModelVariant[];
  homepage?: string;
  documentation?: string;
  license?: string;
  tags?: string[];
}

/**
 * Filter state for the application
 */
export interface FilterState {
  searchQuery: string;
  selectedVersion: OpenVINOVersion | 'all';
  selectedCategories: ModelCategory[];
  selectedDevices: DeviceType[];
  loraOnly: boolean;
}

/**
 * View mode for displaying models
 */
export type ViewMode = 'table' | 'card';

/**
 * Sort configuration
 */
export interface SortConfig {
  field: 'name' | 'family' | 'category';
  direction: 'asc' | 'desc';
}

/**
 * Application state
 */
export interface AppState {
  models: Model[];
  filters: FilterState;
  viewMode: ViewMode;
  sortConfig: SortConfig;
  selectedModels: string[];
  loading: boolean;
}

/**
 * Statistics for the dashboard
 */
export interface Stats {
  totalModels: number;
  modelsByCategory: Record<ModelCategory, number>;
  latestVersion: OpenVINOVersion;
  deviceCoverage: {
    cpu: number;
    gpu: number;
    npu: number;
  };
}
