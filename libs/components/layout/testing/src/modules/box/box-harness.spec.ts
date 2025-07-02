import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyHelpService } from '@skyux/core';
import { SkyHelpTestingModule } from '@skyux/core/testing';

import { SkyBoxHarness } from './box-harness';
import { BoxHarnessTestComponent } from './fixtures/box-harness-test.component';
import { BoxHarnessTestModule } from './fixtures/box-harness-test.module';

describe('Box test harness', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {},
  ): Promise<{
    boxHarness: SkyBoxHarness;
    fixture: ComponentFixture<BoxHarnessTestComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      imports: [BoxHarnessTestModule, SkyHelpTestingModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(BoxHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const boxHarness: SkyBoxHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyBoxHarness.with({
            dataSkyId: options.dataSkyId,
          }),
        )
      : await loader.getHarness(SkyBoxHarness);

    return { boxHarness, fixture, loader };
  }

  it('should get the box from its data-sky-id', async () => {
    const { boxHarness, fixture } = await setupTest({ dataSkyId: 'other-box' });

    fixture.detectChanges();

    await expectAsync(boxHarness.getAriaLabel()).toBeResolvedTo('otherBox');
  });

  it('should get the heading text', async () => {
    const { boxHarness, fixture } = await setupTest();

    fixture.componentInstance.headingText = 'Box header';
    fixture.detectChanges();

    await expectAsync(boxHarness.getHeadingText()).toBeResolvedTo('Box header');
  });

  it('should get the heading text and exclude the text content of controls', async () => {
    const { boxHarness, fixture } = await setupTest();

    fixture.componentInstance.headingText = 'Box header';
    fixture.componentRef.setInput('showControls', true);
    fixture.detectChanges();

    await expectAsync(boxHarness.getHeadingText()).toBeResolvedTo('Box header');
  });

  it('should get the heading text when heading text is hidden', async () => {
    const { boxHarness, fixture } = await setupTest();

    fixture.componentInstance.headingText = 'Box header';
    fixture.componentInstance.headingHidden = true;
    fixture.detectChanges();

    await expectAsync(boxHarness.getHeadingText()).toBeResolvedTo('Box header');
  });

  it('should indicate the heading is not hidden', async () => {
    const { boxHarness } = await setupTest();

    await expectAsync(boxHarness.getHeadingHidden()).toBeResolvedTo(false);
  });

  it('should indicate the heading is hidden', async () => {
    const { boxHarness, fixture } = await setupTest();

    fixture.componentInstance.headingText = 'Box header';
    fixture.componentInstance.headingHidden = true;
    fixture.detectChanges();

    await expectAsync(boxHarness.getHeadingHidden()).toBeResolvedTo(true);
  });

  it('should return the heading level and heading style', async () => {
    const { boxHarness, fixture } = await setupTest();

    fixture.componentInstance.headingText = 'Box header';
    fixture.componentInstance.headingLevel = undefined;
    fixture.componentInstance.headingStyle = 2;
    fixture.detectChanges();

    await expectAsync(boxHarness.getHeadingLevel()).toBeResolvedTo(2);
    await expectAsync(boxHarness.getHeadingStyle()).toBeResolvedTo(2);

    fixture.componentInstance.headingLevel = 2;
    fixture.componentInstance.headingStyle = 3;
    fixture.detectChanges();

    await expectAsync(boxHarness.getHeadingLevel()).toBeResolvedTo(2);
    await expectAsync(boxHarness.getHeadingStyle()).toBeResolvedTo(3);

    fixture.componentInstance.headingLevel = 3;
    fixture.componentInstance.headingStyle = 4;
    fixture.detectChanges();

    await expectAsync(boxHarness.getHeadingLevel()).toBeResolvedTo(3);
    await expectAsync(boxHarness.getHeadingStyle()).toBeResolvedTo(4);

    fixture.componentInstance.headingLevel = 4;
    fixture.componentInstance.headingStyle = 5;
    fixture.detectChanges();

    await expectAsync(boxHarness.getHeadingLevel()).toBeResolvedTo(4);
    await expectAsync(boxHarness.getHeadingStyle()).toBeResolvedTo(5);

    fixture.componentInstance.headingLevel = 5;
    fixture.componentInstance.headingStyle = undefined;
    fixture.detectChanges();

    await expectAsync(boxHarness.getHeadingLevel()).toBeResolvedTo(5);
    await expectAsync(boxHarness.getHeadingStyle()).toBeResolvedTo(2);
  });

  it('should throw an error if no help inline is found', async () => {
    const { boxHarness, fixture } = await setupTest();

    fixture.componentInstance.headingText = 'heading';
    fixture.detectChanges();

    await expectAsync(boxHarness.clickHelpInline()).toBeRejectedWithError(
      'No help inline found.',
    );
  });

  it('should open help inline popover when clicked', async () => {
    const { boxHarness, fixture } = await setupTest();

    fixture.componentInstance.headingText = 'heading';
    fixture.componentInstance.helpPopoverContent = 'popover content';
    fixture.detectChanges();

    await boxHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(boxHarness.getHelpPopoverContent()).toBeResolved();
  });

  it('should open global help widget when clicked', async () => {
    const { boxHarness, fixture } = await setupTest();
    const helpSvc = TestBed.inject(SkyHelpService);
    const helpSpy = spyOn(helpSvc, 'openHelp');

    fixture.componentInstance.headingText = 'heading';
    fixture.componentInstance.helpPopoverContent = undefined;
    fixture.componentInstance.helpKey = 'helpKey.html';
    fixture.detectChanges();

    await boxHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(helpSpy).toHaveBeenCalledWith({ helpKey: 'helpKey.html' });
  });

  it('should get the aria-label', async () => {
    const { boxHarness, fixture } = await setupTest();

    fixture.componentInstance.ariaLabel = 'aria-label';
    fixture.detectChanges();

    await expectAsync(boxHarness.getAriaLabel()).toBeResolvedTo('aria-label');
  });

  it('should get the aria-labelledby', async () => {
    const { boxHarness, fixture } = await setupTest();

    fixture.componentInstance.ariaLabelledBy = 'aria-labelledby';
    fixture.detectChanges();

    await expectAsync(boxHarness.getAriaLabelledby()).toBeResolvedTo(
      'aria-labelledby',
    );
  });

  it('should get the aria-role', async () => {
    const { boxHarness, fixture } = await setupTest();

    fixture.componentInstance.ariaRole = 'aria-role';
    fixture.detectChanges();

    await expectAsync(boxHarness.getAriaRole()).toBeResolvedTo('aria-role');
  });

  it('should get default values', async () => {
    const { boxHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(boxHarness.getAriaLabelledby()).toBeResolvedTo(null);
    await expectAsync(boxHarness.getAriaRole()).toBeResolvedTo(null);
    await expectAsync(boxHarness.getAriaLabel()).toBeResolvedTo(null);
  });
});
