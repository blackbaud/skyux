import { SkyHostBrowser, SkyVisualThemeSelector, expect } from '@skyux-sdk/e2e';
import { SkyHostBrowserBreakpoint } from '@skyux-sdk/e2e/host-browser/host-browser-breakpoint';

import { browser, by, element } from 'protractor';

function browserPause() {
  return browser.wait(new Promise((resolve) => setTimeout(resolve, 100)));
}

describe('Readonly grid', () => {
  // selectors
  const readonlyGrid = '.readonly-grid';
  const sortableHeaderCell = '.ag-header-cell-sortable';

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
    describe('read mode', () => {
      async function matchesPreviousReadonlyGrid(
        screenSize: SkyHostBrowserBreakpoint,
        done: DoneFn
      ): Promise<void> {
        await SkyHostBrowser.setWindowBreakpoint(screenSize);

        await SkyHostBrowser.moveCursorOffScreen();
        await browserPause();

        expect(readonlyGrid).toMatchBaselineScreenshot(done, {
          screenshotName: getScreenshotName(`readonly-grid-${screenSize}`),
        });
      }

      it('should match previous screenshot on large screens', async (done) => {
        await matchesPreviousReadonlyGrid('lg', done);
      });

      it('should match previous screenshot on extra small screens', async (done) => {
        await matchesPreviousReadonlyGrid('xs', done);
      });
    });

    describe('descending sort', () => {
      async function matchesPreviousDescendingSortGrid(
        screenSize: SkyHostBrowserBreakpoint,
        done: DoneFn
      ): Promise<void> {
        await SkyHostBrowser.setWindowBreakpoint(screenSize);

        await element.all(by.css(sortableHeaderCell)).get(1).click();
        await browserPause();

        expect(readonlyGrid).toMatchBaselineScreenshot(done, {
          screenshotName: getScreenshotName(
            `readonly-grid-sort-desc-${screenSize}`
          ),
        });
      }

      it('should match previous screenshot on large screens', async (done) => {
        await matchesPreviousDescendingSortGrid('lg', done);
      });

      it('should match previous screenshot on extra small screens', async (done) => {
        await matchesPreviousDescendingSortGrid('xs', done);
      });
    });

    describe('ascending sort', () => {
      async function matchesPreviousAscendingSortGrid(
        screenSize: SkyHostBrowserBreakpoint,
        done: DoneFn
      ): Promise<void> {
        await SkyHostBrowser.setWindowBreakpoint(screenSize);
        await browserPause();

        // click twice to sort by descending then ascending
        await element.all(by.css(sortableHeaderCell)).get(1).click();
        await element.all(by.css(sortableHeaderCell)).get(1).click();

        expect(readonlyGrid).toMatchBaselineScreenshot(done, {
          screenshotName: getScreenshotName(
            `readonly-grid-sort-asc-${screenSize}`
          ),
        });
      }

      it('should match previous screenshoton large screens', async (done) => {
        await matchesPreviousAscendingSortGrid('lg', done);
      });

      it('should match previous screenshoton extra small screens', async (done) => {
        await matchesPreviousAscendingSortGrid('xs', done);
      });
    });
  }

  beforeEach(async () => {
    await SkyHostBrowser.get('visual/readonly-grid');
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

  describe('row delete', () => {
    async function matchesPreviousRowDeleteGrid(
      screenSize: SkyHostBrowserBreakpoint,
      done: DoneFn
    ) {
      await SkyHostBrowser.setWindowBreakpoint(screenSize);
      await browserPause();

      // click twice to sort by descending then ascending
      await element(by.css('[row-id="0"] .sky-dropdown-button')).click();
      await element.all(by.css('.sky-dropdown-item button')).get(0).click();

      await SkyHostBrowser.moveCursorOffScreen();

      expect(readonlyGrid).toMatchBaselineScreenshot(done, {
        screenshotName: `readonly-grid-row-delete-${screenSize}`,
      });
    }

    it('should match previous screenshoton large screens', async (done) => {
      await matchesPreviousRowDeleteGrid('lg', done);
    });

    it('should match previous screenshoton extra small screens', async (done) => {
      await matchesPreviousRowDeleteGrid('xs', done);
    });
  });
});
