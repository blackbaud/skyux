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
import { SkyTimepickerModule } from '@skyux/datetime';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyInputBoxHarness } from '@skyux/forms/testing';

import { SkyTimepickerHarness } from './timepicker-harness';
import { SkyTimepickerInputHarness } from './timepicker-input-harness';

//#region Test component
@Component({
  selector: 'sky-timepicker-test',
  template: `
    <form [formGroup]="myForm">
      <sky-input-box data-sky-id="input-wrapped">
        <sky-timepicker #wrapped>
          <input
            formControlName="inputWrapped"
            type="text"
            [skyTimepickerInput]="wrapped"
          />
        </sky-timepicker>
      </sky-input-box>
      <sky-timepicker data-sky-id="standalone" #standalone>
        <input
          formControlName="standalone"
          timeFormat="HH"
          type="text"
          [skyTimepickerInput]="standalone"
        />
      </sky-timepicker>
    </form>
  `,
  standalone: false,
})
class TestComponent {
  public myForm: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.myForm = formBuilder.group({
      inputWrapped: new FormControl('5:17 AM'),
      standalone: new FormControl('20:09'),
    });
  }
}
//#endregion Test component

describe('Timepicker harness', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    timepickerHarness: SkyTimepickerHarness;
    fixture: ComponentFixture<TestComponent>;
  }> {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SkyTimepickerModule,
        SkyInputBoxModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const timepickerHarness: SkyTimepickerHarness = ['input-wrapped'].includes(
      options.dataSkyId,
    )
      ? await (
          await loader.getHarness(
            SkyInputBoxHarness.with({ dataSkyId: options.dataSkyId }),
          )
        ).queryHarness(SkyTimepickerHarness)
      : await loader.getHarness(
          SkyTimepickerHarness.with({ dataSkyId: options.dataSkyId }),
        );

    return { timepickerHarness, fixture };
  }

  it('should get timepicker inside input box', async () => {
    const { timepickerHarness } = await setupTest({
      dataSkyId: 'input-wrapped',
    });

    await timepickerHarness.clickSelectorButton();
    const selectorHarness = await timepickerHarness.getTimepickerSelector();

    await expectAsync(selectorHarness.getSelectedValue()).toBeResolvedTo(
      '5:15 AM',
    );
  });

  it('should get standalone timepicker', async () => {
    const { timepickerHarness } = await setupTest({ dataSkyId: 'standalone' });

    await timepickerHarness.clickSelectorButton();
    const selectorHarness = await timepickerHarness.getTimepickerSelector();

    await expectAsync(selectorHarness.getSelectedValue()).toBeResolvedTo(
      '20:00',
    );
  });

  it('should click the picker button and get whether timepicker is open', async () => {
    const { timepickerHarness } = await setupTest({
      dataSkyId: 'input-wrapped',
    });

    await expectAsync(timepickerHarness.isTimepickerOpen()).toBeResolvedTo(
      false,
    );

    await timepickerHarness.clickSelectorButton();
    await expectAsync(timepickerHarness.isTimepickerOpen()).toBeResolvedTo(
      true,
    );
  });

  it('should throw an error trying to get selector picker if picker is closed', async () => {
    const { timepickerHarness } = await setupTest({
      dataSkyId: 'input-wrapped',
    });

    await expectAsync(
      timepickerHarness.getTimepickerSelector(),
    ).toBeRejectedWithError(
      'Unable to get timepicker selector because selector is closed.',
    );
  });

  describe('Timepicker selector picker', () => {
    it('should click hour button', async () => {
      const { timepickerHarness } = await setupTest({
        dataSkyId: 'input-wrapped',
      });

      await timepickerHarness.clickSelectorButton();
      const selectorHarness = await timepickerHarness.getTimepickerSelector();
      await selectorHarness.clickHour('2');

      await expectAsync(selectorHarness.getSelectedValue()).toBeResolvedTo(
        '2:15 AM',
      );
    });

    it('should throw an error if hour input is incorrect', async () => {
      const { timepickerHarness } = await setupTest({
        dataSkyId: 'input-wrapped',
      });

      await timepickerHarness.clickSelectorButton();
      const selectorHarness = await timepickerHarness.getTimepickerSelector();

      await expectAsync(selectorHarness.clickHour('17')).toBeRejectedWithError(
        'Unable to find hour button with label "17".',
      );
    });

    it('should click minute button', async () => {
      const { timepickerHarness } = await setupTest({
        dataSkyId: 'input-wrapped',
      });

      await timepickerHarness.clickSelectorButton();
      const selectorHarness = await timepickerHarness.getTimepickerSelector();
      await selectorHarness.clickMinute('30');

      await expectAsync(selectorHarness.getSelectedValue()).toBeResolvedTo(
        '5:30 AM',
      );
    });

    it('should throw an error if minute input is incorrect', async () => {
      const { timepickerHarness } = await setupTest({
        dataSkyId: 'input-wrapped',
      });

      await timepickerHarness.clickSelectorButton();
      const selectorHarness = await timepickerHarness.getTimepickerSelector();

      await expectAsync(
        selectorHarness.clickMinute('17'),
      ).toBeRejectedWithError('Unable to find minute button with label "17".');
    });

    it('should click meridie button', async () => {
      const { timepickerHarness } = await setupTest({
        dataSkyId: 'input-wrapped',
      });

      await timepickerHarness.clickSelectorButton();
      const selectorHarness = await timepickerHarness.getTimepickerSelector();
      await selectorHarness.clickMeridie('PM');

      await expectAsync(selectorHarness.getSelectedValue()).toBeResolvedTo(
        '5:15 PM',
      );
    });

    it('should throw an error if meridie input is incorrect', async () => {
      const { timepickerHarness } = await setupTest({
        dataSkyId: 'input-wrapped',
      });

      await timepickerHarness.clickSelectorButton();
      const selectorHarness = await timepickerHarness.getTimepickerSelector();

      await expectAsync(
        selectorHarness.clickMeridie('17'),
      ).toBeRejectedWithError('Unable to find meridie button with label "17".');
    });

    it('should throw an error when trying to select meridie in 24 hour mode', async () => {
      const { timepickerHarness } = await setupTest({
        dataSkyId: 'standalone',
      });

      await timepickerHarness.clickSelectorButton();
      const selectorHarness = await timepickerHarness.getTimepickerSelector();

      await expectAsync(
        selectorHarness.clickMeridie('PM'),
      ).toBeRejectedWithError('Unable to find meridie button with label "PM".');
    });

    it('should get selector picker 12 hour mode', async () => {
      const { timepickerHarness } = await setupTest({
        dataSkyId: 'input-wrapped',
      });

      await timepickerHarness.clickSelectorButton();
      const selectorHarness = await timepickerHarness.getTimepickerSelector();

      await expectAsync(selectorHarness.getSelectorMode()).toBeResolvedTo(
        '12Hr',
      );
    });

    it('should get selector picker 24 hour mode', async () => {
      const { timepickerHarness } = await setupTest({
        dataSkyId: 'standalone',
      });

      await timepickerHarness.clickSelectorButton();
      const selectorHarness = await timepickerHarness.getTimepickerSelector();

      await expectAsync(selectorHarness.getSelectorMode()).toBeResolvedTo(
        '24Hr',
      );
    });

    it('should get the input harness', async () => {
      const { timepickerHarness } = await setupTest({
        dataSkyId: 'input-wrapped',
      });

      expect(
        (await timepickerHarness.getControl()) instanceof
          SkyTimepickerInputHarness,
      ).toBeTruthy();
    });
  });

  describe('Timepicker input harness', () => {
    it('should set the date', async () => {
      const { timepickerHarness, fixture } = await setupTest({
        dataSkyId: 'input-wrapped',
      });

      const control = fixture.componentInstance.myForm.get('inputWrapped');

      const inputHarness = await timepickerHarness.getControl();
      await inputHarness.setValue('1:15 AM');

      const expectedDate = { hour: 1, minute: 15, meridie: 'AM' };

      expect(control?.value).toEqual(jasmine.objectContaining(expectedDate));
      expect(control?.touched).toEqual(true);
    });

    it('should set the touched status when focus leaves the composite control', async () => {
      const { timepickerHarness, fixture } = await setupTest({
        dataSkyId: 'input-wrapped',
      });

      const control = fixture.componentInstance.myForm.get('inputWrapped');
      const inputHarness = await timepickerHarness.getControl();

      fixture.detectChanges();

      expect(control?.touched).toEqual(false);
      await expectAsync(inputHarness.isFocused()).toBeResolvedTo(false);

      // Interact with selector.
      await timepickerHarness.clickSelectorButton();
      const selectorHarness = await timepickerHarness.getTimepickerSelector();
      await selectorHarness.clickHour('7');

      // Blur the input.
      await inputHarness.blur();

      expect(control?.touched).toEqual(true);
    });
  });
});
