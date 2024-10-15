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
          <input formControlName="inputWrapped" type="text" />
        </sky-datepicker>
      </sky-input-box>
      <sky-datepicker data-sky-id="standalone">
        <input formControlName="standalone" type="text" />
      </sky-datepicker>
    </form>
  `,
})
class TestComponent {
  public myForm: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.myForm = formBuilder.group({
      inputWrapped: new FormControl('input wrapped'),
      standalone: new FormControl('standalone'),
    });
  }
}
//#endregion Test component

fdescribe('Datepicker harness', () => {
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
    const { fixture } = await setupTest({
      dataSkyId: 'input-wrapped',
    });

    expect(
      fixture.componentInstance.myForm.controls['inputWrapped'].value,
    ).toBe('input wrapped');
  });

  it('should get standalone datepicker', async () => {
    const { fixture } = await setupTest({
      dataSkyId: 'standalone',
    });

    expect(
      fixture.componentInstance.myForm.controls['inputWrapped'].value,
    ).toBe('input wrapped');
  });
});
