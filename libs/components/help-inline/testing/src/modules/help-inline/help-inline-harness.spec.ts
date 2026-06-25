import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyHelpInlineModule } from '@skyux/help-inline';

import { SkyHelpInlineHarness } from './help-inline-harness';

//#region Test component
@Component({
  selector: 'sky-help-inline-test',
  template: `
    <sky-help-inline
      [ariaControls]="ariaControls"
      [ariaExpanded]="ariaExpanded"
      [ariaLabel]="ariaLabel"
      [helpKey]="helpKey"
      [labelText]="labelText"
      [popoverContent]="popoverContent"
      [popoverTitle]="popoverTitle"
      (actionClick)="onActionClick()"
    />
    <sky-help-inline data-sky-id="help-inline" (actionClick)="otherClick()" />
    <sky-help-inline
      data-sky-id="help-inline-using-labelled-by"
      labelledBy="label1 label2"
      (actionClick)="otherClick()"
    />
    <span id="label1">An explanation</span>
    <span id="label2">that spans multiple elements</span>
  `,
  standalone: false,
})
class TestComponent {
  public ariaControls: string | undefined;
  public ariaExpanded: boolean | undefined;
  public ariaLabel: string | undefined;
  public helpKey: string | undefined;
  public labelText: string | undefined;
  public popoverContent: string | undefined;
  public popoverTitle: string | undefined;

  public onActionClick(): void {
    // This function is for the spy
  }
  public otherClick(): void {
    // This function is for the spy
  }
}
//#endregion Test component

describe('Inline help harness', () => {
  async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
    helpInlineHarness: SkyHelpInlineHarness;
    fixture: ComponentFixture<TestComponent>;
    loader: HarnessLoader;
  }> {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [SkyHelpInlineModule],
    });

    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const helpInlineHarness: SkyHelpInlineHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyHelpInlineHarness.with({ dataSkyId: options.dataSkyId }),
        )
      : await loader.getHarness(SkyHelpInlineHarness);

    return { helpInlineHarness, fixture, loader };
  }

  it('should get the help inline from its data-sky-id', async () => {
    const { helpInlineHarness, fixture } = await setupTest({
      dataSkyId: 'help-inline',
    });
    const clickSpy = spyOn(fixture.componentInstance, 'otherClick');

    await helpInlineHarness.click();

    expect(clickSpy).toHaveBeenCalled();
  });

  it('should click help inline button', async () => {
    const { helpInlineHarness, fixture } = await setupTest();
    const actionClickSpy = spyOn(fixture.componentInstance, 'onActionClick');

    await helpInlineHarness.click();

    expect(actionClickSpy).toHaveBeenCalled();
  });

  it('should return the default values', async () => {
    const { helpInlineHarness } = await setupTest();

    await expectAsync(helpInlineHarness.getAriaControls()).toBeResolvedTo(null);
    await expectAsync(helpInlineHarness.getAriaLabel()).toBeResolvedTo(
      'Show help content',
    );
    await expectAsync(helpInlineHarness.getLabelText()).toBeResolvedTo(
      undefined,
    );
  });

  it('should get aria controls value', async () => {
    const { helpInlineHarness, fixture } = await setupTest();

    fixture.componentInstance.ariaControls = 'aria controls';
    fixture.detectChanges();

    await expectAsync(helpInlineHarness.getAriaControls()).toBeResolvedTo(
      'aria controls',
    );
  });

  it('should throw an error trying to get aria expanded if aria controls is not set', async () => {
    const { helpInlineHarness, fixture } = await setupTest();

    fixture.componentInstance.ariaExpanded = true;
    fixture.detectChanges();

    await expectAsync(
      helpInlineHarness.getAriaExpanded(),
    ).toBeRejectedWithError(
      'aria-expanded is only set when `ariaControls` is set.',
    );
  });

  it('should get aria expanded values when aria controls is set', async () => {
    const { helpInlineHarness, fixture } = await setupTest();
    fixture.componentInstance.ariaControls = 'aria controls';

    fixture.componentInstance.ariaExpanded = true;
    fixture.detectChanges();

    await expectAsync(helpInlineHarness.getAriaExpanded()).toBeResolvedTo(true);

    fixture.componentInstance.ariaExpanded = false;
    fixture.detectChanges();

    await expectAsync(helpInlineHarness.getAriaExpanded()).toBeResolvedTo(
      false,
    );
  });

  it('should get aria label', async () => {
    const { helpInlineHarness, fixture } = await setupTest();

    fixture.componentInstance.ariaLabel = 'aria label';
    fixture.detectChanges();

    await expectAsync(helpInlineHarness.getAriaLabel()).toBeResolvedTo(
      'aria label',
    );
    await expectAsync(helpInlineHarness.getAriaLabelledBy()).toBeResolvedTo(
      null,
    );
  });

  it('should get aria labelled by', async () => {
    const { helpInlineHarness } = await setupTest({
      dataSkyId: 'help-inline-using-labelled-by',
    });
    await expectAsync(helpInlineHarness.getAriaLabelledBy()).toBeResolvedTo(
      'label1 label2',
    );
  });

  it('should get labelText', async () => {
    const { helpInlineHarness, fixture } = await setupTest();

    fixture.componentInstance.labelText = 'label';
    fixture.detectChanges();

    await expectAsync(helpInlineHarness.getLabelText()).toBeResolvedTo('label');
    await expectAsync(helpInlineHarness.getAriaLabel()).toBeResolvedTo(
      'Show help content for label',
    );
  });

  it('should throw an error trying to get popover content if popover is closed', async () => {
    const { helpInlineHarness, fixture } = await setupTest();

    fixture.componentInstance.popoverContent = 'popover content';
    fixture.detectChanges();

    await expectAsync(
      helpInlineHarness.getPopoverContent(),
    ).toBeRejectedWithError(
      'Unable to retrieve the popover content because the popover is not open.',
    );
  });

  it('should get popover content if popover is open', async () => {
    const { helpInlineHarness, fixture } = await setupTest();

    fixture.componentInstance.popoverContent = 'popover content';
    fixture.detectChanges();
    await helpInlineHarness.click();
    await fixture.whenStable();

    await expectAsync(helpInlineHarness.getPopoverContent()).toBeResolvedTo(
      'popover content',
    );
  });

  it('should throw an error trying to get popover title if popover is closed', async () => {
    const { helpInlineHarness, fixture } = await setupTest();

    fixture.componentInstance.popoverContent = 'popover content';
    fixture.componentInstance.popoverTitle = 'popover title';
    fixture.detectChanges();

    await expectAsync(
      helpInlineHarness.getPopoverTitle(),
    ).toBeRejectedWithError(
      'Unable to retrieve the popover content because the popover is not open.',
    );
  });

  it('should get popover title if popover is open', async () => {
    const { helpInlineHarness, fixture } = await setupTest();

    fixture.componentInstance.popoverContent = 'popover content';
    fixture.componentInstance.popoverTitle = 'popover title';
    fixture.detectChanges();
    await helpInlineHarness.click();
    await fixture.whenStable();

    await expectAsync(helpInlineHarness.getPopoverTitle()).toBeResolvedTo(
      'popover title',
    );
  });

  it('should throw an error when clicking the button while the button is hidden', async () => {
    const { helpInlineHarness, fixture } = await setupTest();

    fixture.componentInstance.helpKey = 'test.html';
    fixture.detectChanges();

    await expectAsync(helpInlineHarness.click()).toBeRejectedWithError(
      'Unable to click the help inline button because it is hidden.',
    );
  });
});
