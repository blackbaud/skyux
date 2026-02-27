import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { SkyHelpService } from '@skyux/core';
import { SkyHelpTestingModule } from '@skyux/core/testing';
import { SkyValidators } from '@skyux/validation';

import { InputBoxHarnessTestComponent } from './fixtures/input-box-harness-test.component';
import { InputBoxHarnessTestModule } from './fixtures/input-box-harness-test.module';
import { LastNameHarness } from './fixtures/last-name-harness';
import { NonexistentHarness } from './fixtures/nonexistent-harness';
import { SkyInputBoxHarness } from './input-box-harness';

const DATA_SKY_ID_EASY_MODE = 'my-input-box-last-name-easy-mode';

describe('Input box harness', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    component: InputBoxHarnessTestComponent;
    fixture: ComponentFixture<InputBoxHarnessTestComponent>;
    inputBoxHarness: SkyInputBoxHarness;
  }> {
    await TestBed.configureTestingModule({
      imports: [
        InputBoxHarnessTestModule,
        SkyHelpTestingModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(InputBoxHarnessTestComponent);
    const component = fixture.componentInstance;
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const inputBoxHarness = await loader.getHarness(
      SkyInputBoxHarness.with({
        dataSkyId: options.dataSkyId,
      }),
    );

    return { component, fixture, inputBoxHarness };
  }

  it('should query child harnesses', async () => {
    const { inputBoxHarness } = await setupTest({
      dataSkyId: 'my-input-box-last-name',
    });

    const harness = await inputBoxHarness.queryHarness(LastNameHarness);

    await expectAsync(harness.value()).toBeResolvedTo('Doe');
  });

  it('should throw error for query if child harness is not found', async () => {
    const { inputBoxHarness } = await setupTest({
      dataSkyId: 'my-input-box-last-name',
    });

    await expectAsync(
      inputBoxHarness.queryHarness(NonexistentHarness),
    ).toBeRejectedWithError();
  });

  it('should return null for query if child harness is not found', async () => {
    const { inputBoxHarness } = await setupTest({
      dataSkyId: 'my-input-box-last-name',
    });

    await expectAsync(
      inputBoxHarness.queryHarnessOrNull(NonexistentHarness),
    ).toBeResolvedTo(null);
  });

  it('should return disabled', async () => {
    const { fixture, inputBoxHarness } = await setupTest({
      dataSkyId: DATA_SKY_ID_EASY_MODE,
    });

    await expectAsync(inputBoxHarness.getDisabled()).toBeResolvedTo(false);

    fixture.componentInstance.easyModeDisabled = true;
    fixture.detectChanges();

    await expectAsync(inputBoxHarness.getDisabled()).toBeResolvedTo(true);
  });

  it('should return label text', async () => {
    const { fixture, inputBoxHarness } = await setupTest({
      dataSkyId: DATA_SKY_ID_EASY_MODE,
    });

    await expectAsync(inputBoxHarness.getLabelText()).toBeResolvedTo(
      'Last name (easy mode)',
    );

    fixture.componentInstance.easyModeLabel = undefined;
    fixture.detectChanges();

    await expectAsync(inputBoxHarness.getLabelText()).toBeResolvedTo('');
  });

  it('should return help popover harness', async () => {
    const { component, fixture, inputBoxHarness } = await setupTest({
      dataSkyId: DATA_SKY_ID_EASY_MODE,
    });

    // String content
    const helpPopover = await inputBoxHarness.getHelpPopover();
    await helpPopover.clickPopoverButton();

    const helpContent = await helpPopover.getPopoverContent();

    await expectAsync(helpContent.getBodyText()).toBeResolvedTo('Help content');
    await expectAsync(helpContent.getTitleText()).toBeResolvedTo('Help title');

    // Template content
    component.easyModeHelpContent = component.helpContentTemplate;
    fixture.detectChanges();

    await expectAsync(helpContent.getBodyText()).toBeResolvedTo(
      'Help content from template',
    );

    // No content
    component.easyModeHelpContent = undefined;
    component.easyModeHelpKey = undefined;
    fixture.detectChanges();

    await expectAsync(inputBoxHarness.getHelpPopover()).toBeRejectedWithError(
      'The input box does not have a help popover configured.',
    );
  });

  it('should throw an error if no help inline is found', async () => {
    const { fixture, inputBoxHarness } = await setupTest({
      dataSkyId: DATA_SKY_ID_EASY_MODE,
    });

    fixture.componentInstance.easyModeHelpContent = undefined;
    fixture.componentInstance.easyModeHelpKey = undefined;
    fixture.detectChanges();

    await expectAsync(inputBoxHarness.clickHelpInline()).toBeRejectedWithError(
      'No help inline found.',
    );
  });

  it('should open widget when clicked', async () => {
    const { fixture, inputBoxHarness } = await setupTest({
      dataSkyId: DATA_SKY_ID_EASY_MODE,
    });

    fixture.componentInstance.easyModeHelpKey = 'helpKey.html';

    const helpSvc = TestBed.inject(SkyHelpService);
    const helpSpy = spyOn(helpSvc, 'openHelp');

    await inputBoxHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(helpSpy).toHaveBeenCalledWith({ helpKey: 'helpKey.html' });
  });

  it('should get help popover content', async () => {
    const { fixture, inputBoxHarness } = await setupTest({
      dataSkyId: DATA_SKY_ID_EASY_MODE,
    });

    await inputBoxHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(inputBoxHarness.getHelpPopoverContent()).toBeResolvedTo(
      'Help content',
    );
  });

  it('should get help popover title', async () => {
    const { fixture, inputBoxHarness } = await setupTest({
      dataSkyId: DATA_SKY_ID_EASY_MODE,
    });

    await inputBoxHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(inputBoxHarness.getHelpPopoverTitle()).toBeResolvedTo(
      'Help title',
    );
  });

  it('should return stacked', async () => {
    const { fixture, inputBoxHarness } = await setupTest({
      dataSkyId: DATA_SKY_ID_EASY_MODE,
    });

    await expectAsync(inputBoxHarness.getStacked()).toBeResolvedTo(false);

    fixture.componentInstance.easyModeStacked = true;
    fixture.detectChanges();

    await expectAsync(inputBoxHarness.getStacked()).toBeResolvedTo(true);
  });

  it('should return custom status indicator errors', async () => {
    const { component, fixture, inputBoxHarness } = await setupTest({
      dataSkyId: DATA_SKY_ID_EASY_MODE,
    });

    const control = component.myForm.controls['lastName'];

    control.addValidators(Validators.required);
    control.setValue('');
    control.markAsDirty();

    fixture.detectChanges();

    const customErrors = await inputBoxHarness.getCustomErrors();

    expect(customErrors.length).toBe(1);

    const customError = customErrors[0];

    await expectAsync(customError.getDescriptionType()).toBeResolvedTo('error');
    await expectAsync(customError.getIndicatorType()).toBeResolvedTo('danger');
    await expectAsync(customError.getText()).toBeResolvedTo('Test error');
  });

  it('should return custom form error', async () => {
    const { inputBoxHarness } = await setupTest({
      dataSkyId: 'custom-error-easy-mode',
    });

    const customFormError = await inputBoxHarness.getCustomFormError('custom');

    await expectAsync(customFormError.getErrorText()).toBeResolvedTo(
      'This is a customer error',
    );
  });

  it('should return whether custom form error has fired', async () => {
    const { inputBoxHarness } = await setupTest({
      dataSkyId: 'custom-error-easy-mode',
    });

    await expectAsync(
      inputBoxHarness.hasCustomFormError('custom'),
    ).toBeResolvedTo(true);
  });

  it('should return whether required error has fired', async () => {
    const { component, fixture, inputBoxHarness } = await setupTest({
      dataSkyId: 'my-input-box-last-name-easy-mode',
    });

    const control = component.myForm.controls['lastName'];
    control.addValidators(Validators.required);
    control.setValue('');
    control.markAsTouched();

    fixture.detectChanges();

    await expectAsync(inputBoxHarness.hasRequiredError()).toBeResolvedTo(true);
  });

  it('should return whether minimum length error has fired', async () => {
    const { component, fixture, inputBoxHarness } = await setupTest({
      dataSkyId: 'my-input-box-last-name-easy-mode',
    });

    const control = component.myForm.controls['lastName'];
    control.addValidators(Validators.minLength(2));
    control.setValue('a');
    control.markAsTouched();

    fixture.detectChanges();

    await expectAsync(inputBoxHarness.hasMinLengthError()).toBeResolvedTo(true);
  });

  it('should return whether maximum length error has fired', async () => {
    const { component, fixture, inputBoxHarness } = await setupTest({
      dataSkyId: 'my-input-box-last-name-easy-mode',
    });

    const control = component.myForm.controls['lastName'];
    control.addValidators(Validators.maxLength(1));
    control.setValue('abc');
    control.markAsDirty();

    fixture.detectChanges();

    await expectAsync(inputBoxHarness.hasMaxLengthError()).toBeResolvedTo(true);
  });

  it('should return whether email validator error has fired', async () => {
    const { component, fixture, inputBoxHarness } = await setupTest({
      dataSkyId: 'my-input-box-last-name-easy-mode',
    });

    const control = component.myForm.controls['lastName'];
    control.addValidators(SkyValidators.email);
    control.setValue('abc');
    control.markAsTouched();

    fixture.detectChanges();

    await expectAsync(inputBoxHarness.hasEmailError()).toBeResolvedTo(true);
  });

  it('should return whether url validator error has fired', async () => {
    const { component, fixture, inputBoxHarness } = await setupTest({
      dataSkyId: 'my-input-box-last-name-easy-mode',
    });

    const control = component.myForm.controls['lastName'];
    control.addValidators(SkyValidators.url);
    control.setValue('abc');
    control.markAsTouched();

    fixture.detectChanges();

    await expectAsync(inputBoxHarness.hasUrlError()).toBeResolvedTo(true);
  });

  it('should return whether invalid date error has fired', async () => {
    const { fixture, inputBoxHarness } = await setupTest({
      dataSkyId: 'datepicker-easy-mode',
    });

    fixture.detectChanges();

    await expectAsync(inputBoxHarness.hasInvalidDateError()).toBeResolvedTo(
      true,
    );
  });

  it('should return whether max date error has fired', async () => {
    const { component, fixture, inputBoxHarness } = await setupTest({
      dataSkyId: 'datepicker-easy-mode',
    });

    const control = component.directiveErrorForm.controls['easyModeDatepicker'];
    control.setValue('01/01/2990');
    control.markAsTouched();

    fixture.detectChanges();

    await expectAsync(inputBoxHarness.hasMaxDateError()).toBeResolvedTo(true);
  });

  it('should return whether min date error has fired', async () => {
    const { component, fixture, inputBoxHarness } = await setupTest({
      dataSkyId: 'datepicker-easy-mode',
    });

    const control = component.directiveErrorForm.controls['easyModeDatepicker'];
    control.setValue('01/01/1990');
    control.markAsTouched();

    fixture.detectChanges();

    await expectAsync(inputBoxHarness.hasMinDateError()).toBeResolvedTo(true);
  });

  it('should return whether time picker validator error has fired', async () => {
    const { component, fixture, inputBoxHarness } = await setupTest({
      dataSkyId: 'timepicker-easy-mode',
    });

    const control = component.directiveErrorForm.controls['easyModeTimepicker'];
    control.markAsTouched();
    fixture.detectChanges();

    await expectAsync(inputBoxHarness.hasTimeError()).toBeResolvedTo(true);
  });

  it('should return whether phone field validator error has fired', async () => {
    const { component, fixture, inputBoxHarness } = await setupTest({
      dataSkyId: 'phone-field-easy-mode',
    });

    const control = component.directiveErrorForm.controls['easyModePhoneField'];
    control.markAsTouched();
    fixture.detectChanges();

    await expectAsync(inputBoxHarness.hasPhoneFieldError()).toBeResolvedTo(
      true,
    );
  });

  it('should return character counter indicator', async () => {
    const { component, fixture, inputBoxHarness } = await setupTest({
      dataSkyId: DATA_SKY_ID_EASY_MODE,
    });

    await expectAsync(
      inputBoxHarness.getCharacterCounter(),
    ).toBeRejectedWithError(
      'The input box does not have a character limit specified.',
    );

    component.easyModeCharacterLimit = 50;
    fixture.detectChanges();

    const characterCounter = await inputBoxHarness.getCharacterCounter();

    await expectAsync(characterCounter.getCharacterCountLimit()).toBeResolvedTo(
      50,
    );
  });

  it('should return hint text', async () => {
    const { component, fixture, inputBoxHarness } = await setupTest({
      dataSkyId: DATA_SKY_ID_EASY_MODE,
    });

    await expectAsync(inputBoxHarness.getHintText()).toBeResolvedTo('');

    component.easyModeHintText = 'Test hint text';
    fixture.detectChanges();

    await expectAsync(inputBoxHarness.getHintText()).toBeResolvedTo(
      'Test hint text',
    );
  });
});
