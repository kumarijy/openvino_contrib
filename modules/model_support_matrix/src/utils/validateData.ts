/**
 * Data validation utilities to ensure model data integrity
 */

import type { Model, ModelCategory, OpenVINOVersion } from '../types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

const VALID_CATEGORIES: ModelCategory[] = [
  'LLM',
  'VLM',
  'Image Generation',
  'Video Generation',
  'Speech Recognition',
  'Speech Generation',
  'Text Embeddings',
  'Text Rerank',
];

/**
 * Validate a single model
 */
export function validateModel(model: Model, allVersions: OpenVINOVersion[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!model.id || model.id.trim() === '') {
    errors.push(`Model missing ID`);
  }

  if (!model.name || model.name.trim() === '') {
    errors.push(`Model ${model.id}: missing name`);
  }

  if (!model.family || model.family.trim() === '') {
    errors.push(`Model ${model.id}: missing family`);
  }

  if (!VALID_CATEGORIES.includes(model.category)) {
    errors.push(`Model ${model.id}: invalid category "${model.category}"`);
  }

  if (!model.variants || model.variants.length === 0) {
    errors.push(`Model ${model.id}: no variants defined`);
  }

  model.variants.forEach((variant, idx) => {
    if (!variant.size || variant.size.trim() === '') {
      errors.push(`Model ${model.id} variant ${idx}: missing size`);
    }

    if (!variant.versionSupport || variant.versionSupport.length === 0) {
      errors.push(`Model ${model.id} variant ${variant.size}: no version support defined`);
    }

    const versionsSeen = new Set<string>();
    variant.versionSupport.forEach((vs) => {
      if (versionsSeen.has(vs.version)) {
        errors.push(
          `Model ${model.id} variant ${variant.size}: duplicate version ${vs.version}`
        );
      }
      versionsSeen.add(vs.version);

      if (!allVersions.includes(vs.version)) {
        warnings.push(
          `Model ${model.id} variant ${variant.size}: unknown version ${vs.version}`
        );
      }

      if (vs.supported && !vs.devices.cpu && !vs.devices.gpu && !vs.devices.npu) {
        warnings.push(
          `Model ${model.id} variant ${variant.size} v${vs.version}: marked supported but no devices enabled`
        );
      }

      if (!vs.supported && (vs.devices.cpu || vs.devices.gpu || vs.devices.npu)) {
        warnings.push(
          `Model ${model.id} variant ${variant.size} v${vs.version}: marked unsupported but has devices enabled`
        );
      }
    });
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate all models in the dataset
 */
export function validateAllModels(
  models: Model[],
  versions: OpenVINOVersion[]
): ValidationResult {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];

  const idsSeen = new Set<string>();

  models.forEach((model) => {
    if (idsSeen.has(model.id)) {
      allErrors.push(`Duplicate model ID: ${model.id}`);
    }
    idsSeen.add(model.id);

    const result = validateModel(model, versions);
    allErrors.push(...result.errors);
    allWarnings.push(...result.warnings);
  });

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
}

/**
 * Get a summary of the validation results
 */
export function getValidationSummary(result: ValidationResult): string {
  const lines: string[] = [];

  if (result.valid) {
    lines.push('✅ All validation checks passed!');
  } else {
    lines.push(`❌ Validation failed with ${result.errors.length} error(s)`);
  }

  if (result.errors.length > 0) {
    lines.push('\nErrors:');
    result.errors.forEach((err) => lines.push(`  - ${err}`));
  }

  if (result.warnings.length > 0) {
    lines.push(`\nWarnings (${result.warnings.length}):`);
    result.warnings.slice(0, 5).forEach((warn) => lines.push(`  - ${warn}`));
    if (result.warnings.length > 5) {
      lines.push(`  ... and ${result.warnings.length - 5} more`);
    }
  }

  return lines.join('\n');
}
