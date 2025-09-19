import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';

import { NonexistentHarness } from './fixtures/nonexistent-harness';
import { RepeaterHarnessTestItemHarness } from './fixtures/repeater-harness-test-item-harness';
import { RepeaterHarnessTestComponent } from './fixtures/repeater-harness-test.component';
import { RepeaterHarnessTestModule } from './fixtures/repeater-harness-test.module';
import { SkyRepeaterHarness } from './repeater-harness';
import { SkyRepeaterItemHarness } from './repeater-item-harness';

async function setupTest(options: { dataSkyId?: string } = {}) {
  await TestBed.configureTestingModule({
    imports: [RepeaterHarnessTestModule],
  }).compileComponents();

  const fixture = TestBed.createComponent(RepeaterHarnessTestComponent);
  const loader = TestbedHarnessEnvironment.loader(fixture);

  const repeaterHarness = options.dataSkyId
    ? await loader.getHarness(
        SkyRepeaterHarness.with({
          dataSkyId: options.dataSkyId,
        }),
      )
    : await loader.getHarness(SkyRepeaterHarness);

  return { repeaterHarness, fixture, loader };
}

describe('Repeater harness', () => {
  it('should get child repeater items', async () => {
    const { repeaterHarness } = await setupTest({
      dataSkyId: 'my-basic-repeater',
    });

    const items = await repeaterHarness.getRepeaterItems();

    expect(items.length).toEqual(2);
    expect(items[0] instanceof SkyRepeaterItemHarness).toBeTrue();
  });

  it('should update the active index when a repeater item is clicked', async () => {
    const { fixture, repeaterHarness } = await setupTest({
      dataSkyId: 'my-basic-repeater',
    });

    fixture.componentInstance.activeIndex = 0;

    const items = await repeaterHarness.getRepeaterItems();

    await items[1].click();

    expect(fixture.componentInstance.activeIndex).toBe(1);
  });

  it('should select and deselect an item', async () => {
    const { fixture, repeaterHarness } = await setupTest({
      dataSkyId: 'my-basic-repeater',
    });

    const items = await repeaterHarness.getRepeaterItems();

    await expectAsync(items[0].isSelectable()).toBeResolvedTo(false);

    fixture.componentInstance.selectable = true;

    const item = items[0];

    await expectAsync(item.isSelected()).toBeResolvedTo(false);
    await expectAsync(item.isSelectable()).toBeResolvedTo(true);

    await item.select();

    await expectAsync(item.isSelected()).toBeResolvedTo(true);

    await item.deselect();

    await expectAsync(item.isSelected()).toBeResolvedTo(false);
  });

  it('should throw an error if (de)selecting an unselectable item', async () => {
    const { repeaterHarness } = await setupTest({
      dataSkyId: 'my-basic-repeater',
    });

    const items = await repeaterHarness.getRepeaterItems();
    const item = items[0];

    await expectAsync(item.isSelected()).toBeRejectedWithError(
      'Could not determine if repeater item is selected because it is not selectable.',
    );
    await expectAsync(item.select()).toBeRejectedWithError(
      'Could not select the repeater item because it is not selectable.',
    );
    await expectAsync(item.deselect()).toBeRejectedWithError(
      'Could not deselect the repeater item because it is not selectable.',
    );
  });

  it('should expand and collapse items', async () => {
    const { fixture, repeaterHarness } = await setupTest({
      dataSkyId: 'my-basic-repeater',
    });

    const items = await repeaterHarness.getRepeaterItems();
    const item = items[0];

    await expectAsync(item.isCollapsible()).toBeResolvedTo(false);

    fixture.componentInstance.expandMode = 'multi';

    await expectAsync(item.isCollapsible()).toBeResolvedTo(true);

    await expectAsync(item.isExpanded()).toBeResolvedTo(true);

    await item.collapse();

    await expectAsync(item.isExpanded()).toBeResolvedTo(false);

    await item.expand();

    await expectAsync(item.isExpanded()).toBeResolvedTo(true);
  });

  it('should throw an error if expanding or collapsing an noncollapsible item', async () => {
    const { repeaterHarness } = await setupTest({
      dataSkyId: 'my-basic-repeater',
    });

    const items = await repeaterHarness.getRepeaterItems();
    const item = items[0];

    await expectAsync(item.isCollapsible()).toBeResolvedTo(false);

    await expectAsync(item.isExpanded()).toBeRejectedWithError(
      'Could not determine if repeater item is expanded because it is not collapsible.',
    );

    await expectAsync(item.expand()).toBeRejectedWithError(
      'Could not expand the repeater item because it is not collapsible.',
    );
    await expectAsync(item.collapse()).toBeRejectedWithError(
      'Could not collapse the repeater item because it is not collapsible.',
    );
  });

  it('should handle reorderability', async () => {
    const { repeaterHarness, fixture } = await setupTest({
      dataSkyId: 'my-basic-repeater',
    });

    const items = await repeaterHarness.getRepeaterItems();
    const item = items[0];

    await expectAsync(item.isReorderable()).toBeResolvedTo(false);
    await expectAsync(item.sendToTop()).toBeRejectedWithError(
      'Could not send to top because the repeater is not reorderable.',
    );

    fixture.componentInstance.reorderable = true;

    await expectAsync(item.isReorderable()).toBeResolvedTo(true);
    await expectAsync(item.sendToTop()).toBeResolved();
  });

  it('should find items by `data-sky-id` attributes', async () => {
    const { repeaterHarness } = await setupTest({
      dataSkyId: 'my-basic-repeater',
    });

    const items = await repeaterHarness.getRepeaterItems({
      dataSkyId: 'my-basic-repeater-item-0',
    });

    expect(items.length).toEqual(1);
  });

  it('should find items by title text', async () => {
    const { repeaterHarness } = await setupTest({
      dataSkyId: 'my-basic-repeater',
    });

    const items = await repeaterHarness.getRepeaterItems({
      titleText: 'Call Robert Hernandez',
    });

    await expectAsync(items[0].getTitleText()).toBeResolvedTo(
      'Call Robert Hernandez',
    );
  });

  it('should find items by body text', async () => {
    const { repeaterHarness } = await setupTest({
      dataSkyId: 'my-basic-repeater',
    });

    const items = await repeaterHarness.getRepeaterItems({
      contentText: /We should call him to thank him/,
    });

    await expectAsync(items[0].getContentText()).toBeResolvedTo(
      'Robert recently gave a very generous gift. We should call him to thank him.',
    );
  });

  it('should allow querying harnesses inside an item', async () => {
    const { repeaterHarness } = await setupTest({
      dataSkyId: 'my-basic-repeater',
    });

    const items = await repeaterHarness.getRepeaterItems();

    const noteHarness = await items[0].queryHarness(
      RepeaterHarnessTestItemHarness,
    );

    expect(noteHarness).not.toBeNull();
    await expectAsync((await noteHarness.host()).text()).toBeResolvedTo(
      'Robert recently gave a very generous gift. We should call him to thank him.',
    );

    const noteHarnesses = await items[1].queryHarnesses(
      RepeaterHarnessTestItemHarness,
    );
    expect(noteHarnesses).not.toBeNull();
    expect(noteHarnesses.length).toBe(1);

    const noteElement = await items[0].querySelector('.item-note');
    expect(noteElement).not.toBeNull();

    const noteElements = await items[0].querySelectorAll('.item-note');
    expect(noteElements).not.toBeNull();
    expect(noteElements.length).toBe(1);
  });

  it('should throw when querying harnesses inside an item that does not exist', async () => {
    const { repeaterHarness } = await setupTest({
      dataSkyId: 'my-basic-repeater',
    });

    const items = await repeaterHarness.getRepeaterItems();

    await expectAsync(
      items[0].queryHarness(NonexistentHarness),
    ).toBeRejectedWithError();
  });

  it('should return null when querying harnesses inside an item that does not exist', async () => {
    const { repeaterHarness } = await setupTest({
      dataSkyId: 'my-basic-repeater',
    });

    const items = await repeaterHarness.getRepeaterItems();

    await expectAsync(
      items[0].queryHarnessOrNull(NonexistentHarness),
    ).toBeResolvedTo(null);
  });

  it('should get whether a selectable item is disabled', async () => {
    const { fixture, repeaterHarness } = await setupTest({
      dataSkyId: 'my-basic-repeater',
    });

    fixture.componentInstance.selectable = true;
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    const items = await repeaterHarness.getRepeaterItems();
    const item = items[0];

    await expectAsync(item.isDisabled()).toBeResolvedTo(true);
  });

  it('should get the aria-label of the repeater', async () => {
    const { fixture, repeaterHarness } = await setupTest({
      dataSkyId: 'my-basic-repeater',
    });

    fixture.componentInstance.ariaLabel = 'Test Repeater Aria Label';
    fixture.detectChanges();

    await expectAsync(repeaterHarness.getAriaLabel()).toBeResolvedTo(
      'Test Repeater Aria Label',
    );
  });

  it('should return false if a non-selectable item is disabled', async () => {
    const { fixture, repeaterHarness } = await setupTest({
      dataSkyId: 'my-basic-repeater',
    });

    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    const items = await repeaterHarness.getRepeaterItems();
    const item = items[0];

    await expectAsync(item.isDisabled()).toBeResolvedTo(false);
  });
  it('should get the inline form from an item', async () => {
    const { repeaterHarness } = await setupTest({
      dataSkyId: 'my-inline-form-repeater',
    });

    const items = await repeaterHarness.getRepeaterItems();
    const item = items[0];

    const inlineForm = await item.getInlineForm();

    await expectAsync(inlineForm.isFormExpanded()).toBeResolvedTo(true);
  });

  it('should get the item name', async () => {
    const { repeaterHarness } = await setupTest({
      dataSkyId: 'my-inline-form-repeater',
    });

    const items = await repeaterHarness.getRepeaterItems();
    const item = items[0];

    await expectAsync(item.getItemName()).toBeResolvedTo('Inline form item');
  });

  it('should get the title from an item with data sky id', async () => {
    const { repeaterHarness } = await setupTest({
      dataSkyId: 'my-basic-repeater',
    });

    const items = await repeaterHarness.getRepeaterItems();
    const item = items[0];

    const title = await item.getTitle({
      dataSkyId: 'my-item-title-0',
    });

    await expectAsync(title.getTitleText()).toBeResolvedTo(
      'Call Robert Hernandez',
    );
  });

  it('should get the context menu from an item by data sky id', async () => {
    const { repeaterHarness } = await setupTest({
      dataSkyId: 'my-basic-repeater',
    });

    const items = await repeaterHarness.getRepeaterItems();
    const item = items[0];

    await expectAsync(
      item.getContextMenu({
        dataSkyId: 'my-item-context-menu-0',
      }),
    ).toBeResolved();
  });

  it('should get the content of an item', async () => {
    const { repeaterHarness } = await setupTest({
      dataSkyId: 'my-basic-repeater',
    });

    const items = await repeaterHarness.getRepeaterItems();
    const item = items[0];

    await expectAsync(
      item.getContent({
        dataSkyId: 'my-item-content-0',
      }),
    ).toBeResolved();
  });

  it('should get the content, context menu and title of an item if they exist', async () => {
    const { repeaterHarness } = await setupTest({
      dataSkyId: 'my-basic-repeater',
    });

    const items = await repeaterHarness.getRepeaterItems();
    const item = items[0];

    await expectAsync(item.getContent()).toBeResolved();
    await expectAsync(item.getContextMenu()).toBeResolved();
    await expectAsync(item.getTitle()).toBeResolved();
  });
});
