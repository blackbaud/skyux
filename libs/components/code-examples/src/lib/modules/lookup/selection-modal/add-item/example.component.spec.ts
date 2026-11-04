import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopSkyAnimations } from '@skyux/core';
import { SkyButtonHarness, SkyInputBoxHarness } from '@skyux/forms/testing';
import { SkySelectionModalHarness } from '@skyux/lookup/testing';

import { of } from 'rxjs';

import { LookupSelectionModalAddItemExampleComponent } from './example.component';
import { ExampleService } from './example.service';

describe('Selection modal example', () => {
  let mockSvc: jasmine.SpyObj<ExampleService>;

  async function setupTest(): Promise<{
    harness: SkySelectionModalHarness;
    el: HTMLElement;
    fixture: ComponentFixture<LookupSelectionModalAddItemExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(
      LookupSelectionModalAddItemExampleComponent,
    );
    const el = fixture.nativeElement as HTMLElement;

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const openButtonHarness = await loader.getHarness(
      SkyButtonHarness.with({ dataSkyId: 'show-selection-modal-button' }),
    );

    await openButtonHarness.click();

    const harness = await rootLoader.getHarness(SkySelectionModalHarness);
    return { harness, el, fixture };
  }

  beforeEach(() => {
    // Create a mock search service. In a real-world application, the search
    // service would make a web request which should be avoided in unit tests.
    mockSvc = jasmine.createSpyObj<ExampleService>('ExampleService', [
      'addItem',
      'search',
    ]);

    mockSvc.search.and.callFake((searchText) => {
      return of({
        hasMore: false,
        people:
          searchText === 'ra'
            ? [
                {
                  id: '1',
                  name: 'Rachel',
                },
              ]
            : [],
        totalCount: 1,
      });
    });

    TestBed.configureTestingModule({
      imports: [LookupSelectionModalAddItemExampleComponent],
      providers: [
        { provide: ExampleService, useValue: mockSvc },
        provideNoopSkyAnimations(),
      ],
    });
  });

  it('should update the selected items list when an item is selected', async () => {
    const { harness, el } = await setupTest();

    await harness.enterSearchText('ra');
    await harness.selectSearchResult({
      contentText: 'Rachel',
    });
    await harness.saveAndClose();

    const selectedItemEls = el.querySelectorAll<HTMLLIElement>(
      '.selection-modal-example-selected li',
    );

    expect(selectedItemEls).toHaveSize(1);
    expect(selectedItemEls[0].innerText.trim()).toBe('Rachel');
  });

  it('should not update the selected items list when the user cancels the selection modal', async () => {
    const { harness, el } = await setupTest();

    await harness.enterSearchText('ra');
    await harness.selectSearchResult({
      contentText: 'Rachel',
    });
    await harness.cancel();

    const selectedItemEls = el.querySelectorAll<HTMLLIElement>(
      '.selection-modal-example-selected li',
    );

    expect(selectedItemEls).toHaveSize(0);
  });

  it('should respect the selection descriptor', async () => {
    const { harness } = await setupTest();

    await expectAsync(harness.getSearchAriaLabel()).toBeResolvedTo(
      'Search person',
    );
    await expectAsync(harness.getSaveButtonAriaLabel()).toBeResolvedTo(
      'Select person',
    );
  });

  describe('add item modal', () => {
    it('should select a newly added person', async () => {
      const { harness, el, fixture } = await setupTest();
      await harness.clickAddButton();

      const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
      const nameInputBoxHarness = await rootLoader.getHarness(
        SkyInputBoxHarness.with({ dataSkyId: 'add-item-name-field' }),
      );
      const addButtonHarness = await rootLoader.getHarness(
        SkyButtonHarness.with({ dataSkyId: 'add-item-button' }),
      );

      await (
        await nameInputBoxHarness.querySelector('input')
      ).sendKeys('Newman');
      await addButtonHarness.click();

      expect(mockSvc.addItem.calls.mostRecent().args[0]).toEqual(
        jasmine.objectContaining({ name: 'Newman' }),
      );

      await harness.saveAndClose();

      const selectedItemEls = el.querySelectorAll<HTMLLIElement>(
        '.selection-modal-example-selected li',
      );

      expect(selectedItemEls).toHaveSize(1);
      expect(selectedItemEls[0].innerText.trim()).toBe('Newman');
    });

    it('should require a name before adding', async () => {
      const { harness, fixture } = await setupTest();
      await harness.clickAddButton();

      const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
      const nameInputBoxHarness = await rootLoader.getHarness(
        SkyInputBoxHarness.with({ dataSkyId: 'add-item-name-field' }),
      );
      const addButtonHarness = await rootLoader.getHarness(
        SkyButtonHarness.with({ dataSkyId: 'add-item-button' }),
      );

      await addButtonHarness.click();

      await expectAsync(nameInputBoxHarness.hasRequiredError()).toBeResolvedTo(
        true,
      );
      expect(mockSvc.addItem.calls.count()).toBe(0);
    });
  });
});
