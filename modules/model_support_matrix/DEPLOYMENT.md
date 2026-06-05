# Deployment Guide

This guide explains how to deploy the OpenVINO Model Support Matrix to various hosting platforms.

## Table of Contents

- [Quick Start](#quick-start)
- [Netlify Deployment](#netlify-deployment)
- [Vercel Deployment](#vercel-deployment)
- [GitHub Pages Deployment](#github-pages-deployment)
- [Manual Deployment](#manual-deployment)
- [Environment Configuration](#environment-configuration)
- [Troubleshooting](#troubleshooting)

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git repository with the project
- Account on chosen hosting platform

### Build Commands

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Output directory: dist/
```

## Netlify Deployment

### Option 1: Deploy via Netlify UI

1. **Login to Netlify**: https://app.netlify.com
2. **New site from Git**: Click "Add new site" → "Import an existing project"
3. **Connect repository**: 
   - Choose GitHub
   - Select `kumarijy/openvino_contrib`
4. **Configure build settings**:
   - Base directory: `modules/model_support_matrix`
   - Build command: `npm run build`
   - Publish directory: `modules/model_support_matrix/dist`
5. **Deploy**: Click "Deploy site"

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Navigate to project
cd modules/model_support_matrix

# Build
npm run build

# Deploy
netlify deploy --prod
```

### Option 3: Automatic Deployment

The included `netlify.toml` file configures automatic deployment:

```bash
# Just push to master branch
git add .
git commit -m "Deploy to Netlify"
git push origin master
```

Netlify will automatically:
- Detect the `netlify.toml` configuration
- Build the project
- Deploy to your site URL

### Netlify Configuration

The `netlify.toml` file includes:
- ✅ Build settings
- ✅ Redirect rules for SPA routing
- ✅ Security headers
- ✅ Cache optimization
- ✅ Compression settings

### Custom Domain on Netlify

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow DNS configuration instructions
4. SSL certificate auto-provisioned

## Vercel Deployment

### Option 1: Deploy via Vercel UI

1. **Login to Vercel**: https://vercel.com
2. **Import Project**: Click "Add New..." → "Project"
3. **Import Git Repository**:
   - Select `kumarijy/openvino_contrib`
4. **Configure Project**:
   - Framework Preset: Other
   - Root Directory: `modules/model_support_matrix`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Deploy**: Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Navigate to project
cd modules/model_support_matrix

# Deploy
vercel --prod
```

### Vercel Configuration

The `vercel.json` file includes:
- ✅ Build configuration
- ✅ SPA routing rules
- ✅ Security headers
- ✅ Cache headers

## GitHub Pages Deployment

### Option 1: Automated Deployment (Recommended)

The included GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically deploys on push to master.

**Setup Steps:**

1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: GitHub Actions
   
2. **Push to master**:
   ```bash
   git add .
   git commit -m "Enable GitHub Pages deployment"
   git push origin master
   ```

3. **Access your site**:
   - URL: `https://kumarijy.github.io/openvino_contrib/`
   - Wait 2-3 minutes for first deployment

### Option 2: Manual Deployment

```bash
# Build the project
npm run build

# Install gh-pages package
npm install -g gh-pages

# Deploy to gh-pages branch
gh-pages -d dist -b gh-pages
```

### GitHub Pages Configuration

**For subpath deployment** (e.g., `/openvino_contrib/`):

Update `webpack.config.ts`:
```typescript
output: {
  publicPath: '/openvino_contrib/',
}
```

## Manual Deployment

### Build Locally

```bash
cd modules/model_support_matrix
npm install
npm run build
```

The `dist/` folder contains all production files.

### Deploy to Any Static Host

Upload the `dist/` folder contents to:
- AWS S3 + CloudFront
- Azure Static Web Apps
- Google Cloud Storage
- Cloudflare Pages
- DigitalOcean App Platform
- Any web server (Apache, Nginx)

### Server Configuration

**Nginx Example** (`nginx.conf`):
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "DENY";
    add_header X-Content-Type-Options "nosniff";
}
```

**Apache Example** (`.htaccess`):
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>

# Cache static assets
<FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg)$">
    Header set Cache-Control "max-age=31536000, public"
</FilesMatch>
```

## Environment Configuration

### Base URL Configuration

If deploying to a subpath, update `webpack.config.ts`:

```typescript
const config: webpack.Configuration = {
  output: {
    publicPath: process.env.PUBLIC_URL || '/',
  },
};
```

### Environment Variables

Create `.env.production` (optional):
```
PUBLIC_URL=/your-subpath/
REACT_APP_API_URL=https://api.example.com
```

## Deployment Checklist

Before deploying to production:

- [ ] Run `npm run type-check` - No TypeScript errors
- [ ] Run `npm run lint` - No linting errors
- [ ] Run `npm run build` - Build succeeds
- [ ] Test production build locally
- [ ] Verify all links work
- [ ] Check mobile responsiveness
- [ ] Test in multiple browsers
- [ ] Verify data loads correctly
- [ ] Check search and filter functionality
- [ ] Test export features
- [ ] Verify modal interactions
- [ ] Check version comparison
- [ ] Update README with deployment URL
- [ ] Add deployment badge to README

## Troubleshooting

### Build Fails

**Problem**: `npm run build` fails

**Solutions**:
1. Clear cache: `rm -rf node_modules package-lock.json && npm install`
2. Check Node version: `node -v` (should be 18+)
3. Check for TypeScript errors: `npm run type-check`
4. Check for lint errors: `npm run lint`

### 404 on Refresh

**Problem**: Refreshing the page shows 404 error

**Solution**: Configure SPA routing on your host
- Netlify: `netlify.toml` already configured
- Vercel: `vercel.json` already configured
- GitHub Pages: Use hash router or configure redirects
- Manual: Configure server (see examples above)

### Assets Not Loading

**Problem**: JS/CSS files return 404

**Solution**: Check `publicPath` in `webpack.config.ts`
- Root deployment: `publicPath: '/'`
- Subpath deployment: `publicPath: '/subpath/'`

### Large Bundle Size

**Problem**: Bundle is too large

**Solutions**:
1. Enable compression on server
2. Use code splitting (optional)
3. Analyze bundle: `npm install -g webpack-bundle-analyzer`

### CORS Errors

**Problem**: Cannot load data/genai_models.json

**Solution**: 
- Ensure data file is in dist/data/
- Check server CORS headers
- Verify file path in fetch request

## Monitoring

### Performance Monitoring

Use Lighthouse to audit:
```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse https://your-deployment-url
```

Target scores:
- Performance: >90
- Accessibility: >90
- Best Practices: >90
- SEO: >90

### Analytics (Optional)

Add Google Analytics or Plausible:

1. Sign up for service
2. Add tracking code to `public/index.html`
3. Redeploy

## Updates

To update the live site:

1. Make changes locally
2. Test thoroughly
3. Commit and push:
   ```bash
   git add .
   git commit -m "Update: description"
   git push origin master
   ```
4. Deployment happens automatically (if configured)

## Support

For deployment issues:
- Check platform status pages
- Review build logs
- Consult platform documentation
- Open issue in repository

---

**Deployment Platforms:**
- Netlify: https://docs.netlify.com
- Vercel: https://vercel.com/docs
- GitHub Pages: https://docs.github.com/pages

**Last Updated**: 2026-05-14
