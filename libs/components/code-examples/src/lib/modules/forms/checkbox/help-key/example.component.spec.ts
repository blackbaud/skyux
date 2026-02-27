import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import {
  SkyHelpTestingController,
  SkyHelpTestingModule,
} from '@skyux/core/testing';
import {
  SkyCheckboxGroupHarness,
  SkyCheckboxHarness,
} from '@skyux/forms/testing';

import { FormsCheckboxHelpKeyExampleComponent } from './example.component';

describe('Basic checkbox group example', () => {
  async function setupCheckboxGroupTest(options: {
    dataSkyId: string;
  }): Promise<{
    checkboxGroupHarness: SkyCheckboxGroupHarness;
    helpController: SkyHelpTestingController;
  }> {
    const fixture = TestBed.createComponent(
      FormsCheckboxHelpKeyExampleComponent,
    );

    const loader = TestbedHarnessEnvironment.loader(fixture);

    const checkboxGroupHarness = await loader.getHarness(
      SkyCheckboxGroupHarness.with({ dataSkyId: options.dataSkyId }),
    );

    const helpController = TestBed.inject(SkyHelpTestingController);

    fixture.detectChanges();
    await fixture.whenStable();

    return { checkboxGroupHarness, helpController };
  }

  async function setupCheckboxTest(options: { dataSkyId: string }): Promise<{
    checkboxHarness: SkyCheckboxHarness;
    helpController: SkyHelpTestingController;
  }> {
    const fixture = TestBed.createComponent(
      FormsCheckboxHelpKeyExampleComponent,
    );

    const loader = TestbedHarnessEnvironment.loader(fixture);

    const checkboxHarness = await loader.getHarness(
      SkyCheckboxHarness.with({ dataSkyId: options.dataSkyId }),
    );

    const helpController = TestBed.inject(SkyHelpTestingController);

    fixture.detectChanges();
    await fixture.whenStable();

    return { checkboxHarness, helpController };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsCheckboxHelpKeyExampleComponent,
        SkyHelpTestingModule],
    });
  });

  it('should have the appropriate heading text/level/style, label text, and hint text', async () => {
    const { checkboxGroupHarness } = await setupCheckboxGroupTest({
      dataSkyId: 'checkbox-group',
    });

    const checkboxButtons = await checkboxGroupHarness.getCheckboxes();

    await expectAsync(checkboxGroupHarness.getHeadingText()).toBeResolvedTo(
      'Contact method',
    );
    await expectAsync(checkboxGroupHarness.getHeadingLevel()).toBeResolvedTo(
      undefined,
    );
    await expectAsync(checkboxGroupHarness.getHeadingStyle()).toBeResolvedTo(5);
    await expectAsync(checkboxGroupHarness.getHintText()).toBeResolvedTo(
      'Please select at least one phone-based method.',
    );

    await expectAsync(checkboxButtons[0].getLabelText()).toBeResolvedTo(
      'Email',
    );
    await expectAsync(checkboxButtons[0].getHintText()).toBeResolvedTo('');

    await expectAsync(checkboxButtons[1].getLabelText()).toBeResolvedTo(
      'Phone',
    );
    await expectAsync(checkboxButtons[1].getHintText()).toBeResolvedTo('');

    await expectAsync(checkboxButtons[2].getLabelText()).toBeResolvedTo('Text');
    await expectAsync(checkboxButtons[2].getHintText()).toBeResolvedTo('');
  });

  it('should display an error message when there is a custom validation error', async () => {
    const { checkboxGroupHarness } = await setupCheckboxGroupTest({
      dataSkyId: 'checkbox-group',
    });

    const checkboxHarness = (await checkboxGroupHarness.getCheckboxes())[0];

    await checkboxHarness.check();

    await expectAsync(
      checkboxGroupHarness.hasError('emailOnly'),
    ).toBeResolvedTo(true);
  });

  it('should have the correct help key for checkbox groups', async () => {
    const { checkboxGroupHarness, helpController } =
      await setupCheckboxGroupTest({
        dataSkyId: 'checkbox-group',
      });

    await checkboxGroupHarness.clickHelpInline();

    helpController.expectCurrentHelpKey('contact-help');
  });

  it('should check and uncheck checkboxes in display errors if they are required', async () => {
    const { checkboxHarness } = await setupCheckboxTest({
      dataSkyId: 'single-checkbox',
    });

    await expectAsync(checkboxHarness.isStacked()).toBeResolvedTo(true);

    await expectAsync(checkboxHarness.isChecked()).toBeResolvedTo(false);
    await checkboxHarness.check();
    await expectAsync(checkboxHarness.isChecked()).toBeResolvedTo(true);
    await checkboxHarness.uncheck();
    await checkboxHarness.blur();
    await expectAsync(checkboxHarness.hasRequiredError()).toBeResolvedTo(true);
  });

  it('should have the correct help key for checkboxes', async () => {
    const { checkboxHarness, helpController } = await setupCheckboxTest({
      dataSkyId: 'single-checkbox',
    });

    await checkboxHarness.clickHelpInline();

    helpController.expectCurrentHelpKey('terms-help');
  });
});
