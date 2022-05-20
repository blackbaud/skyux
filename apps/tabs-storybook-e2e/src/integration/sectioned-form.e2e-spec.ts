import { SkyHostBrowser, expect } from '@skyux-sdk/e2e';

import { by, element } from 'protractor';

describe('Sectioned Form', () => {
  beforeEach(async () => {
    await SkyHostBrowser.get('visual/sectioned-form');
  });

  it('should match previous sectioned form screenshot', async (done) => {
    await SkyHostBrowser.setWindowBreakpoint('lg');
    expect('#screenshot-sectioned-form').toMatchBaselineScreenshot(done, {
      screenshotName: 'sectioned-form',
    });
  });

  it('should match previous sectioned form screenshot (screen: xs)', async (done) => {
    await SkyHostBrowser.setWindowBreakpoint('xs');
    expect('#screenshot-sectioned-form').toMatchBaselineScreenshot(done, {
      screenshotName: 'sectioned-form-xs',
    });
  });

  it('should match previous sectioned form screenshot after clicking first tab', async (done) => {
    await SkyHostBrowser.setWindowBreakpoint('lg');

    let tabs = element.all(by.css('sky-vertical-tab'));

    // click first tab
    await tabs.get(0).click();
    expect('#screenshot-sectioned-form').toMatchBaselineScreenshot(done, {
      screenshotName: 'sectioned-form-first',
    });
  });

  it('should match previous sectioned form screenshot after clicking first tab when name is required', async (done) => {
    await SkyHostBrowser.setWindowBreakpoint('lg');

    let tabs = element.all(by.css('sky-vertical-tab'));

    // click first tab
    await tabs.get(0).click();
    await element(
      by.css('#name-checkbox-container .sky-switch-control')
    ).click();
    expect('#screenshot-sectioned-form').toMatchBaselineScreenshot(done, {
      screenshotName: 'sectioned-form-first-required',
    });
  });

  it('should match previous sectioned form screenshot after clicking second tab', async (done) => {
    await SkyHostBrowser.setWindowBreakpoint('lg');

    let tabs = element.all(by.css('sky-vertical-tab'));

    // click first tab
    await tabs.get(1).click();
    expect('#screenshot-sectioned-form').toMatchBaselineScreenshot(done, {
      screenshotName: 'sectioned-form-second',
    });
  });

  it('should match previous sectioned form screenshot when the required and error indicators are present', async (done) => {
    await SkyHostBrowser.get('visual/sectioned-form');
    await SkyHostBrowser.setWindowBreakpoint('lg');

    let tabs = element.all(by.css('sky-vertical-tab'));

    // click first tab
    await tabs.get(0).click();

    // Trigger the checkbox to require the name input
    await element(
      by.css('#name-checkbox-container .sky-switch-control')
    ).click();

    // Click the name input
    await element(by.css('#inputName')).click();

    await element(by.css('body')).click();

    expect('#screenshot-sectioned-form').toMatchBaselineScreenshot(done, {
      screenshotName: 'sectioned-form-required-and-error',
    });
  });
});
