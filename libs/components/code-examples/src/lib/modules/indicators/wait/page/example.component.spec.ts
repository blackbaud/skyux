import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyWaitHarness } from '@skyux/indicators/testing';

import { IndicatorsWaitPageExampleComponent } from './example.component';

describe('Page wait', () => {
  function setupTest(): {
    rootLoader: HarnessLoader;
    el: HTMLElement;
    fixture: ComponentFixture<IndicatorsWaitPageExampleComponent>;
  } {
    const fixture = TestBed.createComponent(IndicatorsWaitPageExampleComponent);
    const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const el = fixture.nativeElement as HTMLElement;

    return { rootLoader, el, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IndicatorsWaitPageExampleComponent],
    });
  });

  it('should show the page wait component when the user performs an action', async () => {
    const { rootLoader, el } = setupTest();

    const buttons = el.querySelectorAll<HTMLButtonElement>('.sky-btn');

    buttons[0].click();

    const waitHarness = await rootLoader.getHarness(
      SkyWaitHarness.with({ servicePageWaitType: 'blocking' }),
    );

    await expectAsync(waitHarness.isWaiting()).toBeResolvedTo(true);
    await expectAsync(waitHarness.isFullPage()).toBeResolvedTo(true);
    await expectAsync(waitHarness.isNonBlocking()).toBeResolvedTo(false);
  });

  it('should show the non-blocking page wait component when the user performs an action', async () => {
    const { rootLoader, el } = setupTest();

    const buttons = el.querySelectorAll<HTMLButtonElement>('.sky-btn');

    buttons[1].click();

    const waitHarness = await rootLoader.getHarness(
      SkyWaitHarness.with({ servicePageWaitType: 'non-blocking' }),
    );

    await expectAsync(waitHarness.isWaiting()).toBeResolvedTo(true);
    await expectAsync(waitHarness.isFullPage()).toBeResolvedTo(true);
    await expectAsync(waitHarness.isNonBlocking()).toBeResolvedTo(true);
  });
});
