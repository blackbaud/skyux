import { SkyHostBrowser, expect } from '@skyux-sdk/e2e';

import { by, element } from 'protractor';

describe('Filter', () => {
  beforeEach(async () => {
    await SkyHostBrowser.get('visual/filter');
    await SkyHostBrowser.setWindowBreakpoint('lg');
  });

  it('should match previous screenshot for filter button', async (done) => {
    await SkyHostBrowser.scrollTo('#screenshot-filter-button');
    expect('#screenshot-filter-button .sky-btn').toMatchBaselineScreenshot(
      done,
      {
        screenshotName: 'filter-button',
      }
    );
  });

  it('should match the previous screenshot for filter button when text is shown', async (done) => {
    await SkyHostBrowser.scrollTo('#screenshot-filter-button-text');
    expect('#screenshot-filter-button-text .sky-btn').toMatchBaselineScreenshot(
      done,
      {
        screenshotName: 'filter-button-text',
      }
    );
  });

  it('should match the previous screenshot for filter button when text is on but the screen is small', async (done) => {
    await SkyHostBrowser.setWindowBreakpoint('xs');
    await SkyHostBrowser.scrollTo('#screenshot-filter-button-text');
    expect('#screenshot-filter-button-text .sky-btn').toMatchBaselineScreenshot(
      done,
      {
        screenshotName: 'filter-button-text-small',
      }
    );
  });

  it('should match previous screenshot for active filter button', async (done) => {
    await SkyHostBrowser.scrollTo('#screenshot-filter-button');
    await element(by.css('.sky-btn-default')).click();
    expect('#screenshot-filter-button').toMatchBaselineScreenshot(done, {
      screenshotName: 'filter-button-active',
    });
  });

  it('should match previous screenshot for filter summary', async (done) => {
    await SkyHostBrowser.scrollTo('#screenshot-filter-summary');
    expect('#screenshot-filter-summary').toMatchBaselineScreenshot(done, {
      screenshotName: 'filter-summary',
    });
  });

  it('should match previous screenshot for filter summary when overflowing', async (done) => {
    await SkyHostBrowser.scrollTo('#screenshot-filter-summary-overflow');
    expect('#screenshot-filter-summary-overflow').toMatchBaselineScreenshot(
      done,
      {
        screenshotName: 'filter-summary-overflow',
      }
    );
  });

  it('should match previous screenshot for filter inline', async (done) => {
    await SkyHostBrowser.scrollTo('#screenshot-filter-inline');
    expect('#screenshot-filter-inline').toMatchBaselineScreenshot(done, {
      screenshotName: 'filter-inline',
    });
  });
});
