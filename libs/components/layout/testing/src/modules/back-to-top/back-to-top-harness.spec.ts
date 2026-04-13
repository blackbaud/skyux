import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

import { SkyBackToTopHarness } from './back-to-top-harness';
import { BackToTopHarnessTestComponent } from './fixtures/back-to-top-harness-test.component';

describe('BackToTop test harness', () => {
  it('should get the back to top component and click it', async () => {
    await TestBed.configureTestingModule({
      imports: [BackToTopHarnessTestComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(BackToTopHarnessTestComponent);
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
