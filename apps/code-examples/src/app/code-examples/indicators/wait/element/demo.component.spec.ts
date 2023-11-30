import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyWaitHarness } from '@skyux/indicators/testing';

import { DemoComponent } from './demo.component';

describe('Basic wait', () => {
  async function setupTest(): Promise<{
    waitHarness: SkyWaitHarness;
    fixture: ComponentFixture<DemoComponent>;
  }> {
    const fixture = TestBed.createComponent(DemoComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const waitHarness = await loader.getHarness(
      SkyWaitHarness.with({ dataSkyId: 'wait-demo' }),
    );

    return { waitHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DemoComponent],
    });
  });

  it('should show the wait component when the user performs an action', async () => {
    const { waitHarness, fixture } = await setupTest();

    fixture.nativeElement.querySelector('.sky-btn').click();
    fixture.detectChanges();

    await expectAsync(waitHarness.isWaiting()).toBeResolvedTo(true);
    await expectAsync(waitHarness.isFullPage()).toBeResolvedTo(false);
    await expectAsync(waitHarness.isNonBlocking()).toBeResolvedTo(false);
  });
});
