import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyHelpService } from '@skyux/core';
import { SkyHelpTestingModule } from '@skyux/core/testing';

import { SkyCheckboxGroupHarness } from './checkbox-group-harness';
import { CheckboxHarnessTestComponent } from './fixtures/checkbox-harness-test.component';

async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
  checkboxGroupHarness: SkyCheckboxGroupHarness;
  fixture: ComponentFixture<CheckboxHarnessTestComponent>;
}> {
  await TestBed.configureTestingModule({
    imports: [CheckboxHarnessTestComponent, SkyHelpTestingModule],
  }).compileComponents();

  const fixture = TestBed.createComponent(CheckboxHarnessTestComponent);
  const loader = TestbedHarnessEnvironment.loader(fixture);

  const checkboxGroupHarness: SkyCheckboxGroupHarness = options.dataSkyId
    ? await loader.getHarness(
        SkyCheckboxGroupHarness.with({
          dataSkyId: options.dataSkyId,
        }),
      )
    : await loader.getHarness(SkyCheckboxGroupHarness);

  return { checkboxGroupHarness, fixture };
}

describe('Checkbox group harness', () => {
  it('should get the heading text', async () => {
    const { checkboxGroupHarness } = await setupTest();

    await expectAsync(checkboxGroupHarness.getHeadingText()).toBeResolvedTo(
      'Contact method',
    );
  });

  it('should get the heading text when heading text is hidden', async () => {
    const { checkboxGroupHarness, fixture } = await setupTest({
      dataSkyId: 'checkbox-group',
    });

    fixture.componentRef.setInput('hideGroupHeading', true);
    fixture.detectChanges();

    await expectAsync(checkboxGroupHarness.getHeadingText()).toBeResolvedTo(
      'Contact method',
    );
  });

  it('should indicate the heading is not hidden', async () => {
    const { checkboxGroupHarness } = await setupTest();

    await expectAsync(checkboxGroupHarness.getHeadingHidden()).toBeResolvedTo(
      false,
    );
  });

  it('should indicate the heading is hidden', async () => {
    const { checkboxGroupHarness, fixture } = await setupTest();

    fixture.componentRef.setInput('hideGroupHeading', true);
    fixture.detectChanges();

    await expectAsync(checkboxGroupHarness.getHeadingHidden()).toBeResolvedTo(
      true,
    );
  });

  it('should return the heading level', async () => {
    const { checkboxGroupHarness, fixture } = await setupTest();

    fixture.componentRef.setInput('headingLevel', undefined);
    fixture.detectChanges();

    await expectAsync(checkboxGroupHarness.getHeadingLevel()).toBeResolvedTo(
      undefined,
    );

    fixture.componentRef.setInput('headingLevel', 3);
    fixture.detectChanges();

    await expectAsync(checkboxGroupHarness.getHeadingLevel()).toBeResolvedTo(3);

    fixture.componentRef.setInput('headingLevel', 4);
    fixture.detectChanges();

    await expectAsync(checkboxGroupHarness.getHeadingLevel()).toBeResolvedTo(4);

    fixture.componentRef.setInput('headingLevel', 5);
    fixture.detectChanges();

    await expectAsync(checkboxGroupHarness.getHeadingLevel()).toBeResolvedTo(5);
  });

  it('should return the heading style', async () => {
    const { checkboxGroupHarness, fixture } = await setupTest();

    fixture.componentRef.setInput('headingLevel', undefined);
    fixture.componentRef.setInput('headingStyle', 3);
    fixture.detectChanges();

    await expectAsync(checkboxGroupHarness.getHeadingLevel()).toBeResolvedTo(
      undefined,
    );
    await expectAsync(checkboxGroupHarness.getHeadingStyle()).toBeResolvedTo(3);

    fixture.componentRef.setInput('headingLevel', 3);
    fixture.componentRef.setInput('headingStyle', 4);
    fixture.detectChanges();

    await expectAsync(checkboxGroupHarness.getHeadingLevel()).toBeResolvedTo(3);
    await expectAsync(checkboxGroupHarness.getHeadingStyle()).toBeResolvedTo(4);

    fixture.componentRef.setInput('headingLevel', 4);
    fixture.componentRef.setInput('headingStyle', 5);
    fixture.detectChanges();

    await expectAsync(checkboxGroupHarness.getHeadingLevel()).toBeResolvedTo(4);
    await expectAsync(checkboxGroupHarness.getHeadingStyle()).toBeResolvedTo(5);

    fixture.componentRef.setInput('headingLevel', 5);
    fixture.componentRef.setInput('headingStyle', 3);
    fixture.detectChanges();

    await expectAsync(checkboxGroupHarness.getHeadingLevel()).toBeResolvedTo(5);
    await expectAsync(checkboxGroupHarness.getHeadingStyle()).toBeResolvedTo(3);
  });

  it('should get the hint text', async () => {
    const { checkboxGroupHarness, fixture } = await setupTest();
    const hintText = 'Hint text for the section.';

    await expectAsync(checkboxGroupHarness.getHintText()).toBeResolvedTo('');

    fixture.componentRef.setInput('hintText', hintText);
    fixture.detectChanges();

    await expectAsync(checkboxGroupHarness.getHintText()).toBeResolvedTo(
      hintText,
    );
  });

  it('should indicate the component is stacked when margin is lg and headingLevel is not set', async () => {
    const { checkboxGroupHarness, fixture } = await setupTest();

    fixture.componentRef.setInput('stacked', true);
    fixture.componentRef.setInput('headingLevel', undefined);
    fixture.detectChanges();

    await expectAsync(checkboxGroupHarness.getStacked()).toBeResolvedTo(true);
  });

  it('should indicate the component is not stacked when margin is lg and headingLevel is set', async () => {
    const { checkboxGroupHarness, fixture } = await setupTest();

    fixture.componentRef.setInput('class', 'sky-margin-stacked-lg');
    fixture.componentRef.setInput('headingLevel', 4);
    fixture.detectChanges();

    await expectAsync(checkboxGroupHarness.getStacked()).toBeResolvedTo(false);
  });

  it('should indicate the component is stacked when margin is xl and headingLevel is set', async () => {
    const { checkboxGroupHarness, fixture } = await setupTest();

    fixture.componentRef.setInput('stacked', true);
    fixture.detectChanges();

    await expectAsync(checkboxGroupHarness.getStacked()).toBeResolvedTo(true);
  });

  it('should indicate the component is not stacked when margin is xl and headingLevel is not set', async () => {
    const { checkboxGroupHarness, fixture } = await setupTest();

    fixture.componentRef.setInput('class', 'sky-margin-stacked-xl');
    fixture.componentRef.setInput('headingLevel', undefined);
    fixture.detectChanges();

    await expectAsync(checkboxGroupHarness.getStacked()).toBeResolvedTo(false);
  });

  it('should indicate the component is not stacked', async () => {
    const { checkboxGroupHarness } = await setupTest();

    await expectAsync(checkboxGroupHarness.getStacked()).toBeResolvedTo(false);
  });

  it('should indicate the component is required', async () => {
    const { checkboxGroupHarness, fixture } = await setupTest();

    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    await expectAsync(checkboxGroupHarness.getRequired()).toBeResolvedTo(true);
  });

  it('should indicate the component is not required', async () => {
    const { checkboxGroupHarness } = await setupTest();

    await expectAsync(checkboxGroupHarness.getRequired()).toBeResolvedTo(false);
  });

  it('should display an error message when the checkbox group is required and no checkboxes are checked', async () => {
    const { checkboxGroupHarness, fixture } = await setupTest();
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    const checkboxHarness = (await checkboxGroupHarness.getCheckboxes())[0];

    await checkboxHarness.check();
    await checkboxHarness.uncheck();
    await checkboxHarness.blur();

    await expectAsync(checkboxGroupHarness.hasRequiredError()).toBeResolvedTo(
      true,
    );
  });

  it('should display an error message when there is a custom validation error', async () => {
    const { checkboxGroupHarness, fixture } = await setupTest();
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    const checkboxHarness = (await checkboxGroupHarness.getCheckboxes())[0];

    await checkboxHarness.check();

    await expectAsync(
      checkboxGroupHarness.hasError('emailOnly'),
    ).toBeResolvedTo(true);
  });

  it('should throw an error if no form error is found', async () => {
    const { checkboxGroupHarness } = await setupTest();
    const checkboxHarness = (await checkboxGroupHarness.getCheckboxes())[1];

    await checkboxHarness.check();

    await expectAsync(checkboxGroupHarness.hasError('test')).toBeResolvedTo(
      false,
    );
  });

  it('should get all checkboxes', async () => {
    const { checkboxGroupHarness } = await setupTest();
    const checkboxes = await checkboxGroupHarness.getCheckboxes();
    expect(checkboxes.length).toBe(3);
  });

  it('should get a checkbox with filters', async () => {
    const { checkboxGroupHarness } = await setupTest();

    const checkbox = await checkboxGroupHarness.getCheckbox({
      dataSkyId: 'my-phone-checkbox',
    });
    await expectAsync(checkbox.getLabelText()).toBeResolvedTo('Phone');
  });

  it('should get checkboxes with filters', async () => {
    const { checkboxGroupHarness } = await setupTest();

    const checkbox = await checkboxGroupHarness.getCheckboxes({
      dataSkyId: 'my-phone-checkbox',
    });
    await expectAsync(checkbox[0].getLabelText()).toBeResolvedTo('Phone');
  });

  it('should throw an error if no help inline is found', async () => {
    const { checkboxGroupHarness } = await setupTest();

    await expectAsync(
      checkboxGroupHarness.clickHelpInline(),
    ).toBeRejectedWithError('No help inline found.');
  });

  it('should open help inline popover when clicked', async () => {
    const { checkboxGroupHarness, fixture } = await setupTest();

    fixture.componentRef.setInput('helpPopoverContent', 'popover content');
    fixture.detectChanges();

    await checkboxGroupHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(
      checkboxGroupHarness.getHelpPopoverContent(),
    ).toBeResolved();
  });

  it('should open global help widget when clicked', async () => {
    const { checkboxGroupHarness, fixture } = await setupTest();
    const helpSvc = TestBed.inject(SkyHelpService);
    const helpSpy = spyOn(helpSvc, 'openHelp');

    fixture.componentRef.setInput('helpPopoverContent', undefined);
    fixture.componentRef.setInput('helpKey', 'helpKey.html');
    fixture.detectChanges();

    await checkboxGroupHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(helpSpy).toHaveBeenCalledWith({ helpKey: 'helpKey.html' });
  });

  it('should get help popover content', async () => {
    const { checkboxGroupHarness, fixture } = await setupTest();
    fixture.componentRef.setInput('helpPopoverContent', 'popover content');
    fixture.detectChanges();

    await checkboxGroupHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(
      checkboxGroupHarness.getHelpPopoverContent(),
    ).toBeResolvedTo('popover content');
  });

  it('should get help popover title', async () => {
    const { checkboxGroupHarness, fixture } = await setupTest();
    fixture.componentRef.setInput('helpPopoverContent', 'popover content');
    fixture.componentRef.setInput('helpPopoverTitle', 'popover title');
    fixture.detectChanges();

    await checkboxGroupHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(
      checkboxGroupHarness.getHelpPopoverTitle(),
    ).toBeResolvedTo('popover title');
  });
});
