import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyHelpService } from '@skyux/core';
import { SkyHelpTestingModule } from '@skyux/core/testing';

import { SkyCheckboxHarness } from './checkbox-harness';
import { CheckboxHarnessTestComponent } from './fixtures/checkbox-harness-test.component';

async function setupTest(
  options: { dataSkyId?: string; hideEmailLabel?: boolean } = {},
): Promise<{
  checkboxHarness: SkyCheckboxHarness;
  fixture: ComponentFixture<CheckboxHarnessTestComponent>;
  loader: HarnessLoader;
}> {
  await TestBed.configureTestingModule({
    imports: [
      CheckboxHarnessTestComponent,
      SkyHelpTestingModule],
  }).compileComponents();

  const fixture = TestBed.createComponent(CheckboxHarnessTestComponent);
  if (options.hideEmailLabel) {
    fixture.componentInstance.hideEmailLabel = true;
    fixture.detectChanges();
  }
  const loader = TestbedHarnessEnvironment.loader(fixture);

  const checkboxHarness: SkyCheckboxHarness = options.dataSkyId
    ? await loader.getHarness(
        SkyCheckboxHarness.with({
          dataSkyId: options.dataSkyId,
        }),
      )
    : await loader.getHarness(SkyCheckboxHarness);

  return { checkboxHarness, fixture, loader };
}

describe('Checkbox harness', () => {
  it('should check and uncheck the checkbox', async () => {
    const { checkboxHarness } = await setupTest({
      dataSkyId: 'my-email-checkbox',
    });

    await expectAsync(checkboxHarness.isChecked()).toBeResolvedTo(false);

    await checkboxHarness.check();
    await expectAsync(checkboxHarness.isChecked()).toBeResolvedTo(true);

    await checkboxHarness.uncheck();
    await expectAsync(checkboxHarness.isChecked()).toBeResolvedTo(false);
  });

  it('should check if checkbox is disabled', async () => {
    const { checkboxHarness, fixture } = await setupTest({
      dataSkyId: 'my-email-checkbox',
    });

    await expectAsync(checkboxHarness.isDisabled()).toBeResolvedTo(false);

    fixture.componentInstance.disableForm();
    await expectAsync(checkboxHarness.isDisabled()).toBeResolvedTo(true);
  });

  it('should check if checkbox is required', async () => {
    const { checkboxHarness, loader } = await setupTest({
      dataSkyId: 'my-email-checkbox',
    });

    await expectAsync(checkboxHarness.isRequired()).toBeResolvedTo(false);

    const phoneCheckboxHarness = await loader.getHarness(
      SkyCheckboxHarness.with({
        dataSkyId: 'my-phone-checkbox',
      }),
    );
    await expectAsync(phoneCheckboxHarness.isRequired()).toBeResolvedTo(true);
  });

  it('should focus the checkbox', async () => {
    const { checkboxHarness } = await setupTest({
      dataSkyId: 'my-email-checkbox',
    });

    await expectAsync(checkboxHarness.isFocused()).toBeResolvedTo(false);

    await checkboxHarness.focus();
    await expectAsync(checkboxHarness.isFocused()).toBeResolvedTo(true);

    await checkboxHarness.blur();
    await expectAsync(checkboxHarness.isFocused()).toBeResolvedTo(false);
  });

  it('should get ARIA attributes', async () => {
    const { checkboxHarness } = await setupTest({
      dataSkyId: 'my-email-checkbox',
    });

    await expectAsync(checkboxHarness.getAriaLabel()).toBeResolvedTo(
      'Your email address',
    );
    await expectAsync(checkboxHarness.getAriaLabelledby()).toBeResolvedTo(
      'foo-email-id',
    );
    await expectAsync(checkboxHarness.getLabelText()).toBeResolvedTo('Email');
  });

  it('should handle a missing label when getting the label text', async () => {
    const { checkboxHarness } = await setupTest({
      dataSkyId: 'my-email-checkbox',
      hideEmailLabel: true,
    });
    await expectAsync(checkboxHarness.getLabelText()).toBeResolvedTo(undefined);
  });

  it('should get the label text when specified via `labelText` input', async () => {
    const { checkboxHarness } = await setupTest({
      dataSkyId: 'my-phone-checkbox',
    });

    await expectAsync(checkboxHarness.getLabelText()).toBeResolvedTo('Phone');
  });

  it('should get the label text when specified via `labelText` input and label is hidden', async () => {
    const { checkboxHarness, fixture } = await setupTest({
      dataSkyId: 'my-phone-checkbox',
    });

    fixture.componentInstance.hidePhoneLabel = true;
    fixture.detectChanges();

    await expectAsync(checkboxHarness.getLabelText()).toBeResolvedTo('Phone');
  });

  it('should indicate the label is not hidden when the label is specified via `labelText`', async () => {
    const { checkboxHarness } = await setupTest({
      dataSkyId: 'my-phone-checkbox',
    });

    await expectAsync(checkboxHarness.getLabelHidden()).toBeResolvedTo(false);
  });

  it('should indicate the label is hidden when the label is specified via `labelText`', async () => {
    const { checkboxHarness, fixture } = await setupTest({
      dataSkyId: 'my-phone-checkbox',
    });

    fixture.componentInstance.hidePhoneLabel = true;
    fixture.detectChanges();

    await expectAsync(checkboxHarness.getLabelHidden()).toBeResolvedTo(true);
  });

  it('should throw an error when getting `labelHidden` for a checkbox using `sky-checkbox-label`', async () => {
    const { checkboxHarness } = await setupTest({
      dataSkyId: 'my-email-checkbox',
    });

    await expectAsync(checkboxHarness.getLabelHidden()).toBeRejectedWithError(
      '`labelHidden` is only supported when setting the checkbox label via the `labelText` input.',
    );
  });

  it('should get the hint text', async () => {
    const { checkboxHarness, fixture } = await setupTest({
      dataSkyId: 'my-phone-checkbox',
    });
    const hintText = 'Hint text for the checkbox.';

    await expectAsync(checkboxHarness.getHintText()).toBeResolvedTo('');

    fixture.componentInstance.phoneHintText = hintText;
    fixture.detectChanges();

    await expectAsync(checkboxHarness.getHintText()).toBeResolvedTo(hintText);
  });

  it('should get the checkbox name and value', async () => {
    const { checkboxHarness } = await setupTest({
      dataSkyId: 'my-email-checkbox',
    });

    await expectAsync(checkboxHarness.getName()).toBeResolvedTo(
      jasmine.stringMatching(/sky-checkbox-sky-id-gen__[0-9]+__[0-9]+/),
    );
    await expectAsync(checkboxHarness.getValue()).toBeResolvedTo('on');
  });

  it('should indicate the component is stacked', async () => {
    const { checkboxHarness } = await setupTest({
      dataSkyId: 'stacked-checkbox',
    });

    await expectAsync(checkboxHarness.isStacked()).toBeResolvedTo(true);
  });

  it('should throw error if toggling a disabled checkbox', async () => {
    const { checkboxHarness, fixture } = await setupTest({
      dataSkyId: 'my-email-checkbox',
    });

    fixture.componentInstance.disableForm();

    await expectAsync(checkboxHarness.isChecked()).toBeResolvedTo(false);

    await expectAsync(checkboxHarness.check()).toBeRejectedWithError(
      'Could not toggle the checkbox because it is disabled.',
    );
  });

  it('should display a required error message when there is an error', async () => {
    const { checkboxHarness } = await setupTest({
      dataSkyId: 'my-phone-checkbox',
    });

    await checkboxHarness.check();
    await checkboxHarness.uncheck();
    await checkboxHarness.blur();

    await expectAsync(checkboxHarness.hasRequiredError()).toBeResolvedTo(true);
  });

  it('should display a custom error message when there is a custom validation error', async () => {
    const { checkboxHarness } = await setupTest({
      dataSkyId: 'my-mail-checkbox',
    });

    await checkboxHarness.check();
    await checkboxHarness.uncheck();
    await checkboxHarness.check();

    await expectAsync(
      checkboxHarness.hasCustomError('requiredFalse'),
    ).toBeResolvedTo(true);
  });

  it('should throw an error if no form error is found', async () => {
    const { checkboxHarness } = await setupTest({
      dataSkyId: 'my-email-checkbox',
    });

    await expectAsync(checkboxHarness.hasRequiredError()).toBeResolvedTo(false);
  });

  it('should throw an error if no help inline is found', async () => {
    const { checkboxHarness } = await setupTest({
      dataSkyId: 'my-mail-checkbox',
    });

    await expectAsync(checkboxHarness.clickHelpInline()).toBeRejectedWithError(
      'No help inline found.',
    );
  });

  it('should open help inline popover when clicked', async () => {
    const { checkboxHarness, fixture } = await setupTest({
      dataSkyId: 'my-phone-checkbox',
    });

    await checkboxHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(checkboxHarness.getHelpPopoverContent()).toBeResolved();
  });

  it('should open help widget when clicked', async () => {
    const { checkboxHarness, fixture } = await setupTest({
      dataSkyId: 'my-phone-checkbox',
    });
    const helpSvc = TestBed.inject(SkyHelpService);
    const helpSpy = spyOn(helpSvc, 'openHelp');
    fixture.componentInstance.helpKey = 'helpKey.html';
    fixture.componentInstance.helpPopoverContent = undefined;
    fixture.detectChanges();

    await checkboxHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(helpSpy).toHaveBeenCalledWith({ helpKey: 'helpKey.html' });
  });

  it('should get help popover content', async () => {
    const { checkboxHarness, fixture } = await setupTest({
      dataSkyId: 'my-phone-checkbox',
    });
    await checkboxHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(checkboxHarness.getHelpPopoverContent()).toBeResolvedTo(
      '(xxx)xxx-xxxx',
    );
  });

  it('should get help popover title', async () => {
    const { checkboxHarness, fixture } = await setupTest({
      dataSkyId: 'my-phone-checkbox',
    });
    await checkboxHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(checkboxHarness.getHelpPopoverTitle()).toBeResolvedTo(
      'Format',
    );
  });
});
