import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidationErrors } from '@angular/forms';
// eslint-disable-next-line @nx/enforce-module-boundaries
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
  template: ` <sky-form-errors [labelText]="errorText" [showErrors]="true">
      <sky-form-error errorName="error1" errorText="error1 text" />
    </sky-form-errors>
    <sky-form-errors
      data-sky-id="other-error"
      labelText="other error"
      showErrors="true"
    >
      <sky-form-error
        errorName="error2"
        errorText="error2 text"
      /> </sky-form-errors
    >"`,
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

    await expectAsync(formErrorsHarness.hasError('error2')).toBeResolvedTo(
      true,
    );
    await expectAsync(formErrorsHarness.getFormErrors()).toBeResolvedTo([
      { errorName: 'error2' },
    ]);
  });
});
