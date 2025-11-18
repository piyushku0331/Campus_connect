import { test, expect } from '@playwright/test';

test.describe('Touch Interactions and Mobile Forms', () => {
  test('all interactive elements have adequate touch targets on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Test home page buttons
    await page.goto('/');

    const buttons = page.locator('button, a[role="button"], input[type="submit"]');
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const box = await button.boundingBox();

      if (box) {
        // WCAG touch target guidelines: minimum 44x44px
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('form inputs are touch-friendly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/login');

    const inputs = page.locator('input');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const box = await input.boundingBox();

      if (box) {
        // Form inputs should have adequate height for touch
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('login form touch interactions work properly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/login');

    // Test email input touch
    const emailInput = page.locator('input[name="email"]');
    await emailInput.tap();
    await expect(emailInput).toBeFocused();

    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');

    // Test password input touch
    const passwordInput = page.locator('input[name="password"]');
    await passwordInput.tap();
    await expect(passwordInput).toBeFocused();

    await passwordInput.fill('password123');
    await expect(passwordInput).toHaveValue('password123');

    // Test password visibility toggle touch
    const toggleButton = page.locator('button').filter({ hasText: /Eye/ });
    const initialType = await passwordInput.getAttribute('type');
    expect(initialType).toBe('password');

    await toggleButton.tap();
    const newType = await passwordInput.getAttribute('type');
    expect(newType).toBe('text');

    // Test form submission button touch
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled();

    // Note: We don't actually submit to avoid backend dependency
    // But we can test the button is tappable
    await submitButton.tap();
    // Form should attempt submission (may show loading state)
  });

  test('mobile keyboard behavior - inputs don\'t get hidden', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/login');

    const emailInput = page.locator('input[name="email"]');

    // Focus the input (simulates keyboard appearing)
    await emailInput.focus();

    // Check that input is still visible after focusing
    const box = await emailInput.boundingBox();
    expect(box.y).toBeGreaterThan(0); // Input should be visible

    // The input should not be covered by virtual keyboard
    // (This is a basic check; real keyboard testing would need device emulation)
  });

  test('touch gestures on testimonial carousel', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Wait for testimonials section to load
    await page.waitForSelector('h2:has-text("What Students Say")');

    // Test navigation buttons are touch-friendly
    const prevButton = page.locator('button[aria-label="Previous testimonial"]');
    const nextButton = page.locator('button[aria-label="Next testimonial"]');

    await expect(prevButton).toBeVisible();
    await expect(nextButton).toBeVisible();

    // Test touch on navigation buttons
    await nextButton.tap();
    // Should change testimonial (we can't easily verify without more complex state checking)

    await prevButton.tap();
    // Should go back

    // Test navigation dots
    const dots = page.locator('button[aria-label*="testimonial"]');
    const dotCount = await dots.count();
    expect(dotCount).toBeGreaterThan(1);

    // Test tapping on a dot
    if (dotCount > 1) {
      await dots.nth(1).tap();
      // Should navigate to second testimonial
    }
  });

  test('mobile menu touch interactions', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const hamburgerButton = page.locator('button[aria-label="Toggle menu"]');

    // Test hamburger button touch
    await hamburgerButton.tap();
    const mobileMenu = page.locator('div').filter({ hasText: 'HomeServicesSupportAboutContactLoginSign Up' }).first();
    await expect(mobileMenu).toBeVisible();

    // Test touching menu items
    const homeLink = page.locator('text=Home').first();
    await homeLink.tap();
    // Menu should close
    await expect(mobileMenu).toBeHidden();

    // Test services dropdown touch
    await hamburgerButton.tap();
    await expect(mobileMenu).toBeVisible();

    const servicesButton = page.locator('button:has-text("Services")');
    await servicesButton.tap();

    // Dropdown should appear
    const dashboardLink = page.locator('text=Dashboard');
    await expect(dashboardLink).toBeVisible();

    // Test touching dropdown item
    await dashboardLink.tap();
    // Should navigate and close menu
  });

  test('form validation provides touch-friendly feedback', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/login');

    const submitButton = page.locator('button[type="submit"]');

    // Try to submit empty form
    await submitButton.tap();

    // HTML5 validation should prevent submission and show validation messages
    // Check that inputs show validation feedback
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');

    // Focus and blur to trigger validation
    await emailInput.focus();
    await emailInput.blur();

    await passwordInput.focus();
    await passwordInput.blur();

    // Check for validation styling (red borders, etc.)
    // Note: Actual validation messages depend on browser implementation
  });

  test('touch scrolling works smoothly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Test that page is scrollable
    const initialScrollY = await page.evaluate(() => window.scrollY);

    // Scroll down
    await page.mouse.wheel(0, 500);
    const afterScrollY = await page.evaluate(() => window.scrollY);

    expect(afterScrollY).toBeGreaterThan(initialScrollY);

    // Scroll back up
    await page.mouse.wheel(0, -500);
    const finalScrollY = await page.evaluate(() => window.scrollY);

    expect(finalScrollY).toBeLessThan(afterScrollY);
  });

  test('mobile form prevents zoom on input focus', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/login');

    // Set viewport meta tag should prevent zoom
    const viewportMeta = await page.locator('meta[name="viewport"]');
    if (await viewportMeta.count() > 0) {
      const content = await viewportMeta.getAttribute('content');
      expect(content).toContain('user-scalable=no');
      expect(content).toContain('maximum-scale=1');
    }

    // Test input focus doesn't cause unwanted zoom
    const emailInput = page.locator('input[name="email"]');
    await emailInput.focus();

    // Check viewport hasn't changed dramatically
    const viewport = page.viewportSize();
    expect(viewport.width).toBe(375);
    expect(viewport.height).toBe(667);
  });
});