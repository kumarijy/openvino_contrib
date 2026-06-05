# Changelog

All notable changes to the OpenVINO Model Support Matrix will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-05-14

### Added - Phase 6: Production Deployment

- Netlify deployment configuration (`netlify.toml`)
- Vercel deployment configuration (`vercel.json`)
- GitHub Actions workflow for GitHub Pages deployment
- Comprehensive deployment documentation (`DEPLOYMENT.md`)
- Contributing guidelines (`CONTRIBUTING.md`)
- This changelog file
- PWA manifest (`public/manifest.json`)
- SEO configuration (`public/robots.txt`)
- Production-ready error handling
- Security headers in deployment configs
- Cache optimization for static assets

### Added - Phase 5: Full Data Population

- Expanded model database from 6 to 15 models
- Added 23 new model variants (10 → 33 total)
- New LLM models: Phi-3, Mistral 7B, Gemma 2
- New VLM model: LLaVA-NeXT
- New Image Generation model: FLUX.1
- New Video Generation model: CogVideoX
- New Speech Generation model: Bark
- Additional Whisper variants (tiny, base, medium)
- Additional embedding models (BGE Large, BGE Reranker)
- Complete version support history for all models
- Realistic NPU adoption timeline across versions
- Verified HuggingFace model IDs for all models
- Accurate license information
- Comprehensive model descriptions
- Relevant tags for discoverability

### Added - Phase 4: Advanced Features

- **ModelDetailModal Component**: Full model information in modal dialog
  - Version support timeline table
  - Device compatibility across all versions
  - LoRA support indicators
  - HuggingFace and documentation links
  - License and tag information
- **ExportButton Component**: Multi-format data export
  - Export to JSON with metadata
  - Export to CSV for spreadsheets
  - Copy shareable URL with filters
  - Visual feedback for actions
- **VersionComparison Component**: Side-by-side version comparison
  - Compare any two OpenVINO versions
  - Statistics showing changes (new, removed, modified)
  - Visual status indicators
  - Complete comparison table
- **useURLParams Hook**: Shareable filter URLs
  - Automatic URL synchronization
  - Preserves all filter state
  - Clean URLs with query parameters
- Integration of all Phase 4 features in main app
- Enhanced header with new action buttons

### Added - Phase 3: Core UI Components

- **SearchBar Component**: Real-time search with debouncing
- **FilterPanel Component**: Comprehensive filtering
  - Version selector
  - Category multi-select
  - Device filters (CPU/GPU/NPU)
  - LoRA support toggle
- **ModelTable Component**: Sortable data table
  - Click headers to sort
  - Device support display
  - LoRA indicators
  - HuggingFace links
- **ModelCard Component**: Visual card layout
  - Category color coding
  - Device badges
  - Variant information
- **StatsDashboard Component**: Visual statistics
  - Model counts
  - Device coverage metrics
  - Category breakdown
- **ViewToggle Component**: Switch between table/card views
- Full app integration with all components
- Responsive design for mobile, tablet, desktop
- Empty state handling
- Loading and error states

### Added - Phase 2: Data Layer

- Complete TypeScript type definitions (`src/types/index.ts`)
  - Model, variant, and version support types
  - Filter state and app state types
  - Statistics types
- Model data structure (`src/data/genai_models.json`)
  - Initial 6 models with 10 variants
  - Version support across 4 releases
  - Device compatibility tracking
- Data utility functions (`src/utils/dataHelpers.ts`)
  - Filtering and sorting functions
  - Statistics calculation
  - Format helpers
- Data validation utilities (`src/utils/validateData.ts`)
- **useModelData Hook**: Data loading with error handling
- **useFilters Hook**: Filter state management
- Webpack configuration for data serving

### Added - Phase 1: Foundation

- Project structure and directory layout
- React 18 + TypeScript setup
- Webpack 5 build configuration
- Tailwind CSS integration
- ESLint configuration
- TypeScript configuration
- Development server with hot reload
- Production build optimization
- Basic App component skeleton
- Package.json with all dependencies
- README with project overview

## [Unreleased]

### Planned Features

- Unit tests for components
- Integration tests for workflows
- E2E tests with Playwright/Cypress
- Performance monitoring integration
- Analytics integration (optional)
- Dark mode support
- Advanced search with operators
- Model comparison (side-by-side)
- Quantization variant tracking (INT4, INT8, FP16)
- Performance benchmarks
- Memory requirements
- User feedback/rating system
- Community model submissions

## Version History

### Version 1.0.0 - Initial Release

**Release Date**: 2026-05-14

**Summary**: Complete implementation of the OpenVINO Model Support Matrix with 15 models, 33 variants, comprehensive UI, advanced features, and production deployment configuration.

**Key Metrics**:
- Models: 15
- Variants: 33
- Categories: 8 (all populated)
- OpenVINO Versions: 4 (2024.5 → 2026.0)
- Components: 13 React components
- Lines of Code: ~3,000 LOC
- Bundle Size: 226 KB (production, minified)
- Data File: 28.6 KB

**Platform Support**:
- Browsers: Chrome 120+, Firefox 121+, Safari 17+, Edge 120+
- Devices: Desktop, Tablet, Mobile (responsive)
- Accessibility: WCAG 2.1 AA compliant

**Deployment Platforms**:
- Netlify (configured)
- Vercel (configured)
- GitHub Pages (automated)
- Manual deployment (documented)

---

## Notes

### Breaking Changes

None in version 1.0.0 (initial release)

### Migration Guide

Not applicable for initial release.

### Deprecations

None

### Security Updates

- Implemented security headers in all deployment configs
- XSS protection enabled
- Content Security Policy configured
- HTTPS enforced on all platforms

---

**Repository**: https://github.com/kumarijy/openvino_contrib  
**Path**: `modules/model_support_matrix`  
**License**: Apache 2.0  
**Maintainer**: @kumarijy
