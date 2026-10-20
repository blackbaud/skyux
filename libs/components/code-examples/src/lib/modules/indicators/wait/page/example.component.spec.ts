import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { SkyButtonHarness } from '@skyux/forms/testing';
import { SkyWaitHarness } from '@skyux/indicators/testing';

import { IndicatorsWaitPageExampleComponent } from './example.component';

describe('Page wait', () => {
  function setupTest(): {
    loader: HarnessLoader;
    rootLoader: HarnessLoader;
  } {
    const fixture = TestBed.createComponent(IndicatorsWaitPageExampleComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    return { loader, rootLoader };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IndicatorsWaitPageExampleComponent],
    });
  });

  it('should show the page wait component when the user performs an action', async () => {
    const { loader, rootLoader } = setupTest();

    const buttonHarness = await loader.getHarness(
      SkyButtonHarness.with({ dataSkyId: 'show-page-wait-button' }),
    );

    await buttonHarness.click();

    const waitHarness = await rootLoader.getHarness(
      SkyWaitHarness.with({ servicePageWaitType: 'blocking' }),
    );

    await expectAsync(waitHarness.isWaiting()).toBeResolvedTo(true);
    await expectAsync(waitHarness.isFullPage()).toBeResolvedTo(true);
    await expectAsync(waitHarness.isNonBlocking()).toBeResolvedTo(false);
  });

  it('should show the non-blocking page wait component when the user performs an action', async () => {
    const { loader, rootLoader } = setupTest();

    const buttonHarness = await loader.getHarness(
      SkyButtonHarness.with({
        dataSkyId: 'show-non-blocking-page-wait-button',
      }),
    );

    await buttonHarness.click();

    const waitHarness = await rootLoader.getHarness(
      SkyWaitHarness.with({ servicePageWaitType: 'non-blocking' }),
    );

    await expectAsync(waitHarness.isWaiting()).toBeResolvedTo(true);
    await expectAsync(waitHarness.isFullPage()).toBeResolvedTo(true);
    await expectAsync(waitHarness.isNonBlocking()).toBeResolvedTo(true);
  });
});
