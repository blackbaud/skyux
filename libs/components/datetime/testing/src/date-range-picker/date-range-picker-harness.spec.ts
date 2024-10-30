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
import { SkyDateRangePickerModule } from '@skyux/datetime';

import { SkyDateRangePickerHarness } from './date-range-picker-harness';

//#region Test component
@Component({
  selector: 'sky-datepicker-test',
  template: `
    <form [formGroup]="myForm">
      <sky-date-range-picker
        data-sky-id="test-date-range-picker"
        [helpPopoverContent]="helpPopoverContent"
        [helpPopoverTitle]="helpPopoverTitle"
        [hintText]="hintText"
        [labelText]="labelText"
        [stacked]="stacked"
      />
      <sky-date-range-picker
        data-sky-id="other-date-range-picker"
        hintText="The other date range picker"
      />
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
fdescribe('Date range picker harness', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    dateRangePickerHarness: SkyDateRangePickerHarness;
    fixture: ComponentFixture<TestComponent>;
  }> {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SkyDateRangePickerModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const dateRangePickerHarness: SkyDateRangePickerHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyDateRangePickerHarness.with({ dataSkyId: options.dataSkyId }),
        )
      : await loader.getHarness(SkyDateRangePickerHarness);

    return { dateRangePickerHarness, fixture };
  }

  it('should get the date range picker by its data-sky-id', async () => {
    const { dateRangePickerHarness } = await setupTest({
      dataSkyId: 'other-date-range-picker',
    });

    await expectAsync(dateRangePickerHarness.getHintText()).toBeResolvedTo(
      'The other date range picker',
    );
  });
});
