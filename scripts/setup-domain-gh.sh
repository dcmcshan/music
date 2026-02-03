#!/bin/bash
# Setup custom domain using GitHub CLI
# Note: GitHub requires manual verification, but this script helps with the process

set -e

DOMAIN="music.inquiry.institute"
REPO="dcmcshan/music"

echo "=== GitHub Pages Custom Domain Setup (via gh CLI) ==="
echo ""
echo "Domain: $DOMAIN"
echo "Repository: $REPO"
echo ""

# Check current status
echo "1. Checking current GitHub Pages configuration..."
PAGES_CONFIG=$(gh api repos/$REPO/pages 2>/dev/null)
CURRENT_CNAME=$(echo "$PAGES_CONFIG" | jq -r '.cname // "not set"')
PAGES_URL=$(echo "$PAGES_CONFIG" | jq -r '.html_url')

echo "   Current CNAME: $CURRENT_CNAME"
echo "   Pages URL: $PAGES_URL"
echo ""

# Check DNS
echo "2. Verifying DNS configuration..."
CNAME=$(dig $DOMAIN CNAME +short 2>/dev/null | tr -d '\n')
if [ "$CNAME" = "dcmcshan.github.io." ]; then
  echo "   ✅ DNS CNAME record is correct"
else
  echo "   ❌ DNS CNAME record incorrect"
  echo "   Current: $CNAME"
  echo "   Expected: dcmcshan.github.io."
  exit 1
fi

# Try to set via API (will fail if not verified)
echo ""
echo "3. Attempting to set custom domain via GitHub API..."
API_RESULT=$(gh api repos/$REPO/pages -X PUT -f cname="$DOMAIN" 2>&1 || true)

if echo "$API_RESULT" | grep -q "verify your domain"; then
  echo "   ⚠️  Domain verification required"
  echo ""
  echo "   GitHub requires manual domain verification before the API can set"
  echo "   the custom domain. This is a security requirement."
  echo ""
  echo "4. Opening GitHub Pages settings for manual configuration..."
  echo ""
  
  # Open settings page
  if gh browse --settings --repo $REPO 2>/dev/null; then
    echo "   ✅ Opened GitHub Pages settings in browser"
  else
    echo "   Please visit: https://github.com/$REPO/settings/pages"
  fi
  
  echo ""
  echo "   Manual steps required:"
  echo "   a) In the 'Custom domain' field, enter: $DOMAIN"
  echo "   b) Check 'Enforce HTTPS'"
  echo "   c) Click 'Save'"
  echo ""
  echo "   GitHub will:"
  echo "   - Verify the DNS CNAME record (should pass immediately)"
  echo "   - Provision SSL certificate (10-15 minutes)"
  echo "   - Enable the custom domain"
  echo ""
elif echo "$API_RESULT" | grep -q "Invalid request"; then
  echo "   ❌ API request failed:"
  echo "$API_RESULT" | jq -r '.message // .' 2>/dev/null || echo "$API_RESULT"
  exit 1
else
  echo "   ✅ Custom domain configured successfully!"
  echo ""
  echo "   Domain: $DOMAIN"
  echo "   Wait 10-15 minutes for SSL certificate provisioning"
fi

echo ""
echo "=== Setup Summary ==="
echo ""
echo "After configuration, site will be available at:"
echo "  - https://$DOMAIN"
echo "  - http://$DOMAIN (redirects to HTTPS)"
echo ""
echo "Monitor status:"
echo "  gh api repos/$REPO/pages | jq '.cname, .status'"
echo ""
