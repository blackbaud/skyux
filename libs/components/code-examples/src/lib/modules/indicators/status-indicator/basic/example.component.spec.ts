import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import {
  SkyIndicatorDescriptionType,
  SkyIndicatorIconType,
} from '@skyux/indicators';
import { SkyStatusIndicatorHarness } from '@skyux/indicators/testing';

import { IndicatorsStatusIndicatorBasicExampleComponent } from './example.component';

describe('Status indicator basic example', () => {
  async function setupTest(): Promise<HarnessLoader> {
    const fixture = TestBed.createComponent(
      IndicatorsStatusIndicatorBasicExampleComponent,
    );

    const loader = TestbedHarnessEnvironment.loader(fixture);

    fixture.detectChanges();
    await fixture.whenStable();

    return loader;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IndicatorsStatusIndicatorBasicExampleComponent],
    });
  });

  it('should use the expected text and description type for each status indicator', async () => {
    const loader = await setupTest();

    async function validate(
      dataSkyIdSuffix: string,
      expectedIndicatorType: SkyIndicatorIconType,
      expectedDescriptionType: SkyIndicatorDescriptionType,
      expectedText: string,
      expectedCustomDescription?: string,
    ): Promise<void> {
      const harness = await loader.getHarness(
        SkyStatusIndicatorHarness.with({
          dataSkyId: `status-indicator-${dataSkyIdSuffix}`,
        }),
      );

      await expectAsync(harness.getDescriptionType()).toBeResolvedTo(
        expectedDescriptionType,
      );

      await expectAsync(harness.getIndicatorType()).toBeResolvedTo(
        expectedIndicatorType,
      );

      await expectAsync(harness.getText()).toBeResolvedTo(expectedText);

      if (expectedCustomDescription !== undefined) {
        await expectAsync(harness.getCustomDescription()).toBeResolvedTo(
          expectedCustomDescription,
        );
      }
    }

    await validate('error', 'danger', 'error', 'Danger status indicator');

    await validate(
      'important-info',
      'info',
      'important-info',
      'Info status indicator',
    );

    await validate(
      'completed',
      'success',
      'completed',
      'Success status indicator',
    );

    await validate('warning', 'warning', 'warning', 'Warning status indicator');

    await validate(
      'custom',
      'warning',
      'custom',
      'Warning status indicator with custom screen reader description',
      'Custom warning',
    );

    await validate(
      'error-with-help',
      'danger',
      'error',
      'Danger status indicator with help',
    );
  });
});
