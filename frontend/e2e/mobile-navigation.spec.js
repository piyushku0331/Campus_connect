import { test, expect } from '@playwright/test';

test.describe('Mobile Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');
  });

  test('hamburger menu is visible on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that hamburger menu button is visible
    const hamburgerButton = page.locator('button[aria-label="Toggle menu"]');
    await expect(hamburgerButton).toBeVisible();

    // Check that desktop navigation is hidden
    const desktopNav = page.locator('.hidden.md\\:flex');
    await expect(desktopNav).toBeHidden();
  });

  test('hamburger menu is hidden on desktop viewport', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1024, height: 768 });

    // Check that hamburger menu button is hidden
    const hamburgerButton = page.locator('button[aria-label="Toggle menu"]');
    await expect(hamburgerButton).toBeHidden();

    // Check that desktop navigation is visible
    const desktopNav = page.locator('.hidden.md\\:flex');
    await expect(desktopNav).toBeVisible();
  });

  test('clicking hamburger menu toggles mobile menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const hamburgerButton = page.locator('button[aria-label="Toggle menu"]');
    const mobileMenu = page.locator('div[ref="mobileMenuRef"]');

    // Initially mobile menu should be hidden
    await expect(mobileMenu).toBeHidden();

    // Click hamburger to open menu
    await hamburgerButton.click();
    await expect(mobileMenu).toBeVisible();
    await expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true');

    // Click again to close menu
    await hamburgerButton.click();
    await expect(mobileMenu).toBeHidden();
    await expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('mobile menu contains all navigation items', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const hamburgerButton = page.locator('button[aria-label="Toggle menu"]');

    // Open mobile menu
    await hamburgerButton.click();

    // Check for main navigation items
    const navItems = [
      'Home',
      'Services',
      'Support',
      'About',
      'Contact',
      'Login',
      'Sign Up'
    ];

    for (const item of navItems) {
      await expect(page.locator(`text=${item}`)).toBeVisible();
    }
  });

  test('mobile menu closes when clicking navigation item', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const hamburgerButton = page.locator('button[aria-label="Toggle menu"]');
    const mobileMenu = page.locator('div[ref="mobileMenuRef"]');

    // Open mobile menu
    await hamburgerButton.click();
    await expect(mobileMenu).toBeVisible();

    // Click on a navigation item (Home)
    await page.locator('text=Home').click();

    // Menu should close
    await expect(mobileMenu).toBeHidden();
  });

  test('mobile menu supports keyboard navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const hamburgerButton = page.locator('button[aria-label="Toggle menu"]');
    const mobileMenu = page.locator('div[ref="mobileMenuRef"]');

    // Focus on hamburger button
    await hamburgerButton.focus();
    await expect(hamburgerButton).toBeFocused();

    // Press Enter to open menu
    await page.keyboard.press('Enter');
    await expect(mobileMenu).toBeVisible();

    // Press Escape to close menu
    await page.keyboard.press('Escape');
    await expect(mobileMenu).toBeHidden();
  });

  test('services dropdown works in mobile menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const hamburgerButton = page.locator('button[aria-label="Toggle menu"]');

    // Open mobile menu
    await hamburgerButton.click();

    // Click on Services to expand dropdown
    await page.locator('text=Services').click();

    // Check that dropdown items are visible
    const dropdownItems = [
      'Dashboard',
      'Feed',
      'News',
      'Blog',
      'Profile',
      'Lost & Found',
      'Resources',
      'Events',
      'Networking',
      'Alumni'
    ];

    for (const item of dropdownItems) {
      await expect(page.locator(`text=${item}`)).toBeVisible();
    }
  });
});