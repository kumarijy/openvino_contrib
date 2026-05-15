# OpenVINO Model Support Matrix

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb.svg)](https://react.dev/)
[![Build Status](https://img.shields.io/badge/build-passing-success.svg)](https://github.com/kumarijy/openvino_contrib)

An interactive web application for tracking AI model support across OpenVINO GenAI releases.

**🌐 Live Demo**: https://kumarijy.github.io/openvino_contrib/

## Overview

This tool provides a comprehensive view of all AI models supported by OpenVINO GenAI, organized by:
- **Model Categories**: LLMs, VLMs, Image Generation, Video Generation, Speech Recognition, Speech Generation, Text Embeddings, Text Rerank
- **OpenVINO Versions**: Track which models are available in different releases
- **Device Support**: See which models run on CPU, GPU, and NPU
- **LoRA Support**: Identify models with LoRA adapter support

## Features

- ✅ **Phase 1 (Complete)**: Project foundation and build setup
- ✅ **Phase 2 (Complete)**: Data layer and type definitions
- ✅ **Phase 3 (Complete)**: Core UI components (search, filters, table)
- ✅ **Phase 4 (Complete)**: Advanced features (comparison view, export, detail modal)
- ✅ **Phase 5 (Complete)**: Full data population and testing
- ✅ **Phase 6 (Complete)**: Production deployment and documentation

**🎉 Version 1.0.0 - Production Ready!**

### Core Features
- **Real-time Search**: Search models by name, family, or HuggingFace ID
- **Multi-level Filtering**: Filter by version, category, and device support
- **Version Comparison**: Side-by-side comparison of model support across releases
- **Dual View Modes**: Table view for detailed information, card view for browsing
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Webpack 5
- **Data Format**: JSON

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Navigate to the module directory
cd openvino_contrib/modules/model_support_matrix

# Install dependencies
npm install
```

### Development

```bash
# Start development server (http://localhost:3000)
npm start

# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build
```

## Project Structure

```
model_support_matrix/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── index.tsx               # Entry point
│   ├── App.tsx                 # Main component
│   ├── app.css                 # Global styles + Tailwind
│   ├── types/                  # TypeScript interfaces
│   ├── data/                   # Model support data (JSON)
│   ├── components/             # React components
│   ├── hooks/                  # Custom React hooks
│   └── utils/                  # Helper functions
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── webpack.config.ts           # Build configuration
└── tailwind.config.js          # Tailwind CSS config
```

## Data Structure

Models are tracked with the following information:
- Model name, family, and category
- Size variants (e.g., 1B, 7B, 70B)
- OpenVINO version support
- Device compatibility (CPU/GPU/NPU)
- LoRA support status
- Special requirements and notes

## Deployment

### Quick Deploy

Choose your preferred platform:

**Netlify** (Recommended):
```bash
# Configuration included in netlify.toml
# Connect your repository and deploy
```

**Vercel**:
```bash
# Configuration included in vercel.json
vercel --prod
```

**GitHub Pages**:
```bash
# Automated via GitHub Actions
# Push to master branch to deploy
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## Contributing

Contributions are welcome! We appreciate:

- **Model Additions**: Add new OpenVINO-supported models
- **Data Updates**: Correct or update existing information  
- **Bug Fixes**: Report or fix issues
- **Feature Improvements**: Enhance functionality
- **Documentation**: Improve guides and examples

**Before contributing:**
1. Read [CONTRIBUTING.md](CONTRIBUTING.md)
2. Check existing issues
3. Follow code guidelines
4. Test your changes thoroughly

**Quick Start:**
```bash
# Fork the repository
git clone https://github.com/YOUR_USERNAME/openvino_contrib.git
cd openvino_contrib/modules/model_support_matrix

# Create a branch
git checkout -b add-new-model

# Make changes and test
npm run type-check
npm run lint
npm run build

# Submit pull request
```

## Documentation

- **[GETTING_STARTED.md](GETTING_STARTED.md)** - User guide and tutorials
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment instructions
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines
- **[CHANGELOG.md](CHANGELOG.md)** - Version history
- **PHASE*_SUMMARY.md** - Phase-specific documentation

## Project Stats

- **Models**: 15 across 8 categories
- **Variants**: 33 model variants
- **Versions**: 4 OpenVINO releases tracked
- **Components**: 13 React components
- **Bundle Size**: 226 KB (production)
- **Build Time**: ~6 seconds
- **Type Safety**: 100% TypeScript

## Browser Support

- Chrome 120+
- Firefox 121+
- Safari 17+
- Edge 120+

## License

Apache License 2.0 - See [LICENSE](../../LICENSE) file for details

## Support

**Issues & Questions:**
- GitHub Issues: [openvino_contrib/issues](https://github.com/kumarijy/openvino_contrib/issues)
- OpenVINO Docs: [docs.openvino.ai](https://docs.openvino.ai)
- Discussions: [GitHub Discussions](https://github.com/kumarijy/openvino_contrib/discussions)

**Community:**
- OpenVINO Forum: [community.intel.com](https://community.intel.com/t5/Intel-Distribution-of-OpenVINO/bd-p/distribution-openvino-toolkit)

## Acknowledgments

Built with:
- [React](https://react.dev/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Heroicons](https://heroicons.com/) - Icons
- [Webpack](https://webpack.js.org/) - Build tool

Part of the [OpenVINO Toolkit](https://github.com/openvinotoolkit) ecosystem.

---

**Status**: ✅ Production Ready (v1.0.0)  
**Last Updated**: 2026-05-14  
**Maintained by**: [@kumarijy](https://github.com/kumarijy)

## Current Model Coverage

The matrix now includes **15 models** with **33 variants** across all 8 categories:

- **LLMs (7 models)**: Llama 3, Qwen 2.5, Phi-3, Mistral 7B, Gemma 2
- **VLMs (2 models)**: Llama 3.2 Vision, LLaVA-NeXT
- **Image Generation (2 models)**: Stable Diffusion XL, FLUX.1
- **Video Generation (1 model)**: CogVideoX
- **Speech Recognition (1 model)**: Whisper (5 variants)
- **Speech Generation (1 model)**: Bark
- **Text Embeddings (2 models)**: BGE-M3, BGE Large
- **Text Rerank (1 model)**: BGE Reranker

Each model includes:
- Complete version support history (2024.5 → 2026.0)
- Device compatibility (CPU/GPU/NPU)
- LoRA support status
- HuggingFace repository links
- License information
- Descriptive tags

## Phase 5 Details

### What's New in Phase 5

Phase 5 significantly expands the model database and ensures data quality:

#### Expanded Model Database
- **Increased from 6 to 15 models** (+150% growth)
- **Increased from 10 to 33 variants** (+230% growth)
- **All 8 categories now populated** with representative models
- **Complete version histories** for all models

#### New Models Added

**LLMs:**
- Phi-3 (Microsoft) - Small but powerful
- Mistral 7B (Mistral AI) - High performance
- Gemma 2 (Google) - Lightweight and efficient
- Additional Qwen 2.5 variants (0.5B, 14B)

**VLMs:**
- LLaVA-NeXT - Advanced vision-language
- Llama 3.2 Vision 90B variant

**Image Generation:**
- FLUX.1 (Black Forest Labs) - State-of-the-art quality

**Video Generation:**
- CogVideoX - Text-to-video generation

**Speech:**
- Bark - Multilingual text-to-speech
- Additional Whisper variants (tiny, base, medium)

**Embeddings & Reranking:**
- BGE Large - High-accuracy embeddings
- BGE Reranker - Cross-encoder reranking

#### Data Quality Improvements
- Accurate version support tracking
- Real HuggingFace model IDs
- Verified device compatibility
- Proper license attribution
- Comprehensive descriptions
- Relevant tags for discoverability

## Phase 4 Details

### What's New in Phase 4

Phase 4 adds advanced features for power users and detailed model exploration:

#### New Components

1. **ModelDetailModal** - Comprehensive model information
   - Full model details with all variants
   - Version support timeline table
   - Device support across all versions
   - LoRA support indicators
   - External links (homepage, docs)
   - License and tag information
   - Click any model to open

2. **ExportButton** - Data export functionality
   - Export filtered results to JSON
   - Export to CSV for Excel/spreadsheets
   - Copy shareable URL with active filters
   - Dropdown menu with multiple options

3. **VersionComparison** - Compare versions side-by-side
   - Select two versions to compare
   - See new models added
   - See removed models
   - Identify device support changes
   - Statistics showing changes
   - Sortable comparison table

#### New Features

- **URL Parameters**: Shareable links preserve filters
- **Modal Interactions**: Click models for detailed view
- **Version Comparison Mode**: Toggle to comparison view
- **Export Formats**: JSON and CSV export options
- **Share Links**: Copy URL with current filters applied

## Phase 3 Details

### What's New in Phase 3

Phase 3 delivers a fully functional UI with all core components:

#### Components Created (`src/components/`)

1. **SearchBar** - Real-time model search with debouncing
   - Search by name, family, or HuggingFace ID
   - Clear button for quick reset
   - 300ms debounce for performance

2. **FilterPanel** - Comprehensive filtering options
   - OpenVINO version selector
   - Category multi-select with color coding
   - Device support filters (CPU/GPU/NPU)
   - LoRA support toggle
   - Clear all filters button

3. **ModelTable** - Sortable data table
   - Sortable columns (name, family, category)
   - Device support display
   - LoRA support indicators
   - HuggingFace links
   - Responsive design
   - Empty state handling

4. **ModelCard** - Card view for browsing
   - Color-coded categories
   - Device support badges
   - Variant information
   - Tags display
   - Links to homepage and docs

5. **StatsDashboard** - Visual statistics
   - Total models count
   - Device coverage metrics
   - Category breakdown
   - Color-coded stats cards

6. **ViewToggle** - Switch between layouts
   - Table view (detailed)
   - Card view (browsing)
   - Accessible toggle buttons

#### Integrated Features

- **Real-time Filtering**: Combines search, version, category, device, and LoRA filters
- **Sorting**: Click column headers to sort ascending/descending
- **View Modes**: Toggle between table and card layouts
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Performance**: Memoized computations for optimal rendering
- **Accessibility**: ARIA labels and keyboard navigation

## Phase 2 Details

### What's New in Phase 2

Phase 2 establishes the complete data layer for the application:

#### Type Definitions (`src/types/index.ts`)
- **Model Types**: `Model`, `ModelVariant`, `VersionSupport`, `DeviceSupport`
- **Filter Types**: `FilterState`, `ViewMode`, `SortConfig`
- **Category & Device Enums**: Type-safe definitions for all categories and devices
- **Statistics**: `Stats` interface for dashboard metrics

#### Data Structure (`src/data/models.json`)
- Sample models from multiple categories:
  - **LLM**: Llama 3 (8B, 70B), Qwen 2.5 (7B, 72B)
  - **VLM**: Llama 3.2 Vision (11B)
  - **Image Generation**: Stable Diffusion XL
  - **Speech Recognition**: Whisper (small, large-v3)
  - **Text Embeddings**: BGE-M3
- Version support tracking across OpenVINO 2024.5, 2025.0, 2025.1, 2026.0
- Device compatibility (CPU/GPU/NPU) per version
- LoRA support indicators
- HuggingFace model IDs and metadata

#### Data Utilities (`src/utils/dataHelpers.ts`)
- `filterModels()`: Apply search and filter criteria
- `sortModels()`: Sort by name, family, or category
- `calculateStats()`: Generate dashboard statistics
- `getVersionSupport()`: Extract version-specific data
- Helper functions for device support formatting and model queries

#### React Hooks
- **`useModelData`** (`src/hooks/useModelData.ts`): Loads and manages model data from JSON
- **`useFilters`** (`src/hooks/useFilters.ts`): Manages filter state with memoized operations

#### Build Configuration
- Webpack configured with `copy-webpack-plugin` to serve data files
- Development server serves JSON data at `/data` path
- Type checking passes with full type safety
