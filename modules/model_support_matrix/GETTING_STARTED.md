# Getting Started with OpenVINO Model Support Matrix

## Quick Start

### 1. Install Dependencies
```bash
cd modules/model_support_matrix
npm install
```

### 2. Start Development Server
```bash
npm start
```

The application will open automatically at `http://localhost:3000`

### 3. Build for Production
```bash
npm run build
```

Output will be in the `dist/` directory.

## Features Overview

### 🔍 Search & Filter
- **Search Bar**: Type to search models by name, family, or HuggingFace ID
- **Version Filter**: Select which OpenVINO version to view
- **Category Filter**: Filter by model type (LLM, VLM, Image Generation, etc.)
- **Device Filter**: Filter by CPU, GPU, or NPU support
- **LoRA Filter**: Show only models with LoRA support

### 📊 View Modes
- **Table View**: Detailed tabular display with sortable columns
- **Card View**: Visual card-based browsing

### 📈 Statistics Dashboard
- Total model count
- Device support coverage (CPU/GPU/NPU)
- Category breakdown

### 🎯 Sorting
Click any column header in table view to sort by:
- Model name
- Family name
- Category

## User Guide

### Searching for Models
1. Type in the search bar at the top
2. Search works across:
   - Model names (e.g., "Llama")
   - Model families (e.g., "Meta")
   - HuggingFace IDs (e.g., "meta-llama/Meta-Llama-3")
   - Tags
3. Results update in real-time (debounced 300ms)

### Filtering Models
1. **Select OpenVINO Version**: Use the dropdown in the left sidebar
2. **Choose Categories**: Click category buttons to filter by type
3. **Select Devices**: Toggle CPU/GPU/NPU buttons
4. **LoRA Only**: Check the box to show only LoRA-supported models
5. **Clear Filters**: Click "Clear Filters" to reset (keeps version selection)

### Viewing Model Details
**Table View:**
- See all model variants in rows
- View device support
- Check LoRA availability
- Click HuggingFace IDs to visit model pages

**Card View:**
- Browse models visually
- See key information at a glance
- Color-coded by category
- Click links to visit homepages/docs

### Sorting Models
1. Click any column header (Name, Family, Category)
2. First click: Sort ascending (A-Z)
3. Second click: Sort descending (Z-A)
4. Chevron icon shows current sort state

## Sample Queries

### Find All Llama Models
1. Type "llama" in search bar
2. See all Llama variants

### Find NPU-Compatible Models in Latest Version
1. Select "2026.0" in version dropdown
2. Click "NPU" device button
3. See only NPU-supported models

### Find LLMs with LoRA Support
1. Click "LLM" category button
2. Check "LoRA Support Only" checkbox
3. See LLMs that support LoRA adapters

### Compare Model Categories
1. Select version in dropdown
2. View Statistics Dashboard
3. See category breakdown

## Keyboard Shortcuts

- **Tab**: Navigate between elements
- **Enter/Space**: Activate buttons
- **Escape**: Clear search (when focused)
- **Arrow Keys**: Navigate in dropdowns

## Responsive Design

The application adapts to your screen size:

**Mobile (< 768px):**
- Stacked layout
- Filters collapse
- Cards full-width
- Table scrolls horizontally

**Tablet (768px - 1024px):**
- Side-by-side layout
- 2-column card grid
- Compact filters

**Desktop (> 1024px):**
- Full sidebar + main content
- Up to 2-column card grid
- Wide table view

## Development Scripts

### `npm start`
Starts the development server with hot reload.
- Opens automatically in browser
- Watches for file changes
- Port: 3000

### `npm run build`
Creates production build in `dist/`.
- Minified and optimized
- Bundle size: ~201 KB
- Ready for deployment

### `npm run build:dev`
Creates development build in `dist/`.
- Non-minified
- Source maps included
- Faster build time

### `npm run type-check`
Runs TypeScript compiler without emitting files.
- Checks for type errors
- Fast feedback

### `npm run lint`
Runs ESLint on all source files.
- Checks code style
- Finds common issues

### `npm run validate`
Validates the model data JSON file.
- Checks required fields
- Validates structure
- Reports warnings

## Project Structure

```
model_support_matrix/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/             # UI components
│   │   ├── SearchBar.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── ModelTable.tsx
│   │   ├── ModelCard.tsx
│   │   ├── StatsDashboard.tsx
│   │   ├── ViewToggle.tsx
│   │   └── index.ts
│   ├── hooks/                  # React hooks
│   │   ├── useModelData.ts
│   │   └── useFilters.ts
│   ├── utils/                  # Helper functions
│   │   ├── dataHelpers.ts
│   │   └── validateData.ts
│   ├── types/                  # TypeScript types
│   │   └── index.ts
│   ├── data/                   # Model data
│   │   └── genai_models.json
│   ├── App.tsx                 # Main component
│   ├── index.tsx               # Entry point
│   └── app.css                 # Global styles
├── dist/                       # Build output
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── webpack.config.ts           # Build config
└── tailwind.config.js          # Styling config
```

## Adding New Models

### 1. Edit `src/data/genai_models.json`

```json
{
  "id": "unique-model-id",
  "name": "Model Name",
  "family": "Model Family",
  "category": "LLM",
  "description": "Model description",
  "homepage": "https://...",
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
```

### 2. Validate Data
```bash
npm run validate
```

### 3. Test Changes
```bash
npm start
```

## Troubleshooting

### Build Fails
1. Delete `node_modules/` and `package-lock.json`
2. Run `npm install`
3. Try build again

### Data Not Loading
1. Check browser console for errors
2. Verify `src/data/genai_models.json` is valid JSON
3. Run `npm run validate`

### Styles Not Applying
1. Check `tailwind.config.js` is correct
2. Verify `app.css` imports Tailwind
3. Clear browser cache

### Type Errors
1. Run `npm run type-check`
2. Check error messages
3. Fix type mismatches

## Browser Support

**Recommended:**
- Chrome 120+
- Firefox 121+
- Safari 17+
- Edge 120+

**Minimum:**
- Chrome 100+
- Firefox 100+
- Safari 15+
- Edge 100+

## Performance Tips

### For Large Datasets
- Use version filter to reduce displayed models
- Use category filters to narrow results
- Search is debounced for smooth typing

### For Slow Networks
- Production build is optimized (201 KB)
- Gzip compression reduces size further
- Consider CDN for static assets

## Contributing

### Adding Features
1. Create new component in `src/components/`
2. Add types to `src/types/index.ts`
3. Update `App.tsx` to integrate
4. Test thoroughly
5. Update documentation

### Improving Data
1. Edit `src/data/genai_models.json`
2. Follow existing structure
3. Run `npm run validate`
4. Test in UI
5. Submit PR

### Reporting Issues
- Check existing issues first
- Provide reproduction steps
- Include browser/version info
- Attach screenshots if relevant

## Deployment

### Static Hosting (Recommended)
1. Build: `npm run build`
2. Upload `dist/` folder to:
   - GitHub Pages
   - Netlify
   - Vercel
   - AWS S3 + CloudFront

### Configuration
No environment variables needed - all configuration is in the code.

### Custom Domain
1. Add `CNAME` file to `public/` directory
2. Configure DNS records
3. Rebuild and deploy

## FAQ

**Q: Can I add more OpenVINO versions?**
A: Yes, add to the `versions` array in `genai_models.json` and update model `versionSupport`.

**Q: How do I change the default version?**
A: Edit the `latestVersion` calculation in `App.tsx`.

**Q: Can I customize colors?**
A: Yes, edit `tailwind.config.js` and update component color classes.

**Q: Is there a dark mode?**
A: Not yet - planned for a future phase.

**Q: Can I export results?**
A: Not yet - planned for Phase 4.

**Q: How do I add a new category?**
A: Add to `ModelCategory` type in `types/index.ts` and add colors in components.

## Support

- **Documentation**: See PHASE*_SUMMARY.md files
- **Issues**: GitHub Issues
- **Questions**: OpenVINO Discussions

---

**Version**: 1.0.0 (Phase 3 Complete)  
**Last Updated**: May 14, 2026  
**Status**: Production Ready ✅
