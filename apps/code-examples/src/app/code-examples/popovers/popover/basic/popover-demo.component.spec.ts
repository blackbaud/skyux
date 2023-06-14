import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyPopoverAlignment, SkyPopoverPlacement } from '@skyux/popovers';
import { SkyPopoverHarness } from '@skyux/popovers/testing';

import { PopoverDemoComponent } from './popover-demo.component';
import { PopoverDemoModule } from './popover-demo.module';

describe('Basic popover', () => {
  async function setupTest(options?: {
    titleText?: string;
    alignment?: SkyPopoverAlignment;
    placement?: SkyPopoverPlacement;
    dismissOnBlur?: boolean;
  }): Promise<{
    popoverHarness: SkyPopoverHarness;
    fixture: ComponentFixture<PopoverDemoComponent>;
  }> {
    const fixture = TestBed.createComponent(PopoverDemoComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    if (options) {
      fixture.componentInstance.popoverAlignment = options.alignment;
      fixture.componentInstance.popoverPlacement = options.placement;
      fixture.componentInstance.popoverTitle = options.titleText;
      fixture.componentInstance.dismissOnBlur = options.dismissOnBlur;
    }

    fixture.detectChanges();
    await fixture.whenStable();

    const popoverHarness = await loader.getHarness(
      SkyPopoverHarness.with({
        dataSkyId: 'popover-demo',
      })
    );

    return { popoverHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PopoverDemoModule, NoopAnimationsModule],
    });
  });

  it('should open and close when the user interacts with the trigger', async () => {
    const { popoverHarness } = await setupTest();

    await expectAsync(popoverHarness.isOpen()).toBeResolvedTo(false);

    await popoverHarness.clickPopoverButton();
    await expectAsync(popoverHarness.isOpen()).toBeResolvedTo(true);

    await popoverHarness.clickPopoverButton();
    await expectAsync(popoverHarness.isOpen()).toBeResolvedTo(false);
  });

  it('should expose content properties when visible', async () => {
    const { popoverHarness } = await setupTest({
      titleText: 'Did you know?',
      placement: 'right',
    });

    await popoverHarness.clickPopoverButton();
    const contentHarness = await popoverHarness.getPopoverContent();

    await expectAsync(contentHarness.getTitleText()).toBeResolvedTo(
      'Did you know?'
    );
    await expectAsync(contentHarness.getBodyText()).toBeResolvedTo(
      'This is a popover.'
    );
    await expectAsync(contentHarness.getAlignment()).toBeResolvedTo('center');
    await expectAsync(contentHarness.getPlacement()).toBeResolvedTo('right');

    await popoverHarness.clickPopoverButton();
    // Attempting to call this method when the popover is closed will result in an error.
    await expectAsync(popoverHarness.getPopoverContent()).toBeRejectedWithError(
      'Unable to retrieve the popover content because the popover is not open.'
    );
  });
});
