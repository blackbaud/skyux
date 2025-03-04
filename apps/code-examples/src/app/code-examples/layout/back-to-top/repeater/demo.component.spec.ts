import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyAppTestUtility } from '@skyux-sdk/testing';
import { SkyBackToTopHarness } from '@skyux/layout/testing';

import { DemoComponent } from './demo.component';

describe('Back to top repeater', () => {
  it('should set up the component', async () => {
    await TestBed.configureTestingModule({
      imports: [DemoComponent, NoopAnimationsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(DemoComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    await expectAsync(loader.getHarness(SkyBackToTopHarness)).toBeRejected();

    window.scrollTo(0, document.body.scrollHeight);
    SkyAppTestUtility.fireDomEvent(window, 'scroll');
    fixture.detectChanges();
    await fixture.whenStable();

    const backToTopHarness: SkyBackToTopHarness =
      await loader.getHarness(SkyBackToTopHarness);

    await backToTopHarness.clickBackToTop();
  });
});
