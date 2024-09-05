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
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
  }));

  it('should not show a shadow when the body is not scrollable when disabled', async () => {
    cmp.enabled = false;
    fixture.detectChanges();
    await waitForMutationObserver();
    fixture.detectChanges();

    validateShadow(getScrollFooter());
    validateShadow(getScrollHeader());
  });

  it('should not show a shadow when the body is scrollable when disabled', async () => {
    cmp.height = 800;
    cmp.enabled = false;
    fixture.detectChanges();
    await waitForMutationObserver();
    fixture.detectChanges();

    validateShadow(getScrollFooter());
    validateShadow(getScrollHeader());
  });

  it('should not show a shadow when the body is not scrollable', async () => {
    await waitForMutationObserver();
    fixture.detectChanges();

    validateShadow(getScrollFooter());
    validateShadow(getScrollHeader());
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
    validateShadow(headerEl);
    validateShadow(footerEl, 0.3);

    scrollElement(contentEl, 15);
    validateShadow(headerEl, 0.15);
    validateShadow(footerEl, 0.3);

    scrollElement(contentEl, 30);
    validateShadow(headerEl, 0.3);
    validateShadow(footerEl, 0.3);

    scrollElement(contentEl, 31);
    validateShadow(headerEl, 0.3);
    validateShadow(footerEl, 0.3);

    scrollElement(
      contentEl,
      contentEl.scrollHeight - 15 - contentEl.clientHeight,
    );
    validateShadow(headerEl, 0.3);
    validateShadow(footerEl, 0.15);

    scrollElement(contentEl, contentEl.scrollHeight - contentEl.clientHeight);
    validateShadow(headerEl, 0.3);
    validateShadow(footerEl);
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

    validateShadow(headerEl);
    validateShadow(footerEl, 0.3);

    spyOnProperty(Element.prototype, 'scrollTop').and.returnValue(15);
    SkyAppTestUtility.fireDomEvent(window, 'resize');
    fixture.detectChanges();

    validateShadow(headerEl, 0.15);
    validateShadow(footerEl, 0.3);
  });
});
