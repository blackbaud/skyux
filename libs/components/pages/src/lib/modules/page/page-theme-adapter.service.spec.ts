import { expect } from '@skyux-sdk/testing';

import { SkyPageThemeAdapterService } from './page-theme-adapter.service';

describe('Page theme service', () => {
  let pageThemeSvc!: SkyPageThemeAdapterService;

  function getHeadStyleCount(): number {
    return document.head.querySelectorAll('style').length;
  }

  beforeEach(() => {
    pageThemeSvc = new SkyPageThemeAdapterService(document);
  });

  afterEach(() => {
    pageThemeSvc.removeTheme();
  });

  it('should not add the theme stylesheet twice', () => {
    const styleCount = getHeadStyleCount();

    pageThemeSvc.addTheme();
    pageThemeSvc.addTheme();

    expect(getHeadStyleCount()).toBe(styleCount + 1);
  });

  it('should not remove the theme stylesheet twice', () => {
    pageThemeSvc.addTheme();

    const styleCount = getHeadStyleCount();

    pageThemeSvc.removeTheme();
    pageThemeSvc.removeTheme();

    expect(getHeadStyleCount()).toBe(styleCount - 1);
  });
});
