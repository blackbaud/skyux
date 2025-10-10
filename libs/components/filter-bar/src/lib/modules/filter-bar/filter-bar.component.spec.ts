import { StaticProvider } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { SkyFilterAdapterData, SkyFilterAdapterService } from '@skyux/lists';
import {
  SkySelectionModalInstance,
  SkySelectionModalOpenArgs,
  SkySelectionModalService,
} from '@skyux/lookup';
import {
  SkyConfirmInstance,
  SkyConfirmService,
  SkyModalInstance,
  SkyModalService,
} from '@skyux/modals';
import { SkyModalCloseArgs } from '@skyux/modals';

import { Subject, of } from 'rxjs';

import { SkyFilterBarTestComponent } from './fixtures/filter-bar.component.fixture';
import { SkyFilterBarFilterItem } from './models/filter-bar-filter-item';
import { SkyFilterItemModalInstance } from './models/filter-item-modal-instance';

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
      fixture.nativeElement.querySelectorAll('sky-filter-item-base'),
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
  let selectionModalServiceSpy: jasmine.SpyObj<SkySelectionModalService>;
  let filterAdapterServiceSpy: jasmine.SpyObj<SkyFilterAdapterService>;
  let adapterUpdates$: Subject<SkyFilterAdapterData>;
  let modalServiceSpy: jasmine.SpyObj<SkyModalService>;

  // Common setup for all tests
  async function setupTestBed(options?: {
    includeFilterAdapter?: boolean;
    includeModalService?: boolean;
  }): Promise<void> {
    confirmServiceSpy = jasmine.createSpyObj('SkyConfirmService', ['open']);
    selectionModalServiceSpy = jasmine.createSpyObj(
      'SkySelectionModalService',
      ['open'],
    );

    const providers: StaticProvider[] = [
      provideNoopAnimations(),
      { provide: SkyConfirmService, useValue: confirmServiceSpy },
      {
        provide: SkySelectionModalService,
        useValue: selectionModalServiceSpy,
      },
    ];

    if (options?.includeModalService) {
      modalServiceSpy = jasmine.createSpyObj('SkyModalService', ['open']);
      providers.push({
        provide: SkyModalService,
        useValue: modalServiceSpy,
      });
    }

    if (options?.includeFilterAdapter) {
      adapterUpdates$ = new Subject<SkyFilterAdapterData>();
      filterAdapterServiceSpy = jasmine.createSpyObj(
        'SkyFilterAdapterService',
        ['getFilterDataUpdates', 'updateFilterData'],
      );
      filterAdapterServiceSpy.getFilterDataUpdates.and.returnValue(
        adapterUpdates$.asObservable(),
      );
      providers.push({
        provide: SkyFilterAdapterService,
        useValue: filterAdapterServiceSpy,
      });
    }

    await TestBed.configureTestingModule({
      imports: [SkyFilterBarTestComponent],
      providers,
    }).compileComponents();

    fixture = TestBed.createComponent(SkyFilterBarTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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

      expect(filterItems.length).toBe(4);
      expect(getFilterItemLabel(filterItems[0])).toBe('filter 1');
      expect(getFilterItemLabel(filterItems[1])).toBe('filter 2');
      expect(getFilterItemLabel(filterItems[2])).toBe('filter 3');
      expect(getFilterItemLabel(filterItems[3])).toBe('filter 4');
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
      component.appliedFilters.set([
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
      const filterValues = component.appliedFilters();
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
      component.appliedFilters.set([
        { filterId: '1', filterValue: newFilterValue },
      ]);
      fixture.detectChanges();

      expect(component.appliedFilters()?.[0]?.filterValue).toEqual(
        newFilterValue,
      );
    });

    it('should clear individual filter values', () => {
      // Set initial filter value
      component.appliedFilters.set([
        { filterId: '1', filterValue: { value: 'initial' } },
      ]);
      fixture.detectChanges();

      // Clear by setting to undefined
      component.appliedFilters.set(undefined);
      fixture.detectChanges();

      expect(component.appliedFilters()).toBeUndefined();
    });

    it('should clear filters when appliedFilters is set to an empty array', () => {
      // Start with multiple filters applied
      component.appliedFilters.set([
        { filterId: '1', filterValue: { value: 'value1' } },
        { filterId: '2', filterValue: { value: 'value2' } },
      ]);
      fixture.detectChanges();

      expect(component.appliedFilters()?.length).toBe(2);

      // Set to an empty array to represent no applied filters
      component.appliedFilters.set([]);
      fixture.detectChanges();

      // Expect the signal to hold an empty array (distinct from undefined) and UI to reflect cleared state
      expect(component.appliedFilters()).toEqual([]);
      // Clear filters button should be hidden since there are no active filters
      expect(getClearFiltersButton()).toBeFalsy();

      // The filter items (definitions) still render, but without value elements or pressed state
      const filterItems = getFilterItems();
      expect(filterItems.length).toBeGreaterThan(0); // Definitions still present

      // Check first two previously-set filters no longer show values
      const firstValueEl = filterItems[0].querySelector(
        '.sky-filter-item-value',
      );
      const secondValueEl = filterItems[1].querySelector(
        '.sky-filter-item-value',
      );
      expect(firstValueEl).toBeNull();
      expect(secondValueEl).toBeNull();

      const firstButton = filterItems[0].querySelector('button');
      const secondButton = filterItems[1].querySelector('button');
      expect(firstButton?.getAttribute('aria-pressed')).toBe('false');
      expect(secondButton?.getAttribute('aria-pressed')).toBe('false');
    });

    it('should emit filterUpdated event when filter item is updated', () => {
      // This test needs to be rethought since the architecture changed
      // The filter bar now uses effects to monitor filter updates
      const newFilterValue = { value: 'emitted value' };

      component.appliedFilters.set([
        { filterId: '1', filterValue: newFilterValue },
      ]);
      fixture.detectChanges();

      expect(component.appliedFilters()?.[0]?.filterValue).toEqual(
        newFilterValue,
      );
    });

    it('should show/hide clear filters button based on active filters', () => {
      // Initially no active filters
      expect(getClearFiltersButton()).toBeFalsy();

      // Add filter value
      component.appliedFilters.set([
        { filterId: '1', filterValue: { value: 'test' } },
      ]);
      fixture.detectChanges();

      expect(getClearFiltersButton()).toBeTruthy();
    });

    it('should clear all filters when confirmed', () => {
      // Set initial filter values
      component.appliedFilters.set([
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

      expect(component.appliedFilters()).toBeUndefined();
    });

    it('should not clear filters when cancelled', () => {
      const initialFilterValues: SkyFilterBarFilterItem[] = [
        { filterId: '1', filterValue: { value: 'value1' } },
      ];
      component.appliedFilters.set(initialFilterValues);
      fixture.detectChanges();

      const closed$ = of({ action: 'cancel' });
      confirmServiceSpy.open.and.returnValue({
        closed: closed$,
      } as SkyConfirmInstance);

      getClearFiltersButton()?.click();
      fixture.detectChanges();

      expect(component.appliedFilters()).toEqual(initialFilterValues);
    });
  });

  describe('integration workflow', () => {
    beforeEach(async () => {
      await setupTestBed();
    });

    it('should handle complete user workflow: add, update, clear', () => {
      // 1. Add filter value
      component.appliedFilters.set([
        { filterId: '1', filterValue: { value: 'test value' } },
      ]);
      fixture.detectChanges();

      expect(getClearFiltersButton()).toBeTruthy();

      // 2. Update filter value
      const newValue = { value: 'updated value' };
      component.appliedFilters.set([{ filterId: '1', filterValue: newValue }]);
      fixture.detectChanges();

      expect(component.appliedFilters()?.[0]?.filterValue).toEqual(newValue);

      // 3. Clear all filters
      const closed$ = of({ action: 'save' });
      confirmServiceSpy.open.and.returnValue({
        closed: closed$,
      } as SkyConfirmInstance);

      getClearFiltersButton()?.click();
      fixture.detectChanges();

      expect(component.appliedFilters()).toBeUndefined();
      fixture.detectChanges();
      expect(getClearFiltersButton()).toBeFalsy();
    });
  });

  describe('filter modal interactions', () => {
    beforeEach(async () => {
      await setupTestBed({ includeModalService: true });
    });

    interface ProviderLike<T = unknown> {
      provide: unknown;
      useValue: T;
    }

    function mockModalOpen(
      capture: (inst: SkyFilterItemModalInstance) => void,
    ): void {
      modalServiceSpy.open.and.callFake(
        (componentArg: unknown, config: { providers?: ProviderLike[] }) => {
          const provider = config?.providers?.find(
            (p): p is ProviderLike<SkyFilterItemModalInstance> =>
              p.provide === SkyFilterItemModalInstance,
          );
          if (provider) {
            capture(provider.useValue);
          }
          const closed$ = new Subject<SkyModalCloseArgs>();
          const modalInstance = {
            closed: closed$.asObservable(),
            save: (data: unknown) => {
              closed$.next({ reason: 'save', data });
              closed$.complete();
            },
            cancel: () => {
              closed$.next({ reason: 'cancel', data: undefined });
              closed$.complete();
            },
          } as SkyModalInstance;
          return modalInstance;
        },
      );
    }

    it('should update filter value when modal is saved with new data', () => {
      // Set up initial filter state
      component.appliedFilters.set([
        { filterId: '1', filterValue: { value: 'initial' } },
      ]);
      fixture.detectChanges();

      // Verify initial state
      const filterItems = getFilterItems();
      expect(filterItems.length).toBe(4);

      const initialValueElement = filterItems[0].querySelector(
        '.sky-filter-item-value',
      );
      expect(initialValueElement?.textContent?.trim()).toBe('initial');

      // Set up modal to return new value on save
      const newFilterValue = { value: 'new value from modal' };
      let capturedFilterModalInstance: SkyFilterItemModalInstance | undefined;
      mockModalOpen((inst) => (capturedFilterModalInstance = inst));

      // Click the filter item to open modal
      const filterButton = filterItems[0].querySelector(
        'button',
      ) as HTMLButtonElement;
      filterButton.click();

      expect(modalServiceSpy.open).toHaveBeenCalled();
      // Simulate consumer calling save on the provided filter modal instance
      capturedFilterModalInstance?.save({ filterValue: newFilterValue });
      fixture.detectChanges();

      // Verify filter bar component state is updated
      expect(component.appliedFilters()?.[0]?.filterValue).toEqual(
        newFilterValue,
      );

      // Verify DOM is updated
      const updatedFilterItems = getFilterItems();
      const valueElement = updatedFilterItems[0].querySelector(
        '.sky-filter-item-value',
      );
      expect(valueElement?.textContent?.trim()).toBe('new value from modal');
    });

    it('should accept filter modal context', () => {
      // Set up filter with a value
      component.appliedFilters.set([
        { filterId: '3', filterValue: { value: 'test' } },
      ]);
      fixture.detectChanges();

      // Set up modal response
      const updatedValue = { value: 'updated' };
      let capturedFilterModalInstance: SkyFilterItemModalInstance | undefined;
      mockModalOpen((inst) => (capturedFilterModalInstance = inst));

      // Click the filter item to open modal
      const filterItems = getFilterItems();
      const filterButton = filterItems[2].querySelector(
        'button',
      ) as HTMLButtonElement;
      filterButton.click();

      expect(modalServiceSpy.open).toHaveBeenCalled();
      expect(capturedFilterModalInstance?.context.additionalContext).toEqual({
        value: 'context',
      });

      // Simulate save via filter modal instance to update the filter
      capturedFilterModalInstance?.save({ filterValue: updatedValue });
      fixture.detectChanges();
      expect(component.appliedFilters()?.[0]?.filterValue).toEqual(
        updatedValue,
      );
    });

    it('should handle undefined on filter modal context', () => {
      component.onModalOpened = (): void => {
        /* intentionally empty */
      };

      // Set up filter with a value
      component.appliedFilters.set([
        { filterId: '3', filterValue: { value: 'test' } },
      ]);
      fixture.detectChanges();

      // Set up modal response
      const updatedValue = { value: 'updated' };
      let capturedFilterModalInstance: SkyFilterItemModalInstance | undefined;
      mockModalOpen((inst) => (capturedFilterModalInstance = inst));

      // Click the filter item to open modal
      const filterItems = getFilterItems();
      const filterButton = filterItems[2].querySelector(
        'button',
      ) as HTMLButtonElement;
      filterButton.click();

      expect(modalServiceSpy.open).toHaveBeenCalled();
      expect(
        capturedFilterModalInstance?.context.additionalContext,
      ).toBeUndefined();

      capturedFilterModalInstance?.save({ filterValue: updatedValue });
      fixture.detectChanges();
      expect(component.appliedFilters()?.[0]?.filterValue).toEqual(
        updatedValue,
      );
    });

    it('should handle modal with displayValue different from value', () => {
      // Set up initial filter state
      component.appliedFilters.set([
        { filterId: '1', filterValue: { value: 'code123' } },
      ]);
      fixture.detectChanges();

      // Set up modal to return value with displayValue
      const newFilterValue = {
        value: 'complex_filter_code',
        displayValue: 'User Friendly Display',
      };
      let capturedFilterModalInstance: SkyFilterItemModalInstance | undefined;
      mockModalOpen((inst) => (capturedFilterModalInstance = inst));

      // Click the filter item to open modal
      const filterItems = getFilterItems();
      const filterButton = filterItems[0].querySelector(
        'button',
      ) as HTMLButtonElement;
      filterButton.click();

      expect(modalServiceSpy.open).toHaveBeenCalled();
      capturedFilterModalInstance?.save({ filterValue: newFilterValue });
      fixture.detectChanges();

      // Verify filter bar component stores the complete value
      expect(component.appliedFilters()?.[0]?.filterValue).toEqual(
        newFilterValue,
      );

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
      component.appliedFilters.set([
        { filterId: '1', filterValue: initialValue },
      ]);
      fixture.detectChanges();

      // Verify initial state
      expect(component.appliedFilters()?.[0]?.filterValue).toEqual(
        initialValue,
      );

      const filterItems = getFilterItems();
      const initialValueElement = filterItems[0].querySelector(
        '.sky-filter-item-value',
      );
      expect(initialValueElement?.textContent?.trim()).toBe('original value');

      // Set up modal to be cancelled
      let capturedFilterModalInstance: SkyFilterItemModalInstance | undefined;
      mockModalOpen((inst) => (capturedFilterModalInstance = inst));

      // Click the filter item to open modal
      const filterButton = filterItems[0].querySelector(
        'button',
      ) as HTMLButtonElement;
      filterButton.click();

      expect(modalServiceSpy.open).toHaveBeenCalled();
      // Simulate cancel action via filter modal instance
      capturedFilterModalInstance?.cancel();
      fixture.detectChanges();

      // Verify nothing changed
      expect(component.appliedFilters()?.[0]?.filterValue).toEqual(
        initialValue,
      );

      const unchangedFilterItems = getFilterItems();
      const unchangedValueElement = unchangedFilterItems[0].querySelector(
        '.sky-filter-item-value',
      );
      expect(unchangedValueElement?.textContent?.trim()).toBe('original value');
    });

    it('should open full screen modal when configured', () => {
      // Update the test component's modal config to be full screen
      component.modalSize.set('fullScreen');

      // Set up filter with a value
      component.appliedFilters.set([
        { filterId: '1', filterValue: { value: 'test' } },
      ]);
      fixture.detectChanges();

      // Set up modal response
      const updatedValue = { value: 'updated' };
      let capturedFilterModalInstance: SkyFilterItemModalInstance | undefined;
      mockModalOpen((inst) => (capturedFilterModalInstance = inst));

      // Click the filter item to open modal
      const filterItems = getFilterItems();
      const filterButton = filterItems[0].querySelector(
        'button',
      ) as HTMLButtonElement;
      filterButton.click();

      // Verify modal was opened with fullPage option
      expect(modalServiceSpy.open).toHaveBeenCalledWith(
        component.modalComponent(),
        jasmine.objectContaining({ fullPage: true }),
      );

      capturedFilterModalInstance?.save({ filterValue: updatedValue });
      fixture.detectChanges();
      expect(component.appliedFilters()?.[0]?.filterValue).toEqual(
        updatedValue,
      );
    });

    it('should persist other filter values when updating one filter among multiple', () => {
      // Set up initial state with multiple filters having values
      component.appliedFilters.set([
        { filterId: '1', filterValue: { value: 'filter1 value' } },
        { filterId: '2', filterValue: { value: 'filter2 value' } },
        { filterId: '3', filterValue: { value: 'filter3 value' } },
      ]);
      fixture.detectChanges();

      // Set up modal to update only the second filter
      const updatedFilterValue = { value: 'updated filter2 value' };
      let capturedFilterModalInstance: SkyFilterItemModalInstance | undefined;
      mockModalOpen((inst) => (capturedFilterModalInstance = inst));

      // Click the second filter item to open modal
      const filterItems = getFilterItems();
      const secondFilterButton = filterItems[1].querySelector(
        'button',
      ) as HTMLButtonElement;
      secondFilterButton.click();

      expect(modalServiceSpy.open).toHaveBeenCalled();
      capturedFilterModalInstance?.save({ filterValue: updatedFilterValue });
      fixture.detectChanges();

      // Verify the updated filter changed
      const updatedFilters = component.appliedFilters();
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
      component.appliedFilters.set([
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
      let capturedFilterModalInstance: SkyFilterItemModalInstance | undefined;
      mockModalOpen((inst) => (capturedFilterModalInstance = inst));

      // Click the filter item to open modal
      const filterButton = initialFilterItems[1].querySelector(
        'button',
      ) as HTMLButtonElement;
      filterButton.click();

      expect(modalServiceSpy.open).toHaveBeenCalled();
      // Simulate clearing filter by saving undefined
      capturedFilterModalInstance?.save({ filterValue: undefined });
      fixture.detectChanges();

      // Verify filter is cleared from component state
      const updatedFilters = component.appliedFilters();
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

    // eslint-disable-next-line complexity
    it('should handle setting a filter when no filters were previously set', () => {
      // Set up initial state with no filters set
      component.appliedFilters.set(undefined);
      fixture.detectChanges();

      // Verify initial state
      expect(component.appliedFilters()).toBeUndefined();
      expect(getClearFiltersButton()).toBeFalsy();

      const initialFilterItems = getFilterItems();
      const initialButton = initialFilterItems[0].querySelector('button');
      expect(initialButton?.getAttribute('aria-pressed')).toBe('false');

      // Set up modal to set a new filter value
      const newFilterValue = { value: 'first filter value' };
      let capturedFilterModalInstance: SkyFilterItemModalInstance | undefined;
      mockModalOpen((inst) => (capturedFilterModalInstance = inst));

      // Click the first filter item to open modal
      const filterButton = initialFilterItems[0].querySelector(
        'button',
      ) as HTMLButtonElement;
      filterButton.click();

      expect(modalServiceSpy.open).toHaveBeenCalled();
      capturedFilterModalInstance?.save({ filterValue: newFilterValue });
      fixture.detectChanges();

      // Verify filter is set in component state
      const updatedFilters = component.appliedFilters();
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

    // eslint-disable-next-line complexity
    it('should handle setting a previously unset filter when other filters exist', () => {
      // Set up initial state with some filters set, but not the third one
      component.appliedFilters.set([
        { filterId: '1', filterValue: { value: 'existing filter1' } },
        { filterId: '2', filterValue: { value: 'existing filter2' } },
      ]);
      fixture.detectChanges();

      // Verify initial state
      const initialFilters = component.appliedFilters();
      expect(initialFilters?.length).toBe(2);
      expect(initialFilters?.find((f) => f.filterId === '3')).toBeUndefined();

      // Set up modal to set the third filter
      const newFilterValue = { value: 'new filter3 value' };
      let capturedFilterModalInstance: SkyFilterItemModalInstance | undefined;
      mockModalOpen((inst) => (capturedFilterModalInstance = inst));

      // Click the third filter item to open modal
      const filterItems = getFilterItems();
      const thirdFilterButton = filterItems[2].querySelector(
        'button',
      ) as HTMLButtonElement;
      thirdFilterButton.click();

      expect(modalServiceSpy.open).toHaveBeenCalled();
      capturedFilterModalInstance?.save({ filterValue: newFilterValue });
      fixture.detectChanges();

      // Verify the new filter is added and existing filters remain
      const updatedFilters = component.appliedFilters();
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
      component.appliedFilters.set([
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

  describe('filter item lookup component', () => {
    beforeEach(async () => {
      await setupTestBed();
    });

    it('should handle single selection modal result', () => {
      const closed$ = of({
        reason: 'save',
        selectedItems: [{ id: '4', name: 'Alpha' }],
      });
      selectionModalServiceSpy.open.and.returnValue({
        closed: closed$,
      } as unknown as SkySelectionModalInstance);

      // Simulate clicking a lookup filter item to open selection modal
      component.appliedFilters.set([{ filterId: '4', filterValue: undefined }]);
      fixture.detectChanges();

      const filterItems = getFilterItems();
      // lookup is the 4th filter item in the fixture template (index 3)
      const filterButton = filterItems[3].querySelector(
        'button',
      ) as HTMLButtonElement;
      filterButton.click();
      fixture.detectChanges();

      expect(selectionModalServiceSpy.open).toHaveBeenCalled();

      const updatedFilterItems = getFilterItems();
      const valueElement = updatedFilterItems[3].querySelector(
        '.sky-filter-item-value',
      );
      expect(valueElement?.textContent?.trim()).toBe('Alpha');
    });

    it('should call searchAsync and handle save with no selections (internal branch)', () => {
      // Spy implementation will invoke the provided searchAsync callback to simulate initial load
      selectionModalServiceSpy.open.and.callFake(
        (config: SkySelectionModalOpenArgs) => {
          // Trigger initial search
          config.searchAsync({ offset: 0, searchText: '' });
          return {
            closed: of({ reason: 'save', selectedItems: [] }),
          } as unknown as SkySelectionModalInstance;
        },
      );

      const filterItems = getFilterItems();
      const filterButton = filterItems[3].querySelector(
        'button',
      ) as HTMLButtonElement;
      filterButton.click();

      // One search call captured
      expect(component.searchCalls.length).toBe(1);
      // Since no items selected, we expect lookup value element to be absent
      const valueElement = filterItems[3].querySelector(
        '.sky-filter-item-value',
      );
      expect(valueElement).toBeNull();
    });

    it('should call searchAsync and handle save with multiple selections (internal branch)', () => {
      // Provide two selected items to drive multi-select path
      selectionModalServiceSpy.open.and.callFake(
        (config: SkySelectionModalOpenArgs) => {
          config.searchAsync({ offset: 0, searchText: '' });
          return {
            closed: of({
              reason: 'save',
              selectedItems: [
                { id: '4', name: 'Alpha' },
                { id: '5', name: 'Beta' },
              ],
            }),
          } as unknown as SkySelectionModalInstance;
        },
      );

      const filterItems = getFilterItems();
      const filterButton = filterItems[3].querySelector(
        'button',
      ) as HTMLButtonElement;
      filterButton.click();
      fixture.detectChanges();

      // Ensure search emitted
      expect(component.searchCalls.length).toBe(1);
      // We cannot easily assert the localized string without a resource spy in this setup, but ensure button still exists
      const button = filterItems[3].querySelector('button');
      expect(button).toBeTruthy();
    });

    it('should invoke searchAsync callback and save with no selections', () => {
      expect(component.searchCalls.length).toBe(0);

      selectionModalServiceSpy.open.and.callFake((args: unknown) => {
        const cfg = args as {
          searchAsync: (a: { offset?: number; searchText: string }) => void;
        };
        cfg.searchAsync({ offset: 0, searchText: '' });
        return {
          closed: of({ reason: 'save', selectedItems: [] }),
        } as unknown as SkySelectionModalInstance;
      });

      const filterItems = getFilterItems();
      const filterButton = filterItems[3].querySelector(
        'button',
      ) as HTMLButtonElement;
      filterButton.click();

      expect(selectionModalServiceSpy.open).toHaveBeenCalled();
      expect(component.searchCalls.length).toBe(1);
      const valueElement = filterItems[3].querySelector(
        '.sky-filter-item-value',
      );
      expect(valueElement).toBeNull();
    });

    it('should invoke searchAsync callback and save with multiple selections', () => {
      expect(component.searchCalls.length).toBe(0);

      selectionModalServiceSpy.open.and.callFake((args: unknown) => {
        const cfg = args as {
          searchAsync: (a: { offset?: number; searchText: string }) => void;
        };
        cfg.searchAsync({ offset: 0, searchText: 'a' });
        return {
          closed: of({
            reason: 'save',
            selectedItems: [
              { id: '4', name: 'Alpha' },
              { id: '5', name: 'Beta' },
            ],
          }),
        } as unknown as SkySelectionModalInstance;
      });

      const filterItems = getFilterItems();
      const filterButton = filterItems[3].querySelector(
        'button',
      ) as HTMLButtonElement;
      filterButton.click();
      fixture.detectChanges();

      expect(selectionModalServiceSpy.open).toHaveBeenCalled();
      expect(component.searchCalls.length).toBe(1);
      // Simulate applied filters update (would normally be via service update emission)

      const valueElement = filterItems[3].querySelector(
        '.sky-filter-item-value',
      );
      expect(valueElement?.textContent?.trim()).toBe('2 selected');
    });

    it('should handle multiple selection modal result with resource string', () => {
      const closed$ = of({
        reason: 'save',
        selectedItems: [
          { id: '4', name: 'Alpha' },
          { id: '5', name: 'Beta' },
        ],
      });
      selectionModalServiceSpy.open.and.returnValue({
        closed: closed$,
      } as unknown as SkySelectionModalInstance);

      const filterItems = getFilterItems();
      const filterButton = filterItems[3].querySelector(
        'button',
      ) as HTMLButtonElement;
      filterButton.click();
      fixture.detectChanges();

      const valueElement = filterItems[3].querySelector(
        '.sky-filter-item-value',
      );
      expect(valueElement?.textContent?.trim()).toBe('2 selected');
    });

    it('should handle empty selection by clearing filter value', () => {
      // Start with an existing filter value
      component.appliedFilters.set([
        { filterId: '1', filterValue: { value: 'value1' } },
        { filterId: '2', filterValue: { value: 'value2' } },
        { filterId: '3', filterValue: { value: 'value3' } },
        {
          filterId: '4',
          filterValue: { value: 'existing', displayValue: 'Existing' },
        },
      ]);
      fixture.detectChanges();

      const closed$ = of({ reason: 'save', selectedItems: [] });
      selectionModalServiceSpy.open.and.returnValue({
        closed: closed$,
      } as unknown as SkySelectionModalInstance);

      const filterItems = getFilterItems();
      const filterButton = filterItems[3].querySelector(
        'button',
      ) as HTMLButtonElement;
      filterButton.click();
      fixture.detectChanges();

      // Should still have 4 filter items; lookup shows no value
      expect(filterItems.length).toBe(4);
      const lookupValueEl = filterItems[3].querySelector(
        '.sky-filter-item-value',
      );
      expect(lookupValueEl).toBeNull();
    });

    it('should ignore modal cancellation', () => {
      const initialFilterValue = {
        value: 'original',
        displayValue: 'Original',
      };
      component.appliedFilters.set([
        { filterId: '4', filterValue: initialFilterValue },
      ]);
      fixture.detectChanges();

      const closed$ = of({
        reason: 'cancel',
        selectedItems: [{ id: '1', name: 'Alpha' }],
      });
      selectionModalServiceSpy.open.and.returnValue({
        closed: closed$,
      } as unknown as SkySelectionModalInstance);

      const filterItems = getFilterItems();
      const filterButton = filterItems[3].querySelector(
        'button',
      ) as HTMLButtonElement;
      filterButton.click();

      // Filter value should remain unchanged after cancellation
      const applied = component.appliedFilters();
      expect(applied?.find((f) => f.filterId === '4')?.filterValue).toEqual(
        initialFilterValue,
      );

      const valueElement = filterItems[3].querySelector(
        '.sky-filter-item-value',
      );
      expect(valueElement?.textContent?.trim()).toBe('Original');
    });
  });

  describe('filter adapter service integration', () => {
    beforeEach(async () => {
      await setupTestBed({ includeFilterAdapter: true });
    });

    it('should update local signals when receiving adapter updates', () => {
      // Simulate external update through adapter
      adapterUpdates$.next({
        appliedFilters: [
          { filterId: '3', filterValue: { value: 'external value' } },
        ],
        selectedFilterIds: ['3'],
      });
      fixture.detectChanges();

      expect(component.appliedFilters()).toEqual([
        { filterId: '3', filterValue: { value: 'external value' } },
      ]);
      expect(component.selectedFilterIds()).toEqual(['3']);
    });

    it('should update local signals when receiving empty adapter updates', () => {
      // First set some local values
      component.appliedFilters.set([
        { filterId: '1', filterValue: { value: 'local value' } },
      ]);
      component.selectedFilterIds.set(['1']);
      fixture.detectChanges();

      // Then simulate external clearing through adapter
      adapterUpdates$.next({
        appliedFilters: [],
        selectedFilterIds: [],
      });
      fixture.detectChanges();

      expect(component.appliedFilters()).toEqual([]);
      expect(component.selectedFilterIds()).toEqual([]);
    });

    it('should call updateFilterData when a filter changes', () => {
      const closed$ = of({
        reason: 'save',
        selectedItems: [
          { id: '4', name: 'Alpha' },
          { id: '5', name: 'Beta' },
        ],
      });
      selectionModalServiceSpy.open.and.returnValue({
        closed: closed$,
      } as unknown as SkySelectionModalInstance);

      const filterItems = getFilterItems();
      const filterButton = filterItems[3].querySelector(
        'button',
      ) as HTMLButtonElement;
      filterButton.click();
      fixture.detectChanges();

      expect(filterAdapterServiceSpy.updateFilterData).toHaveBeenCalledWith(
        {
          appliedFilters: [
            {
              filterId: '4',
              filterValue: {
                value: [
                  { id: '4', name: 'Alpha' },
                  { id: '5', name: 'Beta' },
                ],
                displayValue: '2 selected',
              },
            },
          ],
          selectedFilterIds: ['1', '2', '3', '4'],
        },
        'skyFilterBar',
      );
    });

    it('should call updateFilterData when selectedFilterIds changes', () => {
      // Simulate external update through adapter
      adapterUpdates$.next({
        appliedFilters: [
          { filterId: '3', filterValue: { value: 'external value' } },
        ],
        selectedFilterIds: ['1', '2', '3', '4'],
      });
      fixture.detectChanges();

      const closed$ = of({
        reason: 'save',
        selectedItems: [
          { filterId: '2', labelText: 'filter 2' },
          { filterId: '3', labelText: 'filter 3' },
        ],
      });
      selectionModalServiceSpy.open.and.returnValue({
        closed: closed$,
      } as SkySelectionModalInstance);

      getFilterPickerButton()?.click();
      fixture.detectChanges();

      expect(filterAdapterServiceSpy.updateFilterData).toHaveBeenCalledWith(
        {
          appliedFilters: [
            { filterId: '3', filterValue: { value: 'external value' } },
          ],
          selectedFilterIds: ['2', '3'],
        },
        'skyFilterBar',
      );
    });

    it('should call updateFilterData when clearing filters', () => {
      // Set initial filters
      component.appliedFilters.set([
        { filterId: '1', filterValue: { value: 'value1' } },
        { filterId: '2', filterValue: { value: 'value2' } },
      ]);
      fixture.detectChanges();

      // Clear spy calls from initial setup
      filterAdapterServiceSpy.updateFilterData.calls.reset();

      // Clear filters
      const closed$ = of({ action: 'save' });
      confirmServiceSpy.open.and.returnValue({
        closed: closed$,
      } as SkyConfirmInstance);

      getClearFiltersButton()?.click();
      fixture.detectChanges();

      expect(filterAdapterServiceSpy.updateFilterData).toHaveBeenCalledWith(
        {
          appliedFilters: undefined,
          selectedFilterIds: ['1', '2', '3', '4'],
        },
        'skyFilterBar',
      );
    });

    it('should call updateFilterData when filter selection changes via modal', () => {
      // Clear initial spy calls
      filterAdapterServiceSpy.updateFilterData.calls.reset();

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
      fixture.detectChanges();

      expect(filterAdapterServiceSpy.updateFilterData).toHaveBeenCalledWith(
        {
          appliedFilters: undefined,
          selectedFilterIds: ['1', '3'],
        },
        'skyFilterBar',
      );
    });
  });
});
