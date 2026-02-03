# GitHub Pages Setup

The music repository is configured for GitHub Pages deployment.

## Enable GitHub Pages

1. Go to: **https://github.com/dcmcshan/music/settings/pages**

2. Under **"Source"**, select: **"GitHub Actions"**

3. Click **"Save"**

## Deployment

Once enabled, the GitHub Actions workflow will automatically:
- Build the React app using Vite
- Deploy to GitHub Pages
- Make it available at: **https://inquiryinstitute.github.io/music**

## Manual Deployment

If you need to trigger a deployment manually:
1. Go to: **https://github.com/dcmcshan/music/actions**
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow"

## Verify Deployment

After the workflow completes:
- Visit: **https://inquiryinstitute.github.io/music**
- The music room should be accessible

## Troubleshooting

### Workflow Not Running
- Ensure GitHub Pages is enabled with "GitHub Actions" as the source
- Check the Actions tab for any errors

### Build Fails
- Check workflow logs in the Actions tab
- Verify all dependencies are in `package.json`
- Ensure Node.js version matches (20.x)

### Site Not Loading
- Wait a few minutes after deployment
- Check if the workflow completed successfully
- Verify the base path is `/music/` in `vite.config.ts`
