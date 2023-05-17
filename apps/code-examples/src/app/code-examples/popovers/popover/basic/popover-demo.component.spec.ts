import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@skyux-sdk/testing';
import { SkyPopoverAlignment, SkyPopoverPlacement } from '@skyux/popovers';
import { SkyPopoverHarness } from '@skyux/popovers/testing';

import { PopoverDemoComponent } from './popover-demo.component';
import { PopoverDemoModule } from './popover-demo.module';

describe('Basic popover', () => {
  async function setupTest(options?: {
    openPopover: boolean;
    titleText?: string;
    alignment?: SkyPopoverAlignment;
    placement?: SkyPopoverPlacement;
    dismissOnBlur?: boolean;
  }): Promise<{
    popoverHarness: SkyPopoverHarness | null;
    fixture: ComponentFixture<PopoverDemoComponent>;
    loader: HarnessLoader;
  }> {
    const fixture = TestBed.createComponent(PopoverDemoComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    let open = true;

    if (options) {
      open = options.openPopover;
      fixture.componentInstance.popoverAlignment = options.alignment;
      fixture.componentInstance.popoverPlacement = options.placement;
      fixture.componentInstance.popoverTitle = options.titleText;
      fixture.componentInstance.dismissOnBlur = options.dismissOnBlur;
    }

    fixture.detectChanges();
    await fixture.whenStable();

    if (open) {
      const button = document.querySelector<HTMLButtonElement>('.sky-btn');
      button?.click();

      fixture.detectChanges();
      await fixture.whenStable();
    }
    const popoverHarness = await loader.getHarnessOrNull(SkyPopoverHarness);

    return { popoverHarness, fixture, loader };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PopoverDemoModule, NoopAnimationsModule],
    });
  });

  it('should not exist when popover is hidden', async () => {
    const { popoverHarness } = await setupTest({ openPopover: false });

    expect(popoverHarness).toBeNull();
  });

  it('should expose popover properties when visible', async () => {
    const { popoverHarness } = await setupTest({
      openPopover: true,
      placement: 'below',
      titleText: 'Did you know?',
    });

    expect(popoverHarness).not.toBeNull();
    await expectAsync(popoverHarness?.getTitleText()).toBeResolvedTo(
      'Did you know?'
    );
    await expectAsync(popoverHarness?.getBodyText()).toBeResolvedTo(
      'This is a popover.'
    );
    await expectAsync(popoverHarness?.getAlignment()).toBeResolvedTo('center');
    await expectAsync(popoverHarness?.getPlacement()).toBeResolvedTo('below');
  });

  it('should close the popover if clicking out when dismissOnBlur is set to true', async () => {
    // eslint-disable-next-line prefer-const
    let { popoverHarness, fixture, loader } = await setupTest();

    fixture.componentInstance.dismissOnBlur = true;

    fixture.detectChanges();
    await fixture.whenStable();

    await popoverHarness?.clickOut();

    popoverHarness = await loader.getHarnessOrNull(SkyPopoverHarness);
    expect(popoverHarness).toBeNull();
  });

  it('should not close the popover if clicking out when dismissOnBlur is set to false', async () => {
    // eslint-disable-next-line prefer-const
    let { popoverHarness, fixture, loader } = await setupTest({
      openPopover: true,
      dismissOnBlur: false,
    });

    fixture.detectChanges();
    await fixture.whenStable();

    await popoverHarness?.clickOut();

    popoverHarness = await loader.getHarnessOrNull(SkyPopoverHarness);
    expect(popoverHarness).not.toBeNull();
  });
});
