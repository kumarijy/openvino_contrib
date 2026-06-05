# OpenVINO Model Hub Data

## Overview
This file contains the list of AI models featured in the **OpenVINO Model Hub for AI Inference Benchmarks** page.

## Data Source
- **Primary Source**: [Intel OpenVINO Model Hub](https://www.intel.com/content/www/us/en/developer/tools/openvino-toolkit/model-hub.html)
- **Description**: Models verified and optimized for OpenVINO inference across computer vision, NLP, and generative AI tasks
- **Last Updated**: 2026-06-04

## File: `model_hub.json`

### Structure
```json
{
  "metadata": {
    "source": "URL to Intel OpenVINO Model Hub",
    "description": "Brief description",
    "lastUpdated": "YYYY-MM-DD",
    "totalModels": 21
  },
  "models": [
    {
      "name": "Model Name",
      "category": "LLM | Vision | Multimodal | Diffusion"
    }
  ]
}
```

### Model Categories

#### 1. **LLM (Large Language Models)** - 11 models
- BERT-Base-Cased
- DeepSeek-R1-Distill-Llama-8B
- DeepSeek-R1-Distill-Qwen-1.5B
- GPT-0SS-20B
- Llama-2-7B-chat
- Llama3-8B-Chat
- Llama3.2-3B-Instruct
- Mistral-7B-Instruct-v0.3
- Phi-4-Mini-Instruct
- Qwen3-30B-A3B
- Qwen3-8B

#### 2. **Vision Models** - 5 models
- Detectron-v2
- MobileNetV2
- ResNet-50
- SSD-ResNet34-1200
- Ultralytics YOLO11

#### 3. **Multimodal Models** - 4 models
- FLUX-1-schnell
- Gemma3-4B
- MiniCPM-V-2_6
- Qwen2.5-VL-7B-Instruct

#### 4. **Diffusion Models** - 1 model
- StableDiffusion-V1-5

## Statistics
- **Total Models**: 21
- **Categories**: 4
- **LLM Models**: 11 (52.4%)
- **Vision Models**: 5 (23.8%)
- **Multimodal Models**: 4 (19.0%)
- **Diffusion Models**: 1 (4.8%)

## Usage in Application

The data is imported and used in `ModelHubPage.tsx`:

```typescript
import modelHubData from '../data/model_hub.json';
const SUPPORTED_MODELS = modelHubData.models;
```

## How to Update

1. **Add a new model**:
   ```json
   {
     "name": "New-Model-Name",
     "category": "LLM"
   }
   ```

2. **Update metadata**:
   - Increment `totalModels` count
   - Update `lastUpdated` date

3. **Supported categories**:
   - `LLM` - Large Language Models
   - `Vision` - Computer Vision models
   - `Multimodal` - Multi-modal models (vision + language)
   - `Diffusion` - Image generation models

## Features

The Model Hub page provides:
- ✅ **Search**: Filter by model name or category
- ✅ **Category Filter**: Filter by specific category (LLM, Vision, Multimodal, Diffusion)
- ✅ **View Modes**: Cards or Table view
- ✅ **Statistics**: Total models and category distribution
- ✅ **Request Model**: Button to request new model enablement via Jira
- ✅ **Dark Mode**: Full dark mode support

## Related Files
- **Component**: `src/components/ModelHubPage.tsx`
- **Data File**: `src/data/model_hub.json`
- **Type Definition**: `src/types/json.d.ts` (for JSON imports)

## Notes
- All models listed are verified for OpenVINO inference
- Models are optimized for Intel hardware (CPU, GPU, NPU)
- For detailed model information, visit the [Intel OpenVINO Model Hub](https://www.intel.com/content/www/us/en/developer/tools/openvino-toolkit/model-hub.html)
