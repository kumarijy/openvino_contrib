# OpenVINO GenAI Model Support Matrix Data

## Overview
This file contains the model support data for the **OpenVINO GenAI Model Support Matrix** - the main interactive page that tracks AI model support across OpenVINO releases.

## Data Source
- **Primary Source**: OpenVINO GenAI team internal tracking
- **Description**: Comprehensive tracking of generative AI model support across OpenVINO versions with device compatibility and LoRA support
- **Last Updated**: 2026-06-04

## File: `genai_models.json`

### Structure
```json
{
  "versions": ["2024.0", "2024.1", ...],
  "models": [
    {
      "id": "unique-model-id",
      "name": "Model Name",
      "family": "Model Family",
      "category": "LLM | VLM | Image Generation | ...",
      "description": "Model description",
      "homepage": "https://...",
      "documentation": "https://...",
      "license": "License Name",
      "tags": ["tag1", "tag2"],
      "variants": [
        {
          "size": "7B",
          "huggingfaceId": "org/model-name",
          "versionSupport": [
            {
              "version": "2026.0",
              "supported": true,
              "devices": {
                "cpu": true,
                "gpu": true,
                "npu": false
              },
              "loraSupport": true,
              "notes": "Optional notes"
            }
          ]
        }
      ]
    }
  ]
}
```

## Current Statistics

### Models by Category

#### **LLM (Large Language Models)** - 6 models, 14 variants
1. **Llama 3** (2 variants: 8B, 70B)
   - Family: Meta Llama
   - License: Meta Llama 3 Community License
   - Tags: chat, instruction, open-source

2. **Llama 3.2 Vision** (1 variant: 11B)
   - Family: Meta Llama
   - License: Meta Llama 3.2 Community License
   - Tags: vlm, multimodal, vision-language

3. **Qwen 2.5** (2 variants: 7B, 72B)
   - Family: Qwen
   - License: Apache 2.0
   - Tags: chat, instruction, multilingual

4. **Phi-3** (3 variants: mini-4k, small-8k, medium-14k)
   - Family: Microsoft Phi
   - License: MIT
   - Tags: small, efficient, instruction

5. **Mistral 7B** (2 variants: base, instruct)
   - Family: Mistral
   - License: Apache 2.0
   - Tags: chat, instruction, open-source

6. **Gemma 2** (4 variants: 2B, 9B, 27B, 27B-it)
   - Family: Google Gemma
   - License: Gemma Terms of Use
   - Tags: chat, instruction, google

#### **Multimodal Models** - 1 model, 1 variant
7. **LLaVA-NeXT** (1 variant: 7B)
   - Category: VLM (Vision Language Model)
   - License: Apache 2.0
   - Tags: vlm, multimodal, vision-language

#### **Image Generation** - 2 models, 3 variants
8. **Stable Diffusion XL** (1 variant: base-1.0)
   - License: CreativeML Open RAIL++-M
   - Tags: text-to-image, diffusion, generation

9. **FLUX.1** (2 variants: schnell, dev)
   - License: Apache 2.0 (schnell), Non-commercial (dev)
   - Tags: text-to-image, diffusion, generation

#### **Video Generation** - 1 model, 1 variant
10. **CogVideoX** (1 variant: 5B)
    - License: Apache 2.0
    - Tags: text-to-video, diffusion, generation

#### **Speech Recognition** - 1 model, 4 variants
11. **Whisper** (4 variants: tiny, base, small, large-v3)
    - Family: OpenAI Whisper
    - License: MIT
    - Tags: speech-to-text, asr, multilingual

#### **Speech Generation** - 1 model, 1 variant
12. **Bark** (1 variant: large)
    - License: MIT
    - Tags: text-to-speech, tts, multilingual

#### **Text Embeddings** - 2 models, 2 variants
13. **BGE-M3** (1 variant: base)
    - Family: BGE (BAAI General Embedding)
    - License: MIT
    - Tags: embeddings, retrieval, multilingual

14. **BGE Large** (1 variant: base)
    - Family: BGE
    - License: MIT
    - Tags: embeddings, retrieval, english

#### **Text Rerank** - 1 model, 1 variant
15. **BGE Reranker** (1 variant: large)
    - Family: BGE
    - License: MIT
    - Tags: reranker, retrieval, ranking

### Version Support Timeline
- **2024.0** - Initial GenAI support (6 models)
- **2024.1** - Expanded support (8 models)
- **2024.2** - 9 models
- **2024.3** - 10 models
- **2024.4** - 11 models
- **2024.5** - 12 models
- **2024.6** - 13 models
- **2025.0** - 14 models
- **2025.1** - 14 models
- **2025.2** - 15 models (all current models)
- **2025.3** - 15 models
- **2025.4** - 15 models
- **2026.0** - 15 models + enhanced NPU support
- **2026.1** - 15 models (latest)

### Device Support Evolution
- **CPU**: Supported from the start for all models
- **GPU**: Full support across all models and versions
- **NPU**: Gradual rollout starting 2025.2+
  - 2025.2: Limited NPU support (LLM models)
  - 2025.3+: Expanded NPU support
  - 2026.0+: Broader NPU coverage including some image gen models

### LoRA Support
- Initially limited to LLM models
- Expanded to VLM models in later versions
- Not applicable for non-transformer models (Whisper, embeddings, etc.)

## Usage in Application

The data is loaded in `useModelData.ts`:

```typescript
import { useModelData } from '../hooks/useModelData';

const { models, versions, loading, error } = useModelData();
```

The hook fetches from `/data/genai_models.json` and provides:
- `models`: Array of all model objects
- `versions`: Array of OpenVINO version strings
- `loading`: Boolean loading state
- `error`: Error object if fetch fails

## How to Update

### Adding a New Model

1. **Add to models array**:
```json
{
  "id": "new-model-id",
  "name": "New Model Name",
  "family": "Model Family",
  "category": "LLM",
  "description": "Clear description",
  "homepage": "https://...",
  "documentation": "https://github.com/...",
  "license": "License Name",
  "tags": ["tag1", "tag2"],
  "variants": [...]
}
```

2. **Define variants** with sizes and HuggingFace IDs

3. **Add version support** for each OpenVINO version:
```json
{
  "version": "2026.1",
  "supported": true,
  "devices": {
    "cpu": true,
    "gpu": true,
    "npu": false
  },
  "loraSupport": true,
  "notes": "Optional notes"
}
```

### Adding a New Version

1. **Add to versions array**:
```json
"versions": [
  "2024.0",
  ...,
  "2026.1",
  "2026.2"  // New version
]
```

2. **Update all model variants** with version support for the new version

### Updating Device Support

Edit the `devices` object in the appropriate version's `versionSupport`:
```json
{
  "version": "2026.1",
  "supported": true,
  "devices": {
    "cpu": true,
    "gpu": true,
    "npu": true  // Changed from false to true
  },
  "loraSupport": true
}
```

## Validation

Before committing changes:

1. **Validate JSON syntax**:
```bash
npm run validate
# or manually:
cat src/data/genai_models.json | jq . > /dev/null
```

2. **Check TypeScript types**:
```bash
npm run type-check
```

3. **Test in browser**:
```bash
npm start
```

## Related Files

- **Component**: `src/App.tsx` - Main GenAI matrix page
- **Hook**: `src/hooks/useModelData.ts` - Data loader
- **Types**: `src/types/index.ts` - TypeScript definitions
- **Utilities**: `src/utils/dataHelpers.ts` - Data processing functions

## Model Categories

The following categories are supported:
- `LLM` - Large Language Models
- `VLM` - Vision Language Models
- `Image Generation` - Text-to-image models
- `Video Generation` - Text-to-video models
- `Speech Recognition` - Speech-to-text models
- `Speech Generation` - Text-to-speech models
- `Text Embeddings` - Embedding models for RAG
- `Text Rerank` - Reranking models for retrieval

## Notes

- All HuggingFace IDs should be verified and active
- License information should be accurate and up-to-date
- Version support should reflect actual tested compatibility
- Device support (especially NPU) should be verified with the OpenVINO team
- LoRA support should only be marked true if officially supported and tested
