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
  template: ` <sky-form-errors [labelText]="errorText" [errors]="errors" /> `,
})
class TestComponent {
  public errorText: string | undefined = 'Form';
  public errors: ValidationErrors | undefined = {
    required: true,
  };
}
//#endregion Test component

fdescribe('Form errors harness', () => {
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

  it('should get all errors', async () => {
    const { formErrorsHarness, fixture } = await setupTest();
    fixture.componentInstance.errors = {
      required: true,
      skyUrl: true,
      minlength: { requiredLength: 5 },
    };

    fixture.detectChanges();

    await expectAsync(formErrorsHarness.getErrors()).toBeResolvedTo([
      'Form is required.',
      'Form must be at least 5 character(s).',
      'Enter a URL with a valid format.',
    ]);
  });

  it('should get number of errors', async () => {
    const { formErrorsHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(formErrorsHarness.getNumberOfErrors()).toBeResolvedTo(1);
  });
});
