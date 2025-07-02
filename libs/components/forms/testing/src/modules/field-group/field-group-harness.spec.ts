import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyHelpService } from '@skyux/core';
import { SkyHelpTestingModule } from '@skyux/core/testing';

import { SkyFieldGroupHarness } from './field-group-harness';
import { FieldGroupComponent } from './fixtures/field-group.component.fixture';

async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
  fieldGroupHarness: SkyFieldGroupHarness;
  fixture: ComponentFixture<FieldGroupComponent>;
}> {
  await TestBed.configureTestingModule({
    imports: [FieldGroupComponent, NoopAnimationsModule, SkyHelpTestingModule],
  }).compileComponents();

  const fixture = TestBed.createComponent(FieldGroupComponent);
  const loader = TestbedHarnessEnvironment.loader(fixture);

  const fieldGroupHarness: SkyFieldGroupHarness = options.dataSkyId
    ? await loader.getHarness(
        SkyFieldGroupHarness.with({
          dataSkyId: options.dataSkyId,
        }),
      )
    : await loader.getHarness(SkyFieldGroupHarness);

  return { fieldGroupHarness, fixture };
}

describe('Field group harness', () => {
  it('should get the heading text', async () => {
    const { fieldGroupHarness } = await setupTest();

    await expectAsync(fieldGroupHarness.getHeadingText()).toBeResolvedTo(
      'Heading text',
    );
  });

  it('should get the heading text when heading text is hidden', async () => {
    const { fieldGroupHarness, fixture } = await setupTest({
      dataSkyId: 'field-group',
    });

    fixture.componentInstance.headingHidden = true;
    fixture.detectChanges();

    await expectAsync(fieldGroupHarness.getHeadingText()).toBeResolvedTo(
      'Heading text',
    );
  });

  it('should indicate the heading is not hidden', async () => {
    const { fieldGroupHarness } = await setupTest();

    await expectAsync(fieldGroupHarness.getHeadingHidden()).toBeResolvedTo(
      false,
    );
  });

  it('should indicate the heading is hidden', async () => {
    const { fieldGroupHarness, fixture } = await setupTest();

    fixture.componentInstance.headingHidden = true;
    fixture.detectChanges();

    await expectAsync(fieldGroupHarness.getHeadingHidden()).toBeResolvedTo(
      true,
    );
  });

  it('should get the hint text', async () => {
    const { fieldGroupHarness, fixture } = await setupTest();
    const hintText = 'Hint text for the section.';

    await expectAsync(fieldGroupHarness.getHintText()).toBeResolvedTo('');

    fixture.componentInstance.hintText = hintText;
    fixture.detectChanges();

    await expectAsync(fieldGroupHarness.getHintText()).toBeResolvedTo(hintText);
  });

  it('should indicate the component is stacked', async () => {
    const { fieldGroupHarness, fixture } = await setupTest();

    fixture.componentInstance.stacked = true;
    fixture.detectChanges();

    await expectAsync(fieldGroupHarness.getStacked()).toBeResolvedTo(true);
  });
  it('should indicate the component is not stacked', async () => {
    const { fieldGroupHarness } = await setupTest();

    await expectAsync(fieldGroupHarness.getStacked()).toBeResolvedTo(false);
  });

  it('should return the heading level', async () => {
    const { fieldGroupHarness, fixture } = await setupTest();

    fixture.componentInstance.headingLevel = 3;
    fixture.detectChanges();

    await expectAsync(fieldGroupHarness.getHeadingLevel()).toBeResolvedTo(3);

    fixture.componentInstance.headingLevel = 4;
    fixture.detectChanges();

    await expectAsync(fieldGroupHarness.getHeadingLevel()).toBeResolvedTo(4);
  });

  it('should return the heading style', async () => {
    const { fieldGroupHarness, fixture } = await setupTest();

    fixture.componentInstance.headingLevel = 3;
    fixture.componentInstance.headingStyle = 4;
    fixture.detectChanges();

    await expectAsync(fieldGroupHarness.getHeadingLevel()).toBeResolvedTo(3);
    await expectAsync(fieldGroupHarness.getHeadingStyle()).toBeResolvedTo(4);

    fixture.componentInstance.headingLevel = 4;
    fixture.componentInstance.headingStyle = 3;
    fixture.detectChanges();

    await expectAsync(fieldGroupHarness.getHeadingLevel()).toBeResolvedTo(4);
    await expectAsync(fieldGroupHarness.getHeadingStyle()).toBeResolvedTo(3);
  });

  it('should throw an error if no help inline is found', async () => {
    const { fieldGroupHarness, fixture } = await setupTest();

    fixture.componentInstance.helpPopoverContent = undefined;
    fixture.componentInstance.helpKey = undefined;
    fixture.detectChanges();

    await expectAsync(
      fieldGroupHarness.clickHelpInline(),
    ).toBeRejectedWithError('No help inline found.');
  });

  it('should open help inline popover when clicked', async () => {
    const { fieldGroupHarness, fixture } = await setupTest();

    await fieldGroupHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(fieldGroupHarness.getHelpPopoverContent()).toBeResolved();
  });

  it('should open global help widget when clicked', async () => {
    const { fieldGroupHarness, fixture } = await setupTest();
    const helpSvc = TestBed.inject(SkyHelpService);
    const helpSpy = spyOn(helpSvc, 'openHelp');

    fixture.componentInstance.helpKey = 'helpKey.html';

    await fieldGroupHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(helpSpy).toHaveBeenCalledWith({ helpKey: 'helpKey.html' });
  });
});
