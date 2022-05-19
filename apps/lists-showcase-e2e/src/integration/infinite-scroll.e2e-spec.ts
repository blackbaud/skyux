import { SkyHostBrowser, expect } from '@skyux-sdk/e2e';

import { by, element } from 'protractor';

describe('Infinite Scroll', () => {
  beforeEach(async () => {
    await SkyHostBrowser.get('visual/infinite-scroll');
    await SkyHostBrowser.setWindowBreakpoint('lg');
    await SkyHostBrowser.scrollTo('#screenshot-infinite-scroll');
  });

  it('should match previous screenshot', (done) => {
    expect('#screenshot-infinite-scroll').toMatchBaselineScreenshot(done, {
      screenshotName: 'infinite-scroll',
    });
  });

  it('should match previous screenshot when enabled is false', async (done) => {
    await element(by.css('#toggle-enabled')).click();
    expect('#screenshot-infinite-scroll').toMatchBaselineScreenshot(done, {
      screenshotName: 'infinite-scroll-disabled',
    });
  });

  it('should match previous screenshot in wait mode', async (done) => {
    await element(by.css('#toggle-disable-loader')).click();
    await element(by.css('#screenshot-infinite-scroll .sky-btn')).click();
    expect('#screenshot-infinite-scroll').toMatchBaselineScreenshot(done, {
      screenshotName: 'infinite-scroll-wait',
    });
  });

  it('should match previous screenshot with back to top component showing', async (done) => {
    await element(by.css('#screenshot-infinite-scroll .sky-btn')).click();
    await element(by.css('#toggle-enabled')).click();
    await SkyHostBrowser.scrollTo('#screenshot-window-bottom');
    expect('#screenshot-window').toMatchBaselineScreenshot(done, {
      screenshotName: 'infinite-scroll-back-to-top',
    });
  });
});
