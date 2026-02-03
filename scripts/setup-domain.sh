#!/bin/bash
# Setup custom domain for GitHub Pages
# This script checks DNS and opens GitHub Pages settings

set -e

DOMAIN="music.inquiry.institute"
REPO="dcmcshan/music"
HOSTED_ZONE_ID="Z053032935YKZE3M0E0D1"

echo "=== GitHub Pages Custom Domain Setup ==="
echo ""
echo "Domain: $DOMAIN"
echo "Repository: $REPO"
echo ""

# Check DNS
echo "1. Checking DNS configuration..."
CNAME=$(dig $DOMAIN CNAME +short | tr -d '\n')
if [ "$CNAME" = "dcmcshan.github.io." ]; then
  echo "   ✅ DNS CNAME record is correct: $DOMAIN → dcmcshan.github.io"
else
  echo "   ❌ DNS CNAME record incorrect or missing"
  echo "   Current value: $CNAME"
  echo "   Expected: dcmcshan.github.io."
  exit 1
fi

# Check GitHub Pages status
echo ""
echo "2. Checking GitHub Pages status..."
PAGES_STATUS=$(gh api repos/$REPO/pages 2>/dev/null | jq -r '.cname // "not set"')
if [ "$PAGES_STATUS" = "$DOMAIN" ]; then
  echo "   ✅ Custom domain is configured: $DOMAIN"
  echo ""
  echo "   Domain should be working. If you see 404, wait 5-10 minutes for DNS/SSL propagation."
elif [ "$PAGES_STATUS" = "not set" ] || [ "$PAGES_STATUS" = "null" ]; then
  echo "   ⚠️  Custom domain is NOT configured"
  echo ""
  echo "3. Opening GitHub Pages settings..."
  echo "   Please complete the following steps:"
  echo ""
  echo "   a) Enter custom domain: $DOMAIN"
  echo "   b) Check 'Enforce HTTPS'"
  echo "   c) Click 'Save'"
  echo ""
  echo "   GitHub will verify DNS and provision SSL (10-15 minutes)"
  echo ""
  
  # Try to open the settings page
  if command -v open &> /dev/null; then
    open "https://github.com/$REPO/settings/pages"
  elif command -v xdg-open &> /dev/null; then
    xdg-open "https://github.com/$REPO/settings/pages"
  else
    echo "   Please visit: https://github.com/$REPO/settings/pages"
  fi
else
  echo "   ⚠️  Custom domain is set to: $PAGES_STATUS"
  echo "   Expected: $DOMAIN"
fi

echo ""
echo "=== Setup Complete ==="
echo ""
echo "After configuring in GitHub:"
echo "  - Site will be available at: https://$DOMAIN"
echo "  - SSL certificate will be provisioned automatically"
echo "  - HTTP will redirect to HTTPS"
echo ""
