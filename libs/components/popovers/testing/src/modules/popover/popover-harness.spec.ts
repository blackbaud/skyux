import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyPopoverAlignment, SkyPopoverPlacement } from '@skyux/popovers';

import { NonexistentHarness } from './fixtures/nonexistent-harness';
import { PopoverHarnessTestItemHarness } from './fixtures/popover-harness-test-item-harness';
import { PopoverHarnessTestComponent } from './fixtures/popover-harness-test.component';
import { SkyPopoverHarness } from './popover-harness';

async function setupTest(options?: {
  dataSkyId?: string;
  titleText?: string;
  alignment?: SkyPopoverAlignment;
  placement?: SkyPopoverPlacement;
}): Promise<{
  popoverHarness: SkyPopoverHarness;
  fixture: ComponentFixture<PopoverHarnessTestComponent>;
}> {
  const fixture = TestBed.createComponent(PopoverHarnessTestComponent);
  const loader = TestbedHarnessEnvironment.loader(fixture);

  if (options) {
    fixture.componentInstance.popoverAlignment = options.alignment;
    fixture.componentInstance.popoverPlacement = options.placement;
    fixture.componentInstance.popoverTitle = options.titleText;
  }

  fixture.detectChanges();
  await fixture.whenStable();

  let popoverHarness: SkyPopoverHarness;

  if (options?.dataSkyId) {
    popoverHarness = await loader.getHarness(
      SkyPopoverHarness.with({
        dataSkyId: options.dataSkyId,
      }),
    );
  } else {
    popoverHarness = await loader.getHarness(SkyPopoverHarness);
  }

  return { popoverHarness, fixture };
}

describe('Popover harness', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopoverHarnessTestComponent],
    }).compileComponents();
  });

  it('should return an error when popover is hidden', async () => {
    const { popoverHarness } = await setupTest();

    await expectAsync(popoverHarness.getPopoverContent()).toBeRejectedWithError(
      'Unable to retrieve the popover content because the popover is not open.',
    );
  });

  it('should expose popover properties when visible', async () => {
    const { popoverHarness } = await setupTest({
      titleText: 'popover title',
      placement: 'right',
    });

    await popoverHarness.clickPopoverButton();
    const contentHarness = await popoverHarness.getPopoverContent();

    await expectAsync(contentHarness.getTitleText()).toBeResolvedTo(
      'popover title',
    );
    await expectAsync(contentHarness.getBodyText()).toBeResolvedTo(
      'popover body',
    );
    await expectAsync(contentHarness.getAlignment()).toBeResolvedTo('center');
    await expectAsync(contentHarness.getPlacement()).toBeResolvedTo('right');
  });

  it('should allow querying harnesses inside a popover', async () => {
    const { popoverHarness } = await setupTest();

    await popoverHarness.clickPopoverButton();
    const contentHarness = await popoverHarness.getPopoverContent();

    const bodyHarness = await contentHarness.queryHarness(
      PopoverHarnessTestItemHarness,
    );

    await expectAsync((await bodyHarness.host()).text()).toBeResolvedTo(
      'popover body',
    );

    const bodyHarnesses = await contentHarness.queryHarnesses(
      PopoverHarnessTestItemHarness,
    );
    expect(bodyHarnesses).not.toBeNull();
    expect(bodyHarnesses.length).toBe(1);

    const bodyElement = await contentHarness.querySelector('.popover-body');
    expect(bodyElement).not.toBeNull();

    const noteElements = await contentHarness.querySelectorAll('.popover-body');
    expect(noteElements).not.toBeNull();
    expect(noteElements.length).toBe(1);
  });

  it('should throw error when querying popover content for harnesses that do not exist', async () => {
    const { popoverHarness } = await setupTest();

    await popoverHarness.clickPopoverButton();
    const contentHarness = await popoverHarness.getPopoverContent();

    await expectAsync(
      contentHarness.queryHarness(NonexistentHarness),
    ).toBeRejectedWithError();
  });

  it('should return null when querying popover content for harnesses that do not exist', async () => {
    const { popoverHarness } = await setupTest();

    await popoverHarness.clickPopoverButton();
    const contentHarness = await popoverHarness.getPopoverContent();

    await expectAsync(
      contentHarness.queryHarnessOrNull(NonexistentHarness),
    ).toBeResolvedTo(null);
  });

  it('should close the popover if clicking out', async () => {
    const { popoverHarness, fixture } = await setupTest();

    fixture.detectChanges();
    await fixture.whenStable();

    await popoverHarness.clickPopoverButton();
    await expectAsync(popoverHarness.isOpen()).toBeResolvedTo(true);

    await (await popoverHarness.getPopoverContent()).clickOut();
    await expectAsync(popoverHarness.isOpen()).toBeResolvedTo(false);
  });

  it('should get popovers by data-sky-id', async () => {
    const { popoverHarness } = await setupTest({
      dataSkyId: 'another-popover',
    });

    await popoverHarness.clickPopoverButton();
    const contentHarness = await popoverHarness.getPopoverContent();

    await expectAsync(contentHarness.getTitleText()).toBeResolvedTo(
      'Another popover',
    );
    await expectAsync(contentHarness.getBodyText()).toBeResolvedTo(
      'I have different content',
    );
  });

  it('should return the correct popover for each trigger element', async () => {
    const fixture = TestBed.createComponent(PopoverHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const popoverHarness1 = await loader.getHarness(SkyPopoverHarness);

    const popoverHarness2 = await loader.getHarness(
      SkyPopoverHarness.with({
        dataSkyId: 'another-popover',
      }),
    );

    await popoverHarness1.clickPopoverButton();

    const contentHarness1 = await popoverHarness1.getPopoverContent();
    await expectAsync(
      popoverHarness2.getPopoverContent(),
    ).toBeRejectedWithError(
      'Unable to retrieve the popover content because the popover is not open.',
    );

    await expectAsync(contentHarness1.getTitleText()).toBeResolvedTo(
      'popover title',
    );
    await expectAsync(contentHarness1.getBodyText()).toBeResolvedTo(
      'popover body',
    );

    await popoverHarness2.clickPopoverButton();

    const contentHarness2 = await popoverHarness2.getPopoverContent();
    await expectAsync(
      popoverHarness1.getPopoverContent(),
    ).toBeRejectedWithError(
      'Unable to retrieve the popover content because the popover is not open.',
    );

    await expectAsync(contentHarness2.getTitleText()).toBeResolvedTo(
      'Another popover',
    );
    await expectAsync(contentHarness2.getBodyText()).toBeResolvedTo(
      'I have different content',
    );
  });
});
