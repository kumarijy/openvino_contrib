/**
 * Script to validate model data
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { validateAllModels, getValidationSummary } from '../src/utils/validateData.js';
import type { Model, OpenVINOVersion } from '../src/types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ModelData {
  versions: OpenVINOVersion[];
  models: Model[];
}

function main() {
  try {
    const dataPath = join(__dirname, '../src/data/models.json');
    const rawData = readFileSync(dataPath, 'utf-8');
    const data: ModelData = JSON.parse(rawData);

    console.log('Validating model data...\n');
    console.log(`Models: ${data.models.length}`);
    console.log(`Versions: ${data.versions.join(', ')}\n`);

    const result = validateAllModels(data.models, data.versions);
    const summary = getValidationSummary(result);

    console.log(summary);

    if (!result.valid) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Error validating data:', error);
    process.exit(1);
  }
}

main();
