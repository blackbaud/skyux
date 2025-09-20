import { CSP_NONCE, Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { SkyPageThemeAdapterService } from './page-theme-adapter.service';

describe('Page theme service', () => {
  let pageThemeSvc!: SkyPageThemeAdapterService;

  function setupTest(nonce?: string): void {
    const providers: Provider[] = [SkyPageThemeAdapterService];

    if (nonce) {
      providers.push({
        provide: CSP_NONCE,
        useValue: nonce,
      });
    }

    TestBed.configureTestingModule({
      providers,
    });

    pageThemeSvc = TestBed.inject(SkyPageThemeAdapterService);
  }

  function getHeadStyleCount(nonce?: string): number {
    const styleEls = document.head.querySelectorAll('style');

    if (nonce) {
      return Array.from(styleEls).filter((styleEl) => styleEl.nonce === nonce)
        .length;
    }

    return styleEls.length;
  }

  afterEach(() => {
    pageThemeSvc.removeTheme();
  });

  it('should not add the theme stylesheet twice', () => {
    setupTest();

    const styleCount = getHeadStyleCount();

    pageThemeSvc.addTheme();
    pageThemeSvc.addTheme();

    expect(getHeadStyleCount()).toBe(styleCount + 1);
  });

  it('should not remove the theme stylesheet twice', () => {
    setupTest();

    pageThemeSvc.addTheme();

    const styleCount = getHeadStyleCount();

    pageThemeSvc.removeTheme();
    pageThemeSvc.removeTheme();

    expect(getHeadStyleCount()).toBe(styleCount - 1);
  });

  it('should include the CSP nonce on the style element', () => {
    const testNonce = 'page-theme-adapter-test';

    setupTest(testNonce);

    expect(getHeadStyleCount(testNonce)).toBe(0);

    pageThemeSvc.addTheme();

    expect(getHeadStyleCount(testNonce)).toBe(1);
  });
});
