import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { SkyCharacterCounterIndicatorHarness } from '@skyux/forms/testing';
import { SkyStatusIndicatorHarness } from '@skyux/indicators/testing';

import { FormsCharacterCountExampleComponent } from './example.component';

describe('Character count example', () => {
  async function setupTest(): Promise<{
    harness: SkyCharacterCounterIndicatorHarness;
    loader: HarnessLoader;
  }> {
    const fixture = TestBed.createComponent(
      FormsCharacterCountExampleComponent,
    );

    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkyCharacterCounterIndicatorHarness.with({
        dataSkyId: 'description-indicator',
      }),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    return { harness, loader };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsCharacterCountExampleComponent],
    });
  });

  it('should allow a maximum of 50 characters', async () => {
    const { harness, loader } = await setupTest();

    // Validate initial state.
    await expectAsync(harness.getCharacterCountLimit()).toBeResolvedTo(50);
    await expectAsync(harness.getCharacterCount()).toBeResolvedTo(46);
    await expectAsync(harness.isOverLimit()).toBeResolvedTo(false);

    // Update the value to exceed the limit and validate.
    const inputEl =
      document.querySelector<HTMLInputElement>('.description-input');

    if (inputEl) {
      inputEl.value += ' scholarship fund';
      inputEl.dispatchEvent(new Event('input'));
    }

    await expectAsync(harness.getCharacterCount()).toBeResolvedTo(63);
    await expectAsync(harness.isOverLimit()).toBeResolvedTo(true);

    // Validate that the status indicator error displayed when limit was exceeded.
    const statusIndicator = await loader.getHarness(
      SkyStatusIndicatorHarness.with({
        dataSkyId: 'description-status-indicator-over-limit',
      }),
    );

    await expectAsync(statusIndicator.getDescriptionType()).toBeResolvedTo(
      'error',
    );
    await expectAsync(statusIndicator.getIndicatorType()).toBeResolvedTo(
      'danger',
    );
    await expectAsync(statusIndicator.getText()).toBeResolvedTo(
      'Limit Transaction description to 50 characters.',
    );
  });
});
