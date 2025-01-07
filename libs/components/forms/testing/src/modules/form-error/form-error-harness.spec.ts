import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SKY_FORM_ERRORS_ENABLED, SkyFormErrorModule } from '@skyux/forms';

import { SkyFormErrorHarness } from './form-error-harness';

//#region Test component
@Component({
  selector: 'sky-form-error-test',
  providers: [
    {
      provide: SKY_FORM_ERRORS_ENABLED,
      useValue: true,
    },
  ],
  template: `
    <sky-form-error errorName="error" [errorText]="errorText" />
    <sky-form-error
      data-sky-id="other-error"
      errorName="other-error"
      [errorText]="errorTextSkyId"
    />
  `,
  standalone: false,
})
class TestComponent {
  public errorText = 'some-error';
  public errorTextSkyId = 'some-error-sky-id';
}
//#endregion Test component

describe('Form error harness', () => {
  async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
    formErrorHarness: SkyFormErrorHarness;
    fixture: ComponentFixture<TestComponent>;
    loader: HarnessLoader;
    pageLoader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [SkyFormErrorModule],
    }).compileComponents();
    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const pageLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const formErrorHarness: SkyFormErrorHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyFormErrorHarness.with({ dataSkyId: options.dataSkyId }),
        )
      : await loader.getHarness(SkyFormErrorHarness);
    return { formErrorHarness, fixture, loader, pageLoader };
  }

  it('should get form error name and text', async () => {
    const { formErrorHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(formErrorHarness.getErrorName()).toBeResolvedTo('error');
    await expectAsync(formErrorHarness.getErrorText()).toBeResolvedTo(
      fixture.componentInstance.errorText,
    );
  });

  it('should get form error name and text by its data-sky-id', async () => {
    const { formErrorHarness, fixture } = await setupTest({
      dataSkyId: 'other-error',
    });

    fixture.detectChanges();

    await expectAsync(formErrorHarness.getErrorName()).toBeResolvedTo(
      'other-error',
    );
    await expectAsync(formErrorHarness.getErrorText()).toBeResolvedTo(
      fixture.componentInstance.errorTextSkyId,
    );
  });
});
