import { SkyHostBrowser, SkyVisualThemeSelector, expect } from '@skyux-sdk/e2e';

import { by, element } from 'protractor';

describe('Paging', () => {
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

  beforeEach(async () => {
    currentTheme = undefined;
    currentThemeMode = undefined;

    await SkyHostBrowser.get('visual/paging');
    await SkyHostBrowser.setWindowBreakpoint('lg');
  });

  function validateFirstPage(done: DoneFn): void {
    expect('#screenshot-paging').toMatchBaselineScreenshot(done, {
      screenshotName: getScreenshotName('paging-first'),
    });
  }

  async function validateMiddlePage(done: DoneFn): Promise<void> {
    await element(by.css('button[sky-cmp-id="next"]')).click();

    expect('#screenshot-paging').toMatchBaselineScreenshot(done, {
      screenshotName: getScreenshotName('paging-middle'),
    });
  }

  it('should display first page selected', (done) => {
    validateFirstPage(done);
  });

  it('should display middle page selected', async (done) => {
    await validateMiddlePage(done);
  });

  describe('when modern theme', () => {
    beforeEach(async () => {
      await selectTheme('modern', 'light');
    });

    it('should display first page selected', (done) => {
      validateFirstPage(done);
    });

    it('should display middle page selected', async (done) => {
      await validateMiddlePage(done);
    });
  });

  describe('when modern theme in dark mode', () => {
    beforeEach(async () => {
      await selectTheme('modern', 'dark');
    });

    it('should display first page selected', (done) => {
      validateFirstPage(done);
    });

    it('should display middle page selected', async (done) => {
      await validateMiddlePage(done);
    });
  });
});
