/**
 * Utility functions for working with model data
 */

import type {
  Model,
  ModelCategory,
  FilterState,
  OpenVINOVersion,
  Stats,
  VersionSupport,
} from '../types';

/**
 * Filter models based on filter state
 */
export function filterModels(models: Model[], filters: FilterState): Model[] {
  return models.filter((model) => {
    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesName = model.name.toLowerCase().includes(query);
      const matchesFamily = model.family.toLowerCase().includes(query);
      const matchesId = model.id.toLowerCase().includes(query);
      const matchesTags = model.tags?.some((tag) => tag.toLowerCase().includes(query));
      const matchesHfId = model.variants.some((v) =>
        v.huggingfaceId?.toLowerCase().includes(query)
      );

      if (!matchesName && !matchesFamily && !matchesId && !matchesTags && !matchesHfId) {
        return false;
      }
    }

    // Category filter
    if (filters.selectedCategories.length > 0) {
      if (!filters.selectedCategories.includes(model.category)) {
        return false;
      }
    }

    // Version and device filters
    if (filters.selectedVersion !== 'all' || filters.selectedDevices.length > 0) {
      const hasMatchingVariant = model.variants.some((variant) => {
        const versionSupport = getVersionSupport(variant.versionSupport, filters.selectedVersion);

        if (!versionSupport || !versionSupport.supported) {
          return false;
        }

        // Device filter
        if (filters.selectedDevices.length > 0) {
          const hasDevice = filters.selectedDevices.some((device) => {
            const deviceKey = device.toLowerCase() as 'cpu' | 'gpu' | 'npu';
            return versionSupport.devices[deviceKey];
          });
          if (!hasDevice) {
            return false;
          }
        }

        // LoRA filter
        if (filters.loraOnly && !versionSupport.loraSupport) {
          return false;
        }

        return true;
      });

      if (!hasMatchingVariant) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Get version support for a specific version
 */
export function getVersionSupport(
  versionSupport: VersionSupport[],
  version: OpenVINOVersion | 'all'
): VersionSupport | null {
  if (version === 'all') {
    return versionSupport[versionSupport.length - 1] || null;
  }
  return versionSupport.find((vs) => vs.version === version) || null;
}

/**
 * Sort models based on configuration
 */
export function sortModels(
  models: Model[],
  field: 'name' | 'family' | 'category',
  direction: 'asc' | 'desc'
): Model[] {
  const sorted = [...models].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return direction === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return 0;
  });

  return sorted;
}

/**
 * Calculate statistics from model data
 */
export function calculateStats(models: Model[], version: OpenVINOVersion): Stats {
  const modelsByCategory: Record<ModelCategory, number> = {
    'LLM': 0,
    'VLM': 0,
    'Image Generation': 0,
    'Video Generation': 0,
    'Speech Recognition': 0,
    'Speech Generation': 0,
    'Text Embeddings': 0,
    'Text Rerank': 0,
  };

  let cpuCount = 0;
  let gpuCount = 0;
  let npuCount = 0;
  let totalModels = 0;

  models.forEach((model) => {
    const hasSupport = model.variants.some((variant) => {
      const vs = getVersionSupport(variant.versionSupport, version);
      return vs && vs.supported;
    });

    if (hasSupport) {
      totalModels++;
      modelsByCategory[model.category]++;

      model.variants.forEach((variant) => {
        const vs = getVersionSupport(variant.versionSupport, version);
        if (vs && vs.supported) {
          if (vs.devices.cpu) cpuCount++;
          if (vs.devices.gpu) gpuCount++;
          if (vs.devices.npu) npuCount++;
        }
      });
    }
  });

  return {
    totalModels,
    modelsByCategory,
    latestVersion: version,
    deviceCoverage: {
      cpu: cpuCount,
      gpu: gpuCount,
      npu: npuCount,
    },
  };
}

/**
 * Get all unique model categories from the data
 */
export function getCategories(models: Model[]): ModelCategory[] {
  const categories = new Set<ModelCategory>();
  models.forEach((model) => categories.add(model.category));
  return Array.from(categories).sort();
}

/**
 * Get all unique tags from the data
 */
export function getTags(models: Model[]): string[] {
  const tags = new Set<string>();
  models.forEach((model) => {
    model.tags?.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

/**
 * Format device support as a readable string
 */
export function formatDeviceSupport(devices: { cpu: boolean; gpu: boolean; npu: boolean }): string {
  const supported: string[] = [];
  if (devices.cpu) supported.push('CPU');
  if (devices.gpu) supported.push('GPU');
  if (devices.npu) supported.push('NPU');
  return supported.join(', ') || 'None';
}

/**
 * Get model count by category for a specific version
 */
export function getModelCountByCategory(
  models: Model[],
  category: ModelCategory,
  version: OpenVINOVersion | 'all'
): number {
  return models.filter((model) => {
    if (model.category !== category) return false;

    if (version === 'all') return true;

    return model.variants.some((variant) => {
      const vs = getVersionSupport(variant.versionSupport, version);
      return vs && vs.supported;
    });
  }).length;
}

/**
 * Check if a model supports LoRA for a given version
 */
export function hasLoRaSupport(model: Model, version: OpenVINOVersion | 'all'): boolean {
  return model.variants.some((variant) => {
    const vs = getVersionSupport(variant.versionSupport, version);
    return vs && vs.supported && vs.loraSupport;
  });
}

/**
 * Get the earliest version a model was supported
 */
export function getEarliestSupportedVersion(model: Model): OpenVINOVersion | null {
  let earliest: OpenVINOVersion | null = null;

  model.variants.forEach((variant) => {
    variant.versionSupport.forEach((vs) => {
      if (vs.supported && (!earliest || vs.version < earliest)) {
        earliest = vs.version;
      }
    });
  });

  return earliest;
}
