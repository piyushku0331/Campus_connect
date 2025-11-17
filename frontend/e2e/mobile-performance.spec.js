import { test, expect } from '@playwright/test';

test.describe('Mobile Performance', () => {
  test('home page loads within acceptable time on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - startTime;

    // Page should load within 3 seconds on mobile
    expect(loadTime).toBeLessThan(3000);

    // Check that critical content is visible quickly
    await expect(page.locator('h1')).toBeVisible({ timeout: 2000 });
  });

  test('navigation interactions are responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Test hamburger menu toggle response time
    const hamburgerButton = page.locator('button[aria-label="Toggle menu"]');

    const startTime = Date.now();
    await hamburgerButton.click();
    const clickTime = Date.now() - startTime;

    // Click should respond within 100ms
    expect(clickTime).toBeLessThan(100);

    // Menu should appear within 300ms
    const mobileMenu = page.locator('div').filter({ hasText: 'HomeServicesSupportAboutContactLoginSign Up' }).first();
    await expect(mobileMenu).toBeVisible({ timeout: 300 });
  });

  test('page scrolling is smooth on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Wait for page to stabilize
    await page.waitForTimeout(1000);

    // Measure scroll performance
    const scrollStartTime = Date.now();

    // Perform scroll
    await page.evaluate(() => {
      window.scrollTo({ top: 500, behavior: 'smooth' });
    });

    // Wait for scroll to complete
    await page.waitForTimeout(1000);

    const scrollEndTime = Date.now();
    const scrollDuration = scrollEndTime - scrollStartTime;

    // Smooth scroll should complete within reasonable time
    expect(scrollDuration).toBeLessThan(2000);

    // Verify scroll position
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(400);
  });

  test('image loading performance on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/news');

    // Wait for potential images to load
    await page.waitForTimeout(3000);

    // Check for any slow-loading images
    const images = page.locator('img');
    const imageCount = await images.count();

    if (imageCount > 0) {
      // Check that images load within reasonable time
      const loadTimes = [];

      for (let i = 0; i < Math.min(imageCount, 3); i++) {
        const image = images.nth(i);
        const loadTime = await image.evaluate(el => {
          return new Promise(resolve => {
            if (el.complete) {
              resolve(0);
            } else {
              const start = Date.now();
              el.addEventListener('load', () => resolve(Date.now() - start));
              el.addEventListener('error', () => resolve(Date.now() - start));
            }
          });
        });
        loadTimes.push(loadTime);
      }

      // Average load time should be reasonable
      const avgLoadTime = loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length;
      expect(avgLoadTime).toBeLessThan(2000); // 2 seconds max
    }
  });

  test('JavaScript execution performance on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Measure page load and JS execution time
    const metrics = await page.evaluate(() => {
      return new Promise(resolve => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const metrics = {
            domContentLoaded: 0,
            loadComplete: 0,
            firstPaint: 0,
            firstContentfulPaint: 0
          };

          entries.forEach(entry => {
            if (entry.entryType === 'navigation') {
              metrics.domContentLoaded = entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart;
              metrics.loadComplete = entry.loadEventEnd - entry.loadEventStart;
            } else if (entry.name === 'first-paint') {
              metrics.firstPaint = entry.startTime;
            } else if (entry.name === 'first-contentful-paint') {
              metrics.firstContentfulPaint = entry.startTime;
            }
          });

          resolve(metrics);
        });

        observer.observe({ entryTypes: ['navigation', 'paint'] });

        // Fallback timeout
        setTimeout(() => resolve({}), 5000);
      });
    });

    // Check key performance metrics
    if (metrics.domContentLoaded) {
      expect(metrics.domContentLoaded).toBeLessThan(2000);
    }

    if (metrics.firstContentfulPaint) {
      expect(metrics.firstContentfulPaint).toBeLessThan(2500);
    }
  });

  test('memory usage stays reasonable during interactions', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      if (performance.memory) {
        return performance.memory.usedJSHeapSize;
      }
      return 0;
    });

    // Perform several interactions
    const hamburgerButton = page.locator('button[aria-label="Toggle menu"]');

    for (let i = 0; i < 5; i++) {
      await hamburgerButton.click();
      await page.waitForTimeout(500);
    }

    // Check memory after interactions
    const afterMemory = await page.evaluate(() => {
      if (performance.memory) {
        return performance.memory.usedJSHeapSize;
      }
      return 0;
    });

    if (initialMemory && afterMemory) {
      const memoryIncrease = afterMemory - initialMemory;
      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    }
  });

  test('animations run smoothly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Test that CSS animations don't cause jank
    const animatedElements = page.locator('[class*="animate-"], [class*="transition-"]');
    const animatedCount = await animatedElements.count();

    // Check that animations use hardware acceleration where possible
    for (let i = 0; i < Math.min(animatedCount, 5); i++) {
      const element = animatedElements.nth(i);
      const willChange = await element.evaluate(el => window.getComputedStyle(el).willChange);
      const transform = await element.evaluate(el => window.getComputedStyle(el).transform);

      // Elements with animations should use GPU acceleration
      expect(willChange !== 'auto' || transform !== 'none').toBeTruthy();
    }
  });

  test('form interactions are fast on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/login');

    const emailInput = page.locator('input[name="email"]');

    // Measure input response time
    const inputStartTime = Date.now();
    await emailInput.type('test@example.com', { delay: 50 });
    const inputEndTime = Date.now();

    const inputDuration = inputEndTime - inputStartTime;

    // Typing should be responsive (allowing for delay)
    expect(inputDuration).toBeLessThan(2000);

    // Check that input value updates correctly
    await expect(emailInput).toHaveValue('test@example.com');
  });

  test('lazy loading improves performance on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/news');

    // Check that images below fold have loading="lazy"
    const images = page.locator('img');
    const imageCount = await images.count();

    let lazyLoadedCount = 0;
    for (let i = 0; i < imageCount; i++) {
      const loading = await images.nth(i).getAttribute('loading');
      if (loading === 'lazy') {
        lazyLoadedCount++;
      }
    }

    // At least some images should use lazy loading
    expect(lazyLoadedCount).toBeGreaterThan(0);
  });

  test('Core Web Vitals approximation on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Measure Largest Contentful Paint (LCP)
    const lcpPromise = page.evaluate(() => {
      return new Promise(resolve => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // Fallback
        setTimeout(() => resolve(0), 5000);
      });
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const lcp = await lcpPromise;

    // LCP should be under 2.5 seconds for good UX
    if (lcp > 0) {
      expect(lcp).toBeLessThan(2500);
    }

    // Check Cumulative Layout Shift (CLS)
    const cls = await page.evaluate(() => {
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
      }).observe({ entryTypes: ['layout-shift'] });

      return new Promise(resolve => {
        setTimeout(() => resolve(clsValue), 3000);
      });
    });

    // CLS should be under 0.1 for good UX
    expect(cls).toBeLessThan(0.1);
  });
});