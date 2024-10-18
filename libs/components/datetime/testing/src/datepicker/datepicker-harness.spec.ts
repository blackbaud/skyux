import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyDatepickerModule } from '@skyux/datetime';
import { SkyDatepickerHarness } from '@skyux/datetime/testing';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyInputBoxHarness } from '@skyux/forms/testing';

//#region Test component
@Component({
  selector: 'sky-datepicker-test',
  template: `
    <form [formGroup]="myForm">
      <sky-input-box data-sky-id="input-wrapped">
        <sky-datepicker>
          <input
            skyDatepickerInput
            formControlName="inputWrapped"
            type="text"
          />
        </sky-datepicker>
      </sky-input-box>
      <sky-datepicker data-sky-id="standalone">
        <input skyDatepickerInput formControlName="standalone" type="text" />
      </sky-datepicker>
    </form>
  `,
})
class TestComponent {
  public myForm: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.myForm = formBuilder.group({
      inputWrapped: new FormControl('12/1/2000'),
      standalone: new FormControl('1/2/1234'),
    });
  }
}
//#endregion Test component

describe('Datepicker harness', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    datepickerHarness: SkyDatepickerHarness;
    fixture: ComponentFixture<TestComponent>;
  }> {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SkyDatepickerModule,
        SkyInputBoxModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const datepickerHarness: SkyDatepickerHarness =
      options.dataSkyId === 'input-wrapped'
        ? await (
            await loader.getHarness(
              SkyInputBoxHarness.with({ dataSkyId: options.dataSkyId }),
            )
          ).queryHarness(SkyDatepickerHarness)
        : await loader.getHarness(
            SkyDatepickerHarness.with({ dataSkyId: options.dataSkyId }),
          );

    return { datepickerHarness, fixture };
  }

  it('should get datepicker inside input box', async () => {
    const { datepickerHarness } = await setupTest({
      dataSkyId: 'input-wrapped',
    });

    await datepickerHarness.clickCalendarButton();
    const calendarHarness = await datepickerHarness.getDatepickerCalendar();

    await expectAsync(calendarHarness.getSelectedValue()).toBeResolvedTo(
      'Friday, December 1st 2000',
    );
  });

  it('should get standalone datepicker', async () => {
    const { datepickerHarness } = await setupTest({
      dataSkyId: 'standalone',
    });

    await datepickerHarness.clickCalendarButton();
    const calendarHarness = await datepickerHarness.getDatepickerCalendar();

    await expectAsync(calendarHarness.getSelectedValue()).toBeResolvedTo(
      'Monday, January 2nd 1234',
    );
  });

  it('should click the picker button and get whether datepicker is open', async () => {
    const { datepickerHarness } = await setupTest({
      dataSkyId: 'input-wrapped',
    });

    await expectAsync(datepickerHarness.isDatepickerOpen()).toBeResolvedTo(
      false,
    );

    await datepickerHarness.clickCalendarButton();
    await expectAsync(datepickerHarness.isDatepickerOpen()).toBeResolvedTo(
      true,
    );
  });

  it('should throw an error trying to get calendar picker if picker is closed', async () => {
    const { datepickerHarness } = await setupTest({
      dataSkyId: 'input-wrapped',
    });

    await expectAsync(
      datepickerHarness.getDatepickerCalendar(),
    ).toBeRejectedWithError(
      'Unable to get calendar picker because picker is closed.',
    );
  });

  describe('Datepicker calendar picker', () => {
    it('should get calendar title', async () => {
      const { datepickerHarness } = await setupTest({
        dataSkyId: 'input-wrapped',
      });

      await datepickerHarness.clickCalendarButton();
      const calendarHarness = await datepickerHarness.getDatepickerCalendar();

      await expectAsync(calendarHarness.getCalendarTitle()).toBeResolvedTo(
        'December 2000',
      );
    });

    it('should click previous button', async () => {
      const { datepickerHarness } = await setupTest({
        dataSkyId: 'input-wrapped',
      });

      await datepickerHarness.clickCalendarButton();
      const calendarHarness = await datepickerHarness.getDatepickerCalendar();
      await calendarHarness.clickPreviousButton();

      await expectAsync(calendarHarness.getCalendarTitle()).toBeResolvedTo(
        'November 2000',
      );
    });

    it('should click next button', async () => {
      const { datepickerHarness } = await setupTest({
        dataSkyId: 'input-wrapped',
      });

      await datepickerHarness.clickCalendarButton();
      const calendarHarness = await datepickerHarness.getDatepickerCalendar();
      await calendarHarness.clickNextButton();

      await expectAsync(calendarHarness.getCalendarTitle()).toBeResolvedTo(
        'January 2001',
      );
    });

    it('should click title button', async () => {
      const { datepickerHarness } = await setupTest({
        dataSkyId: 'input-wrapped',
      });

      await datepickerHarness.clickCalendarButton();
      const calendarHarness = await datepickerHarness.getDatepickerCalendar();
      await calendarHarness.clickTitleButton();

      await expectAsync(calendarHarness.getCalendarTitle()).toBeResolvedTo(
        '2000',
      );
    });

    it('should throw an error if title button is clicked when disabled', async () => {
      const { datepickerHarness } = await setupTest({
        dataSkyId: 'input-wrapped',
      });

      await datepickerHarness.clickCalendarButton();
      const calendarHarness = await datepickerHarness.getDatepickerCalendar();
      await calendarHarness.clickTitleButton();
      await calendarHarness.clickTitleButton();

      await expectAsync(
        calendarHarness.clickTitleButton(),
      ).toBeRejectedWithError('Title button is disabled.');
    });

    it('should get calendar picker mode', async () => {
      const { datepickerHarness } = await setupTest({
        dataSkyId: 'input-wrapped',
      });

      await datepickerHarness.clickCalendarButton();
      const calendarHarness = await datepickerHarness.getDatepickerCalendar();

      await expectAsync(calendarHarness.getCalendarMode()).toBeResolvedTo(
        'day',
      );

      await calendarHarness.clickTitleButton();
      await expectAsync(calendarHarness.getCalendarMode()).toBeResolvedTo(
        'month',
      );

      await calendarHarness.clickTitleButton();
      await expectAsync(calendarHarness.getCalendarMode()).toBeResolvedTo(
        'year',
      );
    });

    it('should click a date based on input', async () => {
      const { datepickerHarness, fixture } = await setupTest({
        dataSkyId: 'input-wrapped',
      });

      await datepickerHarness.clickCalendarButton();
      const calendarHarness = await datepickerHarness.getDatepickerCalendar();

      await calendarHarness.clickDate('Saturday, December 2nd 2000');
      expect(
        fixture.componentInstance.myForm.controls['inputWrapped'].value,
      ).toEqual(new Date('12/02/2000'));
    });

    it('should throw an error if date input is incorrect', async () => {
      const { datepickerHarness } = await setupTest({
        dataSkyId: 'input-wrapped',
      });

      await datepickerHarness.clickCalendarButton();
      const calendarHarness = await datepickerHarness.getDatepickerCalendar();

      await expectAsync(
        calendarHarness.clickDate('December'),
      ).toBeRejectedWithError(
        'Unable to find date with label "December". Check that the format is correct and matches the current calendar mode.',
      );
    });
  });
});
