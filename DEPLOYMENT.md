# Deployment Guide

This document covers deployment instructions for the Meridian Wealth Portal, including Vercel (primary), Netlify, GitHub Pages, and AWS S3 alternatives.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Build Configuration](#build-configuration)
- [Vercel Deployment (Recommended)](#vercel-deployment-recommended)
- [Netlify Deployment](#netlify-deployment)
- [GitHub Pages Deployment](#github-pages-deployment)
- [AWS S3 + CloudFront Deployment](#aws-s3--cloudfront-deployment)
- [CI/CD Notes](#cicd-notes)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- A Git repository (GitHub, GitLab, or Bitbucket) with the project source code pushed

Verify your local setup:

```bash
node --version
npm --version
```

Install dependencies before building:

```bash
npm install
```

---

## Environment Variables

The application uses Vite environment variables prefixed with `VITE_`. These are embedded at build time and are **not** secret — they are included in the client-side JavaScript bundle.

| Variable | Description | Default | Required |
|---|---|---|---|
| `VITE_APP_NAME` | Application name displayed in the UI (navbar, login page) | `Meridian Wealth Portal` | No |
| `VITE_API_BASE_URL` | API base URL for backend services (reserved for future use) | `http://localhost:8080/api` | No |
| `VITE_APP_ENV` | Application environment identifier (`development`, `staging`, `production`) | `development` | No |

### Setting Environment Variables

**Local development:** Create a `.env` file in the project root (see `.env.example`):

```
VITE_APP_NAME=Meridian Wealth Portal
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_ENV=development
```

**Production builds:** Set environment variables in your hosting provider's dashboard or CI/CD pipeline before running the build command. Vite injects these values at build time via `import.meta.env.VITE_*`.

> **Note:** `.env` files are excluded from version control via `.gitignore`. Never commit secrets to `.env` files. The current `VITE_*` variables are safe for client-side exposure.

---

## Build Configuration

The project uses **Vite 5** as the build tool with the React plugin.

**Build command:**

```bash
npm run build
```

**Output directory:** `dist/`

**Preview the production build locally:**

```bash
npm run preview
```

**Run tests before deploying:**

```bash
npm test
```

### Key Build Files

| File | Purpose |
|---|---|
| `vite.config.js` | Vite build configuration with React plugin and path aliases |
| `tailwind.config.js` | Tailwind CSS 3.4 configuration with custom color palette |
| `postcss.config.js` | PostCSS configuration with Tailwind and Autoprefixer plugins |
| `vercel.json` | Vercel-specific SPA rewrite rules |
| `index.html` | Entry HTML file |

---

## Vercel Deployment (Recommended)

Vercel auto-detects Vite projects and provides zero-configuration deployment.

### Step 1: Connect Your Git Repository

1. Go to [vercel.com](https://vercel.com) and sign in (or create an account).
2. Click **"Add New..."** → **"Project"**.
3. Import your Git repository from GitHub, GitLab, or Bitbucket.
4. Select the repository containing the Meridian Wealth Portal source code.

### Step 2: Configure Project Settings

Vercel will auto-detect the Vite framework. Verify the following settings:

| Setting | Value |
|---|---|
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |
| **Node.js Version** | 18.x (or later) |

### Step 3: Set Environment Variables

In the Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**.
2. Add the following variables for the **Production** environment:

```
VITE_APP_NAME = Meridian Wealth Portal
VITE_APP_ENV = production
```

You can also set different values for **Preview** and **Development** environments.

### Step 4: Deploy

Click **"Deploy"**. Vercel will:

1. Clone the repository
2. Install dependencies (`npm install`)
3. Run the build command (`npm run build`)
4. Serve the `dist/` directory

Subsequent pushes to the main branch trigger automatic deployments. Pull requests generate preview deployments.

### SPA Rewrite Configuration

The project includes a `vercel.json` file that configures SPA (Single Page Application) rewrites. This ensures that all routes (e.g., `/accounts`, `/portfolio`, `/login`) are handled by `index.html` instead of returning 404 errors:

```json
{
  "rewrites": [
    {
      "source": "/((?!assets/).*)",
      "destination": "/index.html"
    }
  ]
}
```

This rewrite rule:
- Matches all paths **except** those starting with `assets/` (Vite's static asset directory)
- Redirects matched paths to `index.html`, where React Router handles client-side routing

> **Important:** Do not remove `vercel.json` — without it, direct navigation to any route other than `/` will return a 404 on Vercel.

### Custom Domain (Optional)

1. Go to **Settings** → **Domains** in your Vercel project.
2. Add your custom domain.
3. Configure DNS records as instructed by Vercel.
4. Vercel automatically provisions SSL certificates.

---

## Netlify Deployment

### Step 1: Connect Repository

1. Go to [netlify.com](https://netlify.com) and sign in.
2. Click **"Add new site"** → **"Import an existing project"**.
3. Connect your Git provider and select the repository.

### Step 2: Configure Build Settings

| Setting | Value |
|---|---|
| **Build command** | `npm run build` |
| **Publish directory** | `dist` |

### Step 3: Set Environment Variables

In **Site settings** → **Environment variables**, add:

```
VITE_APP_NAME = Meridian Wealth Portal
VITE_APP_ENV = production
```

### Step 4: Configure SPA Redirects

Create a `public/_redirects` file in the project (or add it to the `public/` directory so Vite copies it to `dist/` at build time):

```
/*    /index.html   200
```

This serves the same purpose as the `vercel.json` rewrite — ensuring all routes are handled by React Router.

### Step 5: Deploy

Click **"Deploy site"**. Netlify will build and deploy automatically. Subsequent pushes trigger redeployments.

---

## GitHub Pages Deployment

GitHub Pages serves static files and requires additional configuration for SPAs.

### Step 1: Update `vite.config.js`

Set the `base` option to match your repository name:

```js
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/',
  // ... other config
});
```

> **Note:** If deploying to a custom domain or the root (`username.github.io`), set `base: '/'`.

### Step 2: Add a 404 Fallback

Create a `public/404.html` file that redirects to `index.html`. GitHub Pages serves `404.html` for unknown routes, and a redirect script can forward the request to the SPA:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <script>
      // Redirect all 404s to index.html for SPA routing
      var pathSegmentsToKeep = 1; // Set to 0 for username.github.io root
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body></body>
</html>
```

### Step 3: Deploy with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm

      - run: npm ci

      - run: npm test

      - run: npm run build
        env:
          VITE_APP_NAME: Meridian Wealth Portal
          VITE_APP_ENV: production

      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### Step 4: Enable GitHub Pages

1. Go to your repository **Settings** → **Pages**.
2. Under **Source**, select **GitHub Actions**.

---

## AWS S3 + CloudFront Deployment

### Step 1: Build the Project

```bash
npm ci
npm run build
```

### Step 2: Create an S3 Bucket

```bash
aws s3 mb s3://meridian-wealth-portal --region us-east-1
```

Enable static website hosting:

```bash
aws s3 website s3://meridian-wealth-portal \
  --index-document index.html \
  --error-document index.html
```

> Setting `--error-document` to `index.html` enables SPA routing by serving the app shell for all routes.

### Step 3: Upload Build Artifacts

```bash
aws s3 sync dist/ s3://meridian-wealth-portal --delete
```

### Step 4: Create a CloudFront Distribution

1. Create a CloudFront distribution pointing to the S3 bucket.
2. Set the **Default Root Object** to `index.html`.
3. Add a **Custom Error Response** for 403 and 404 errors:
   - Response Page Path: `/index.html`
   - HTTP Response Code: `200`
4. Enable HTTPS with an ACM certificate for your domain.

### Step 5: Invalidate Cache on Deploy

After uploading new files, invalidate the CloudFront cache:

```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

---

## CI/CD Notes

### Automated Build Pipeline

For any CI/CD platform (GitHub Actions, GitLab CI, CircleCI, Jenkins), the deployment pipeline should follow this sequence:

```
1. Checkout code
2. Install Node.js 18+
3. Install dependencies:  npm ci
4. Run tests:             npm test
5. Build:                 npm run build
6. Deploy dist/ directory
```

### Environment Variables in CI/CD

Set `VITE_*` environment variables in your CI/CD platform's secrets or environment configuration. They must be available **during the build step** since Vite embeds them at compile time.

**GitHub Actions example:**

```yaml
- run: npm run build
  env:
    VITE_APP_NAME: Meridian Wealth Portal
    VITE_APP_ENV: production
```

**GitLab CI example:**

```yaml
build:
  stage: build
  script:
    - npm ci
    - npm run build
  variables:
    VITE_APP_NAME: "Meridian Wealth Portal"
    VITE_APP_ENV: "production"
  artifacts:
    paths:
      - dist/
```

### Branch Strategy

| Branch | Environment | Auto-Deploy |
|---|---|---|
| `main` | Production | Yes |
| `staging` | Staging | Yes (if configured) |
| Pull Requests | Preview | Yes (Vercel/Netlify generate preview URLs) |

### Caching Dependencies

Use `npm ci` instead of `npm install` in CI/CD pipelines for deterministic, faster installs. Cache the `node_modules` directory or npm cache between runs:

**GitHub Actions:**

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 18
    cache: npm
```

### Running Tests in CI

Always run tests before deploying:

```bash
npm test
```

The test suite uses Vitest with jsdom environment. Tests run headlessly and do not require a browser. If tests fail, the pipeline should halt and not proceed to deployment.

---

## Troubleshooting

### Routes Return 404 on Refresh

**Cause:** The hosting provider is looking for a file matching the URL path (e.g., `/accounts`) instead of serving `index.html`.

**Fix:** Ensure SPA rewrite/redirect rules are configured:
- **Vercel:** `vercel.json` with rewrites (included in the project)
- **Netlify:** `public/_redirects` file with `/*  /index.html  200`
- **S3:** Set error document to `index.html`
- **Nginx:** Add `try_files $uri $uri/ /index.html;`

### Environment Variables Not Working

**Cause:** Vite environment variables are injected at **build time**, not runtime.

**Fix:**
- Ensure variables are prefixed with `VITE_` (e.g., `VITE_APP_NAME`)
- Set variables **before** running `npm run build`
- Rebuild the application after changing environment variables
- Access variables via `import.meta.env.VITE_APP_NAME` (not `process.env`)

### Build Fails with Out of Memory

**Cause:** Node.js default memory limit may be insufficient for large builds.

**Fix:** Increase the Node.js memory limit:

```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Tailwind Styles Missing in Production

**Cause:** Tailwind's content purging removed classes that are dynamically constructed.

**Fix:** Ensure `tailwind.config.js` includes all source files in the `content` array:

```js
content: [
  './index.html',
  './src/**/*.{js,jsx}',
],
```

Avoid constructing class names dynamically with string concatenation. Use complete class names in the source code so Tailwind's scanner can detect them.

### Assets Not Loading (Incorrect Base Path)

**Cause:** The `base` option in `vite.config.js` does not match the deployment path.

**Fix:**
- For root domain deployment: `base: '/'` (default)
- For subdirectory deployment (e.g., GitHub Pages): `base: '/repo-name/'`