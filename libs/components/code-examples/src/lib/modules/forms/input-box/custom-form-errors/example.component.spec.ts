import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyInputBoxHarness } from '@skyux/forms/testing';

import { FormsInputBoxWithCustomFormErrorsExampleComponent } from './example.component';

describe('Input box with custom form errors example', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    fixture: ComponentFixture<FormsInputBoxWithCustomFormErrorsExampleComponent>;
    inputBoxHarness: SkyInputBoxHarness;
  }> {
    const fixture = TestBed.createComponent(
      FormsInputBoxWithCustomFormErrorsExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const inputBoxHarness = await loader.getHarness(
      SkyInputBoxHarness.with({ dataSkyId: options.dataSkyId }),
    );

    return { fixture, inputBoxHarness };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsInputBoxWithCustomFormErrorsExampleComponent],
    });
  });

  it('should not allow invalid color to be selected', async () => {
    const { fixture, inputBoxHarness } = await setupTest({
      dataSkyId: 'input-box-favorite-color',
    });

    fixture.detectChanges();

    const selectEl = await inputBoxHarness.querySelector('select');

    // Select the "invalid" option.
    await selectEl.selectOptions(7);

    await expectAsync(
      inputBoxHarness.hasCustomFormError('invalid'),
    ).toBeResolvedTo(true);
  });

  it('should set custom form error details', async () => {
    const { fixture, inputBoxHarness } = await setupTest({
      dataSkyId: 'input-box-favorite-color',
    });

    fixture.detectChanges();

    const selectEl = await inputBoxHarness.querySelector('select');

    await selectEl.selectOptions(7);

    const customFormError = await inputBoxHarness.getCustomFormError('invalid');

    await expectAsync(customFormError.getErrorText()).toBeResolvedTo(
      'The color Invalid Color is not a color',
    );
  });
});
