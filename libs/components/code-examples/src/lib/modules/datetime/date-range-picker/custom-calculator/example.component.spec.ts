import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopSkyAnimations } from '@skyux/core';
import { SkyDateRangeCalculatorId, SkyDateRangeService } from '@skyux/datetime';
import { SkyDateRangePickerHarness } from '@skyux/datetime/testing';

import { firstValueFrom } from 'rxjs';

import { DatetimeDateRangePickerCustomCalculatorExampleComponent } from './example.component';

describe('Date range picker with custom calculator example', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    harness: SkyDateRangePickerHarness;
    fixture: ComponentFixture<DatetimeDateRangePickerCustomCalculatorExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(
      DatetimeDateRangePickerCustomCalculatorExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkyDateRangePickerHarness.with({ dataSkyId: options.dataSkyId }),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    return { harness, fixture };
  }

  async function getCustomCalculatorId(
    shortDescription: string,
  ): Promise<SkyDateRangeCalculatorId> {
    for (const calculator of TestBed.inject(SkyDateRangeService).calculators) {
      if (
        (await firstValueFrom(calculator.shortDescription$)) ===
        shortDescription
      ) {
        return calculator.calculatorId;
      }
    }

    throw new Error(`Could not find calculator "${shortDescription}".`);
  }

  function getSelectedCalculatorText(
    fixture: ComponentFixture<DatetimeDateRangePickerCustomCalculatorExampleComponent>,
  ): string | undefined {
    return (fixture.nativeElement as HTMLElement)
      .querySelector('p')
      ?.textContent?.trim();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DatetimeDateRangePickerCustomCalculatorExampleComponent],
      providers: [provideNoopSkyAnimations()],
    });
  });

  it('should set initial values', async () => {
    const { harness, fixture } = await setupTest({
      dataSkyId: 'last-donation',
    });

    await expectAsync(harness.getLabelText()).toBeResolvedTo('Last donation');
    await expectAsync(harness.getHintText()).toBeResolvedTo(
      'Donations received today are updated at the top of each hour.',
    );
    await expectAsync(harness.getSelectedCalculator()).toBeResolvedTo(
      SkyDateRangeCalculatorId.AnyTime,
    );
    await expectAsync(harness.isDisabled()).toBeResolvedTo(false);
    await expectAsync(harness.isStartDateVisible()).toBeResolvedTo(false);
    await expectAsync(harness.isEndDateVisible()).toBeResolvedTo(false);

    expect(getSelectedCalculatorText(fixture)).toBe(
      'Selected calculator: At any time',
    );

    await harness.clickHelpInline();
    await expectAsync(harness.getHelpPopoverContent()).toBeResolvedTo(
      'By default, donations include one-time gifts, pledges, and matching gifts. To customize, see Giving settings.',
    );
  });

  it('should display the selected calculator', async () => {
    const { harness, fixture } = await setupTest({
      dataSkyId: 'last-donation',
    });

    await harness.selectCalculator(SkyDateRangeCalculatorId.LastFiscalYear);
    fixture.detectChanges();

    await expectAsync(harness.getSelectedCalculator()).toBeResolvedTo(
      SkyDateRangeCalculatorId.LastFiscalYear,
    );
    expect(getSelectedCalculatorText(fixture)).toBe(
      'Selected calculator: Last fiscal year',
    );

    await harness.selectCalculator(await getCustomCalculatorId('Since 1999'));
    fixture.detectChanges();

    expect(getSelectedCalculatorText(fixture)).toBe(
      'Selected calculator: Since 1999',
    );
  });

  it('should show start and end dates for a specific range', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'last-donation',
    });

    await harness.selectCalculator(SkyDateRangeCalculatorId.SpecificRange);

    await expectAsync(harness.isStartDateVisible()).toBeResolvedTo(true);
    await expectAsync(harness.isEndDateVisible()).toBeResolvedTo(true);

    await harness.setStartDateValue('01/01/2024');
    await harness.setEndDateValue('01/31/2024');

    await expectAsync(harness.getStartDateValue()).toBeResolvedTo('01/01/2024');
    await expectAsync(harness.getEndDateValue()).toBeResolvedTo('01/31/2024');
  });

  it('should show an error when the custom calculator receives a future date', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'last-donation',
    });

    await harness.selectCalculator(
      await getCustomCalculatorId('Date before today'),
    );

    await expectAsync(harness.isStartDateVisible()).toBeResolvedTo(false);
    await expectAsync(harness.isEndDateVisible()).toBeResolvedTo(true);

    const nextYear = new Date().getFullYear() + 1;
    await harness.setEndDateValue(`01/01/${nextYear}`);

    await expectAsync(harness.hasError('dateIsAfterToday')).toBeResolvedTo(
      true,
    );

    await harness.setEndDateValue('01/01/2020');

    await expectAsync(harness.hasError('dateIsAfterToday')).toBeResolvedTo(
      false,
    );
  });
});
