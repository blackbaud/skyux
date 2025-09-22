import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyRepeaterHarness } from '@skyux/lists/testing';

import { ListsRepeaterInlineFormExampleComponent } from './example.component';

fdescribe('ListsRepeaterInlineFormExampleComponent', () => {
  async function setupTest(): Promise<{
    component: ListsRepeaterInlineFormExampleComponent;
    fixture: ComponentFixture<ListsRepeaterInlineFormExampleComponent>;
    repeaterHarness: SkyRepeaterHarness;
  }> {
    await TestBed.configureTestingModule({
      imports: [ListsRepeaterInlineFormExampleComponent, NoopAnimationsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(
      ListsRepeaterInlineFormExampleComponent,
    );
    const component = fixture.componentInstance;
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const repeaterHarness = await loader.getHarness(SkyRepeaterHarness);

    fixture.detectChanges();

    return { component, fixture, repeaterHarness };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ListsRepeaterInlineFormExampleComponent],
    });
  });

  it('should display all repeater items', async () => {
    const { repeaterHarness } = await setupTest();

    const items = await repeaterHarness.getRepeaterItems();
    expect(items.length).toBe(4);
  });

  it('should display correct title text', async () => {
    const { repeaterHarness } = await setupTest();

    const items = await repeaterHarness.getRepeaterItems();
    await expectAsync(items[1].getTitleText()).toBeResolvedTo(
      '2019 Special Winter Event',
    );
    await expectAsync(items[3].getTitleText()).toBeResolvedTo(
      '2020 Spring Gala',
    );
  });

  it('should display correct content text', async () => {
    const { repeaterHarness } = await setupTest();

    const items = await repeaterHarness.getRepeaterItems();

    await expectAsync(items[0].getContentText()).toBeResolvedTo(
      'Gala for friends and family',
    );
    await expectAsync(items[2].getContentText()).toBeResolvedTo(
      'Event for all donors and families',
    );
  });

  it('should find items by title text', async () => {
    const { repeaterHarness } = await setupTest();

    const foundItems = await repeaterHarness.getRepeaterItems({
      titleText: '2019 Spring Gala',
    });

    expect(foundItems.length).toBe(1);
    await expectAsync(foundItems[0].getTitleText()).toBeResolvedTo(
      '2019 Spring Gala',
    );
  });

  it('should find items by content text using regex', async () => {
    const { repeaterHarness } = await setupTest();

    const foundItems = await repeaterHarness.getRepeaterItems({
      contentText: /special event/i,
    });

    expect(foundItems.length).toBe(1);
    await expectAsync(foundItems[0].getContentText()).toBeResolvedTo(
      'A special event',
    );
  });

  describe('Inline form functionality', () => {
    it('should show inline form when edit button is clicked', async () => {
      const { repeaterHarness, fixture } = await setupTest();

      const items = await repeaterHarness.getRepeaterItems();
      const firstItem = items[0];

      // Click edit button in context menu
      const contextMenu = await firstItem.getContextMenu();
      const editButton = await contextMenu.querySelector(
        'button[aria-label="Edit"]',
      );
      await editButton!.click();

      fixture.detectChanges();
      await fixture.whenStable();

      // Now inline form should be visible and expanded
      const inlineForm = await firstItem.getInlineForm();
      await expectAsync(inlineForm.isFormExpanded()).toBeResolvedTo(true);
    });

    it('should have save and cancel buttons in inline form', async () => {
      const { repeaterHarness, fixture } = await setupTest();

      const items = await repeaterHarness.getRepeaterItems();
      const firstItem = items[0];

      // Show inline form
      const contextMenu = await firstItem.getContextMenu();
      const editButton = await contextMenu.querySelector(
        'button[aria-label="Edit"]',
      );
      await editButton!.click();

      fixture.detectChanges();
      await fixture.whenStable();

      const inlineForm = await firstItem.getInlineForm();
      const buttons = await inlineForm.getButtons();

      expect(buttons.length).toBe(2);

      // Check button types and text
      const saveButton = await inlineForm.getButton({ styleType: 'primary' });
      const cancelButton = await inlineForm.getButton({ styleType: 'link' });

      expect(saveButton).toBeTruthy();
      expect(cancelButton).toBeTruthy();

      await expectAsync(saveButton!.getText()).toBeResolvedTo('Save');
      await expectAsync(cancelButton!.getText()).toBeResolvedTo('Cancel');
    });

    it('should have template when inline form is expanded', async () => {
      const { repeaterHarness, fixture } = await setupTest();

      const items = await repeaterHarness.getRepeaterItems();
      const firstItem = items[0];

      // Show inline form
      const contextMenu = await firstItem.getContextMenu();
      const editButton = await contextMenu.querySelector(
        'button[aria-label="Edit"]',
      );
      await editButton!.click();

      fixture.detectChanges();
      await fixture.whenStable();

      const inlineForm = await firstItem.getInlineForm();
      const template = await inlineForm.getTemplate();

      expect(template).toBeTruthy();
    });
  });

  it('should demonstrate advanced item searching capabilities', async () => {
    const { repeaterHarness } = await setupTest();

    // Test exact string matching
    const exactMatch = await repeaterHarness.getRepeaterItems({
      titleText: '2019 Donor Appreciation Event',
    });
    expect(exactMatch.length).toBe(1);

    // Test partial string matching with regex
    const partialMatch = await repeaterHarness.getRepeaterItems({
      contentText: /gala/i,
    });
    expect(partialMatch.length).toBe(2); // Two items have "Gala" in content

    // Test content filtering
    const contentFilter = await repeaterHarness.getRepeaterItems({
      contentText: 'Event for all donors and families',
    });
    expect(contentFilter.length).toBe(1);
  });
});
