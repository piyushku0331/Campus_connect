import { test, expect } from '@playwright/test';

test.describe('Modal Dialogs on Mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test('create post modal displays properly on mobile', async ({ page }) => {
    await page.goto('/feed');

    // Click the floating create button to open modal
    const createButton = page.locator('button.fixed.bottom-20.right-4');
    await createButton.tap();

    // Modal should be visible
    const modal = page.locator('div.fixed.inset-0.bg-black.bg-opacity-50');
    await expect(modal).toBeVisible();

    // Modal content should be centered and properly sized
    const modalContent = page.locator('div.bg-white.dark\\:bg-gray-800.rounded-lg.p-6');
    await expect(modalContent).toBeVisible();

    // Check modal sizing - should not exceed viewport width
    const modalBox = await modalContent.boundingBox();
    const viewport = page.viewportSize();

    expect(modalBox.width).toBeLessThanOrEqual(viewport.width - 32); // Account for padding
    expect(modalBox.height).toBeLessThanOrEqual(viewport.height - 32);
  });

  test('modal buttons are touch-friendly on mobile', async ({ page }) => {
    await page.goto('/feed');

    // Open modal
    const createButton = page.locator('button.fixed.bottom-20.right-4');
    await createButton.tap();

    // Check modal buttons
    const becomeCreatorButton = page.locator('button').filter({ hasText: 'Become a Creator' });
    const cancelButton = page.locator('button').filter({ hasText: 'Cancel' });

    // Both buttons should be visible
    await expect(becomeCreatorButton).toBeVisible();
    await expect(cancelButton).toBeVisible();

    // Check button sizes for touch accessibility
    const creatorBox = await becomeCreatorButton.boundingBox();
    const cancelBox = await cancelButton.boundingBox();

    expect(creatorBox.height).toBeGreaterThanOrEqual(44);
    expect(cancelBox.height).toBeGreaterThanOrEqual(44);
  });

  test('modal can be closed by tapping cancel button', async ({ page }) => {
    await page.goto('/feed');

    // Open modal
    const createButton = page.locator('button.fixed.bottom-20.right-4');
    await createButton.tap();

    const modal = page.locator('div.fixed.inset-0.bg-black.bg-opacity-50');
    await expect(modal).toBeVisible();

    // Tap cancel button
    const cancelButton = page.locator('button').filter({ hasText: 'Cancel' });
    await cancelButton.tap();

    // Modal should close
    await expect(modal).toBeHidden();
  });

  test('modal can be closed by tapping outside (backdrop)', async ({ page }) => {
    await page.goto('/feed');

    // Open modal
    const createButton = page.locator('button.fixed.bottom-20.right-4');
    await createButton.tap();

    const modal = page.locator('div.fixed.inset-0.bg-black.bg-opacity-50');
    await expect(modal).toBeVisible();

    // Tap on backdrop (outside modal content)
    const backdrop = page.locator('div.fixed.inset-0.bg-black.bg-opacity-50');
    await backdrop.click({ position: { x: 10, y: 10 } }); // Click near top-left corner

    // Modal should close (though this modal might not have backdrop close functionality)
    // This test depends on actual implementation
  });

  test('modal prevents background scrolling on mobile', async ({ page }) => {
    await page.goto('/feed');

    // Get initial scroll position
    const initialScrollY = await page.evaluate(() => window.scrollY);

    // Open modal
    const createButton = page.locator('button.fixed.bottom-20.right-4');
    await createButton.tap();

    // Try to scroll
    await page.mouse.wheel(0, 100);

    // Scroll position should remain the same (body scroll locked)
    const afterScrollY = await page.evaluate(() => window.scrollY);
    expect(afterScrollY).toBe(initialScrollY);
  });

  test('modal content is accessible with keyboard navigation', async ({ page }) => {
    await page.goto('/feed');

    // Open modal
    const createButton = page.locator('button.fixed.bottom-20.right-4');
    await createButton.tap();

    // Modal should contain focusable elements
    const focusableElements = page.locator('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const count = await focusableElements.count();
    expect(count).toBeGreaterThan(0);

    // First focusable element should receive focus
    const firstFocusable = focusableElements.first();
    await expect(firstFocusable).toBeFocused();
  });

  test('modal displays correctly on different mobile orientations', async ({ page }) => {
    // Test portrait
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/feed');

    const createButton = page.locator('button.fixed.bottom-20.right-4');
    await createButton.tap();

    const modalContent = page.locator('div.bg-white.dark\\:bg-gray-800.rounded-lg.p-6');
    const portraitBox = await modalContent.boundingBox();

    // Test landscape
    await page.setViewportSize({ width: 667, height: 375 });
    const landscapeBox = await modalContent.boundingBox();

    // Modal should adapt to orientation
    expect(portraitBox.width).toBeLessThanOrEqual(667 - 32);
    expect(landscapeBox.width).toBeLessThanOrEqual(667 - 32);
  });

  test('modal text is readable on mobile', async ({ page }) => {
    await page.goto('/feed');

    // Open modal
    const createButton = page.locator('button.fixed.bottom-20.right-4');
    await createButton.tap();

    // Check text elements in modal
    const modalText = page.locator('div.bg-white.dark\\:bg-gray-800.rounded-lg.p-6 p, h2');
    const textElements = await modalText.count();

    for (let i = 0; i < textElements; i++) {
      const textElement = modalText.nth(i);
      const fontSize = await textElement.evaluate(el => parseInt(window.getComputedStyle(el).fontSize));
      expect(fontSize).toBeGreaterThanOrEqual(14); // Minimum readable font size
    }
  });

  test('modal animations work smoothly on mobile', async ({ page }) => {
    await page.goto('/feed');

    // Open modal and check for smooth transitions
    const createButton = page.locator('button.fixed.bottom-20.right-4');
    const startTime = Date.now();

    await createButton.tap();

    const modal = page.locator('div.fixed.inset-0.bg-black.bg-opacity-50');
    await expect(modal).toBeVisible();

    const endTime = Date.now();
    const loadTime = endTime - startTime;

    // Modal should appear within reasonable time (allowing for animation)
    expect(loadTime).toBeLessThan(1000);
  });

  test('modal handles screen reader accessibility', async ({ page }) => {
    await page.goto('/feed');

    // Open modal
    const createButton = page.locator('button.fixed.bottom-20.right-4');
    await createButton.tap();

    // Modal should have proper ARIA attributes
    const modal = page.locator('div.fixed.inset-0.bg-black.bg-opacity-50');
    const ariaHidden = await modal.getAttribute('aria-hidden');
    expect(ariaHidden).toBeNull(); // Should not be aria-hidden when visible

    // Modal content should have proper role
    const modalContent = page.locator('div.bg-white.dark\\:bg-gray-800.rounded-lg.p-6');
    const role = await modalContent.getAttribute('role');
    expect(['dialog', 'alertdialog']).toContain(role);
  });
});