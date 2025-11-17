import { test, expect } from '@playwright/test';

test.describe('Responsive Layouts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('hero section text scales responsively', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileHeading = page.locator('h1').first();
    const mobileFontSize = await mobileHeading.evaluate(el => window.getComputedStyle(el).fontSize);
    expect(parseInt(mobileFontSize)).toBeLessThan(50); // Should be smaller on mobile

    // Tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    const tabletHeading = page.locator('h1').first();
    const tabletFontSize = await tabletHeading.evaluate(el => window.getComputedStyle(el).fontSize);
    expect(parseInt(tabletFontSize)).toBeGreaterThan(parseInt(mobileFontSize));

    // Desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    const desktopHeading = page.locator('h1').first();
    const desktopFontSize = await desktopHeading.evaluate(el => window.getComputedStyle(el).fontSize);
    expect(parseInt(desktopFontSize)).toBeGreaterThan(parseInt(tabletFontSize));
  });

  test('hero buttons layout changes responsively', async ({ page }) => {
    // Mobile viewport - buttons should stack vertically
    await page.setViewportSize({ width: 375, height: 667 });
    const buttonContainer = page.locator('.flex.flex-col.sm\\:flex-row');
    await expect(buttonContainer).toHaveClass(/flex-col/);
    await expect(buttonContainer).not.toHaveClass(/sm:flex-row/);

    // Desktop viewport - buttons should be horizontal
    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(buttonContainer).toHaveClass(/sm:flex-row/);
  });

  test('features grid adapts to screen size', async ({ page }) => {
    // Mobile viewport - single column
    await page.setViewportSize({ width: 375, height: 667 });
    const featuresGrid = page.locator('.grid.grid-cols-1');
    await expect(featuresGrid).toBeVisible();

    // Check that feature cards are stacked
    const featureCards = page.locator('.feature-card');
    const cardCount = await featureCards.count();
    expect(cardCount).toBeGreaterThan(0);

    // Tablet viewport - 2 columns
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('.grid.grid-cols-1.sm\\:grid-cols-2')).toBeVisible();

    // Desktop viewport - 3 columns
    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(page.locator('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3')).toBeVisible();
  });

  test('team members grid is responsive', async ({ page }) => {
    // Mobile viewport - single column
    await page.setViewportSize({ width: 375, height: 667 });
    const teamGrid = page.locator('.grid.grid-cols-1');
    await expect(teamGrid).toBeVisible();

    // Tablet viewport - 2 columns
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('.grid.grid-cols-1.sm\\:grid-cols-2')).toBeVisible();

    // Desktop viewport - 4 columns
    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(page.locator('.grid.grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-4')).toBeVisible();
  });

  test('testimonial carousel navigation is touch-friendly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that navigation buttons are appropriately sized for touch
    const prevButton = page.locator('button[aria-label="Previous testimonial"]');
    const nextButton = page.locator('button[aria-label="Next testimonial"]');

    // Buttons should be visible and have minimum touch target size
    await expect(prevButton).toBeVisible();
    await expect(nextButton).toBeVisible();

    // Check button dimensions (should be at least 44px for touch targets)
    const prevBox = await prevButton.boundingBox();
    const nextBox = await nextButton.boundingBox();

    expect(prevBox.width).toBeGreaterThanOrEqual(44);
    expect(prevBox.height).toBeGreaterThanOrEqual(44);
    expect(nextBox.width).toBeGreaterThanOrEqual(44);
    expect(nextBox.height).toBeGreaterThanOrEqual(44);
  });

  test('content padding adjusts for different screen sizes', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileSection = page.locator('section').first();
    const mobilePadding = await mobileSection.evaluate(el => window.getComputedStyle(el).paddingLeft);
    expect(parseInt(mobilePadding)).toBeLessThan(50); // Smaller padding on mobile

    // Desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    const desktopSection = page.locator('section').first();
    const desktopPadding = await desktopSection.evaluate(el => window.getComputedStyle(el).paddingLeft);
    expect(parseInt(desktopPadding)).toBeGreaterThan(parseInt(mobilePadding));
  });

  test('navigation bar hides/shows appropriately', async ({ page }) => {
    // Mobile viewport - hamburger visible, desktop nav hidden
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('button[aria-label="Toggle menu"]')).toBeVisible();
    await expect(page.locator('nav .hidden.md\\:flex')).toBeHidden();

    // Desktop viewport - hamburger hidden, desktop nav visible
    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(page.locator('button[aria-label="Toggle menu"]')).toBeHidden();
    await expect(page.locator('nav .hidden.md\\:flex')).toBeVisible();
  });

  test('images and media scale properly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that images don't overflow their containers
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i);
      const box = await image.boundingBox();
      const container = image.locator('..');

      if (box && container) {
        const containerBox = await container.boundingBox();
        if (containerBox) {
          expect(box.width).toBeLessThanOrEqual(containerBox.width);
          expect(box.height).toBeLessThanOrEqual(containerBox.height);
        }
      }
    }
  });

  test('text remains readable on all screen sizes', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 }, // iPhone SE
      { width: 375, height: 667 }, // iPhone 6/7/8
      { width: 414, height: 896 }, // iPhone 11
      { width: 768, height: 1024 }, // iPad
      { width: 1024, height: 768 }, // Small desktop
      { width: 1920, height: 1080 } // Large desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);

      // Check that main headings are visible and have appropriate font sizes
      const headings = page.locator('h1, h2, h3');
      const headingCount = await headings.count();

      for (let i = 0; i < headingCount; i++) {
        const heading = headings.nth(i);
        await expect(heading).toBeVisible();

        const fontSize = await heading.evaluate(el => parseInt(window.getComputedStyle(el).fontSize));
        expect(fontSize).toBeGreaterThan(12); // Minimum readable font size
        expect(fontSize).toBeLessThan(200); // Maximum reasonable font size
      }

      // Check that body text is readable
      const paragraphs = page.locator('p');
      const paragraphCount = await paragraphs.count();

      for (let i = 0; i < Math.min(paragraphCount, 5); i++) { // Check first 5 paragraphs
        const paragraph = paragraphs.nth(i);
        const fontSize = await paragraph.evaluate(el => parseInt(window.getComputedStyle(el).fontSize));
        expect(fontSize).toBeGreaterThanOrEqual(14); // Minimum readable body text
      }
    }
  });
});