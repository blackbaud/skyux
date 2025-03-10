import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyAppTestUtility } from '@skyux-sdk/testing';
import { SkyBackToTopHarness } from '@skyux/layout/testing';

import { LayoutBackToTopRepeaterExampleComponent } from './example.component';

describe('Back to top repeater example', () => {
  function getBackToTopTarget(): HTMLElement | null {
    return document.querySelector('.target');
  }

  function isElementInView(element: HTMLElement | null): boolean {
    if (element) {
      const elementRect = element.getBoundingClientRect();
      return elementRect.top >= 0 && elementRect.bottom <= window.innerHeight;
    }
    return false;
  }

  it('should set up the component', async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutBackToTopRepeaterExampleComponent, NoopAnimationsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(
      LayoutBackToTopRepeaterExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const target = getBackToTopTarget();

    expect(isElementInView(target)).toBe(true);
    await expectAsync(loader.getHarness(SkyBackToTopHarness)).toBeRejected();

    window.scrollTo(0, document.body.scrollHeight);
    SkyAppTestUtility.fireDomEvent(window, 'scroll');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(isElementInView(target)).toBe(false);
    const backToTopHarness: SkyBackToTopHarness =
      await loader.getHarness(SkyBackToTopHarness);

    await backToTopHarness.clickBackToTop();

    fixture.detectChanges();
    await fixture.whenStable();

    expect(isElementInView(target)).toBe(true);
  });
});
