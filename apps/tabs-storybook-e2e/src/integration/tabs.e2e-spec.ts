import { SkyHostBrowser, SkyVisualThemeSelector, expect } from '@skyux-sdk/e2e';

import { browser, by, element } from 'protractor';

describe('Tabs', () => {
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

  async function validateBasic(done: DoneFn): Promise<void> {
    await SkyHostBrowser.setWindowBreakpoint('lg');
    expect('#screenshot-tabset').toMatchBaselineScreenshot(done, {
      screenshotName: getScreenshotName('tabset'),
    });
  }

  async function validateSelectedTabHover(done: DoneFn): Promise<void> {
    await SkyHostBrowser.setWindowBreakpoint('lg');
    const tabElem = element(
      by.css('#screenshot-tabset sky-tab-button .sky-btn-tab-selected')
    );
    await browser.actions().mouseMove(tabElem).perform();
    expect('#screenshot-tabset').toMatchBaselineScreenshot(done, {
      screenshotName: getScreenshotName('tabset-hover'),
    });
    await SkyHostBrowser.moveCursorOffScreen();
  }

  async function validateBasicXs(done: DoneFn): Promise<void> {
    await SkyHostBrowser.setWindowBreakpoint('xs');
    expect('#screenshot-tabset').toMatchBaselineScreenshot(done, {
      screenshotName: getScreenshotName('tabset-xs'),
    });
  }

  async function validateSelectedTabHoverXs(done: DoneFn): Promise<void> {
    await SkyHostBrowser.setWindowBreakpoint('xs');
    const tabElem = element(
      by.css('#screenshot-tabset button.sky-dropdown-button-type-tab')
    );
    await browser.actions().mouseMove(tabElem).perform();
    expect('#screenshot-tabset').toMatchBaselineScreenshot(done, {
      screenshotName: getScreenshotName('tabset-xs-hover'),
    });
    await SkyHostBrowser.moveCursorOffScreen();
  }

  async function validateDropdownTabset(done: DoneFn): Promise<void> {
    await SkyHostBrowser.setWindowBreakpoint('xs');
    await element(
      by.css('#screenshot-tabset button.sky-dropdown-button-type-tab')
    ).click();
    expect('#screenshot-tabset').toMatchBaselineScreenshot(done, {
      screenshotName: getScreenshotName('tabset-xs-dropdown'),
    });
  }

  async function validateDropdownLongTabXs(done: DoneFn): Promise<void> {
    await SkyHostBrowser.setWindowBreakpoint('xs');
    await SkyHostBrowser.scrollTo('#screenshot-tabset-long');
    expect('#screenshot-tabset-long').toMatchBaselineScreenshot(done, {
      screenshotName: getScreenshotName('tabset-xs-dropdown-long'),
    });
  }

  beforeEach(async () => {
    currentTheme = undefined;
    currentThemeMode = undefined;

    await SkyHostBrowser.get('visual/tabs');
  });

  it('should match previous tabset screenshot', async (done) => {
    await validateBasic(done);
  });

  it('should match previous tabset screenshot when selected tab is hovered', async (done) => {
    await validateSelectedTabHover(done);
  });

  it('should match previous tabset screenshot (screen: xs)', async (done) => {
    await validateBasicXs(done);
  });

  it('should match previous tabset screenshot when tab is hovered (screen: xs)', async (done) => {
    await validateSelectedTabHoverXs(done);
  });

  it('should match previous dropdown tabset screenshot (screen: xs)', async (done) => {
    await validateDropdownTabset(done);
  });

  it('should match previous dropdown tabset screenshot with long tab (screen: xs)', async (done) => {
    await validateDropdownLongTabXs(done);
  });

  it('should match the tabset screenshot with wizard styling', async (done) => {
    await SkyHostBrowser.get('visual/tabs');
    await SkyHostBrowser.setWindowBreakpoint('lg');
    await element(by.css('.sky-test-show-wizard')).click();
    expect('#screenshot-tabset').toMatchBaselineScreenshot(done, {
      screenshotName: 'tabset-wizard',
    });
  });

  describe('when modern theme', () => {
    beforeEach(async () => {
      await selectTheme('modern', 'light');
    });

    it('should match previous tabset screenshot', async (done) => {
      await validateBasic(done);
    });

    it('should match previous tabset screenshot when selected tab is hovered', async (done) => {
      await validateSelectedTabHover(done);
    });

    it('should match previous tabset screenshot (screen: xs)', async (done) => {
      await validateBasicXs(done);
    });

    it('should match previous tabset screenshot when tab is hovered (screen: xs)', async (done) => {
      await validateSelectedTabHoverXs(done);
    });

    it('should match previous dropdown tabset screenshot (screen: xs)', async (done) => {
      await validateDropdownTabset(done);
    });

    it('should match previous dropdown tabset screenshot with long tab (screen: xs)', async (done) => {
      await validateDropdownLongTabXs(done);
    });
  });
});
