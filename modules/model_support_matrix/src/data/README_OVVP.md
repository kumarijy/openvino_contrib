# OVVP Data Files

This directory contains three OVVP (OpenVINO Validation Program) data files that power the OVVP page with comprehensive model topology information.

## Files

### 1. `ovvp_models.json` (Intel-OV models)
Contains Intel OpenVINO validated model topologies.

**Stats:**
- **Model Topologies:** 291
- **Total Variants:** 738
- **Average Variants per Topology:** ~2.5

**Source:** Intel OVVP validation program
**Framework Support:** TF, TF2, ONNX
**Precision Support:** FP16, FP32, INT8, INT1

### 2. `public-openvino.json` (Public-OV models)
Contains publicly available OpenVINO model topologies.

**Stats:**
- **Model Topologies:** 421
- **Total Variants:** 1,254
- **Average Variants per Topology:** ~3.0

**Source:** Public OpenVINO model repository
**Framework Support:** TF, TF2, ONNX, PyTorch
**Precision Support:** FP16, FP32, INT8, INT4, INT1

### 3. `llm-ov-optimum.json` (LLM-OV models)
Contains Large Language Model topologies optimized for OpenVINO.

**Stats:**
- **Model Topologies:** 173
- **Total Variants:** 722
- **Average Variants per Topology:** ~4.2

**Source:** OpenVINO LLM optimum validation scope
**Framework Support:** PyTorch (PT)
**Precision Support:** FP16, INT8-CW, INT4-MIXED, FP4-NORMALIZED, FP8-STATIC

**Model Categories:**
- LLM text models (llama, qwen, phi, mistral, gemma, etc.)
- Vision-Language models (VLM)
- Image generation models (stable-diffusion, flux, lcm)
- Video generation models
- Speech recognition (whisper)
- Text embeddings and reranking

## Combined Statistics

| Definition | Model Topologies | Total Variants |
|------------|-----------------|----------------|
| **Intel-OV models** | 291 | 738 |
| **Public-OV models** | 421 | 1,254 |
| **LLM-OV models** | 173 | 722 |
| **TOTAL** | **885** | **2,714** |

## JSON Structure

All three files follow the same structure:

```json
{
  "metadata": {
    "tags": ["tag1", "tag2"],
    "version": "2.0",
    "default-framework": "PT|TF|ONNX",
    "default-source": "source-name",
    "info": "Description"
  },
  "scope": [
    {
      "topology": "model-name",
      "tags": ["tag1", "tag2"],
      "tasks": ["task-type"],
      "models": [
        {
          "config": "FP16|INT8|etc",
          "precision": "FP16|INT8|INT4-MIXED|etc",
          "paths": ["path/to/model"],
          "tags": ["optional-tags"]
        }
      ]
    }
  ]
}
```

## Variant Explanation

**What is a Variant?**
Each model topology can have multiple variants representing different combinations of:
- **Framework:** TensorFlow, ONNX, PyTorch
- **Precision:** FP16, FP32, INT8, INT4, INT1
- **Configuration:** Quantization settings, optimization levels

**Example:**
- `llama-3-8b-instruct` has **10 variants**:
  - FP16
  - INT8-CW
  - INT4-MIXED (multiple configs)
  - FP4-NORMALIZED
  - FP8-STATIC

**Why Variants Matter:**
- More variants = More deployment flexibility
- Different precisions offer trade-offs (FP32 = accuracy, INT8 = speed, INT4 = memory efficiency)
- Framework choice depends on your platform and tools

## Usage in OVVP Page

The OVVP page component (`OVVPPage.tsx`) merges all three files and provides:

1. **Definition Filter:** Switch between Intel-OV, Public-OV, and LLM-OV models
2. **Framework Filter:** Filter by TF, TF2, ONNX, PyTorch
3. **Precision Filter:** Filter by FP16, FP32, INT8, INT4, INT1
4. **Search:** Find models by topology name
5. **Dynamic Stats:** Header shows topology count and variant count based on active filters

## Data Updates

### Intel-OV models (`ovvp_models.json`)
**Source:** https://github.com/kumarijy/openvino_contrib/tree/master/modules/model_support_matrix/src/data
**Update Frequency:** Periodic validation cycles

### Public-OV models (`public-openvino.json`)
**Source:** Public OpenVINO model repository
**Update Frequency:** As new models are added to public repository

### LLM-OV models (`llm-ov-optimum.json`)
**Source:** OpenVINO LLM validation scope
**Update Frequency:** Weekly validation cycles
**Tags Include:**
- `llm-weekly-optimum` - P1 weekly validation
- `llm-rest-optimum` - P2 validation scope
- `llm-hf-optimum` - HuggingFace publication
- `vllm-optimum` - vLLM validated
- `llm-nightly` - Nightly validation
- `npu` - NPU device support
- `acc-enabled` - Accuracy validation enabled

## Development

To add or update models:

1. **Edit the appropriate JSON file** (`ovvp_models.json`, `public-openvino.json`, or `llm-ov-optimum.json`)
2. **Follow the JSON structure** shown above
3. **Validate JSON syntax** (use a JSON validator)
4. **Test locally** with `npm start`
5. **Verify stats** in the OVVP page header
6. **Commit changes** to the repository

## File Sizes

- `ovvp_models.json`: ~131 KB
- `public-openvino.json`: ~234 KB
- `llm-ov-optimum.json`: ~198 KB
- **Total:** ~563 KB

## Current Status

✅ **Complete** - All three data files are populated and integrated
- Intel-OV models: 291 topologies, 738 variants
- Public-OV models: 421 topologies, 1,254 variants
- LLM-OV models: 173 topologies, 722 variants
- Definition filter working correctly
- Framework and precision filters operational
- Dynamic stats updating based on filters
- Search functionality working across all models

## Last Updated

**Date:** 2026-06-01
**Version:** 2.0
**Total Models:** 885 topologies, 2,714 variants
