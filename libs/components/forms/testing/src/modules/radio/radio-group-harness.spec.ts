import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyHelpService } from '@skyux/core';
import { SkyHelpTestingModule } from '@skyux/core/testing';

import { RadioHarnessTestComponent } from './fixtures/radio-harness-test.component';
import { SkyRadioGroupHarness } from './radio-group-harness';

async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
  radioGroupHarness: SkyRadioGroupHarness;
  fixture: ComponentFixture<RadioHarnessTestComponent>;
}> {
  await TestBed.configureTestingModule({
    imports: [
      RadioHarnessTestComponent,
      SkyHelpTestingModule,
      NoopAnimationsModule,
    ],
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

    fixture.componentInstance.headingText = undefined;
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getHeadingText()).toBeResolvedTo('');
  });

  it('should get the heading text when heading text is hidden', async () => {
    const { radioGroupHarness, fixture } = await setupTest({
      dataSkyId: 'radio-group',
    });

    fixture.componentInstance.hideGroupHeading = true;
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

    fixture.componentInstance.hideGroupHeading = true;
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getHeadingHidden()).toBeResolvedTo(
      true,
    );

    fixture.componentInstance.headingText = undefined;
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getHeadingHidden()).toBeResolvedTo(
      true,
    );
  });

  it('should return the heading level', async () => {
    const { radioGroupHarness, fixture } = await setupTest();

    fixture.componentInstance.headingLevel = undefined;
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getHeadingLevel()).toBeResolvedTo(
      undefined,
    );

    fixture.componentInstance.headingLevel = 3;
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getHeadingLevel()).toBeResolvedTo(3);

    fixture.componentInstance.headingLevel = 4;
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getHeadingLevel()).toBeResolvedTo(4);

    fixture.componentInstance.headingLevel = 5;
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getHeadingLevel()).toBeResolvedTo(5);
  });

  it('should return the heading style', async () => {
    const { radioGroupHarness, fixture } = await setupTest();

    fixture.componentInstance.headingLevel = undefined;
    fixture.componentInstance.headingStyle = 3;
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getHeadingLevel()).toBeResolvedTo(
      undefined,
    );
    await expectAsync(radioGroupHarness.getHeadingStyle()).toBeResolvedTo(3);

    fixture.componentInstance.headingLevel = 3;
    fixture.componentInstance.headingStyle = 4;
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getHeadingLevel()).toBeResolvedTo(3);
    await expectAsync(radioGroupHarness.getHeadingStyle()).toBeResolvedTo(4);

    fixture.componentInstance.headingLevel = 4;
    fixture.componentInstance.headingStyle = 5;
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getHeadingLevel()).toBeResolvedTo(4);
    await expectAsync(radioGroupHarness.getHeadingStyle()).toBeResolvedTo(5);

    fixture.componentInstance.headingLevel = 5;
    fixture.componentInstance.headingStyle = 3;
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getHeadingLevel()).toBeResolvedTo(5);
    await expectAsync(radioGroupHarness.getHeadingStyle()).toBeResolvedTo(3);
  });

  it('should get the hint text', async () => {
    const { radioGroupHarness, fixture } = await setupTest();
    const hintText = 'Hint text for the section.';

    await expectAsync(radioGroupHarness.getHintText()).toBeResolvedTo('');

    fixture.componentInstance.hintText = hintText;
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getHintText()).toBeResolvedTo(hintText);
  });

  it('should indicate the component is stacked when margin is lg and headingLevel is not set', async () => {
    const { radioGroupHarness, fixture } = await setupTest();

    fixture.componentInstance.stacked = true;
    fixture.componentInstance.headingLevel = undefined;
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getStacked()).toBeResolvedTo(true);
  });

  it('should indicate the component is not stacked when margin is lg and headingLevel is set', async () => {
    const { radioGroupHarness, fixture } = await setupTest();

    fixture.componentInstance.class = 'sky-margin-stacked-lg';
    fixture.componentInstance.headingLevel = 4;
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getStacked()).toBeResolvedTo(false);
  });

  it('should indicate the component is stacked when margin is xl and headingLevel is set', async () => {
    const { radioGroupHarness, fixture } = await setupTest();

    fixture.componentInstance.stacked = true;
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getStacked()).toBeResolvedTo(true);
  });

  it('should indicate the component is not stacked when margin is xl and headingLevel is not set', async () => {
    const { radioGroupHarness, fixture } = await setupTest();

    fixture.componentInstance.class = 'sky-margin-stacked-xl';
    fixture.componentInstance.headingLevel = undefined;
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getStacked()).toBeResolvedTo(false);
  });

  it('should indicate the component is not stacked', async () => {
    const { radioGroupHarness } = await setupTest();

    await expectAsync(radioGroupHarness.getStacked()).toBeResolvedTo(false);
  });

  it('should indicate the component is required', async () => {
    const { radioGroupHarness, fixture } = await setupTest();

    fixture.componentInstance.required = true;
    fixture.detectChanges();

    await expectAsync(radioGroupHarness.getRequired()).toBeResolvedTo(true);
  });

  it('should indicate the component is not required', async () => {
    const { radioGroupHarness } = await setupTest();

    await expectAsync(radioGroupHarness.getRequired()).toBeResolvedTo(false);
  });

  it('should display an error message when there is a custom validation error', async () => {
    const { radioGroupHarness, fixture } = await setupTest();
    fixture.componentInstance.required = true;
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

  it('should throw an error when no radio buttons match filters', async () => {
    const { radioGroupHarness } = await setupTest();

    await expectAsync(
      radioGroupHarness.getRadioButtons({ dataSkyId: 'non-existent' }),
    ).toBeRejectedWithError(
      `Unable to find any radio buttons with filter(s): {"dataSkyId":"non-existent"}`,
    );
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

    fixture.componentInstance.helpPopoverContent = 'popover content';
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

    fixture.componentInstance.helpPopoverContent = undefined;
    fixture.componentInstance.helpKey = 'helpKey.html';
    fixture.detectChanges();

    await radioGroupHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(helpSpy).toHaveBeenCalledWith({ helpKey: 'helpKey.html' });
  });

  it('should get help popover content', async () => {
    const { radioGroupHarness, fixture } = await setupTest();
    fixture.componentInstance.helpPopoverContent = 'popover content';
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
    fixture.componentInstance.helpPopoverContent = 'popover content';
    fixture.componentInstance.helpPopoverTitle = 'popover title';
    fixture.detectChanges();

    await radioGroupHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(radioGroupHarness.getHelpPopoverTitle()).toBeResolvedTo(
      'popover title',
    );
  });
});
