import { SkyHostBrowser, SkyVisualThemeSelector, expect } from '@skyux-sdk/e2e';

import { by, element } from 'protractor';

describe('Repeater', () => {
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

  function runTests(): void {
    it('should match previous repeater screenshot', async (done) => {
      await SkyHostBrowser.scrollTo('#screenshot-repeater');

      expect('#screenshot-repeater').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('repeater'),
      });
    });

    it('should match previous repeater screenshot when an item is active', async (done) => {
      await SkyHostBrowser.scrollTo('#screenshot-repeater-with-active-item');

      expect('#screenshot-repeater-with-active-item').toMatchBaselineScreenshot(
        done,
        {
          screenshotName: getScreenshotName('repeater-with-active-item'),
        }
      );
    });

    it('should match previous repeater screenshot when all are collapsed', async (done) => {
      await SkyHostBrowser.scrollTo('#screenshot-repeater-collapsed');

      expect('#screenshot-repeater-collapsed').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('repeater-collapsed'),
      });
    });

    it('should match previous repeater screenshot in single mode', async (done) => {
      await SkyHostBrowser.scrollTo('#screenshot-repeater-single');

      expect('#screenshot-repeater-single').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('repeater-single'),
      });
    });

    it('should match previous repeater screenshot in multiple mode', async (done) => {
      await SkyHostBrowser.scrollTo('#screenshot-repeater-multiple');

      expect('#screenshot-repeater-multiple').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('repeater-multiple'),
      });
    });

    it('should match previous repeater screenshot in max-width container', async (done) => {
      await SkyHostBrowser.scrollTo('#screenshot-repeater-max-width');

      expect('#screenshot-repeater-max-width').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('repeater-max-width'),
      });
    });

    it('should match previous repeater screenshot with a context menu', async (done) => {
      await SkyHostBrowser.scrollTo('#screenshot-repeater-context-menu');

      expect('#screenshot-repeater-context-menu').toMatchBaselineScreenshot(
        done,
        {
          screenshotName: getScreenshotName('repeater-context-menu'),
        }
      );
    });

    it('should match previous repeater screenshot when selectable', async (done) => {
      await SkyHostBrowser.scrollTo('#screenshot-repeater-selectable');

      expect('#screenshot-repeater-selectable').toMatchBaselineScreenshot(
        done,
        {
          screenshotName: getScreenshotName('repeater-selectable'),
        }
      );
    });

    it('should match previous repeater screenshot when selectable', async (done) => {
      await SkyHostBrowser.scrollTo('#screenshot-repeater-selectable-context');

      expect(
        '#screenshot-repeater-selectable-context'
      ).toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('repeater-selectable-and-context'),
      });
    });

    it('should match previous repeater screenshot when reorderable', async (done) => {
      await SkyHostBrowser.scrollTo('#screenshot-repeater-reorderable');

      expect('#screenshot-repeater-reorderable').toMatchBaselineScreenshot(
        done,
        {
          screenshotName: getScreenshotName('repeater-reorderable'),
        }
      );
    });

    it('should match previous repeater screenshot with an inline delete', async (done) => {
      await SkyHostBrowser.scrollTo('#screenshot-repeater-inline-delete');

      await element
        .all(by.css('#screenshot-repeater-inline-delete .sky-dropdown-button'))
        .get(0)
        .click();

      await element(by.css('#inline-delete-trigger-standard')).click();

      await element
        .all(by.css('#screenshot-repeater-inline-delete .sky-dropdown-button'))
        .get(1)
        .click();

      await element(by.css('#inline-delete-trigger-active')).click();

      await element(by.css('#screenshot-repeater-inline-delete')).click();

      expect('#screenshot-repeater-inline-delete').toMatchBaselineScreenshot(
        done,
        {
          screenshotName: getScreenshotName('repeater-inline-delete'),
        }
      );
    });

    it('should match previous screenshot with items without titles', async (done) => {
      await SkyHostBrowser.scrollTo('#screenshot-repeater-no-titles');

      expect('#screenshot-repeater-no-titles').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('repeater-no-titles'),
      });
    });
  }

  beforeEach(async () => {
    currentTheme = undefined;
    currentThemeMode = undefined;

    await SkyHostBrowser.get('visual/repeater');
    await SkyHostBrowser.setWindowBreakpoint('lg');
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
