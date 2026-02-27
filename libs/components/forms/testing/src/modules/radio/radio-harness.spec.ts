import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyHelpService } from '@skyux/core';
import { SkyHelpTestingModule } from '@skyux/core/testing';

import { RadioHarnessTestComponent } from './fixtures/radio-harness-test.component';
import { SkyRadioHarness } from './radio-harness';

async function setupTest(
  options: { dataSkyId?: string; hideCheckLabel?: boolean } = {},
): Promise<{
  radioHarness: SkyRadioHarness;
  fixture: ComponentFixture<RadioHarnessTestComponent>;
  loader: HarnessLoader;
}> {
  await TestBed.configureTestingModule({
    imports: [
      RadioHarnessTestComponent,
      SkyHelpTestingModule],
  }).compileComponents();

  const fixture = TestBed.createComponent(RadioHarnessTestComponent);
  if (options.hideCheckLabel) {
    fixture.componentInstance.hideCheckLabel = true;
    fixture.detectChanges();
  }
  const loader = TestbedHarnessEnvironment.loader(fixture);

  const radioHarness: SkyRadioHarness = options.dataSkyId
    ? await loader.getHarness(
        SkyRadioHarness.with({
          dataSkyId: options.dataSkyId,
        }),
      )
    : await loader.getHarness(SkyRadioHarness);

  return { radioHarness, fixture, loader };
}

describe('Radio harness', () => {
  it('should check if radio is disabled', async () => {
    const { radioHarness, fixture } = await setupTest({
      dataSkyId: 'my-check-radio',
    });

    await expectAsync(radioHarness.isDisabled()).toBeResolvedTo(false);

    fixture.componentInstance.disableForm();
    await expectAsync(radioHarness.isDisabled()).toBeResolvedTo(true);
  });

  it('should focus the radio', async () => {
    const { radioHarness } = await setupTest({
      dataSkyId: 'my-check-radio',
    });

    await expectAsync(radioHarness.isFocused()).toBeResolvedTo(false);

    await radioHarness.focus();
    await expectAsync(radioHarness.isFocused()).toBeResolvedTo(true);

    await radioHarness.blur();
    await expectAsync(radioHarness.isFocused()).toBeResolvedTo(false);
  });

  it('should get ARIA attributes', async () => {
    const { radioHarness, fixture } = await setupTest({
      dataSkyId: 'my-check-radio',
    });

    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(radioHarness.getAriaLabel()).toBeResolvedTo(
      'Pay by check',
    );
    await expectAsync(radioHarness.getAriaLabelledby()).toBeResolvedTo(
      'foo-check-id',
    );
    await expectAsync(radioHarness.getLabelText()).toBeResolvedTo('Check');
  });

  it('should handle a missing label when getting the label text', async () => {
    const { radioHarness } = await setupTest({
      dataSkyId: 'my-check-radio',
      hideCheckLabel: true,
    });
    await expectAsync(radioHarness.getLabelText()).toBeResolvedTo(undefined);
  });

  it('should get the label text when specified via `labelText` input', async () => {
    const { radioHarness } = await setupTest({
      dataSkyId: 'my-cash-radio',
    });

    await expectAsync(radioHarness.getLabelText()).toBeResolvedTo('Cash');
  });

  it('should get the label text when specified via `labelText` input and label is hidden', async () => {
    const { radioHarness, fixture } = await setupTest({
      dataSkyId: 'my-cash-radio',
    });

    fixture.componentInstance.hideCashLabel = true;
    fixture.detectChanges();

    await expectAsync(radioHarness.getLabelText()).toBeResolvedTo('Cash');
  });

  it('should indicate the label is not hidden when the label is specified via `labelText`', async () => {
    const { radioHarness } = await setupTest({
      dataSkyId: 'my-cash-radio',
    });

    await expectAsync(radioHarness.getLabelHidden()).toBeResolvedTo(false);
  });

  it('should indicate the label is hidden when the label is specified via `labelText`', async () => {
    const { radioHarness, fixture } = await setupTest({
      dataSkyId: 'my-cash-radio',
    });

    fixture.componentInstance.hideCashLabel = true;
    fixture.detectChanges();

    await expectAsync(radioHarness.getLabelHidden()).toBeResolvedTo(true);
  });

  it('should throw an error when getting `labelHidden` for a radio using `sky-radio-label`', async () => {
    const { radioHarness } = await setupTest({
      dataSkyId: 'my-check-radio',
    });

    await expectAsync(radioHarness.getLabelHidden()).toBeRejectedWithError(
      '`labelHidden` is only supported when setting the radio label via the `labelText` input.',
    );
  });

  it('should get the hint text', async () => {
    const { radioHarness, fixture } = await setupTest({
      dataSkyId: 'my-cash-radio',
    });
    const hintText = 'Hint text for the radio.';

    await expectAsync(radioHarness.getHintText()).toBeResolvedTo('');

    fixture.componentInstance.cashHintText = hintText;
    fixture.detectChanges();

    await expectAsync(radioHarness.getHintText()).toBeResolvedTo(hintText);
  });

  it('should get the radio name', async () => {
    const { radioHarness } = await setupTest({
      dataSkyId: 'my-check-radio',
    });

    await expectAsync(radioHarness.getName()).toBeResolvedTo(
      jasmine.stringMatching(/sky-radio-group-[0-9]+/),
    );
  });

  it('should throw error if toggling a disabled radio', async () => {
    const { radioHarness, fixture } = await setupTest({
      dataSkyId: 'my-check-radio',
    });

    fixture.componentInstance.disableForm();

    await expectAsync(radioHarness.isChecked()).toBeResolvedTo(false);

    await expectAsync(radioHarness.check()).toBeRejectedWithError(
      'Could not check the radio button because it is disabled.',
    );
  });

  it('should throw an error if no help inline is found', async () => {
    const { radioHarness } = await setupTest({
      dataSkyId: 'my-credit-radio',
    });

    await expectAsync(radioHarness.clickHelpInline()).toBeRejectedWithError(
      'No help inline found.',
    );
  });

  it('should open help inline popover when clicked', async () => {
    const { radioHarness, fixture } = await setupTest({
      dataSkyId: 'my-cash-radio',
    });

    await radioHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(radioHarness.getHelpPopoverContent()).toBeResolved();
  });

  it('should open help widget when clicked', async () => {
    const { radioHarness, fixture } = await setupTest({
      dataSkyId: 'my-cash-radio',
    });
    const helpSvc = TestBed.inject(SkyHelpService);
    const helpSpy = spyOn(helpSvc, 'openHelp');
    fixture.componentInstance.helpKey = 'helpKey.html';
    fixture.componentInstance.helpPopoverContent = undefined;
    fixture.detectChanges();

    await radioHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(helpSpy).toHaveBeenCalledWith({ helpKey: 'helpKey.html' });
  });

  it('should get help popover content', async () => {
    const { radioHarness, fixture } = await setupTest({
      dataSkyId: 'my-cash-radio',
    });
    await radioHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(radioHarness.getHelpPopoverContent()).toBeResolvedTo(
      '(xxx)xxx-xxxx',
    );
  });

  it('should get help popover title', async () => {
    const { radioHarness, fixture } = await setupTest({
      dataSkyId: 'my-cash-radio',
    });
    await radioHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(radioHarness.getHelpPopoverTitle()).toBeResolvedTo(
      'Format',
    );
  });
});
