import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { SkyCodeHarness } from '@skyux/code/testing';
import { SkyButtonHarness } from '@skyux/forms/testing';
import { SkyWaitHarness } from '@skyux/indicators/testing';

import { IndicatorsWaitElementExampleComponent } from './example.component';

describe('Basic wait', () => {
  async function setupTest(): Promise<{
    waitHarness: SkyWaitHarness;
    toggleButtonHarness: SkyButtonHarness;
  }> {
    const fixture = TestBed.createComponent(
      IndicatorsWaitElementExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const waitHarness = await loader.getHarness(
      SkyWaitHarness.with({ dataSkyId: 'wait-example' }),
    );
    const toggleButtonHarness = await loader.getHarness(
      SkyButtonHarness.with({ dataSkyId: 'toggle-wait-button' }),
    );

    return { waitHarness, toggleButtonHarness };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IndicatorsWaitElementExampleComponent],
    });
  });

  it('should show the wait component when the user performs an action', async () => {
    const { waitHarness, toggleButtonHarness } = await setupTest();

    await toggleButtonHarness.click();

    await expectAsync(waitHarness.isWaiting()).toBeResolvedTo(true);
    await expectAsync(waitHarness.isFullPage()).toBeResolvedTo(false);
    await expectAsync(waitHarness.isNonBlocking()).toBeResolvedTo(false);
  });

  it('should show the directive name as code', async () => {
    const fixture = TestBed.createComponent(
      IndicatorsWaitElementExampleComponent,
    );
    const codeHarness =
      await TestbedHarnessEnvironment.loader(fixture).getHarness(
        SkyCodeHarness,
      );

    await expectAsync(codeHarness.getText()).toBeResolvedTo('sky-wait');
  });
});
