import { SkyHostBrowser, SkyVisualThemeSelector, expect } from '@skyux-sdk/e2e';

import { by, element } from 'protractor';

describe('Sort', () => {
  let currentTheme: string;
  let currentThemeMode: string;

  async function selectTheme(theme: string, mode: string): Promise<void> {
    currentTheme = theme;
    currentThemeMode = mode;

    return SkyVisualThemeSelector.selectTheme(theme, mode);
  }

  function getScreenshotName(name: string): string {
    if (currentTheme) {
      name += '-' + currentTheme;
    }

    if (currentThemeMode) {
      name += '-' + currentThemeMode;
    }

    return name;
  }

  async function runTests(): Promise<void> {
    it('should match the baseline sort screenshot', async (done) => {
      await SkyHostBrowser.setWindowBreakpoint('lg');
      await SkyHostBrowser.scrollTo('#screenshot-sort-full');
      expect('#screenshot-sort-full').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('sort'),
      });
    });

    it('should match the baseline sort screenshot when dropdown is open', async (done) => {
      await SkyHostBrowser.setWindowBreakpoint('lg');
      await SkyHostBrowser.scrollTo('#screenshot-sort-full');
      await element(by.css('.sky-btn-default')).click();
      expect('#screenshot-sort-full').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('sort-open'),
      });
    });

    it('should match the baseline sort screenshot when text is shown', async (done) => {
      await SkyHostBrowser.setWindowBreakpoint('lg');
      await SkyHostBrowser.scrollTo('#screenshot-sort-text');
      expect('#screenshot-sort-text').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('sort-text'),
      });
    });

    it('should match the baseline sort screenshot when text is on but the screen is small', async (done) => {
      await SkyHostBrowser.setWindowBreakpoint('xs');
      await SkyHostBrowser.scrollTo('#screenshot-sort-text');
      expect('#screenshot-sort-text').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('sort-text-small'),
      });
    });
  }

  beforeEach(async () => {
    currentTheme = undefined;
    currentThemeMode = undefined;

    await SkyHostBrowser.get('visual/sort');
  });

  runTests();

  describe('when modern theme', () => {
    beforeEach(async () => {
      await selectTheme('modern', 'light');
    });

    runTests();
  });

  describe('when modern theme in dark mode', () => {
    beforeEach(async () => {
      await selectTheme('modern', 'dark');
    });

    runTests();
  });
});
