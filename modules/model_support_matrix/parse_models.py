import json
import re

def parse_line(line):
    """Parse a single line of model data"""
    # Skip header lines and empty lines
    if not line.strip() or line.strip().startswith('Category') or line.strip().startswith('Topology'):
        return None
    
    parts = line.strip().split()
    if len(parts) < 5:
        return None
    
    # Extract device support from end of line (last 3 positions should be CPU, GPU, NPU)
    cpu = '+' in parts[-3] if len(parts) >= 3 else False
    gpu = '+' in parts[-2] if len(parts) >= 2 else False
    npu = '+' in parts[-1] if len(parts) >= 1 else False
    
    # Remove the last 3 elements (CPU, GPU, NPU indicators)
    remaining = parts[:-3]
    
    if len(remaining) < 4:
        return None
    
    # Try to find "OpenVINO", "torch.compile", or "Optimum" as the inference engine marker
    inference_idx = -1
    for i, part in enumerate(remaining):
        if 'OpenVINO' in part or 'torch.compile' in part or 'Optimum' in part:
            inference_idx = i
            break
    
    if inference_idx == -1:
        return None
    
    # Precision is just before the inference marker
    precision = remaining[inference_idx - 1] if inference_idx > 0 else 'FP32'
    
    # Framework is before precision
    framework = remaining[inference_idx - 2] if inference_idx > 1 else 'onnx'
    
    # Model name (topology) is before framework
    topology_end = inference_idx - 2
    if topology_end < 1:
        return None
    
    # Category and topology - need to figure out where category ends and topology begins
    # This is tricky because both can be multi-word
    # Strategy: Common categories are known, so we can match them
    
    categories = [
        'Action Recognition', 'Audio', 'Audio Classification', 'Audio Enhancement',
        'Background Matting', 'Behavior / Decision Prediction', 'ClickThrough Rate (CTR) Prediction',
        'Colorization', 'DNA Classification', 'Image Classification', 'Image Generation',
        'Image Processing', 'Image Processing, Enhancement', 'Image Segmentation',
        'Image Text to Text', 'Image to Image', 'Image to Text', 'Instance Segmentation',
        'Large Language Model', 'Monodepth', 'Movement Prediction', 'Multimodal Large Language Model',
        'Natural Language Processing', 'Object Detection', 'Ocean Simulator', 'Panoptic Segmentation',
        'Particle Interaction', 'Recommender', 'Semantic Segmentation', 'Sound Classification',
        'Spatial Transformer Network', 'Speech Recognition', 'Text Detection', 'Text Recognition',
        'Text to Speech', 'Time Series Forecasting', 'URL Classification', 'Video Classification',
        'Video Processing', 'Image Classification, Dual Path Network'
    ]
    
    # Try to match category
    category = None
    topology_start = 0
    
    for cat in sorted(categories, key=len, reverse=True):
        cat_parts = cat.split()
        if len(cat_parts) <= len(remaining[:topology_end]):
            match = True
            for i, cp in enumerate(cat_parts):
                if i >= len(remaining) or remaining[i] != cp:
                    match = False
                    break
            if match:
                category = cat
                topology_start = len(cat_parts)
                break
    
    if not category:
        # Default: assume first word is category
        category = remaining[0]
        topology_start = 1
    
    # Topology is everything between category end and framework start
    topology = ' '.join(remaining[topology_start:topology_end])
    
    if not topology:
        return None
    
    return {
        'name': topology,
        'category': category,
        'framework': framework,
        'precision': precision,
        'cpu': cpu,
        'gpu': gpu,
        'npu': npu
    }

# Read the file
with open('/mnt/c/Users/kumarijy/Downloads/modelhub.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

models = []
for line in lines:
    model = parse_line(line)
    if model:
        models.append(model)

print(f"Parsed {len(models)} models")
print(json.dumps(models[:5], indent=2))

# Write to file
with open('verified_models.json', 'w', encoding='utf-8') as f:
    json.dumps(models, f, indent=2)
    
print(f"\nWrote {len(models)} models to verified_models.json")
