import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyHelpService } from '@skyux/core';
import { SkyHelpTestingModule } from '@skyux/core/testing';

import { RadioHarnessTestComponent } from './fixtures/radio-harness-test.component';
import { SkyRadioGroupHarness } from './radio-group-harness';

async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
  radioGroupHarness: SkyRadioGroupHarness;
  fixture: ComponentFixture<RadioHarnessTestComponent>;
}> {
  await TestBed.configureTestingModule({
    imports: [RadioHarnessTestComponent, SkyHelpTestingModule],
  }).compileComponents();

  const fixture = TestBed.createComponent(RadioHarnessTestComponent);
  const loader = TestbedHarnessEnvironment.loader(fixture);

  const radioGroupHarness: SkyRadioGroupHarness = options.dataSkyId
    ? await loader.getHarness(
        SkyRadioGroupHarness.with({
          dataSkyId: options.dataSkyId,
        }),
      )
    : await loader.getHarness(SkyRadioGroupHarness);

  return { radioGroupHarness, fixture };
}

describe('Radio group harness', () => {
  it('should get the heading text when it is set', async () => {
    const { radioGroupHarness, fixture } = await setupTest();

    await expectAsync(radioGroupHarness.getHeadingText()).toBeResolvedTo(
      'Payment method',
    );

    fixture.componentRef.setInput('headingText', undefined);
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getHeadingText()).toBeResolvedTo('');
  });

  it('should get the heading text when heading text is hidden', async () => {
    const { radioGroupHarness, fixture } = await setupTest({
      dataSkyId: 'radio-group',
    });

    fixture.componentRef.setInput('hideGroupHeading', true);
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getHeadingText()).toBeResolvedTo(
      'Payment method',
    );
  });

  it('should indicate the heading is not hidden', async () => {
    const { radioGroupHarness } = await setupTest();

    await expectAsync(radioGroupHarness.getHeadingHidden()).toBeResolvedTo(
      false,
    );
  });

  it('should indicate the heading is hidden', async () => {
    const { radioGroupHarness, fixture } = await setupTest();

    fixture.componentRef.setInput('hideGroupHeading', true);
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getHeadingHidden()).toBeResolvedTo(
      true,
    );

    fixture.componentRef.setInput('headingText', undefined);
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getHeadingHidden()).toBeResolvedTo(
      true,
    );
  });

  it('should return the heading level', async () => {
    const { radioGroupHarness, fixture } = await setupTest();

    fixture.componentRef.setInput('headingLevel', undefined);
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getHeadingLevel()).toBeResolvedTo(
      undefined,
    );

    fixture.componentRef.setInput('headingLevel', 3);
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getHeadingLevel()).toBeResolvedTo(3);

    fixture.componentRef.setInput('headingLevel', 4);
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getHeadingLevel()).toBeResolvedTo(4);

    fixture.componentRef.setInput('headingLevel', 5);
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getHeadingLevel()).toBeResolvedTo(5);
  });

  it('should return the heading style', async () => {
    const { radioGroupHarness, fixture } = await setupTest();

    fixture.componentRef.setInput('headingLevel', undefined);
    fixture.componentRef.setInput('headingStyle', 3);
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getHeadingLevel()).toBeResolvedTo(
      undefined,
    );
    await expectAsync(radioGroupHarness.getHeadingStyle()).toBeResolvedTo(3);

    fixture.componentRef.setInput('headingLevel', 3);
    fixture.componentRef.setInput('headingStyle', 4);
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getHeadingLevel()).toBeResolvedTo(3);
    await expectAsync(radioGroupHarness.getHeadingStyle()).toBeResolvedTo(4);

    fixture.componentRef.setInput('headingLevel', 4);
    fixture.componentRef.setInput('headingStyle', 5);
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getHeadingLevel()).toBeResolvedTo(4);
    await expectAsync(radioGroupHarness.getHeadingStyle()).toBeResolvedTo(5);

    fixture.componentRef.setInput('headingLevel', 5);
    fixture.componentRef.setInput('headingStyle', 3);
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getHeadingLevel()).toBeResolvedTo(5);
    await expectAsync(radioGroupHarness.getHeadingStyle()).toBeResolvedTo(3);
  });

  it('should get the hint text', async () => {
    const { radioGroupHarness, fixture } = await setupTest();
    const hintText = 'Hint text for the section.';

    await expectAsync(radioGroupHarness.getHintText()).toBeResolvedTo('');

    fixture.componentRef.setInput('hintText', hintText);
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getHintText()).toBeResolvedTo(hintText);
  });

  it('should indicate the component is stacked when margin is lg and headingLevel is not set', async () => {
    const { radioGroupHarness, fixture } = await setupTest();

    fixture.componentRef.setInput('stacked', true);
    fixture.componentRef.setInput('headingLevel', undefined);
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getStacked()).toBeResolvedTo(true);
  });

  it('should indicate the component is not stacked when margin is lg and headingLevel is set', async () => {
    const { radioGroupHarness, fixture } = await setupTest();

    fixture.componentRef.setInput('class', 'sky-margin-stacked-lg');
    fixture.componentRef.setInput('headingLevel', 4);
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getStacked()).toBeResolvedTo(false);
  });

  it('should indicate the component is stacked when margin is xl and headingLevel is set', async () => {
    const { radioGroupHarness, fixture } = await setupTest();

    fixture.componentRef.setInput('stacked', true);
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getStacked()).toBeResolvedTo(true);
  });

  it('should indicate the component is not stacked when margin is xl and headingLevel is not set', async () => {
    const { radioGroupHarness, fixture } = await setupTest();

    fixture.componentRef.setInput('class', 'sky-margin-stacked-xl');
    fixture.componentRef.setInput('headingLevel', undefined);
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getStacked()).toBeResolvedTo(false);
  });

  it('should indicate the component is not stacked', async () => {
    const { radioGroupHarness } = await setupTest();

    await expectAsync(radioGroupHarness.getStacked()).toBeResolvedTo(false);
  });

  it('should indicate the component is required', async () => {
    const { radioGroupHarness, fixture } = await setupTest();

    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getRequired()).toBeResolvedTo(true);
  });

  it('should indicate the component is not required', async () => {
    const { radioGroupHarness } = await setupTest();

    await expectAsync(radioGroupHarness.getRequired()).toBeResolvedTo(false);
  });

  it('should display an error message when there is a custom validation error', async () => {
    const { radioGroupHarness, fixture } = await setupTest();
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    const radioHarness = (await radioGroupHarness.getRadioButtons())[1];

    await radioHarness.check();

    await expectAsync(
      radioGroupHarness.hasError('processingIssue'),
    ).toBeResolvedTo(true);
  });

  it('should throw an error if no form error is found', async () => {
    const { radioGroupHarness } = await setupTest();
    const radioHarness = (await radioGroupHarness.getRadioButtons())[2];

    await radioHarness.check();

    await expectAsync(radioGroupHarness.hasError('test')).toBeResolvedTo(false);
  });

  it('should get all radio buttons', async () => {
    const { radioGroupHarness } = await setupTest();
    const radioButtons = await radioGroupHarness.getRadioButtons();
    expect(radioButtons.length).toBe(3);
  });

  it('should get a radio button with filters', async () => {
    const { radioGroupHarness } = await setupTest();

    const radioButton = await radioGroupHarness.getRadioButton({
      dataSkyId: 'my-cash-radio',
    });
    await expectAsync(radioButton.getLabelText()).toBeResolvedTo('Cash');
  });

  it('should get radio buttons with filters', async () => {
    const { radioGroupHarness } = await setupTest();

    const radioButtons = await radioGroupHarness.getRadioButtons({
      dataSkyId: 'my-cash-radio',
    });
    await expectAsync(radioButtons[0].getLabelText()).toBeResolvedTo('Cash');
  });

  it('should throw an error if no help inline is found', async () => {
    const { radioGroupHarness } = await setupTest();

    await expectAsync(
      radioGroupHarness.clickHelpInline(),
    ).toBeRejectedWithError('No help inline found.');
  });

  it('should open help inline popover when clicked', async () => {
    const { radioGroupHarness, fixture } = await setupTest();

    fixture.componentRef.setInput('helpPopoverContent', 'popover content');
    fixture.detectChanges();

    await radioGroupHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(radioGroupHarness.getHelpPopoverContent()).toBeResolved();
  });

  it('should open global help widget when clicked', async () => {
    const { radioGroupHarness, fixture } = await setupTest();
    const helpSvc = TestBed.inject(SkyHelpService);
    const helpSpy = spyOn(helpSvc, 'openHelp');

    fixture.componentRef.setInput('helpPopoverContent', undefined);
    fixture.componentRef.setInput('helpKey', 'helpKey.html');
    fixture.detectChanges();

    await radioGroupHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(helpSpy).toHaveBeenCalledWith({ helpKey: 'helpKey.html' });
  });

  it('should get help popover content', async () => {
    const { radioGroupHarness, fixture } = await setupTest();
    fixture.componentRef.setInput('helpPopoverContent', 'popover content');
    fixture.detectChanges();

    await radioGroupHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(radioGroupHarness.getHelpPopoverContent()).toBeResolvedTo(
      'popover content',
    );
  });

  it('should get help popover title', async () => {
    const { radioGroupHarness, fixture } = await setupTest();
    fixture.componentRef.setInput('helpPopoverContent', 'popover content');
    fixture.componentRef.setInput('helpPopoverTitle', 'popover title');
    fixture.detectChanges();

    await radioGroupHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(radioGroupHarness.getHelpPopoverTitle()).toBeResolvedTo(
      'popover title',
    );
  });

  it('should get custom form error', async () => {
    const { radioGroupHarness, fixture } = await setupTest();

    // Set payment method to 'check' to trigger the custom validator error
    fixture.componentInstance.paymentMethod.setValue('check');
    fixture.componentInstance.paymentMethod.markAsTouched();
    fixture.detectChanges();

    const customFormError =
      await radioGroupHarness.getCustomError('processingIssue');

    await expectAsync(customFormError.getErrorText()).toBeResolvedTo(
      'An error occurred with this payment method. Please contact us to resolve.',
    );
  });
});
