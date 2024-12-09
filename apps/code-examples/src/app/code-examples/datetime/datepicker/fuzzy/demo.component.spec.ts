import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyDatepickerHarness } from '@skyux/datetime/testing';
import { SkyInputBoxHarness } from '@skyux/forms/testing';

import { DemoComponent } from './demo.component';

describe('Fuzzy datepicker demo', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    inputHarness: SkyInputBoxHarness;
    datepickerHarness: SkyDatepickerHarness;
    fixture: ComponentFixture<DemoComponent>;
  }> {
    const fixture = TestBed.createComponent(DemoComponent);
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
      imports: [DemoComponent, NoopAnimationsModule],
    });
  });

  it('should have initial setup values', async () => {
    const { inputHarness, datepickerHarness, fixture } = await setupTest({
      dataSkyId: 'fuzzy-datepicker-demo',
    });

    await expectAsync(inputHarness.getHintText()).toBeResolvedTo(
      "Include a partial date if you don't have the exact date.",
    );

    await datepickerHarness.clickCalendarButton();

    await inputHarness.clickHelpInline();
    await expectAsync(inputHarness.getHelpPopoverContent()).toBeResolvedTo(
      fixture.componentInstance.helpPopoverContent,
    );

    await datepickerHarness.clickCalendarButton();
    const calendarHarness = await datepickerHarness.getDatepickerCalendar();
    await expectAsync(calendarHarness.getSelectedValue()).toBeResolvedTo(
      'Saturday, November 5th 1955',
    );
  });
});
