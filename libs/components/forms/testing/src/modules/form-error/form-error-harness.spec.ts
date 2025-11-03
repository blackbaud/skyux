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
    <sky-form-error [errorName]="errorName" [errorText]="errorText" />
    <sky-form-error
      data-sky-id="other-error"
      [errorName]="errorNameSkyId"
      [errorText]="errorTextSkyId"
    />
  `,
  standalone: false,
})
class TestComponent {
  public errorName = 'error';
  public errorText = 'some-error';
  public errorNameSkyId = 'error-sky-id';
  public errorTextSkyId = 'some-error-sky-id';
}
//#endregion Test component

describe('Form error harness', () => {
  async function setupTest(
    options: { dataSkyId?: string; errorName?: string } = {},
  ): Promise<{
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
    const formErrorHarness: SkyFormErrorHarness = options
      ? await loader.getHarness(SkyFormErrorHarness.with(options))
      : await loader.getHarness(SkyFormErrorHarness);
    return { formErrorHarness, fixture, loader, pageLoader };
  }

  it('should get form error text', async () => {
    const { formErrorHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(formErrorHarness.getErrorText()).toBeResolvedTo(
      fixture.componentInstance.errorText,
    );
  });

  it('should get form error text by its data-sky-id', async () => {
    const { formErrorHarness, fixture } = await setupTest({
      dataSkyId: 'other-error',
    });

    fixture.detectChanges();

    await expectAsync(formErrorHarness.getErrorText()).toBeResolvedTo(
      fixture.componentInstance.errorTextSkyId,
    );
  });

  it('should get form error by its error name', async () => {
    const { formErrorHarness, fixture } = await setupTest({
      errorName: 'error-sky-id',
    });

    fixture.detectChanges();

    await expectAsync(formErrorHarness.getErrorText()).toBeResolvedTo(
      fixture.componentInstance.errorTextSkyId,
    );
  });
});
