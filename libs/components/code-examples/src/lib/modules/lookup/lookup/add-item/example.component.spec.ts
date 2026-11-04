import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopSkyAnimations } from '@skyux/core';
import { SkyButtonHarness, SkyInputBoxHarness } from '@skyux/forms/testing';
import { SkyLookupHarness } from '@skyux/lookup/testing';
import { SkyModalHarness } from '@skyux/modals/testing';

import { of } from 'rxjs';

import { LookupAddItemExampleComponent } from './example.component';
import { DemoService } from './example.service';

describe('Lookup asynchronous search example', () => {
  let mockSvc!: jasmine.SpyObj<DemoService>;

  async function setupTest(): Promise<{
    lookupHarness: SkyLookupHarness;
    fixture: ComponentFixture<LookupAddItemExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(LookupAddItemExampleComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const lookupHarness = await (
      await loader.getHarness(
        SkyInputBoxHarness.with({ dataSkyId: 'favorite-names-field' }),
      )
    ).queryHarness(SkyLookupHarness);

    return { lookupHarness, fixture };
  }

  beforeEach(() => {
    // Create a mock search service. In a real-world application, the search
    // service would make a web request which should be avoided in unit tests.
    mockSvc = jasmine.createSpyObj<DemoService>('DemoService', [
      'addPerson',
      'search',
    ]);

    mockSvc.search.and.returnValue(
      of({ hasMore: false, people: [], totalCount: 0 }),
    );
    mockSvc.addPerson.and.callFake((person) => of([person]));

    TestBed.configureTestingModule({
      imports: [LookupAddItemExampleComponent],
      providers: [
        {
          provide: DemoService,
          useValue: mockSvc,
        },
        provideNoopSkyAnimations(),
      ],
    });
  });

  it('should set the expected initial value', async () => {
    const { lookupHarness } = await setupTest();

    await expectAsync(lookupHarness.getSelectionsText()).toBeResolvedTo([
      'Shirley',
    ]);
  });

  it('should update the form control when a favorite name is selected', async () => {
    const { lookupHarness, fixture } = await setupTest();

    mockSvc.search.and.callFake((searchText) =>
      of({
        hasMore: false,
        people:
          searchText === 'b'
            ? [
                {
                  id: '21',
                  name: 'Bernard',
                },
              ]
            : [],
        totalCount: 1,
      }),
    );

    await lookupHarness.enterText('b');
    await lookupHarness.selectSearchResult({
      text: 'Bernard',
    });

    expect(fixture.componentInstance.favoritesForm.value.favoriteNames).toEqual(
      [
        { id: '16', name: 'Shirley' },
        { id: '21', name: 'Bernard' },
      ],
    );
  });

  it('should respect the selection descriptor', async () => {
    const { lookupHarness } = await setupTest();

    mockSvc.search.and.callFake(() =>
      of({
        hasMore: false,
        people: [
          {
            id: '21',
            name: 'Bernard',
          },
        ],
        totalCount: 1,
      }),
    );

    await lookupHarness.clickShowMoreButton();

    const picker = await lookupHarness.getShowMorePicker();

    await expectAsync(picker.getSearchAriaLabel()).toBeResolvedTo(
      'Search names',
    );
    await expectAsync(picker.getSaveButtonAriaLabel()).toBeResolvedTo(
      'Select names',
    );
  });

  describe('add item modal', () => {
    async function openAddItemModal(
      fixture: ComponentFixture<LookupAddItemExampleComponent>,
      lookupHarness: SkyLookupHarness,
    ): Promise<{
      modalHarness: SkyModalHarness;
      nameInputBoxHarness: SkyInputBoxHarness;
      addButtonHarness: SkyButtonHarness;
    }> {
      // The add button is displayed in the lookup's search results dropdown.
      await lookupHarness.enterText('n');
      await lookupHarness.clickAddButton();

      const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

      return {
        modalHarness: await rootLoader.getHarness(SkyModalHarness),
        nameInputBoxHarness: await rootLoader.getHarness(
          SkyInputBoxHarness.with({ dataSkyId: 'add-item-name-field' }),
        ),
        addButtonHarness: await rootLoader.getHarness(
          SkyButtonHarness.with({ dataSkyId: 'add-item-button' }),
        ),
      };
    }

    it('should add a new name to the lookup', async () => {
      const { lookupHarness, fixture } = await setupTest();
      const { modalHarness, nameInputBoxHarness, addButtonHarness } =
        await openAddItemModal(fixture, lookupHarness);

      await expectAsync(modalHarness.getHeadingText()).toBeResolvedTo(
        'Add Item',
      );

      await (
        await nameInputBoxHarness.querySelector('input')
      ).sendKeys('Newman');
      await addButtonHarness.click();

      expect(mockSvc.addPerson.calls.mostRecent().args[0]).toEqual(
        jasmine.objectContaining({ name: 'Newman' }),
      );
      await expectAsync(lookupHarness.getSelectionsText()).toBeResolvedTo([
        'Shirley',
        'Newman',
      ]);
    });

    it('should require a name before adding', async () => {
      const { lookupHarness, fixture } = await setupTest();
      const { nameInputBoxHarness, addButtonHarness } = await openAddItemModal(
        fixture,
        lookupHarness,
      );

      await addButtonHarness.click();

      await expectAsync(nameInputBoxHarness.hasRequiredError()).toBeResolvedTo(
        true,
      );
      expect(mockSvc.addPerson.calls.count()).toBe(0);
    });
  });
});
