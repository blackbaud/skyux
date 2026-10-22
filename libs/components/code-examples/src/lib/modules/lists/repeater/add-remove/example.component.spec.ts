import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { provideNoopSkyAnimations } from '@skyux/core';
import { SkyButtonHarness } from '@skyux/forms/testing';
import { SkyRepeaterHarness } from '@skyux/lists/testing';

import { ListsRepeaterAddRemoveExampleComponent } from './example.component';

describe('Repeater add remove example', () => {
  async function setupTest(): Promise<{
    loader: HarnessLoader;
    repeaterHarness: SkyRepeaterHarness;
  }> {
    const fixture = TestBed.createComponent(
      ListsRepeaterAddRemoveExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const repeaterHarness = await loader.getHarness(
      SkyRepeaterHarness.with({ dataSkyId: 'repeater-example' }),
    );

    return { loader, repeaterHarness };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ListsRepeaterAddRemoveExampleComponent],
      providers: [provideNoopSkyAnimations()],
    });
  });

  it('should allow items to be expanded and collapsed', async () => {
    const { repeaterHarness } = await setupTest();

    const repeaterItems = await repeaterHarness.getRepeaterItems();

    let first = true;

    for (const item of repeaterItems) {
      await expectAsync(item.isCollapsible()).toBeResolvedTo(true);

      // in single expand mode, the first item is expanded by default
      await expectAsync(item.isExpanded()).toBeResolvedTo(first ? true : false);

      first = false;

      await item.collapse();
      await expectAsync(item.isExpanded()).toBeResolvedTo(false);

      await item.expand();
      await expectAsync(item.isExpanded()).toBeResolvedTo(true);
    }
  });

  it('should allow items to be reordered', async () => {
    const { repeaterHarness } = await setupTest();

    const expectedContent = [
      {
        title: 'Call Robert Hernandez  Completed',
        body: 'Robert recently gave a very generous gift. We should call him to thank him.',
      },
      {
        title: 'Send invitation to Spring Ball  Past due',
        body: "The Spring Ball is coming up soon. Let's get those invitations out!",
      },
      {
        title: 'Assign prospects  Due tomorrow',
        body: 'There are 14 new prospects who are not assigned to fundraisers.',
      },
      {
        title: 'Process gift receipts  Due next week',
        body: 'There are 28 recent gifts that are not receipted.',
      },
    ];

    let repeaterItems = await repeaterHarness.getRepeaterItems();

    expect(repeaterItems).toBeDefined();
    expect(repeaterItems.length).toBe(expectedContent.length);

    for (const item of repeaterItems) {
      await expectAsync(item.isReorderable()).toBeResolvedTo(true);
    }

    await expectAsync(repeaterItems[1].getTitleText()).toBeResolvedTo(
      expectedContent[1].title,
    );

    await repeaterItems[1].sendToTop();
    repeaterItems = await repeaterHarness.getRepeaterItems();

    await expectAsync(repeaterItems[1].getTitleText()).toBeResolvedTo(
      expectedContent[0].title,
    );
  });

  it('should allow items to be added and removed', async () => {
    const { repeaterHarness, loader } = await setupTest();

    let repeaterItems = await repeaterHarness.getRepeaterItems();

    expect(repeaterItems).toBeDefined();
    expect(repeaterItems.length).toBe(4);

    for (const item of repeaterItems) {
      await expectAsync(item.isSelectable()).toBeResolvedTo(true);
    }

    const addButton = await loader.getHarness(
      SkyButtonHarness.with({ dataSkyId: 'add-button' }),
    );

    const removeButton = await loader.getHarness(
      SkyButtonHarness.with({ dataSkyId: 'remove-button' }),
    );

    await addButton.click();

    repeaterItems = await repeaterHarness.getRepeaterItems();
    expect(repeaterItems).toBeDefined();
    expect(repeaterItems.length).toBe(5);

    await expectAsync(repeaterItems[0].isSelected()).toBeResolvedTo(false);
    await repeaterItems[0].select();

    await expectAsync(repeaterItems[0].isSelected()).toBeResolvedTo(true);
    await expectAsync(repeaterItems[1].isSelected()).toBeResolvedTo(false);

    await repeaterItems[1].select();
    await expectAsync(repeaterItems[1].isSelected()).toBeResolvedTo(true);

    await removeButton.click();

    repeaterItems = await repeaterHarness.getRepeaterItems();
    expect(repeaterItems).toBeDefined();
    expect(repeaterItems.length).toBe(3);
  });
});
