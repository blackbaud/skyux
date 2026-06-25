import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidationErrors } from '@angular/forms';
import {
  SKY_FORM_ERRORS_ENABLED,
  SkyFormErrorModule,
  SkyFormErrorsModule,
} from '@skyux/forms';

import { SkyFormErrorsHarness } from './form-errors-harness';

//#region Test component
@Component({
  selector: 'sky-form-errors-test',
  providers: [
    {
      provide: SKY_FORM_ERRORS_ENABLED,
      useValue: true,
    },
  ],
  template: ` <sky-form-errors
      [touched]="true"
      [dirty]="true"
      [labelText]="errorText"
      [errors]="errors"
    >
      @if (customErrorName) {
        <sky-form-error
          [errorName]="customErrorName"
          errorText="Custom error"
        />
      }
    </sky-form-errors>
    <sky-form-errors
      data-sky-id="other-error"
      labelText="other error"
      [touched]="true"
      [dirty]="true"
      [errors]="{ required: true }"
    />"`,
  standalone: false,
})
class TestComponent {
  public errorText: string | undefined = 'Form';
  public errors: ValidationErrors | undefined;
  public customErrorName: string | undefined;
}
//#endregion Test component

describe('Form errors harness', () => {
  async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
    formErrorsHarness: SkyFormErrorsHarness;
    fixture: ComponentFixture<TestComponent>;
    loader: HarnessLoader;
    pageLoader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [SkyFormErrorsModule, SkyFormErrorModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const pageLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const formErrorsHarness: SkyFormErrorsHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyFormErrorsHarness.with({ dataSkyId: options.dataSkyId }),
        )
      : await loader.getHarness(SkyFormErrorsHarness);

    return { formErrorsHarness, fixture, loader, pageLoader };
  }

  it('should get form error by its data-sky-id', async () => {
    const { formErrorsHarness, fixture } = await setupTest({
      dataSkyId: 'other-error',
    });

    fixture.detectChanges();
    fixture.detectChanges();

    await expectAsync(formErrorsHarness.hasError('required')).toBeResolvedTo(
      true,
    );
    await expectAsync(formErrorsHarness.getFormErrors()).toBeResolvedTo([
      { errorName: 'required' },
    ]);
  });

  it('should return an array of current errors', async () => {
    const { formErrorsHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(formErrorsHarness.getFormErrors()).toBeResolvedTo([]);

    fixture.componentInstance.errors = {
      required: true,
      minlength: true,
      maxlength: true,
      skyDate: { invalid: true, minDate: true, maxDate: true },
      skyEmail: true,
      skyPhoneField: true,
      skyTime: true,
      skyUrl: true,
    };
    fixture.detectChanges();

    await expectAsync(formErrorsHarness.getFormErrors()).toBeResolvedTo([
      { errorName: 'required' },
      { errorName: 'minlength' },
      { errorName: 'invalidDate' },
      { errorName: 'minDate' },
      { errorName: 'maxDate' },
      { errorName: 'email' },
      { errorName: 'phone' },
      { errorName: 'time' },
      { errorName: 'url' },
      { errorName: 'maxlength' },
    ]);
  });

  it('should return custom errors', async () => {
    const { formErrorsHarness, fixture } = await setupTest();

    fixture.componentInstance.customErrorName = 'custom';
    fixture.detectChanges();

    await expectAsync(formErrorsHarness.hasError('custom')).toBeResolvedTo(
      true,
    );

    await expectAsync(formErrorsHarness.getFormErrors()).toBeResolvedTo([
      { errorName: 'custom' },
    ]);
  });
});
