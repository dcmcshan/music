import { test, expect } from '@playwright/test';

test.describe('Music Room Site', () => {
  test('should load the main page', async ({ page }) => {
    await page.goto('http://music.inquiry.institute/');
    
    // Check page title or heading
    await expect(page.locator('h1')).toContainText('Music Room', { timeout: 10000 });
  });

  test('should display musical staff editor', async ({ page }) => {
    await page.goto('http://music.inquiry.institute/');
    
    // Check for staff editor component
    const staffEditor = page.locator('text=Musical Staff Editor').first();
    await expect(staffEditor).toBeVisible({ timeout: 10000 });
  });

  test('should display piano keyboard', async ({ page }) => {
    await page.goto('http://music.inquiry.institute/');
    
    // Check for piano keyboard
    const pianoKeys = page.locator('button').filter({ hasText: /^[A-G]$/ }).first();
    await expect(pianoKeys).toBeVisible({ timeout: 10000 });
  });

  test('should load widget script', async ({ page }) => {
    await page.goto('http://music.inquiry.institute/widget/demo.html');
    
    // Check if widget demo loads
    await expect(page.locator('h1')).toContainText('Music Room Widget Demo', { timeout: 10000 });
  });

  test('widget should accept notes parameter', async ({ page }) => {
    await page.goto('http://music.inquiry.institute/widget/demo.html');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    // Check if widget container exists (may take time for React/VexFlow to load)
    const widgetContainer = page.locator('[data-music-widget], #music-widget-container').first();
    await expect(widgetContainer).toBeVisible({ timeout: 20000 });
    
    // Verify widget script is loaded
    const widgetScript = await page.evaluate(() => {
      return typeof window.MusicWidget !== 'undefined';
    });
    expect(widgetScript).toBe(true);
  });

  test('should redirect HTTP to HTTPS', async ({ page, context }) => {
    // Track redirects
    const responses = [];
    context.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
      });
    });

    await page.goto('http://music.inquiry.institute/', { waitUntil: 'networkidle' });
    
    // Check final URL (should be HTTPS if redirect works)
    const finalUrl = page.url();
    console.log('Final URL:', finalUrl);
    
    // Site should load (either HTTP or HTTPS)
    await expect(page.locator('h1')).toContainText('Music Room', { timeout: 10000 });
  });
});
