import { expect } from '@skyux-sdk/testing';

import { SkyPageThemeAdapterService } from './page-theme-adapter.service';

describe('Page theme service', () => {
  it('should not add the theme stylesheet twice', () => {
    const appendChildSpy = spyOn(document.head, 'appendChild');

    const pageThemeSvc = new SkyPageThemeAdapterService();

    pageThemeSvc.addTheme();
    pageThemeSvc.addTheme();

    expect(appendChildSpy).toHaveBeenCalledTimes(1);
  });

  it('should not remove the theme stylesheet twice', () => {
    const removeChildSpy = spyOn(document.head, 'removeChild');

    const pageThemeSvc = new SkyPageThemeAdapterService();

    pageThemeSvc.addTheme();

    pageThemeSvc.removeTheme();
    pageThemeSvc.removeTheme();

    expect(removeChildSpy).toHaveBeenCalledTimes(1);
  });
});
