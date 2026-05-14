# Contributing to OpenVINO Model Support Matrix

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Adding New Models](#adding-new-models)
- [Code Guidelines](#code-guidelines)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)

## Code of Conduct

By participating in this project, you agree to:
- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other contributors

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Code editor (VS Code recommended)
- Basic knowledge of React and TypeScript

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/kumarijy/openvino_contrib.git
cd openvino_contrib/modules/model_support_matrix

# Install dependencies
npm install

# Start development server
npm start

# Open http://localhost:3000
```

### Project Structure

```
model_support_matrix/
├── public/          # Static files
├── src/
│   ├── components/  # React components
│   ├── hooks/       # Custom React hooks
│   ├── types/       # TypeScript type definitions
│   ├── utils/       # Utility functions
│   ├── data/        # Model data (JSON)
│   ├── App.tsx      # Main application component
│   └── index.tsx    # Entry point
├── package.json     # Dependencies and scripts
├── tsconfig.json    # TypeScript configuration
└── webpack.config.ts # Build configuration
```

## How to Contribute

### Types of Contributions

1. **Add New Models**: Expand the model database
2. **Update Model Data**: Correct or update existing information
3. **Fix Bugs**: Report or fix issues
4. **Improve Documentation**: Enhance README, guides, or code comments
5. **Add Features**: Propose and implement new functionality
6. **Improve UI/UX**: Design improvements and accessibility

### Before Contributing

1. Check existing issues to avoid duplication
2. For major changes, open an issue first to discuss
3. Ensure your changes align with project goals
4. Test your changes thoroughly

## Development Workflow

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/openvino_contrib.git
cd openvino_contrib/modules/model_support_matrix
```

### 2. Create a Branch

```bash
# Create a descriptive branch name
git checkout -b add-mistral-8x7b-model
# or
git checkout -b fix-search-performance
# or
git checkout -b docs-update-readme
```

### 3. Make Changes

Follow the [Code Guidelines](#code-guidelines) below.

### 4. Test Your Changes

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build

# Test manually
npm start
```

### 5. Commit Your Changes

```bash
# Stage your changes
git add .

# Commit with descriptive message
git commit -m "Add Mistral 8x7B MoE model with version support"
```

**Commit Message Guidelines:**
- Use present tense ("Add feature" not "Added feature")
- Be specific and descriptive
- Reference issues if applicable (#123)
- Keep first line under 72 characters

**Examples:**
- `Add Gemini Pro model with 2026.0 support`
- `Fix NPU device filter not working correctly`
- `Update README with deployment instructions`
- `Refactor ModelTable component for better performance`

### 6. Push and Create Pull Request

```bash
# Push to your fork
git push origin add-mistral-8x7b-model

# Create Pull Request on GitHub
```

## Adding New Models

### Model Data Format

Edit `src/data/models.json`:

```json
{
  "id": "unique-model-id",
  "name": "Model Display Name",
  "family": "Model Family",
  "category": "LLM|VLM|Image Generation|Video Generation|Speech Recognition|Speech Generation|Text Embeddings|Text Rerank",
  "description": "Clear, concise description of the model",
  "homepage": "https://official-homepage.com",
  "documentation": "https://docs-or-github.com",
  "license": "License Name",
  "tags": ["tag1", "tag2", "tag3"],
  "variants": [
    {
      "size": "7B",
      "huggingfaceId": "organization/model-name",
      "versionSupport": [
        {
          "version": "2024.5",
          "supported": true|false,
          "devices": {
            "cpu": true|false,
            "gpu": true|false,
            "npu": true|false
          },
          "loraSupport": true|false,
          "notes": "Optional version-specific notes"
        }
        // ... repeat for all versions
      ]
    }
  ]
}
```

### Model Addition Checklist

- [ ] Model ID is unique and uses kebab-case
- [ ] All required fields are present
- [ ] Description is clear and accurate
- [ ] HuggingFace ID is verified (link works)
- [ ] License information is correct
- [ ] All 4 OpenVINO versions have entries
- [ ] Device support is realistic
- [ ] LoRA support is verified (if claimed)
- [ ] Tags are relevant and follow existing patterns
- [ ] JSON is properly formatted
- [ ] Validation passes: `npm run validate` (if available)
- [ ] Model appears correctly in UI
- [ ] Search finds the model
- [ ] Filters work with the model
- [ ] Modal shows correct information

### Verification Steps

1. **Verify HuggingFace ID**:
   ```bash
   # Visit: https://huggingface.co/[organization]/[model-name]
   # Ensure the model exists and is accessible
   ```

2. **Check License**:
   - Review model card on HuggingFace
   - Verify license terms
   - Use exact license name

3. **Validate Support Claims**:
   - Check OpenVINO GenAI documentation
   - Verify device compatibility claims
   - Confirm LoRA support if stated

4. **Test in UI**:
   ```bash
   npm start
   # Search for your model
   # Click to open modal
   # Verify all information displays correctly
   ```

## Code Guidelines

### TypeScript

- **Always use types**: No `any` types
- **Define interfaces**: For props and complex objects
- **Use type inference**: Where TypeScript can infer
- **Export types**: From `types/index.ts`

**Example:**
```typescript
// Good
interface ModelCardProps {
  model: Model;
  selectedVersion: OpenVINOVersion;
  onClick?: (model: Model) => void;
}

// Bad
const ModelCard = (props: any) => { ... }
```

### React Components

- **Functional components**: Use hooks, not classes
- **Props destructuring**: Destructure props in function signature
- **Memoization**: Use `useMemo` for expensive computations
- **Accessibility**: Include ARIA labels and semantic HTML

**Example:**
```typescript
export const ComponentName: React.FC<Props> = ({
  prop1,
  prop2,
  onAction,
}) => {
  // Component logic
  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
};
```

### Styling

- **Tailwind CSS**: Use utility classes
- **Consistency**: Follow existing patterns
- **Responsive**: Use responsive modifiers (sm:, md:, lg:)
- **Colors**: Use defined color variables

**Example:**
```tsx
<div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
  <h2 className="text-xl font-semibold text-gray-900 mb-4">
    Title
  </h2>
</div>
```

### File Organization

- **Components**: One component per file
- **Naming**: PascalCase for components, camelCase for utilities
- **Imports**: Group by external, internal, types
- **Exports**: Export from index files

**Example:**
```typescript
// External imports
import React, { useState, useEffect } from 'react';
import { Icon } from '@heroicons/react/24/outline';

// Internal imports
import { useModelData } from './hooks/useModelData';
import { filterModels } from './utils/dataHelpers';

// Types
import type { Model, FilterState } from './types';
```

### Code Comments

- **When to comment**: Complex logic, non-obvious decisions
- **What not to comment**: Obvious code, implementation details
- **Documentation**: Use JSDoc for public functions

**Example:**
```typescript
/**
 * Filters models based on search query, categories, and device support.
 * Returns a new array without mutating the original.
 */
export function filterModels(
  models: Model[],
  filters: FilterState
): Model[] {
  // Filter logic here
}
```

## Testing

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] **Build**: `npm run build` succeeds
- [ ] **Type Check**: `npm run type-check` passes
- [ ] **Lint**: `npm run lint` passes
- [ ] **Search**: Works with new/changed data
- [ ] **Filters**: All filter combinations work
- [ ] **Sorting**: Table sorts correctly
- [ ] **View Modes**: Both table and card views work
- [ ] **Modal**: Opens and displays correctly
- [ ] **Export**: JSON and CSV export work
- [ ] **Comparison**: Version comparison functions
- [ ] **Responsive**: Works on mobile/tablet/desktop
- [ ] **Browsers**: Test in Chrome, Firefox, Safari
- [ ] **Accessibility**: Keyboard navigation works
- [ ] **Performance**: No console errors

### Test Scenarios

**Adding a Model:**
1. Add model to JSON
2. Search for model by name
3. Filter by category
4. Click model to open modal
5. Verify all fields display
6. Test HuggingFace link
7. Export to CSV, check model appears

**Changing a Component:**
1. Test existing functionality
2. Test new functionality
3. Test edge cases
4. Test error states
5. Test loading states
6. Test empty states

## Submitting Changes

### Pull Request Process

1. **Ensure quality**:
   - Code follows guidelines
   - All tests pass
   - No console errors
   - Documentation updated

2. **Create PR**:
   - Descriptive title
   - Clear description of changes
   - Link to related issues
   - Screenshots (if UI changes)

3. **PR Template**:
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Model addition/update
   - [ ] Documentation update
   
   ## Testing
   - [ ] Type check passes
   - [ ] Lint passes
   - [ ] Build succeeds
   - [ ] Manually tested
   
   ## Screenshots (if applicable)
   
   ## Related Issues
   Closes #123
   ```

4. **Respond to feedback**:
   - Address review comments promptly
   - Make requested changes
   - Ask for clarification if needed

### Review Process

- Maintainer will review your PR
- May request changes or ask questions
- Once approved, PR will be merged
- Your contribution will be credited

## Questions?

- Open an issue for questions
- Check existing documentation
- Review closed PRs for examples

## Recognition

Contributors will be:
- Listed in project documentation
- Credited in release notes
- Acknowledged in the community

Thank you for contributing! 🎉

---

**Quick Links:**
- [Report Bug](https://github.com/kumarijy/openvino_contrib/issues/new)
- [Request Feature](https://github.com/kumarijy/openvino_contrib/issues/new)
- [Documentation](README.md)
