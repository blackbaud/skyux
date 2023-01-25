import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { SkyWaitHarness } from '@skyux/indicators/testing';

import { WaitDemoComponent } from './wait-demo.component';
import { WaitDemoModule } from './wait-demo.module';

describe('Page wait', () => {
  function setupTest() {
    const fixture = TestBed.createComponent(WaitDemoComponent);
    const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    return { rootLoader, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WaitDemoModule],
    });
  });

  it('should show the page wait component when the user performs an action', async () => {
    const { rootLoader, fixture } = setupTest();
    const buttons = fixture.nativeElement.querySelectorAll('.sky-btn');

    buttons[0].click();

    const waitHarness = await rootLoader.getHarness(
      SkyWaitHarness.with({ globalPageWaitType: 'blocking' })
    );

    await expectAsync(waitHarness.isWaiting()).toBeResolvedTo(true);
    await expectAsync(waitHarness.isFullPage()).toBeResolvedTo(true);
    await expectAsync(waitHarness.isNonBlocking()).toBeResolvedTo(false);
  });

  it('should show the non-blocking page wait component when the user performs an action', async () => {
    const { rootLoader, fixture } = setupTest();
    const buttons = fixture.nativeElement.querySelectorAll('.sky-btn');
    buttons[1].click();

    const waitHarness = await rootLoader.getHarness(
      SkyWaitHarness.with({ globalPageWaitType: 'non-blocking' })
    );

    await expectAsync(waitHarness.isWaiting()).toBeResolvedTo(true);
    await expectAsync(waitHarness.isFullPage()).toBeResolvedTo(true);
    await expectAsync(waitHarness.isNonBlocking()).toBeResolvedTo(true);
  });
});
