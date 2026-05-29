# OVVP Data Setup

The `ovvp_models.json` file should contain the OpenVINO Validation Program model data.

## How to populate the data:

1. Save your `intel-openvino_v2.json` file content
2. Copy the entire JSON content
3. Replace the content of `ovvp_models.json` with your JSON data

The JSON structure should be:
```json
{
  "metadata": {
    "tags": [...],
    "version": "2.0",
    ...
  },
  "scope": [
    {
      "topology": "model-name",
      "models": [
        {
          "framework": "TF|ONNX|...",
          "precision": "FP16|FP32|INT8|...",
          "paths": [...]
        }
      ]
    }
  ]
}
```

## Current Status:
- OVVPPage component is ready
- UI components are configured
- Waiting for full OVVP data to be added to `ovvp_models.json`
