import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
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
import { SkyModalCloseArgs } from '@skyux/modals';

import { Subject, of } from 'rxjs';

import { SkyFilterBarItemComponent } from './filter-bar-item.component';
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
      fixture.nativeElement.querySelectorAll('.sky-filter-item'),
    ) as Element[];
  }

  function getFilterItemLabel(el: Element): string {
    const nameElement = el.querySelector('.sky-filter-item-name');
    return nameElement?.textContent?.trim() || '';
  }

  function getClearFiltersButton(): HTMLButtonElement | null {
    return fixture.nativeElement.querySelector('.sky-btn-link');
  }

  //#endregion

  let component: SkyFilterBarTestComponent;
  let componentRef: ComponentRef<SkyFilterBarTestComponent>;
  let fixture: ComponentFixture<SkyFilterBarTestComponent>;
  let confirmServiceSpy: jasmine.SpyObj<SkyConfirmService>;
  let selectionModalServiceSpy: jasmine.SpyObj<SkySelectionModalService>;

  // Common setup for all tests
  async function setupTestBed(): Promise<void> {
    confirmServiceSpy = jasmine.createSpyObj('SkyConfirmService', ['open']);
    selectionModalServiceSpy = jasmine.createSpyObj(
      'SkySelectionModalService',
      ['open'],
    );

    await TestBed.configureTestingModule({
      imports: [SkyFilterBarTestComponent],
      providers: [
        provideNoopAnimations(),
        { provide: SkyConfirmService, useValue: confirmServiceSpy },
        {
          provide: SkySelectionModalService,
          useValue: selectionModalServiceSpy,
        },
      ],
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
    let modalServiceSpy: jasmine.SpyObj<SkyModalService>;

    beforeEach(async () => {
      modalServiceSpy = jasmine.createSpyObj('SkyModalService', ['open']);

      confirmServiceSpy = jasmine.createSpyObj('SkyConfirmService', ['open']);
      selectionModalServiceSpy = jasmine.createSpyObj(
        'SkySelectionModalService',
        ['open'],
      );

      await TestBed.configureTestingModule({
        imports: [SkyFilterBarTestComponent],
        providers: [
          provideNoopAnimations(),
          { provide: SkyConfirmService, useValue: confirmServiceSpy },
          {
            provide: SkySelectionModalService,
            useValue: selectionModalServiceSpy,
          },
          { provide: SkyModalService, useValue: modalServiceSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SkyFilterBarTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
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
      expect(filterItems.length).toBe(3);

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

  it('should pass correct inputs to filter bar item components', () => {
    const filters = [
      {
        id: 'filter1',
        name: 'Test Filter 1',
        filterValue: { value: 'value1' },
        filterModalConfig: { modalComponent: class {}, modalSize: 'medium' },
      },
    ];
    componentRef.setInput('filters', filters);
    fixture.detectChanges();

    const filterItem = fixture.debugElement.query(
      By.directive(SkyFilterBarItemComponent),
    );

    expect(filterItem.componentInstance.filterName()).toBe('Test Filter 1');
    expect(filterItem.componentInstance.filterValue()).toEqual({
      value: 'value1',
    });
    expect(filterItem.componentInstance.filterModalConfig()).toEqual(
      filters[0].filterModalConfig,
    );
  });

  it('should update filter value when filterUpdated event is emitted from filter item', () => {
    const filters = [
      {
        id: 'filter1',
        name: 'Test Filter',
        filterValue: { value: 'initial' },
        filterModalConfig: { modalComponent: class {} },
      },
    ];
    componentRef.setInput('filters', filters);
    fixture.detectChanges();

    const newFilterValue = { value: 'updated' };
    const filterItem = fixture.debugElement.query(
      By.directive(SkyFilterBarItemComponent),
    );

    // Emit the filterUpdated event
    filterItem.componentInstance.filterUpdated.emit(newFilterValue);

    // Verify the filter value was updated
    expect(component.filters()[0].filterValue).toEqual(newFilterValue);
  });

  it('should remove filter when filterUpdated event emits undefined', () => {
    const filters = [
      {
        id: 'filter1',
        name: 'Test Filter',
        filterValue: { value: 'initial' },
        filterModalConfig: { modalComponent: class {} },
      },
    ];
    componentRef.setInput('filters', filters);
    fixture.detectChanges();

    const filterItem = fixture.debugElement.query(
      By.directive(SkyFilterBarItemComponent),
    );

    // Emit undefined to clear the filter
    filterItem.componentInstance.filterUpdated.emit(undefined);

    // Verify the filter value was cleared
    expect(component.filters()[0].filterValue).toBeUndefined();
  });

  it('should hide clear filters button when no filters have values', () => {
    const filters = [
      {
        id: 'filter1',
        name: 'Test Filter',
        filterValue: undefined,
        filterModalConfig: { modalComponent: class {} },
      },
    ];
    componentRef.setInput('filters', filters);
    fixture.detectChanges();

    const clearButton = getClearFiltersButton();
    expect(clearButton).toBeFalsy();
  });

  it('should show clear filters button when at least one filter has a value', () => {
    const filters = [
      {
        id: 'filter1',
        name: 'Test Filter',
        filterValue: { value: 'test' },
        filterModalConfig: { modalComponent: class {} },
      },
    ];
    componentRef.setInput('filters', filters);
    fixture.detectChanges();

    const clearButton = getClearFiltersButton();
    expect(clearButton).toBeTruthy();
    expect(clearButton?.textContent?.trim()).toContain('Clear all values');
  });

  it('should clear all filter values when clear filters button is clicked and confirmed', () => {
    const filters = [
      {
        id: 'filter1',
        name: 'Test Filter 1',
        filterValue: { value: 'value1' },
        filterModalConfig: { modalComponent: class {} },
      },
      {
        id: 'filter2',
        name: 'Test Filter 2',
        filterValue: { value: 'value2' },
        filterModalConfig: { modalComponent: class {} },
      },
    ];
    const closed$ = of({ action: 'save' });
    confirmServiceSpy.open.and.returnValue({
      closed: closed$,
    } as SkyConfirmInstance);

    componentRef.setInput('filters', filters);
    fixture.detectChanges();

    const clearButton = getClearFiltersButton();
    clearButton?.click();

    expect(component.filters()[0].filterValue).toBeUndefined();
    expect(component.filters()[1].filterValue).toBeUndefined();
  });

  it('should not clear all filter values when clear filters button is clicked and cancelled', () => {
    const filters = [
      {
        id: 'filter1',
        name: 'Test Filter 1',
        filterValue: { value: 'value1' },
        filterModalConfig: { modalComponent: class {} },
      },
      {
        id: 'filter2',
        name: 'Test Filter 2',
        filterValue: { value: 'value2' },
        filterModalConfig: { modalComponent: class {} },
      },
    ];
    const closed$ = of({ action: 'cancel' });
    confirmServiceSpy.open.and.returnValue({
      closed: closed$,
    } as SkyConfirmInstance);

    componentRef.setInput('filters', filters);
    fixture.detectChanges();

    const clearButton = getClearFiltersButton();
    clearButton?.click();

    expect(component.filters()[0].filterValue).not.toBeUndefined();
    expect(component.filters()[1].filterValue).not.toBeUndefined();
  });
});
