import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyWaitHarness } from '@skyux/indicators/testing';

import { IndicatorsWaitElementExampleComponent } from './example.component';

describe('Basic wait', () => {
  async function setupTest(): Promise<{
    waitHarness: SkyWaitHarness;
    fixture: ComponentFixture<IndicatorsWaitElementExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(
      IndicatorsWaitElementExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const waitHarness = await loader.getHarness(
      SkyWaitHarness.with({ dataSkyId: 'wait-example' }),
    );

    return { waitHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IndicatorsWaitElementExampleComponent],
    });
  });

  it('should show the wait component when the user performs an action', async () => {
    const { waitHarness, fixture } = await setupTest();

    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLButtonElement>('.sky-btn')
      ?.click();

    fixture.detectChanges();

    await expectAsync(waitHarness.isWaiting()).toBeResolvedTo(true);
    await expectAsync(waitHarness.isFullPage()).toBeResolvedTo(false);
    await expectAsync(waitHarness.isNonBlocking()).toBeResolvedTo(false);
  });
});
