import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidationErrors } from '@angular/forms';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SkyFormErrorsModule } from '@skyux/forms';

import { SkyFormErrorsHarness } from './form-errors-harness';

//#region Test component
@Component({
  selector: 'sky-form-errors-test',
  template: ` <sky-form-errors [labelText]="errorText" [errors]="errors" />
    <sky-form-errors
      data-sky-id="other-error"
      labelText="other error"
      [errors]="{ required: true }"
    />"`,
})
class TestComponent {
  public errorText: string | undefined = 'Form';
  public errors: ValidationErrors | undefined;
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
      imports: [SkyFormErrorsModule],
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

    await expectAsync(formErrorsHarness.getNumberOfErrors()).toBeResolvedTo(1);
    await expectAsync(formErrorsHarness.hasRequiredError()).toBeResolvedTo(
      true,
    );
  });

  it('should get number of errors', async () => {
    const { formErrorsHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(formErrorsHarness.getNumberOfErrors()).toBeResolvedTo(0);

    fixture.componentInstance.errors = {
      required: true,
      minlength: true,
    };
    fixture.detectChanges();

    await expectAsync(formErrorsHarness.getNumberOfErrors()).toBeResolvedTo(2);
  });

  it('should return whether first class errors are fired', async () => {
    const { formErrorsHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(formErrorsHarness.hasRequiredError()).toBeResolvedTo(
      false,
    );
    await expectAsync(formErrorsHarness.hasMaxLengthError()).toBeResolvedTo(
      false,
    );
    await expectAsync(formErrorsHarness.hasMinLengthError()).toBeResolvedTo(
      false,
    );
    await expectAsync(
      formErrorsHarness.hasCharacterCountError(),
    ).toBeResolvedTo(false);
    await expectAsync(formErrorsHarness.hasDateError()).toBeResolvedTo(false);
    await expectAsync(formErrorsHarness.hasEmailError()).toBeResolvedTo(false);
    await expectAsync(formErrorsHarness.hasPhoneFieldError()).toBeResolvedTo(
      false,
    );
    await expectAsync(formErrorsHarness.hasTimeError()).toBeResolvedTo(false);
    await expectAsync(formErrorsHarness.hasUrlError()).toBeResolvedTo(false);

    fixture.componentInstance.errors = {
      required: true,
      minlength: true,
      maxlength: true,
      skyCharacterCounter: true,
      skyDate: true,
      skyEmail: true,
      skyPhoneField: true,
      skyTime: true,
      skyUrl: true,
    };
    fixture.detectChanges();

    await expectAsync(formErrorsHarness.hasRequiredError()).toBeResolvedTo(
      true,
    );
    await expectAsync(formErrorsHarness.hasMaxLengthError()).toBeResolvedTo(
      true,
    );
    await expectAsync(formErrorsHarness.hasMinLengthError()).toBeResolvedTo(
      true,
    );
    await expectAsync(
      formErrorsHarness.hasCharacterCountError(),
    ).toBeResolvedTo(true);
    await expectAsync(formErrorsHarness.hasDateError()).toBeResolvedTo(true);
    await expectAsync(formErrorsHarness.hasEmailError()).toBeResolvedTo(true);
    await expectAsync(formErrorsHarness.hasPhoneFieldError()).toBeResolvedTo(
      true,
    );
    await expectAsync(formErrorsHarness.hasTimeError()).toBeResolvedTo(true);
    await expectAsync(formErrorsHarness.hasUrlError()).toBeResolvedTo(true);
  });
});
