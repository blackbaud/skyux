import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyPopoverAlignment, SkyPopoverPlacement } from '@skyux/popovers';

import { PopoverHarnessTestItemHarness } from './fixtures/popover-harness-test-item-harness';
import { PopoverHarnessTestComponent } from './fixtures/popover-harness-test.component';
import { PopoverHarnessTestModule } from './fixtures/popover-harness-test.module';
import { SkyPopoverHarness } from './popover-harness';

async function setupTest(options?: {
  openPopover: boolean;
  titleText?: string;
  alignment?: SkyPopoverAlignment;
  placement?: SkyPopoverPlacement;
  dismissOnBlur?: boolean;
}): Promise<{
  popoverHarness: SkyPopoverHarness | null;
  fixture: ComponentFixture<PopoverHarnessTestComponent>;
  loader: HarnessLoader;
}> {
  await TestBed.configureTestingModule({
    imports: [PopoverHarnessTestModule],
  }).compileComponents();

  const fixture = TestBed.createComponent(PopoverHarnessTestComponent);
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

describe('Popover harness', () => {
  it('should not exist when popover is hidden', async () => {
    const { popoverHarness } = await setupTest({ openPopover: false });

    expect(popoverHarness).toBeNull();
  });

  it('should expose popover properties when visible', async () => {
    const { popoverHarness } = await setupTest();

    expect(popoverHarness).not.toBeNull();
    await expectAsync(popoverHarness?.getTitleText()).toBeResolvedTo(
      'popover title'
    );
    await expectAsync(popoverHarness?.getBodyText()).toBeResolvedTo(
      'popover body'
    );
    await expectAsync(popoverHarness?.getAlignment()).toBeResolvedTo('center');
    await expectAsync(popoverHarness?.getPlacement()).toBeResolvedTo('above');
  });

  it('should allow querying harnesses inside a popover', async () => {
    const { popoverHarness } = await setupTest();

    const bodyHarness = await popoverHarness?.queryHarness(
      PopoverHarnessTestItemHarness
    );

    expect(bodyHarness).not.toBeNull();
    await expectAsync((await bodyHarness!.host()).text()).toBeResolvedTo(
      'popover body'
    );

    const bodyHarnesses = await popoverHarness?.queryHarnesses(
      PopoverHarnessTestItemHarness
    );
    expect(bodyHarnesses).not.toBeNull();
    expect(bodyHarnesses!.length).toBe(1);

    const bodyElement = await popoverHarness?.querySelector('.popover-body');
    expect(bodyElement).not.toBeNull();

    const noteElements = await popoverHarness?.querySelectorAll(
      '.popover-body'
    );
    expect(noteElements).not.toBeNull();
    expect(noteElements!.length).toBe(1);
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
