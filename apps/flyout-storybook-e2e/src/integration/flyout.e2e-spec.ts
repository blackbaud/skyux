import { SkyHostBrowser, SkyVisualThemeSelector, expect } from '@skyux-sdk/e2e';
import { SkyHostBrowserBreakpoint } from '@skyux-sdk/e2e/host-browser/host-browser-breakpoint';

import { browser, by, element } from 'protractor';

describe('Flyout', () => {
  //#region helpers
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

  async function openDropdown(): Promise<void> {
    await element(by.css('.sky-flyout .sky-dropdown-button')).click();
    await SkyHostBrowser.moveCursorOffScreen();
  }

  async function validateFlyout(
    size: SkyHostBrowserBreakpoint,
    done: DoneFn
  ): Promise<void> {
    await SkyHostBrowser.setWindowBreakpoint(size);
    element(by.css('.sky-btn-primary')).click();
    expect('body').toMatchBaselineScreenshot(done, {
      screenshotName: getScreenshotName(`flyout-${size}`),
    });
  }

  async function validateDropdownInFlyout(
    size: SkyHostBrowserBreakpoint,
    done: DoneFn
  ): Promise<void> {
    await SkyHostBrowser.setWindowBreakpoint(size);
    await element(by.css('.sky-btn-primary')).click();
    await browser.sleep(250);
    await openDropdown();
    expect('body').toMatchBaselineScreenshot(done, {
      screenshotName: getScreenshotName(`flyout-absolute-${size}`),
    });
  }

  async function validateIteratorButtons(
    size: SkyHostBrowserBreakpoint,
    done: DoneFn
  ): Promise<void> {
    await SkyHostBrowser.setWindowBreakpoint(size);
    await element(by.css('#open-flyout-with-iterators')).click();
    expect('body').toMatchBaselineScreenshot(done, {
      screenshotName: getScreenshotName(`flyout-iterators-${size}`),
    });
  }

  async function validateDisabledIteratorButtons(
    size: SkyHostBrowserBreakpoint,
    done: DoneFn
  ): Promise<void> {
    await SkyHostBrowser.setWindowBreakpoint(size);
    await element(by.css('#open-flyout-with-iterators-disabled')).click();
    expect('body').toMatchBaselineScreenshot(done, {
      screenshotName: getScreenshotName(`flyout-no-iterators-${size}`),
    });
  }

  async function validateFullScreen(
    size: SkyHostBrowserBreakpoint,
    done: DoneFn
  ): Promise<void> {
    await SkyHostBrowser.setWindowBreakpoint(size);
    await element(by.css('#open-flyout-fullscreen')).click();
    expect('body').toMatchBaselineScreenshot(done, {
      screenshotName: getScreenshotName(`flyout-fullscreen-${size}`),
    });
  }

  async function validateResponsiveContainer(
    size: SkyHostBrowserBreakpoint,
    done: DoneFn
  ): Promise<void> {
    // Since we're testing the responsive container inside the flyout,
    // the browser should always run with a large breakpoint.
    await SkyHostBrowser.setWindowBreakpoint('lg');
    await element(by.css(`#open-responsive-flyout-${size}`)).click();
    expect('body').toMatchBaselineScreenshot(done, {
      screenshotName: getScreenshotName(`flyout-responsive-${size}`),
    });
  }

  async function closeFlyout(): Promise<void> {
    const closeButton = element(by.css('.sky-flyout-btn-close'));
    if (closeButton) {
      await closeButton.click();
    }
  }

  function runTests(): void {
    it('should match previous screenshot', async (done) => {
      await validateFlyout('lg', done);
    });

    it('should match previous screenshot (screen: xs)', async (done) => {
      await validateFlyout('xs', done);
    });

    it('should handle absolutely positioned items inside the flyout', async (done) => {
      await validateDropdownInFlyout('lg', done);
    });

    it('should handle absolutely positioned items inside the flyout (screen: xs)', async (done) => {
      await validateDropdownInFlyout('xs', done);
    });

    it('should match previous screenshot when row iterators are enabled', async (done) => {
      await validateIteratorButtons('lg', done);
    });

    it('should match previous screenshot when row iterators are enabled (screen: xs)', async (done) => {
      await validateIteratorButtons('xs', done);
    });

    it('should match previous screenshot when row iterators are disabled', async (done) => {
      await validateDisabledIteratorButtons('lg', done);
    });

    it('should match previous screenshot when row iterator are disabled (screen: xs)', async (done) => {
      await validateDisabledIteratorButtons('xs', done);
    });

    it('should match previous screenshot when flyout is fullscreen (screen: xs)', async (done) => {
      await validateFullScreen('xs', done);
    });

    it('should match previous screenshot when the flyout contains responsive content (flyout: xs)', async (done) => {
      await validateResponsiveContainer('xs', done);
    });

    it('should match previous screenshot when the flyout contains responsive content (flyout: sm)', async (done) => {
      await validateResponsiveContainer('sm', done);
    });

    it('should match previous screenshot when the flyout contains responsive content (flyout: md)', async (done) => {
      await validateResponsiveContainer('md', done);
    });

    it('should match previous screenshot when the flyout contains responsive content (flyout: lg)', async (done) => {
      await validateResponsiveContainer('lg', done);
    });
  }
  //#endregion

  beforeEach(async () => {
    currentTheme = undefined;
    currentThemeMode = undefined;

    await SkyHostBrowser.get('visual/flyout');
  });

  afterEach(async () => {
    await closeFlyout();
  });

  runTests();

  it('should match previous screenshot when the flyout contains responsive content (screen: xs)', async (done) => {
    await SkyHostBrowser.setWindowBreakpoint('xs');
    await element(by.css('#open-responsive-flyout-lg')).click();
    expect('body').toMatchBaselineScreenshot(done, {
      screenshotName: 'flyout-responsive-lg-screen-xs',
    });
  });

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
