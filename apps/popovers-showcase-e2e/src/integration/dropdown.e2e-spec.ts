import { SkyHostBrowser, SkyVisualThemeSelector, expect } from '@skyux-sdk/e2e';

import { Key, browser, by, element } from 'protractor';

describe('Dropdown', () => {
  let currentTheme: string;
  let currentThemeMode: string;

  //#region helpers
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

  function validateAll() {
    it('should match dropdown button screenshot when closed', async (done) => {
      await SkyHostBrowser.scrollTo('#screenshot-dropdown-button');

      expect('#screenshot-dropdown-button').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('dropdown-button-closed'),
      });
    });

    it('should match dropdown button screenshot when open', async (done) => {
      await SkyHostBrowser.scrollTo('#screenshot-dropdown-button');

      await element(
        by.css('#screenshot-dropdown-button .sky-dropdown-button')
      ).click();

      expect('#screenshot-dropdown-button').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('dropdown-button-open'),
      });
    });

    it('should match dropdown button screenshot when dropdown item is focused', async (done) => {
      await SkyHostBrowser.scrollTo('#screenshot-dropdown-button');

      const buttonEl = element(
        by.css('#screenshot-dropdown-button .sky-dropdown-button')
      );

      // Click the button to focus it, then click it again to collapse the menu.
      await buttonEl.click();
      await buttonEl.click();

      // Now that the button is focused, use the Arrow Down key to expand the menu, which
      // will also set focus on the first dropdown item.
      await buttonEl.sendKeys(Key.ARROW_DOWN);
      await browser.driver.sleep(250);

      expect('#screenshot-dropdown-button').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('dropdown-item-focused'),
      });
    });

    it('should match dropdown context menu screenshot when closed', async (done) => {
      await SkyHostBrowser.scrollTo('#screenshot-dropdown-context-menu');

      expect('#screenshot-dropdown-context-menu').toMatchBaselineScreenshot(
        done,
        {
          screenshotName: getScreenshotName('dropdown-context-menu-closed'),
        }
      );
    });

    it('should match dropdown context menu screenshot when open', async (done) => {
      await SkyHostBrowser.scrollTo('#screenshot-dropdown-context-menu');

      await element(
        by.css('#screenshot-dropdown-context-menu .sky-dropdown-button')
      ).click();

      expect('#screenshot-dropdown-context-menu').toMatchBaselineScreenshot(
        done,
        {
          screenshotName: getScreenshotName('dropdown-context-menu-open'),
        }
      );
    });

    it('should match dropdown screenshot when before a relative element', async (done) => {
      await SkyHostBrowser.scrollTo('#screenshot-dropdown-z-index');

      await element(
        by.css('#screenshot-dropdown-z-index .sky-dropdown-button')
      ).click();

      expect('#screenshot-dropdown-z-index').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('dropdown-z-index'),
      });
    });

    it('should match dropdown screenshot when menu items overflow dropdown', async (done) => {
      await SkyHostBrowser.scrollTo('#screenshot-dropdown-max-height');

      await element(
        by.css('#screenshot-dropdown-max-height .sky-dropdown-button')
      ).click();

      expect('#screenshot-dropdown-max-height').toMatchBaselineScreenshot(
        done,
        {
          screenshotName: getScreenshotName('dropdown-max-height'),
        }
      );
    });
  }

  beforeEach(async () => {
    currentTheme = undefined;
    currentThemeMode = undefined;

    await SkyHostBrowser.get('visual/dropdown');
    await SkyHostBrowser.setWindowBreakpoint('lg');
  });

  validateAll();

  describe('when modern theme', () => {
    beforeEach(async () => {
      await selectTheme('modern', 'light');
    });

    validateAll();
  });

  describe('when modern theme in dark mode', () => {
    beforeEach(async () => {
      await selectTheme('modern', 'dark');
    });

    validateAll();
  });
});
