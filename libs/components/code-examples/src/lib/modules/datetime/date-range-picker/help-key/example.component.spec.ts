import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  SkyHelpTestingController,
  SkyHelpTestingModule,
} from '@skyux/core/testing';
import { SkyDateRangePickerHarness } from '@skyux/datetime/testing';

import { DatetimeDateRangePickerHelpKeyExampleComponent } from './example.component';

describe('Basic date range picker example', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    harness: SkyDateRangePickerHarness;
    fixture: ComponentFixture<DatetimeDateRangePickerHelpKeyExampleComponent>;
    helpController: SkyHelpTestingController;
  }> {
    const fixture = TestBed.createComponent(
      DatetimeDateRangePickerHelpKeyExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const helpController = TestBed.inject(SkyHelpTestingController);

    const harness = await loader.getHarness(
      SkyDateRangePickerHarness.with({ dataSkyId: options.dataSkyId }),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    return { harness, fixture, helpController };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        DatetimeDateRangePickerHelpKeyExampleComponent,
        NoopAnimationsModule,
        SkyHelpTestingModule,
      ],
    });
  });

  it('should set initial value', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'last-donation',
    });

    await expectAsync(harness.getLabelText()).toBeResolvedTo('Last donation');
    await expectAsync(harness.getHintText()).toBeResolvedTo(
      'Donations received today are updated at the top of each hour.',
    );
  });

  it('should have the correct help key', async () => {
    const { harness, helpController } = await setupTest({
      dataSkyId: 'last-donation',
    });

    await harness.clickHelpInline();

    helpController.expectCurrentHelpKey('dates-help');
  });
});
