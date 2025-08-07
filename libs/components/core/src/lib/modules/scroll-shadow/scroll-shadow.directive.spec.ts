import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

import { ScrollShadowFixtureComponent } from './fixtures/scroll-shadow.component.fixture';

// Wait for the next change detection cycle. This avoids having nested setTimeout() calls
// and using the Jasmine done() function.
function waitForMutationObserver(): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve());
  });
}

describe('Scroll shadow directive', () => {
  function getScrollBody(): HTMLElement | null {
    return document.querySelector<HTMLElement>('.scroll-shadow-test-body');
  }

  function getScrollFooter(): HTMLElement | null {
    return document.querySelector<HTMLElement>('.scroll-shadow-test-footer');
  }

  function getScrollHeader(): HTMLElement | null {
    return document.querySelector<HTMLElement>('.scroll-shadow-test-header');
  }

  function scrollElement(element: HTMLElement | null, yDistance: number): void {
    if (element) {
      element.scrollTop = yDistance;
      SkyAppTestUtility.fireDomEvent(element, 'scroll');
      fixture.detectChanges();
    }
  }

  function validateShadow(
    el: HTMLElement | null,
    expectedShadow?: string,
  ): void {
    if (!el) {
      fail('Element not provided');
      return;
    }

    const boxShadowStyle = getComputedStyle(el).boxShadow;

    if (expectedShadow) {
      expect(boxShadowStyle).toBe(expectedShadow);
    } else {
      expect(boxShadowStyle).toBe('none');
    }
  }

  function validateShadowAlpha(
    el: HTMLElement | null,
    expectedAlpha?: number,
  ): void {
    if (!el) {
      fail('Element not provided');
      return;
    }

    const boxShadowStyle = getComputedStyle(el).boxShadow;

    if (expectedAlpha) {
      const rgbaMatch = boxShadowStyle.match(
        /rgba\(0,\s*0,\s*0,\s*([0-9.]*)\)/,
      );

      if (!(rgbaMatch && rgbaMatch[1])) {
        fail('No shadow found');
      } else {
        const alpha = parseFloat(rgbaMatch[1]);

        const alphaHundredths = Math.round(alpha * 1e2) / 1e2;
        expect(alphaHundredths).toBeGreaterThan(expectedAlpha - 0.03);
        expect(alphaHundredths).toBeLessThan(expectedAlpha + 0.03);
      }
    } else {
      expect(boxShadowStyle).toBe('none');
    }
  }

  let fixture: ComponentFixture<ScrollShadowFixtureComponent>;
  let cmp: ScrollShadowFixtureComponent;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [ScrollShadowFixtureComponent],
    });

    fixture = TestBed.createComponent(ScrollShadowFixtureComponent);
    cmp = fixture.componentInstance;

    fixture.nativeElement.style.setProperty(
      '--sky-elevation-overflow',
      '0 1px 8px 0 rgba(0, 0, 0, 0.3)',
    );
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
  }));

  it('should not show a shadow when the body is not scrollable when disabled', async () => {
    cmp.enabled = false;
    fixture.detectChanges();
    await waitForMutationObserver();
    fixture.detectChanges();

    validateShadowAlpha(getScrollFooter());
    validateShadowAlpha(getScrollHeader());
  });

  it('should not show a shadow when the body is scrollable when disabled', async () => {
    cmp.height = 800;
    cmp.enabled = false;
    fixture.detectChanges();
    await waitForMutationObserver();
    fixture.detectChanges();

    validateShadowAlpha(getScrollFooter());
    validateShadowAlpha(getScrollHeader());
  });

  it('should not show a shadow when the body is not scrollable', async () => {
    await waitForMutationObserver();
    fixture.detectChanges();

    validateShadowAlpha(getScrollFooter());
    validateShadowAlpha(getScrollHeader());
  });

  it('should progressively show a drop shadow as the modal content scrolls', async () => {
    const headerEl = getScrollHeader();
    const contentEl = getScrollBody();
    const footerEl = getScrollFooter();

    if (!contentEl) {
      fail('Content element not found');
      return;
    }

    cmp.height = 800;
    fixture.detectChanges();
    await waitForMutationObserver();
    fixture.detectChanges();

    scrollElement(contentEl, 0);
    validateShadowAlpha(headerEl);
    validateShadowAlpha(footerEl, 0.3);

    scrollElement(contentEl, 15);
    validateShadowAlpha(headerEl, 0.15);
    validateShadowAlpha(footerEl, 0.3);

    scrollElement(contentEl, 30);
    validateShadowAlpha(headerEl, 0.3);
    validateShadowAlpha(footerEl, 0.3);

    scrollElement(contentEl, 31);
    validateShadowAlpha(headerEl, 0.3);
    validateShadowAlpha(footerEl, 0.3);

    scrollElement(
      contentEl,
      contentEl.scrollHeight - 15 - contentEl.clientHeight,
    );
    validateShadowAlpha(headerEl, 0.3);
    validateShadowAlpha(footerEl, 0.15);

    scrollElement(contentEl, contentEl.scrollHeight - contentEl.clientHeight);
    validateShadowAlpha(headerEl, 0.3);
    validateShadowAlpha(footerEl);
  });

  it('should update the shadow on window resize', async () => {
    const headerEl = getScrollHeader();
    const contentEl = getScrollBody();
    const footerEl = getScrollFooter();

    if (!contentEl) {
      fail('Content element not found');
      return;
    }

    cmp.height = 800;
    fixture.detectChanges();
    await waitForMutationObserver();
    fixture.detectChanges();

    validateShadowAlpha(headerEl);
    validateShadowAlpha(footerEl, 0.3);

    spyOnProperty(Element.prototype, 'scrollTop').and.returnValue(15);
    SkyAppTestUtility.fireDomEvent(window, 'resize');
    fixture.detectChanges();

    validateShadowAlpha(headerEl, 0.15);
    validateShadowAlpha(footerEl, 0.3);
  });

  it('should use no shadow if a bad value is provided', async () => {
    fixture.nativeElement.style.setProperty(
      '--sky-elevation-overflow',
      'gobbledygook',
    );
    fixture.detectChanges();

    const headerEl = getScrollHeader();
    const contentEl = getScrollBody();
    const footerEl = getScrollFooter();

    cmp.height = 800;
    fixture.detectChanges();
    await waitForMutationObserver();
    fixture.detectChanges();

    scrollElement(contentEl, 400);

    validateShadow(headerEl);
    validateShadow(footerEl);
  });

  it('should use no shadow if no value is provided', async () => {
    fixture.nativeElement.style.setProperty(
      '--sky-elevation-overflow',
      undefined,
    );
    fixture.detectChanges();

    const headerEl = getScrollHeader();
    const contentEl = getScrollBody();
    const footerEl = getScrollFooter();

    cmp.height = 800;
    fixture.detectChanges();
    await waitForMutationObserver();
    fixture.detectChanges();

    scrollElement(contentEl, 50);

    validateShadow(headerEl);
    validateShadow(footerEl);
  });

  it('should show the correct shadow when solid colors are specified', async () => {
    fixture.nativeElement.style.setProperty(
      '--sky-elevation-overflow',
      '0 1px 8px 0 #00ff00',
    );
    cmp.height = 1000;
    fixture.detectChanges();
    await waitForMutationObserver();
    fixture.detectChanges();

    const headerEl = getScrollHeader();
    const contentEl = getScrollBody();
    const footerEl = getScrollFooter();

    scrollElement(contentEl, 50);

    validateShadow(headerEl, 'rgb(0, 255, 0) 0px 1px 8px 0px');
    validateShadow(footerEl, 'rgb(0, 255, 0) 0px 1px 8px 0px');
  });

  it('should show the correct shadow when hsla colors are specified', async () => {
    fixture.nativeElement.style.setProperty(
      '--sky-elevation-overflow',
      '0 1px 8px 0 hsla(120, 100.00%, 50.00%, 0.50)',
    );
    cmp.height = 1000;
    fixture.detectChanges();
    await waitForMutationObserver();
    fixture.detectChanges();

    const headerEl = getScrollHeader();
    const contentEl = getScrollBody();
    const footerEl = getScrollFooter();

    scrollElement(contentEl, 50);

    validateShadow(headerEl, 'rgba(0, 255, 0, 0.5) 0px 1px 8px 0px');
    validateShadow(footerEl, 'rgba(0, 255, 0, 0.5) 0px 1px 8px 0px');
  });

  it('should show the correct shadow when multiple shadows are specified', async () => {
    fixture.nativeElement.style.setProperty(
      '--sky-elevation-overflow',
      '0 1px 8px 0 #000000, 0 3px 9px 0 #00ff00',
    );
    cmp.height = 1000;
    fixture.detectChanges();
    await waitForMutationObserver();
    fixture.detectChanges();

    const headerEl = getScrollHeader();
    const contentEl = getScrollBody();
    const footerEl = getScrollFooter();

    scrollElement(contentEl, 50);

    validateShadow(
      headerEl,
      'rgb(0, 0, 0) 0px 1px 8px 0px, rgb(0, 255, 0) 0px 3px 9px 0px',
    );
    validateShadow(
      footerEl,
      'rgb(0, 0, 0) 0px 1px 8px 0px, rgb(0, 255, 0) 0px 3px 9px 0px',
    );
  });
});
