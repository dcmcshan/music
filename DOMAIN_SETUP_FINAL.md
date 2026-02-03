# Final Step: Enable Custom Domain

## Current Status

✅ **DNS Configured**: `music.inquiry.institute` → `dcmcshan.github.io`  
✅ **Site Deployed**: https://dcmcshan.github.io/music/ (working)  
❌ **Custom Domain**: Needs to be enabled in GitHub Pages settings

## Required Action

GitHub requires **manual domain verification** through the web UI. The API cannot set the custom domain until it's verified.

### Steps to Enable Custom Domain

1. **Go to GitHub Pages Settings**:
   - Direct link: https://github.com/dcmcshan/music/settings/pages
   - Or: Repository → Settings → Pages

2. **Configure Custom Domain**:
   - Scroll to "Custom domain" section
   - Enter: `music.inquiry.institute`
   - Check: "Enforce HTTPS"
   - Click: "Save"

3. **GitHub Will**:
   - Verify the DNS CNAME record (should pass immediately)
   - Provision SSL certificate (takes 10-15 minutes)
   - Enable HTTPS automatically

4. **After Verification**:
   - Site will be available at: https://music.inquiry.institute
   - HTTP will redirect to HTTPS
   - SSL certificate will be active

## Verification Process

GitHub checks:
- ✅ CNAME record exists: `music.inquiry.institute` → `dcmcshan.github.io` (verified)
- ⏳ Domain ownership (automatic with CNAME)
- ⏳ SSL certificate provisioning (10-15 minutes)

## Troubleshooting

### If Domain Verification Fails

1. **Check DNS Propagation**:
   ```bash
   dig music.inquiry.institute CNAME +short
   # Should return: dcmcshan.github.io.
   ```

2. **Verify CNAME Record**:
   - Ensure it points exactly to: `dcmcshan.github.io` (no trailing slash)
   - TTL should be 300 seconds or less

3. **Wait for DNS**:
   - DNS changes can take up to 48 hours to propagate
   - Usually works within 5-15 minutes

### If SSL Certificate Fails

- Wait 15-30 minutes after domain verification
- Check GitHub Pages settings for certificate status
- Ensure "Enforce HTTPS" is enabled

## Current DNS Configuration

```json
{
  "Name": "music.inquiry.institute.",
  "Type": "CNAME",
  "TTL": 300,
  "Value": "dcmcshan.github.io"
}
```

✅ This is correctly configured in Route 53.

## After Setup

Once configured, the site will be available at:
- **HTTPS**: https://music.inquiry.institute ✅ (recommended)
- **HTTP**: http://music.inquiry.institute (redirects to HTTPS)

Widget will be available at:
- https://music.inquiry.institute/widget/music-widget.js
