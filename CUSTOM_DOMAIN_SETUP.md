# Custom Domain Setup: music.inquiry.institute

## ✅ Completed Steps

### 1. DNS Configuration (Route 53)
- **CNAME Record Created**: `music.inquiry.institute` → `dcmcshan.github.io`
- **Hosted Zone**: `Z053032935YKZE3M0E0D1`
- **Status**: PENDING (propagating)

### 2. GitHub Pages Configuration
- **Custom Domain**: `music.inquiry.institute`
- **CNAME File**: Added to `public/CNAME`
- **Vite Config**: Updated to use base path `/` (no subdirectory)

### 3. Repository Settings
- **Build Type**: GitHub Actions
- **Source**: `main` branch

## Next Steps

### Verify DNS Propagation
```bash
# Check DNS propagation
dig music.inquiry.institute CNAME

# Should show: dcmcshan.github.io
```

### Enable Custom Domain in GitHub
1. Go to: https://github.com/dcmcshan/music/settings/pages
2. Under "Custom domain", enter: `music.inquiry.institute`
3. Check "Enforce HTTPS"
4. Click "Save"

GitHub will verify the DNS record and provision an SSL certificate (usually takes 5-10 minutes).

### Verify Setup
After DNS propagates and GitHub verifies:
- Visit: **https://music.inquiry.institute**
- Should redirect to HTTPS automatically
- SSL certificate will be provisioned by GitHub

## Troubleshooting

### DNS Not Propagating
- Wait 5-15 minutes for DNS propagation
- Check with: `dig music.inquiry.institute CNAME`
- Verify Route 53 record exists

### GitHub Not Verifying Domain
- Ensure CNAME record points to: `dcmcshan.github.io`
- Wait 10-15 minutes after DNS propagation
- Check GitHub Pages settings for verification status

### SSL Certificate Not Provisioning
- Ensure "Enforce HTTPS" is enabled
- Wait 10-15 minutes after domain verification
- Check Pages settings for certificate status

## Current Status

- ✅ CNAME record created in Route 53
- ✅ CNAME file added to repository
- ✅ Vite config updated for custom domain
- ⏳ DNS propagation (in progress)
- ⏳ GitHub domain verification (pending)
- ⏳ SSL certificate provisioning (pending)
