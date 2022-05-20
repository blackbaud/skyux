import { SkyHostBrowser, SkyVisualThemeSelector, expect } from '@skyux-sdk/e2e';

import { by, element } from 'protractor';

describe('Popover', () => {
  let currentTheme: string;
  let currentThemeMode: string;

  function getScreenshotName(name: string): string {
    if (currentTheme) {
      name += '-' + currentTheme;
    }

    if (currentThemeMode) {
      name += '-' + currentThemeMode;
    }

    return name;
  }

  async function selectTheme(theme: string, mode: string): Promise<void> {
    currentTheme = theme;
    currentThemeMode = mode;

    return SkyVisualThemeSelector.selectTheme(theme, mode);
  }

  async function testPopoverPlacement(
    placement: string,
    done: DoneFn
  ): Promise<void> {
    await SkyHostBrowser.scrollTo(`#screenshot-popover-placements`);
    await element(by.id(`btn-popover-placement-${placement}`)).click();
    expect('#screenshot-popover-placements').toMatchBaselineScreenshot(done, {
      screenshotName: getScreenshotName(`popover-placement-${placement}`),
    });
  }

  function validateAll() {
    it('should match previous screenshot', (done) => {
      expect('#screenshot-all-popovers').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('popover-all-popovers'),
      });
    });

    it('should match previous screenshot of error popovers', async (done) => {
      await SkyHostBrowser.scrollTo(`#screenshot-all-danger-popovers`);
      expect('#screenshot-all-danger-popovers').toMatchBaselineScreenshot(
        done,
        {
          screenshotName: getScreenshotName('popover-all-danger-popovers'),
        }
      );
    });

    it('should open a popover above the caller', (done) => {
      testPopoverPlacement('above', done);
    });

    it('should open a popover above-left the caller', (done) => {
      testPopoverPlacement('above-left', done);
    });

    it('should open a popover above-right the caller', (done) => {
      testPopoverPlacement('above-right', done);
    });

    it('should open a popover below-left the caller', (done) => {
      testPopoverPlacement('below-left', done);
    });

    it('should open a popover below-right the caller', (done) => {
      testPopoverPlacement('below-right', done);
    });

    it('should open a popover below the caller', (done) => {
      testPopoverPlacement('below', done);
    });

    it('should open a popover to the right of the caller', (done) => {
      testPopoverPlacement('right', done);
    });

    it('should open a popover to the left of the caller', (done) => {
      testPopoverPlacement('left', done);
    });

    it('should handle tiny screens', async (done) => {
      await SkyHostBrowser.setWindowBreakpoint('xs');
      await SkyHostBrowser.scrollTo(`#screenshot-popover-tiny`);
      await element(by.id(`btn-popover-tiny`)).click();
      expect('#screenshot-popover-tiny').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('popover-tiny-screen'),
      });
    });

    it('should handle absolutely positioned items inside the popover', async (done) => {
      await SkyHostBrowser.scrollTo('#screenshot-popover-with-dropdown');
      await element(by.id('btn-popover-with-dropdown')).click();
      await element(
        by.css('#popover-with-dropdown .sky-dropdown-button')
      ).click();
      expect('#screenshot-popover-with-dropdown').toMatchBaselineScreenshot(
        done,
        {
          screenshotName: getScreenshotName('popover-with-dropdown'),
        }
      );
    });

    it('should handle left aligned popover in positioned parent', async (done) => {
      await SkyHostBrowser.scrollTo('#screenshot-popover-positioned-parent');
      await element(by.id('btn-popover-position-parent-left')).click();
      await element(
        by.css('#popover-positioned-parent-left .sky-dropdown-button')
      ).click();
      expect('#screenshot-popover-positioned-parent').toMatchBaselineScreenshot(
        done,
        {
          screenshotName: getScreenshotName('popover-position-parent-left'),
        }
      );
    });

    it('should handle right aligned popover in positioned parent', async (done) => {
      await SkyHostBrowser.scrollTo('#screenshot-popover-positioned-parent');
      await element(by.id('btn-popover-position-parent-right')).click();
      await element(
        by.css('#popover-positioned-parent-right .sky-dropdown-button')
      ).click();
      expect('#screenshot-popover-positioned-parent').toMatchBaselineScreenshot(
        done,
        {
          screenshotName: getScreenshotName('popover-position-parent-right'),
        }
      );
    });
  }

  beforeEach(async () => {
    currentTheme = undefined;
    currentThemeMode = undefined;

    await SkyHostBrowser.get('visual/popover');
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
