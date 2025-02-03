import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  SkyCheckboxGroupHarness,
  SkyCheckboxHarness,
} from '@skyux/forms/testing';

import { FormsCheckboxBasicExampleComponent } from './example.component';

describe('Basic checkbox group example', () => {
  async function setupCheckboxGroupTest(options: {
    dataSkyId: string;
  }): Promise<SkyCheckboxGroupHarness> {
    const fixture = TestBed.createComponent(FormsCheckboxBasicExampleComponent);

    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkyCheckboxGroupHarness.with({ dataSkyId: options.dataSkyId }),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    return harness;
  }

  async function setupCheckboxTest(options: {
    dataSkyId: string;
  }): Promise<SkyCheckboxHarness> {
    const fixture = TestBed.createComponent(FormsCheckboxBasicExampleComponent);

    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkyCheckboxHarness.with({ dataSkyId: options.dataSkyId }),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    return harness;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, FormsCheckboxBasicExampleComponent],
    });
  });

  it('should have the appropriate heading text/level/style, label text, and hint text', async () => {
    const harness = await setupCheckboxGroupTest({
      dataSkyId: 'checkbox-group',
    });

    const checkboxButtons = await harness.getCheckboxes();

    await expectAsync(harness.getHeadingText()).toBeResolvedTo(
      'Contact method',
    );
    await expectAsync(harness.getHeadingLevel()).toBeResolvedTo(undefined);
    await expectAsync(harness.getHeadingStyle()).toBeResolvedTo(5);
    await expectAsync(harness.getHintText()).toBeResolvedTo(
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
    const harness = await setupCheckboxGroupTest({
      dataSkyId: 'checkbox-group',
    });

    const checkboxHarness = (await harness.getCheckboxes())[0];

    await checkboxHarness.check();

    await expectAsync(harness.hasError('emailOnly')).toBeResolvedTo(true);
  });

  it('should show a help popover with the expected text', async () => {
    const harness = await setupCheckboxGroupTest({
      dataSkyId: 'checkbox-group',
    });

    await harness.clickHelpInline();

    const helpPopoverContent = await harness.getHelpPopoverContent();
    expect(helpPopoverContent).toBe(
      `We use your contact info to keep you informed on current events. We will not sell your information.`,
    );
  });

  it('should check and uncheck checkboxes in display errors if they are required', async () => {
    const harness = await setupCheckboxTest({ dataSkyId: 'single-checkbox' });

    await expectAsync(harness.isStacked()).toBeResolvedTo(true);

    await expectAsync(harness.isChecked()).toBeResolvedTo(false);
    await harness.check();
    await expectAsync(harness.isChecked()).toBeResolvedTo(true);
    await harness.uncheck();
    await harness.blur();
    await expectAsync(harness.hasRequiredError()).toBeResolvedTo(true);
  });
});
