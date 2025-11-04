import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyRadioGroupHarness } from '@skyux/forms/testing';

import { FormsRadioStandardExampleComponent } from './example.component';

describe('Basic radio group example', () => {
  async function setupTest(options: {
    dataSkyId: string;
  }): Promise<SkyRadioGroupHarness> {
    const fixture = TestBed.createComponent(FormsRadioStandardExampleComponent);

    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkyRadioGroupHarness.with({ dataSkyId: options.dataSkyId }),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    return harness;
  }

  async function triggerProcessingIssueError(
    harness: SkyRadioGroupHarness,
  ): Promise<void> {
    const radioHarness = (await harness.getRadioButtons())[1];
    await radioHarness.check();

    await expectAsync(harness.hasError('processingIssue')).toBeResolvedTo(true);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, FormsRadioStandardExampleComponent],
    });
  });

  it('should have the appropriate heading text/level/style, label text, and hint text', async () => {
    const harness = await setupTest({ dataSkyId: 'radio-group' });

    const radioButtons = await harness.getRadioButtons();

    await expectAsync(harness.getHeadingText()).toBeResolvedTo(
      'Payment method',
    );
    await expectAsync(harness.getHeadingLevel()).toBeResolvedTo(4);
    await expectAsync(harness.getHeadingStyle()).toBeResolvedTo(4);
    await expectAsync(harness.getHintText()).toBeResolvedTo(
      'Card methods require proof of identification.',
    );

    await expectAsync(radioButtons[0].getLabelText()).toBeResolvedTo('Cash');
    await expectAsync(radioButtons[0].getHintText()).toBeResolvedTo('');

    await expectAsync(radioButtons[1].getLabelText()).toBeResolvedTo('Check');
    await expectAsync(radioButtons[1].getHintText()).toBeResolvedTo('');

    await expectAsync(radioButtons[2].getLabelText()).toBeResolvedTo(
      'Apple pay',
    );
    await expectAsync(radioButtons[2].getHintText()).toBeResolvedTo('');

    await expectAsync(radioButtons[3].getLabelText()).toBeResolvedTo('Credit');
    await expectAsync(radioButtons[3].getHintText()).toBeResolvedTo(
      'A 2% late fee is applied to payments made after the due date.',
    );

    await expectAsync(radioButtons[4].getLabelText()).toBeResolvedTo('Debit');
    await expectAsync(radioButtons[4].getHintText()).toBeResolvedTo('');
  });

  it('should display an error message when there is a custom validation error', async () => {
    const harness = await setupTest({ dataSkyId: 'radio-group' });

    await triggerProcessingIssueError(harness);

    await expectAsync(harness.hasError('processingIssue')).toBeResolvedTo(true);
  });

  it('should set custom form error details', async () => {
    const harness = await setupTest({ dataSkyId: 'radio-group' });

    await triggerProcessingIssueError(harness);

    const customFormError = await harness.getCustomError('processingIssue');

    await expectAsync(customFormError.getErrorText()).toBeResolvedTo(
      'An error occurred with this payment method. Please contact us to resolve.',
    );
  });

  it('should show a help popover with the expected text', async () => {
    const harness = await setupTest({
      dataSkyId: 'radio-group',
    });

    await harness.clickHelpInline();

    const helpPopoverTitle = await harness.getHelpPopoverTitle();
    expect(helpPopoverTitle).toBe('Are there fees?');

    const helpPopoverContent = await harness.getHelpPopoverContent();
    expect(helpPopoverContent).toBe(
      `We don't charge fees for any payment method. The only exception is when credit card payments are late, which incurs a 2% fee.`,
    );
  });
});
