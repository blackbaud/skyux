import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  SkyRepeaterHarness,
  SkyRepeaterItemHarness,
} from '@skyux/lists/testing';

import { RepeaterDemoComponent } from './repeater-demo.component';
import { RepeaterDemoModule } from './repeater-demo.module';

describe('Repeater add remove demo', () => {
  async function setupTest(): Promise<{
    repeaterHarness: SkyRepeaterHarness | null;
    repeaterItems: SkyRepeaterItemHarness[] | null;
    fixture: ComponentFixture<RepeaterDemoComponent>;
  }> {
    const fixture = TestBed.createComponent(RepeaterDemoComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const repeaterHarness = await loader.getHarness(
      SkyRepeaterHarness.with({ dataSkyId: 'repeater-demo' })
    );

    const repeaterItems = await repeaterHarness.getRepeaterItems();

    return { repeaterHarness, repeaterItems, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RepeaterDemoModule, NoopAnimationsModule],
    });
  });

  it('should allow items to be expanded and collapsed', async () => {
    const { repeaterItems } = await setupTest();
    let first = true;

    for (const item of repeaterItems!) {
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

    let repeaterItems = await repeaterHarness?.getRepeaterItems();
    expect(repeaterItems).toBeDefined();
    expect(repeaterItems?.length).toBe(expectedContent.length);

    if (repeaterItems) {
      for (const item of repeaterItems) {
        await expectAsync(item.isReorderable()).toBeResolvedTo(true);
      }

      await expectAsync(repeaterItems?.[1].getTitleText()).toBeResolvedTo(
        expectedContent[1].title
      );
      await repeaterItems?.[1].sendToTop();

      repeaterItems = await repeaterHarness?.getRepeaterItems();
      await expectAsync(repeaterItems?.[1].getTitleText()).toBeResolvedTo(
        expectedContent[0].title
      );
    }
  });

  it('should allow items to be added and removed', async () => {
    const { repeaterHarness, fixture } = await setupTest();

    let repeaterItems = await repeaterHarness?.getRepeaterItems();
    expect(repeaterItems).toBeDefined();
    expect(repeaterItems?.length).toBe(4);

    if (repeaterItems) {
      for (const item of repeaterItems) {
        await expectAsync(item.isSelectable()).toBeResolvedTo(true);
      }

      const addButton = fixture.nativeElement.querySelector(
        '[data-sky-id="add-button"]'
      );
      const removeButton = fixture.nativeElement.querySelector(
        '[data-sky-id="remove-button"]'
      );

      addButton.click();
      fixture.detectChanges();

      repeaterItems = await repeaterHarness?.getRepeaterItems();
      expect(repeaterItems).toBeDefined();
      expect(repeaterItems?.length).toBe(5);

      await expectAsync(repeaterItems?.[0].isSelected()).toBeResolvedTo(false);
      await repeaterItems?.[0].select();
      await expectAsync(repeaterItems?.[0].isSelected()).toBeResolvedTo(true);
      await expectAsync(repeaterItems?.[1].isSelected()).toBeResolvedTo(false);
      await repeaterItems?.[1].select();
      await expectAsync(repeaterItems?.[1].isSelected()).toBeResolvedTo(true);

      removeButton.click();
      fixture.detectChanges();

      repeaterItems = await repeaterHarness?.getRepeaterItems();
      expect(repeaterItems).toBeDefined();
      expect(repeaterItems?.length).toBe(3);
    }
  });
});
