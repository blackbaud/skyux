import { Provider } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { SkyFilterState, SkyFilterStateService } from '@skyux/lists';
import {
  SkySelectionModalInstance,
  SkySelectionModalService,
} from '@skyux/lookup';
import {
  SkyConfirmInstance,
  SkyConfirmService,
  SkyModalInstance,
  SkyModalService,
} from '@skyux/modals';

import { BehaviorSubject, of } from 'rxjs';

import { SkyFilterBarTestComponent } from './fixtures/filter-bar.component.fixture';
import { SkyFilterBarFilterItem } from './models/filter-bar-filter-item';

describe('Filter bar component', () => {
  //#region helpers

  function getFilterPickerButton(): HTMLButtonElement | null {
    return fixture.nativeElement.querySelector('.sky-filter-bar-filter-picker');
  }

  function getClearFiltersButton(): HTMLButtonElement | null {
    return fixture.nativeElement.querySelector('.sky-filter-bar-clear-filters');
  }

  function getFilterItems(): Element[] {
    return Array.from(
      fixture.nativeElement.querySelectorAll('.sky-filter-item'),
    ) as Element[];
  }

  function getFilterItemLabel(el: Element): string {
    const nameElement = el.querySelector('.sky-filter-item-name');
    return nameElement?.textContent?.trim() || '';
  }

  //#endregion

  let component: SkyFilterBarTestComponent;
  let fixture: ComponentFixture<SkyFilterBarTestComponent>;
  let confirmServiceSpy: jasmine.SpyObj<SkyConfirmService>;
  let modalServiceSpy: jasmine.SpyObj<SkyModalService>;
  let selectionModalServiceSpy: jasmine.SpyObj<SkySelectionModalService>;

  // Common setup for all tests
  async function setupTestBed(includeFilterStateService = false): Promise<{
    filterStateServiceSpy: jasmine.SpyObj<SkyFilterStateService>;
    filterStateSubject: BehaviorSubject<SkyFilterState>;
  }> {
    confirmServiceSpy = jasmine.createSpyObj('SkyConfirmService', ['open']);
    modalServiceSpy = jasmine.createSpyObj('SkyModalService', ['open']);
    selectionModalServiceSpy = jasmine.createSpyObj(
      'SkySelectionModalService',
      ['open'],
    );

    const providers: Provider[] = [
      provideNoopAnimations(),
      { provide: SkyConfirmService, useValue: confirmServiceSpy },
      { provide: SkyModalService, useValue: modalServiceSpy },
      { provide: SkySelectionModalService, useValue: selectionModalServiceSpy },
    ];

    const filterStateSubject = new BehaviorSubject<SkyFilterState>({
      filters: [
        {
          filterId: '1',
          filterValue: { value: 'fs-value1' },
        },
      ],
      selectedFilterIds: ['1', '2'],
    });

    const filterStateServiceSpy = jasmine.createSpyObj(
      'SkyFilterStateService',
      ['updateDataState'],
      {
        dataStateChanges: filterStateSubject.asObservable(),
      },
    );

    if (includeFilterStateService) {
      providers.push({
        provide: SkyFilterStateService,
        useValue: filterStateServiceSpy,
      });
    }

    await TestBed.configureTestingModule({
      imports: [SkyFilterBarTestComponent],
      providers,
    }).compileComponents();

    fixture = TestBed.createComponent(SkyFilterBarTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    return { filterStateServiceSpy, filterStateSubject };
  }

  describe('basic functionality', () => {
    beforeEach(async () => {
      await setupTestBed();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display filter items from the model', async () => {
      await fixture.whenStable();
      const filterItems = getFilterItems();

      expect(filterItems.length).toBe(3);
      expect(getFilterItemLabel(filterItems[0])).toBe('filter 1');
      expect(getFilterItemLabel(filterItems[1])).toBe('filter 2');
      expect(getFilterItemLabel(filterItems[2])).toBe('filter 3');
    });

    it('should show/hide filter picker button based on selectedFilters', () => {
      // Initially shows since selectedFilters is set to ['1', '2', '3']
      expect(getFilterPickerButton()).toBeTruthy();

      component.selectedFilterIds.set(undefined);
      fixture.detectChanges();

      expect(getFilterPickerButton()).toBeFalsy();

      component.selectedFilterIds.set(['1']);
      fixture.detectChanges();

      expect(getFilterPickerButton()).toBeTruthy();
    });

    it('should handle selection modal workflow', () => {
      const closed$ = of({
        reason: 'save',
        selectedItems: [
          { id: '2', name: 'filter2' },
          { id: '5', name: 'filter5' },
        ],
      });
      selectionModalServiceSpy.open.and.returnValue({
        closed: closed$,
      } as SkySelectionModalInstance);

      getFilterPickerButton()?.click();

      expect(selectionModalServiceSpy.open).toHaveBeenCalled();
    });

    it('should handle no filters selected', () => {
      const closed$ = of({
        reason: 'save',
        selectedItems: [],
      });
      selectionModalServiceSpy.open.and.returnValue({
        closed: closed$,
      } as unknown as SkySelectionModalInstance);

      getFilterPickerButton()?.click();

      expect(selectionModalServiceSpy.open).toHaveBeenCalled();

      // When no filters are selected, selectedFilters should be undefined
      expect(component.selectedFilterIds()).toEqual([]);

      fixture.detectChanges();

      const filterItems = getFilterItems();
      expect(filterItems.length).toBe(0);
    });

    it('should handle deselecting filters with existing values', () => {
      // Set up initial state with multiple filters having values
      component.filters.set([
        { filterId: '1', filterValue: { value: 'value1' } },
        { filterId: '2', filterValue: { value: 'value2' } },
        { filterId: '3', filterValue: { value: 'value3' } },
      ]);
      fixture.detectChanges();

      // User deselects filter '2', keeping only '1' and '3'
      const closed$ = of({
        reason: 'save',
        selectedItems: [
          { filterId: '1', labelText: 'filter 1' },
          { filterId: '3', labelText: 'filter 3' },
        ],
      });
      selectionModalServiceSpy.open.and.returnValue({
        closed: closed$,
      } as SkySelectionModalInstance);

      getFilterPickerButton()?.click();

      expect(selectionModalServiceSpy.open).toHaveBeenCalled();

      // Verify selectedFilters is updated to only include selected items
      expect(component.selectedFilterIds()).toEqual(['1', '3']);

      // Verify the deselected filter's value is removed from filterValues
      const filterValues = component.filters();
      expect(filterValues?.length).toBe(2);
      expect(
        filterValues?.find((f) => f.filterId === '1')?.filterValue,
      ).toEqual({
        value: 'value1',
      });
      expect(
        filterValues?.find((f) => f.filterId === '3')?.filterValue,
      ).toEqual({
        value: 'value3',
      });
      expect(filterValues?.find((f) => f.filterId === '2')).toBeUndefined();
    });
  });

  describe('filter management', () => {
    beforeEach(async () => {
      await setupTestBed();
    });

    it('should update individual filter values', () => {
      const newFilterValue = { value: 'updated value' };

      // Set filter values directly on the model
      component.filters.set([{ filterId: '1', filterValue: newFilterValue }]);
      fixture.detectChanges();

      expect(component.filters()?.[0]?.filterValue).toEqual(newFilterValue);
    });

    it('should clear individual filter values', () => {
      // Set initial filter value
      component.filters.set([
        { filterId: '1', filterValue: { value: 'initial' } },
      ]);
      fixture.detectChanges();

      // Clear by setting to undefined
      component.filters.set(undefined);
      fixture.detectChanges();

      expect(component.filters()).toBeUndefined();
    });

    it('should show/hide clear filters button based on active filters', () => {
      // Initially no active filters
      expect(getClearFiltersButton()).toBeFalsy();

      // Add filter value
      component.filters.set([
        { filterId: '1', filterValue: { value: 'test' } },
      ]);
      fixture.detectChanges();

      expect(getClearFiltersButton()).toBeTruthy();
    });

    it('should clear all filters when confirmed', () => {
      // Set initial filter values
      component.filters.set([
        { filterId: '1', filterValue: { value: 'value1' } },
        { filterId: '2', filterValue: { value: 'value2' } },
      ]);
      fixture.detectChanges();

      const closed$ = of({ action: 'save' });
      confirmServiceSpy.open.and.returnValue({
        closed: closed$,
      } as SkyConfirmInstance);

      getClearFiltersButton()?.click();
      fixture.detectChanges();

      expect(component.filters()).toBeUndefined();
    });

    it('should not clear filters when cancelled', () => {
      const initialFilterValues: SkyFilterBarFilterItem[] = [
        { filterId: '1', filterValue: { value: 'value1' } },
      ];
      component.filters.set(initialFilterValues);
      fixture.detectChanges();

      const closed$ = of({ action: 'cancel' });
      confirmServiceSpy.open.and.returnValue({
        closed: closed$,
      } as SkyConfirmInstance);

      getClearFiltersButton()?.click();
      fixture.detectChanges();

      expect(component.filters()).toEqual(initialFilterValues);
    });
  });

  describe('integration workflow', () => {
    beforeEach(async () => {
      await setupTestBed();
    });

    it('should handle complete user workflow: add, update, clear', () => {
      // 1. Add filter value
      component.filters.set([
        { filterId: '1', filterValue: { value: 'test value' } },
      ]);
      fixture.detectChanges();

      expect(getClearFiltersButton()).toBeTruthy();

      // 2. Update filter value
      const newValue = { value: 'updated value' };
      component.filters.set([{ filterId: '1', filterValue: newValue }]);
      fixture.detectChanges();

      expect(component.filters()?.[0]?.filterValue).toEqual(newValue);

      // 3. Clear all filters
      const closed$ = of({ action: 'save' });
      confirmServiceSpy.open.and.returnValue({
        closed: closed$,
      } as SkyConfirmInstance);

      getClearFiltersButton()?.click();
      fixture.detectChanges();

      expect(component.filters()).toBeUndefined();
      fixture.detectChanges();
      expect(getClearFiltersButton()).toBeFalsy();
    });
  });

  describe('filter modal interactions', () => {
    beforeEach(async () => {
      await setupTestBed();
    });

    it('should update filter value when modal is saved with new data', () => {
      // Set up initial filter state
      component.filters.set([
        { filterId: '1', filterValue: { value: 'initial' } },
      ]);
      fixture.detectChanges();

      // Verify initial state
      const filterItems = getFilterItems();
      expect(filterItems.length).toBe(3);

      const initialValueElement = filterItems[0].querySelector(
        '.sky-filter-item-value',
      );
      expect(initialValueElement?.textContent?.trim()).toBe('initial');

      // Set up modal to return new value on save
      const newFilterValue = { value: 'new value from modal' };
      const closed$ = of({ reason: 'save', data: newFilterValue });
      modalServiceSpy.open.and.returnValue({
        closed: closed$,
      } as SkyModalInstance);

      // Click the filter item to open modal
      const filterButton = filterItems[0].querySelector(
        'button',
      ) as HTMLButtonElement;
      filterButton.click();

      expect(modalServiceSpy.open).toHaveBeenCalled();
      fixture.detectChanges();

      // Verify filter bar component state is updated
      expect(component.filters()?.[0]?.filterValue).toEqual(newFilterValue);

      // Verify DOM is updated
      const updatedFilterItems = getFilterItems();
      const valueElement = updatedFilterItems[0].querySelector(
        '.sky-filter-item-value',
      );
      expect(valueElement?.textContent?.trim()).toBe('new value from modal');
    });

    it('should handle modal with displayValue different from value', () => {
      // Set up initial filter state
      component.filters.set([
        { filterId: '1', filterValue: { value: 'code123' } },
      ]);
      fixture.detectChanges();

      // Set up modal to return value with displayValue
      const newFilterValue = {
        value: 'complex_filter_code',
        displayValue: 'User Friendly Display',
      };
      const closed$ = of({ reason: 'save', data: newFilterValue });
      modalServiceSpy.open.and.returnValue({
        closed: closed$,
      } as SkyModalInstance);

      // Click the filter item to open modal
      const filterItems = getFilterItems();
      const filterButton = filterItems[0].querySelector(
        'button',
      ) as HTMLButtonElement;
      filterButton.click();

      expect(modalServiceSpy.open).toHaveBeenCalled();
      fixture.detectChanges();

      // Verify filter bar component stores the complete value
      expect(component.filters()?.[0]?.filterValue).toEqual(newFilterValue);

      // Verify DOM shows the displayValue (not the raw value)
      const updatedFilterItems = getFilterItems();
      const valueElement = updatedFilterItems[0].querySelector(
        '.sky-filter-item-value',
      );
      expect(valueElement?.textContent?.trim()).toBe('User Friendly Display');
    });

    it('should not update filter value when modal is cancelled', () => {
      // Set up initial filter state
      const initialValue = { value: 'original value' };
      component.filters.set([{ filterId: '1', filterValue: initialValue }]);
      fixture.detectChanges();

      // Verify initial state
      expect(component.filters()?.[0]?.filterValue).toEqual(initialValue);

      const filterItems = getFilterItems();
      const initialValueElement = filterItems[0].querySelector(
        '.sky-filter-item-value',
      );
      expect(initialValueElement?.textContent?.trim()).toBe('original value');

      // Set up modal to be cancelled
      const closed$ = of({ reason: 'cancel' });
      modalServiceSpy.open.and.returnValue({
        closed: closed$,
      } as SkyModalInstance);

      // Click the filter item to open modal
      const filterButton = filterItems[0].querySelector(
        'button',
      ) as HTMLButtonElement;
      filterButton.click();

      expect(modalServiceSpy.open).toHaveBeenCalled();
      fixture.detectChanges();

      // Verify nothing changed
      expect(component.filters()?.[0]?.filterValue).toEqual(initialValue);

      const unchangedFilterItems = getFilterItems();
      const unchangedValueElement = unchangedFilterItems[0].querySelector(
        '.sky-filter-item-value',
      );
      expect(unchangedValueElement?.textContent?.trim()).toBe('original value');
    });

    it('should open full screen modal when configured', () => {
      // Update the test component's modal config to be full screen
      component.modalConfig = {
        modalComponent: class TestModalComponent {},
        modalSize: 'full',
      };

      // Set up filter with a value
      component.filters.set([
        { filterId: '1', filterValue: { value: 'test' } },
      ]);
      fixture.detectChanges();

      // Set up modal response
      const closed$ = of({ reason: 'save', data: { value: 'updated' } });
      modalServiceSpy.open.and.returnValue({
        closed: closed$,
      } as SkyModalInstance);

      // Click the filter item to open modal
      const filterItems = getFilterItems();
      const filterButton = filterItems[0].querySelector(
        'button',
      ) as HTMLButtonElement;
      filterButton.click();

      // Verify modal was opened with fullPage option
      expect(modalServiceSpy.open).toHaveBeenCalledWith(
        component.modalConfig.modalComponent,
        jasmine.objectContaining({ fullPage: true }),
      );

      fixture.detectChanges();
      expect(component.filters()?.[0]?.filterValue).toEqual({
        value: 'updated',
      });
    });

    it('should persist other filter values when updating one filter among multiple', () => {
      // Set up initial state with multiple filters having values
      component.filters.set([
        { filterId: '1', filterValue: { value: 'filter1 value' } },
        { filterId: '2', filterValue: { value: 'filter2 value' } },
        { filterId: '3', filterValue: { value: 'filter3 value' } },
      ]);
      fixture.detectChanges();

      // Set up modal to update only the second filter
      const updatedFilterValue = { value: 'updated filter2 value' };
      const closed$ = of({ reason: 'save', data: updatedFilterValue });
      modalServiceSpy.open.and.returnValue({
        closed: closed$,
      } as SkyModalInstance);

      // Click the second filter item to open modal
      const filterItems = getFilterItems();
      const secondFilterButton = filterItems[1].querySelector(
        'button',
      ) as HTMLButtonElement;
      secondFilterButton.click();

      expect(modalServiceSpy.open).toHaveBeenCalled();
      fixture.detectChanges();

      // Verify the updated filter changed
      const updatedFilters = component.filters();
      expect(
        updatedFilters?.find((f) => f.filterId === '2')?.filterValue,
      ).toEqual(updatedFilterValue);

      // Verify other filters remained unchanged
      expect(
        updatedFilters?.find((f) => f.filterId === '1')?.filterValue,
      ).toEqual({
        value: 'filter1 value',
      });
      expect(
        updatedFilters?.find((f) => f.filterId === '3')?.filterValue,
      ).toEqual({
        value: 'filter3 value',
      });
      expect(updatedFilters?.length).toBe(3);
    });

    it('should handle clearing the only set filter', () => {
      // Set up initial state with only one filter having a value
      component.filters.set([
        { filterId: '2', filterValue: { value: 'only filter value' } },
      ]);
      fixture.detectChanges();

      // Verify initial state
      const initialFilterItems = getFilterItems();
      const initialValueElement = initialFilterItems[1].querySelector(
        '.sky-filter-item-value',
      );
      expect(initialValueElement?.textContent?.trim()).toBe(
        'only filter value',
      );
      expect(getClearFiltersButton()).toBeTruthy();

      // Set up modal to clear the filter (save with undefined/empty data)
      const closed$ = of({ reason: 'save', data: undefined });
      modalServiceSpy.open.and.returnValue({
        closed: closed$,
      } as SkyModalInstance);

      // Click the filter item to open modal
      const filterButton = initialFilterItems[1].querySelector(
        'button',
      ) as HTMLButtonElement;
      filterButton.click();

      expect(modalServiceSpy.open).toHaveBeenCalled();
      fixture.detectChanges();

      // Verify filter is cleared from component state
      const updatedFilters = component.filters();
      expect(updatedFilters).toBeUndefined();

      // Verify clear filters button is hidden
      expect(getClearFiltersButton()).toBeFalsy();

      // Verify DOM reflects the cleared state
      const updatedFilterItems = getFilterItems();
      const valueElement = updatedFilterItems[1].querySelector(
        '.sky-filter-item-value',
      );
      expect(valueElement).toBeFalsy(); // No value element should be present

      const updatedButton = updatedFilterItems[1].querySelector('button');
      expect(updatedButton?.getAttribute('aria-pressed')).toBe('false');
    });

    it('should handle setting a filter when no filters were previously set', () => {
      // Set up initial state with no filters set
      component.filters.set(undefined);
      fixture.detectChanges();

      // Verify initial state
      expect(component.filters()).toBeUndefined();
      expect(getClearFiltersButton()).toBeFalsy();

      const initialFilterItems = getFilterItems();
      const initialButton = initialFilterItems[0].querySelector('button');
      expect(initialButton?.getAttribute('aria-pressed')).toBe('false');

      // Set up modal to set a new filter value
      const newFilterValue = { value: 'first filter value' };
      const closed$ = of({ reason: 'save', data: newFilterValue });
      modalServiceSpy.open.and.returnValue({
        closed: closed$,
      } as SkyModalInstance);

      // Click the first filter item to open modal
      const filterButton = initialFilterItems[0].querySelector(
        'button',
      ) as HTMLButtonElement;
      filterButton.click();

      expect(modalServiceSpy.open).toHaveBeenCalled();
      fixture.detectChanges();

      // Verify filter is set in component state
      const updatedFilters = component.filters();
      expect(updatedFilters?.length).toBe(1);
      expect(updatedFilters?.[0]?.filterId).toBe('1');
      expect(updatedFilters?.[0]?.filterValue).toEqual(newFilterValue);

      // Verify clear filters button appears
      expect(getClearFiltersButton()).toBeTruthy();

      // Verify DOM reflects the new state
      const updatedFilterItems = getFilterItems();
      const valueElement = updatedFilterItems[0].querySelector(
        '.sky-filter-item-value',
      );
      expect(valueElement?.textContent?.trim()).toBe('first filter value');

      const updatedButton = updatedFilterItems[0].querySelector('button');
      expect(updatedButton?.getAttribute('aria-pressed')).toBe('true');
    });

    it('should handle setting a previously unset filter when other filters exist', () => {
      // Set up initial state with some filters set, but not the third one
      component.filters.set([
        { filterId: '1', filterValue: { value: 'existing filter1' } },
        { filterId: '2', filterValue: { value: 'existing filter2' } },
      ]);
      fixture.detectChanges();

      // Verify initial state
      const initialFilters = component.filters();
      expect(initialFilters?.length).toBe(2);
      expect(initialFilters?.find((f) => f.filterId === '3')).toBeUndefined();

      // Set up modal to set the third filter
      const newFilterValue = { value: 'new filter3 value' };
      const closed$ = of({ reason: 'save', data: newFilterValue });
      modalServiceSpy.open.and.returnValue({
        closed: closed$,
      } as SkyModalInstance);

      // Click the third filter item to open modal
      const filterItems = getFilterItems();
      const thirdFilterButton = filterItems[2].querySelector(
        'button',
      ) as HTMLButtonElement;
      thirdFilterButton.click();

      expect(modalServiceSpy.open).toHaveBeenCalled();
      fixture.detectChanges();

      // Verify the new filter is added and existing filters remain
      const updatedFilters = component.filters();
      expect(updatedFilters?.length).toBe(3);
      expect(
        updatedFilters?.find((f) => f.filterId === '3')?.filterValue,
      ).toEqual(newFilterValue);
      expect(
        updatedFilters?.find((f) => f.filterId === '1')?.filterValue,
      ).toEqual({
        value: 'existing filter1',
      });
      expect(
        updatedFilters?.find((f) => f.filterId === '2')?.filterValue,
      ).toEqual({
        value: 'existing filter2',
      });
    });

    it('should update DOM correctly when adding filter to existing filters', () => {
      // Set up initial state with some filters
      component.filters.set([
        { filterId: '1', filterValue: { value: 'existing filter1' } },
      ]);
      fixture.detectChanges();

      // Set up modal to add second filter
      const newFilterValue = { value: 'new filter2 value' };
      const closed$ = of({ reason: 'save', data: newFilterValue });
      modalServiceSpy.open.and.returnValue({
        closed: closed$,
      } as SkyModalInstance);

      // Click the second filter item
      const filterItems = getFilterItems();
      const secondFilterButton = filterItems[1].querySelector(
        'button',
      ) as HTMLButtonElement;
      secondFilterButton.click();
      fixture.detectChanges();

      // Verify DOM reflects the new filter
      const updatedFilterItems = getFilterItems();
      const secondValueElement = updatedFilterItems[1].querySelector(
        '.sky-filter-item-value',
      );
      expect(secondValueElement?.textContent?.trim()).toBe('new filter2 value');

      const secondButton = updatedFilterItems[1].querySelector('button');
      expect(secondButton?.getAttribute('aria-pressed')).toBe('true');
    });
  });

  describe('with filter state service', () => {
    let filterStateServiceSpy: jasmine.SpyObj<SkyFilterStateService>;
    let filterStateSubject: BehaviorSubject<SkyFilterState>;

    beforeEach(async () => {
      const setup = await setupTestBed(true);
      filterStateServiceSpy = setup.filterStateServiceSpy;
      filterStateSubject = setup.filterStateSubject;
    });

    it('should use filter state service filters over model filters', () => {
      const filterItems = getFilterItems();

      expect(filterItems.length).toBe(2);
      const firstItemValue = filterItems[0].querySelector(
        '.sky-filter-item-value',
      );
      expect(firstItemValue?.textContent?.trim()).toBe('fs-value1');

      // Second filter should not have a value element since filterValue is undefined
      const secondItemValue = filterItems[1].querySelector(
        '.sky-filter-item-value',
      );
      expect(secondItemValue).toBeFalsy();
    });

    it('should update filter state service when filters change', () => {
      // Simulate filter being updated
      const filterItems = getFilterItems();
      const newFilterValue = { value: 'updated value' };
      const closed$ = of({ reason: 'save', data: newFilterValue });
      modalServiceSpy.open.and.returnValue({
        closed: closed$,
      } as SkyModalInstance);

      // Click the first filter item to open modal
      const filterButton = filterItems[0].querySelector(
        'button',
      ) as HTMLButtonElement;
      filterButton.click();
      fixture.detectChanges();

      expect(filterStateServiceSpy.updateDataState).toHaveBeenCalledWith({
        filters: [{ filterId: '1', filterValue: newFilterValue }],
        selectedFilterIds: jasmine.any(Array),
      });
    });

    it('should sync filter state service changes to component model', () => {
      const newFilterState: SkyFilterState = {
        filters: [
          {
            filterId: 'synced-filter',
            filterValue: { value: 'synced value' },
          },
        ],
        selectedFilterIds: ['synced-filter'],
      };

      filterStateSubject.next(newFilterState);
      fixture.detectChanges();

      expect(component.filters()).toEqual(newFilterState.filters);
      expect(component.selectedFilterIds()).toEqual(
        newFilterState.selectedFilterIds,
      );
    });

    it('should clear filters through filter state service', () => {
      // Set up initial filters
      component.filters.set([
        { filterId: '1', filterValue: { value: 'test' } },
      ]);
      fixture.detectChanges();

      const closed$ = of({ action: 'save' });
      confirmServiceSpy.open.and.returnValue({
        closed: closed$,
      } as SkyConfirmInstance);

      getClearFiltersButton()?.click();
      fixture.detectChanges();

      expect(filterStateServiceSpy.updateDataState).toHaveBeenCalledWith({
        filters: undefined,
        selectedFilterIds: jasmine.any(Array),
      });
    });

    it('should show clear button when filter state service has active filters', () => {
      // Filter state service has filters with values, so clear button should be visible
      expect(getClearFiltersButton()).toBeTruthy();
    });

    it('should update selected filter IDs when filters are selected/deselected', () => {
      const closed$ = of({
        reason: 'save',
        selectedItems: [
          { filterId: '1', labelText: 'filter 1' },
          { filterId: '3', labelText: 'filter 3' },
        ],
      });
      selectionModalServiceSpy.open.and.returnValue({
        closed: closed$,
      } as SkySelectionModalInstance);

      const filterPickerButton = getFilterPickerButton();
      filterPickerButton?.click();

      expect(filterStateServiceSpy.updateDataState).toHaveBeenCalledWith({
        filters: jasmine.any(Array),
        selectedFilterIds: ['1', '3'],
      });
    });
  });
});
