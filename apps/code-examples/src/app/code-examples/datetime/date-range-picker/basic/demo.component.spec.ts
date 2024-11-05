import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyDateRangeCalculatorId } from '@skyux/datetime';
import { SkyDateRangePickerHarness } from '@skyux/datetime/testing';

import { DemoComponent } from '../../date-range-picker/basic/demo.component';

describe('Basic date range picker demo', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    harness: SkyDateRangePickerHarness;
    fixture: ComponentFixture<DemoComponent>;
  }> {
    const fixture = TestBed.createComponent(DemoComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkyDateRangePickerHarness.with({ dataSkyId: options.dataSkyId }),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    return { harness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DemoComponent, NoopAnimationsModule],
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
    await harness.clickHelpInline();
    await expectAsync(harness.getHelpPopoverContent()).toBeResolvedTo(
      'By default, donations include one-time gifts, pledges, and matching gifts. To customize, see Giving settings.',
    );
  });

  it('should throw an error if a weekend is selected', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'last-donation',
    });

    await harness.selectCalculator(SkyDateRangeCalculatorId.SpecificRange);
    await harness.setEndDateValue('05/22/2022');

    await expectAsync(harness.hasError('dateWeekend')).toBeResolvedTo(true);
  });
});
