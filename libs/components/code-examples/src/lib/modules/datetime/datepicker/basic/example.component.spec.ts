import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyDatepickerHarness } from '@skyux/datetime/testing';
import { SkyInputBoxHarness } from '@skyux/forms/testing';

import { DatetimeDatepickerBasicExampleComponent } from './example.component';

describe('Basic datepicker example', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    inputHarness: SkyInputBoxHarness;
    datepickerHarness: SkyDatepickerHarness;
    fixture: ComponentFixture<DatetimeDatepickerBasicExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(
      DatetimeDatepickerBasicExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const inputHarness = await loader.getHarness(
      SkyInputBoxHarness.with({ dataSkyId: options.dataSkyId }),
    );
    const datepickerHarness =
      await inputHarness.queryHarness(SkyDatepickerHarness);

    fixture.detectChanges();
    await fixture.whenStable();

    return { inputHarness, datepickerHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DatetimeDatepickerBasicExampleComponent],
    });
  });

  it('should have initial setup values', async () => {
    const { inputHarness, datepickerHarness, fixture } = await setupTest({
      dataSkyId: 'datepicker-example',
    });

    await expectAsync(inputHarness.getHintText()).toBeResolvedTo(
      'Must be before your 1 year anniversary. Use the format MM/DD/YYYY.',
    );

    await datepickerHarness.clickCalendarButton();

    await inputHarness.clickHelpInline();
    await expectAsync(inputHarness.getHelpPopoverContent()).toBeResolvedTo(
      fixture.componentInstance.helpPopoverContent,
    );

    await datepickerHarness.clickCalendarButton();
    const calendarHarness = await datepickerHarness.getDatepickerCalendar();
    await expectAsync(calendarHarness.getSelectedValue()).toBeResolvedTo(
      'Friday, October 12th 2001',
    );
  });

  it('should throw an error if selecting a weekend', async () => {
    const { inputHarness, datepickerHarness } = await setupTest({
      dataSkyId: 'datepicker-example',
    });

    await datepickerHarness.clickCalendarButton();
    const calendarHarness = await datepickerHarness.getDatepickerCalendar();

    await calendarHarness.clickDate('Saturday, October 13th 2001');
    await expectAsync(
      inputHarness.hasCustomFormError('invalidWeekend'),
    ).toBeResolvedTo(true);
  });
});
