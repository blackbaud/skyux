import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyTimepickerHarness } from '@skyux/datetime/testing';
import { SkyInputBoxHarness } from '@skyux/forms/testing';

import { DatetimeTimepickerBasicExampleComponent } from './example.component';

describe('Basic timepicker example', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    inputHarness: SkyInputBoxHarness;
    timepickerHarness: SkyTimepickerHarness;
    fixture: ComponentFixture<DatetimeTimepickerBasicExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(
      DatetimeTimepickerBasicExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const inputHarness = await loader.getHarness(
      SkyInputBoxHarness.with({ dataSkyId: options.dataSkyId }),
    );
    const timepickerHarness =
      await inputHarness.queryHarness(SkyTimepickerHarness);

    fixture.detectChanges();
    await fixture.whenStable();

    return { inputHarness, timepickerHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DatetimeTimepickerBasicExampleComponent, NoopAnimationsModule],
    });
  });

  it('should have initial setup values', async () => {
    const { inputHarness, timepickerHarness, fixture } = await setupTest({
      dataSkyId: 'timepicker-example',
    });

    await expectAsync(inputHarness.getHintText()).toBeResolvedTo(
      'Choose a time that allows for late arrivals.',
    );

    await timepickerHarness.clickSelectorButton();

    await inputHarness.clickHelpInline();
    await expectAsync(inputHarness.getHelpPopoverContent()).toBeResolvedTo(
      fixture.componentInstance.helpPopoverContent,
    );

    await timepickerHarness.clickSelectorButton();
    const selectorHarness = await timepickerHarness.getTimepickerSelector();
    await expectAsync(selectorHarness.getSelectedValue()).toBeResolvedTo(
      '2:45 AM',
    );
    await expectAsync(
      (await timepickerHarness.getControl()).isDisabled(),
    ).toBeResolvedTo(false);
  });

  it('should throw an error if selecting an invalid time', async () => {
    const { inputHarness, timepickerHarness } = await setupTest({
      dataSkyId: 'timepicker-example',
    });

    await timepickerHarness.clickSelectorButton();
    const selectorHarness = await timepickerHarness.getTimepickerSelector();

    await selectorHarness.clickMinute('40');
    await expectAsync(
      inputHarness.hasCustomFormError('invalidMinute'),
    ).toBeResolvedTo(true);
  });
});
