import { test, expect } from '@playwright/test';

test.describe('Image and Video Display on Mobile', () => {
  test('news article images display properly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Navigate to news page
    await page.goto('/news');

    // Wait for news to load (may need to mock API or wait for loading to finish)
    await page.waitForTimeout(2000); // Allow time for API call

    // Check if there are any images
    const images = page.locator('img');
    const imageCount = await images.count();

    if (imageCount > 0) {
      // Test first image
      const firstImage = images.first();
      await expect(firstImage).toBeVisible();

      // Check that image has proper object-fit
      const objectFit = await firstImage.evaluate(el => window.getComputedStyle(el).objectFit);
      expect(['cover', 'contain', 'fill', 'none', 'scale-down']).toContain(objectFit);

      // Check that image doesn't overflow its container
      const imageBox = await firstImage.boundingBox();
      const container = firstImage.locator('..');
      const containerBox = await container.boundingBox();

      if (imageBox && containerBox) {
        expect(imageBox.width).toBeLessThanOrEqual(containerBox.width + 1); // Allow 1px tolerance
        expect(imageBox.height).toBeLessThanOrEqual(containerBox.height + 1);
      }

      // Check aspect ratio is maintained (roughly)
      if (imageBox) {
        const aspectRatio = imageBox.width / imageBox.height;
        expect(aspectRatio).toBeGreaterThan(0.5);
        expect(aspectRatio).toBeLessThan(3);
      }
    }
  });

  test('logo image scales appropriately on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check navbar logo
    const logo = page.locator('img[alt*="Logo"]');
    await expect(logo).toBeVisible();

    // Check logo dimensions are reasonable for mobile
    const logoBox = await logo.boundingBox();
    if (logoBox) {
      expect(logoBox.width).toBeGreaterThan(20);
      expect(logoBox.height).toBeGreaterThan(20);
      expect(logoBox.width).toBeLessThan(100);
      expect(logoBox.height).toBeLessThan(100);
    }
  });

  test('images load without errors on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/news');

    await page.waitForTimeout(3000); // Wait for images to load

    // Listen for failed image loads
    const failedImages = [];
    page.on('response', response => {
      if (response.url().match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) && !response.ok()) {
        failedImages.push(response.url());
      }
    });

    // Check that no images failed to load
    expect(failedImages.length).toBe(0);
  });

  test('image lazy loading works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/news');

    // Check that images have loading="lazy" attribute
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const loading = await images.nth(i).getAttribute('loading');
      expect(loading).toBe('lazy');
    }
  });

  test('images maintain quality on high-DPI mobile screens', async ({ page }) => {
    // Set viewport to simulate high-DPI mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.setViewportSize({ width: 375, height: 667, deviceScaleFactor: 2 });

    await page.goto('/news');

    const images = page.locator('img');
    const imageCount = await images.count();

    if (imageCount > 0) {
      // Check that images don't appear pixelated (basic check)
      const firstImage = images.first();
      const naturalWidth = await firstImage.evaluate(el => el.naturalWidth);
      const naturalHeight = await firstImage.evaluate(el => el.naturalHeight);

      // Images should have reasonable natural dimensions
      expect(naturalWidth).toBeGreaterThan(100);
      expect(naturalHeight).toBeGreaterThan(100);
    }
  });

  test('background images scale properly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check hero background
    const heroSection = page.locator('section').first();
    const backgroundImage = await heroSection.evaluate(el => window.getComputedStyle(el).backgroundImage);

    if (backgroundImage && backgroundImage !== 'none') {
      // Background should be properly sized
      const backgroundSize = await heroSection.evaluate(el => window.getComputedStyle(el).backgroundSize);
      expect(backgroundSize).toMatch(/(cover|contain|auto|\d+px)/);
    }
  });

  test('avatar images display correctly in testimonials', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Look for testimonial avatars (they might be text-based like "👋" or actual images)
    const avatars = page.locator('.w-16.h-16'); // Avatar containers
    const avatarCount = await avatars.count();

    if (avatarCount > 0) {
      // Check avatar sizing
      const firstAvatar = avatars.first();
      const avatarBox = await firstAvatar.boundingBox();

      if (avatarBox) {
        // Avatars should be appropriately sized
        expect(avatarBox.width).toBeGreaterThanOrEqual(32);
        expect(avatarBox.height).toBeGreaterThanOrEqual(32);
        expect(avatarBox.width).toBeLessThanOrEqual(100);
        expect(avatarBox.height).toBeLessThanOrEqual(100);
      }
    }
  });

  test('image alt text is present for accessibility', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/news');

    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
      expect(alt.length).toBeGreaterThan(0);
    }
  });

  test('images don\'t cause horizontal scrolling on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/news');

    // Check that page width doesn't exceed viewport
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = page.viewportSize().width;

    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
  });

  test('video elements (if present) display properly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Check various pages for video elements
    const pages = ['/', '/news', '/blog'];

    for (const pageUrl of pages) {
      await page.goto(pageUrl);

      const videos = page.locator('video');
      const videoCount = await videos.count();

      if (videoCount > 0) {
        const firstVideo = videos.first();
        await expect(firstVideo).toBeVisible();

        // Check video attributes
        const controls = await firstVideo.getAttribute('controls');
        expect(controls).toBeTruthy();

        // Check video sizing
        const videoBox = await firstVideo.boundingBox();
        if (videoBox) {
          expect(videoBox.width).toBeLessThanOrEqual(page.viewportSize().width);
        }

        break; // Found videos, no need to check other pages
      }
    }
  });
});