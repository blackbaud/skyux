// import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import {
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';
import { SkyConfirmInstance, SkyConfirmService } from '@skyux/modals';

import { BehaviorSubject, of } from 'rxjs';

import { SkyFilterBarItemComponent } from './filter-bar-item.component';
import { SkyFilterBarComponent } from './filter-bar.component';
import { SkyFilterBarTestComponent } from './fixtures/filter-bar.component.fixture';

describe('Filter bar component', () => {
  //#region helpers

  function getFilterPickerButton(): HTMLButtonElement | null {
    return fixture.nativeElement.querySelector(
      '.sky-btn.sky-btn-icon.sky-filter-bar-btn',
    );
  }

  function getModalSaveButton(): HTMLButtonElement | null {
    return document.querySelector('.sky-lookup-show-more-modal-save');
  }

  function getClearFiltersButton(): HTMLButtonElement | null {
    return fixture.nativeElement.querySelector('.sky-btn-link');
  }

  function getFilterBarComponent(): SkyFilterBarComponent {
    return fixture.debugElement.query(By.directive(SkyFilterBarComponent))
      .componentInstance;
  }

  //#endregion

  let component: SkyFilterBarTestComponent;
  // let componentRef: ComponentRef<SkyFilterBarTestComponent>;
  let fixture: ComponentFixture<SkyFilterBarTestComponent>;
  let confirmServiceSpy: jasmine.SpyObj<SkyConfirmService>;

  // Common setup for tests that need confirm service
  function setupConfirmService(): void {
    confirmServiceSpy = jasmine.createSpyObj('SkyConfirmService', ['open']);
  }

  // Setup for tests without data manager service
  async function setupWithoutDataManager(): Promise<void> {
    setupConfirmService();

    await TestBed.configureTestingModule({
      imports: [SkyFilterBarTestComponent],
      providers: [
        provideNoopAnimations(),
        { provide: SkyConfirmService, useValue: confirmServiceSpy },
        // Note: No SkyDataManagerService provided
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SkyFilterBarTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  // Setup for tests with data manager service
  async function setupWithDataManager(): Promise<{
    dataManagerServiceSpy: jasmine.SpyObj<SkyDataManagerService>;
    dataStateSubject: BehaviorSubject<Partial<SkyDataManagerState>>;
  }> {
    setupConfirmService();

    const dataManagerServiceSpy = jasmine.createSpyObj(
      'SkyDataManagerService',
      ['getDataStateUpdates', 'updateDataState'],
    );

    const dataStateSubject = new BehaviorSubject<Partial<SkyDataManagerState>>({
      filterData: {
        filters: [
          {
            id: 'dm-filter1',
            name: 'Data Manager Filter 1',
            filterValue: { value: 'dm-value1' },
          },
          {
            id: 'dm-filter2',
            name: 'Data Manager Filter 2',
            filterValue: undefined,
          },
        ],
        filtersApplied: true,
      },
    });

    dataManagerServiceSpy.getDataStateUpdates.and.returnValue(
      dataStateSubject.asObservable(),
    );

    await TestBed.configureTestingModule({
      imports: [SkyFilterBarTestComponent],
      providers: [
        provideNoopAnimations(),
        { provide: SkyConfirmService, useValue: confirmServiceSpy },
        { provide: SkyDataManagerService, useValue: dataManagerServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SkyFilterBarTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    return { dataManagerServiceSpy, dataStateSubject };
  }

  describe('basic functionality', () => {
    beforeEach(async () => {
      await setupWithoutDataManager();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should open the selection modal when selected', () => {
      const filterPickerButton = getFilterPickerButton();

      expect(filterPickerButton).toBeTruthy();

      filterPickerButton?.click();

      fixture.detectChanges();

      const closeButton = getModalSaveButton();

      closeButton?.click();
    });

    it('should show filter picker button when search function is provided', () => {
      expect(getFilterPickerButton()).toBeTruthy();
    });

    it('should hide filter picker button when search function is not provided', () => {
      component.searchFn = undefined;
      fixture.detectChanges();

      expect(getFilterPickerButton()).toBeFalsy();
    });

    it('should display filter items from the model', () => {
      const filterItems = fixture.debugElement.queryAll(
        By.directive(SkyFilterBarItemComponent),
      );

      expect(filterItems.length).toBe(3);
      expect(filterItems[0].componentInstance.filterName()).toBe('filter 1');
      expect(filterItems[1].componentInstance.filterName()).toBe('filter 2');
      expect(filterItems[2].componentInstance.filterName()).toBe('filter 3');
    });
  });

  describe('without data manager service', () => {
    beforeEach(async () => {
      await setupWithoutDataManager();
    });

    it('should use filters from model signal only', () => {
      const filterBarComponent = getFilterBarComponent();
      const modelFilters = component.filters();
      const computedFilters = filterBarComponent.computedFilters();

      expect(computedFilters).toEqual(modelFilters);
    });

    it('should update filter value when user interacts with filter item', () => {
      const filterBarComponent = getFilterBarComponent();
      const filters = component.filters();
      const newFilterValue = { value: 'updated value' };

      // Simulate user updating a filter
      filterBarComponent.updateFilters(newFilterValue, filters[0]);

      // Verify the model was updated
      expect(component.filters()[0].filterValue).toEqual(newFilterValue);
    });

    it('should clear filter value when user clears individual filter', () => {
      // Set initial filter value
      const filters = component.filters();
      filters[0].filterValue = { value: 'initial' };
      component.filters.set([...filters]);
      fixture.detectChanges();

      const filterBarComponent = getFilterBarComponent();

      // Simulate user clearing a filter
      filterBarComponent.updateFilters(undefined, filters[0]);

      // Verify the filter was cleared
      expect(component.filters()[0].filterValue).toBeUndefined();
    });

    it('should show clear filters button when at least one filter has a value', () => {
      const filters = component.filters();
      filters[0].filterValue = { value: 'test' };
      component.filters.set([...filters]);
      fixture.detectChanges();

      expect(getClearFiltersButton()).toBeTruthy();
    });

    it('should hide clear filters button when no filters have values', () => {
      expect(getClearFiltersButton()).toBeFalsy();
    });

    it('should clear all filters when user confirms clear action', () => {
      // Set initial filter values
      const filters = component.filters();
      filters[0].filterValue = { value: 'value1' };
      filters[1].filterValue = { value: 'value2' };
      component.filters.set([...filters]);
      fixture.detectChanges();

      const closed$ = of({ action: 'save' });
      confirmServiceSpy.open.and.returnValue({
        closed: closed$,
      } as SkyConfirmInstance);

      const filterBarComponent = getFilterBarComponent();
      filterBarComponent.clearFilters();

      // Verify all filters were cleared
      expect(component.filters()[0].filterValue).toBeUndefined();
      expect(component.filters()[1].filterValue).toBeUndefined();
    });

    it('should not clear filters when user cancels clear action', () => {
      // Set initial filter values
      const filters = component.filters();
      filters[0].filterValue = { value: 'value1' };
      component.filters.set([...filters]);
      fixture.detectChanges();

      const closed$ = of({ action: 'cancel' });
      confirmServiceSpy.open.and.returnValue({
        closed: closed$,
      } as SkyConfirmInstance);

      const filterBarComponent = getFilterBarComponent();
      filterBarComponent.clearFilters();

      // Verify filters were not cleared
      expect(component.filters()[0].filterValue).toEqual({ value: 'value1' });
    });

    it('should emit filterUpdated event when filter item is updated', () => {
      const filterItem = fixture.debugElement.query(
        By.directive(SkyFilterBarItemComponent),
      );
      const newFilterValue = { value: 'emitted value' };

      // Emit the filterUpdated event
      filterItem.componentInstance.filterUpdated.emit(newFilterValue);

      // Verify the parent component received the update
      expect(component.filters()[0].filterValue).toEqual(newFilterValue);
    });
  });

  describe('with data manager service', () => {
    let dataManagerServiceSpy: jasmine.SpyObj<SkyDataManagerService>;
    let dataStateSubject: BehaviorSubject<Partial<SkyDataManagerState>>;

    beforeEach(async () => {
      const setup = await setupWithDataManager();
      dataManagerServiceSpy = setup.dataManagerServiceSpy;
      dataStateSubject = setup.dataStateSubject;
    });

    it('should display filters from data manager instead of model', () => {
      const filterBarComponent = getFilterBarComponent();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const computedFilters = filterBarComponent.computedFilters()!;

      expect(computedFilters.length).toBe(2);
      expect(computedFilters[0].name).toBe('Data Manager Filter 1');
      expect(computedFilters[1].name).toBe('Data Manager Filter 2');
    });

    it('should update data manager when user updates filter', () => {
      const filterBarComponent = getFilterBarComponent();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const filters = filterBarComponent.computedFilters()!;
      const newFilterValue = { value: 'updated dm value' };

      filterBarComponent.updateFilters(newFilterValue, filters[0]);

      expect(dataManagerServiceSpy.updateDataState).toHaveBeenCalledWith(
        jasmine.objectContaining({
          filterData: jasmine.objectContaining({
            filters: jasmine.arrayContaining([
              jasmine.objectContaining({
                id: 'dm-filter1',
                filterValue: newFilterValue,
              }),
            ]),
            filtersApplied: true,
          }),
        }),
        'filterBarComponent',
      );
    });

    it('should sync data manager changes back to component model', () => {
      const newDataState = {
        filterData: {
          filters: [
            {
              id: 'synced-filter',
              name: 'Synced Filter',
              filterValue: { value: 'synced value' },
            },
          ],
          filtersApplied: true,
        },
      };

      dataStateSubject.next(newDataState);
      fixture.detectChanges();

      // The model signal should be updated with synced data
      expect(component.filters()).toEqual(newDataState.filterData.filters);
    });

    it('should clear all filters through data manager', () => {
      const closed$ = of({ action: 'save' });
      confirmServiceSpy.open.and.returnValue({
        closed: closed$,
      } as SkyConfirmInstance);

      const filterBarComponent = getFilterBarComponent();
      filterBarComponent.clearFilters();

      expect(dataManagerServiceSpy.updateDataState).toHaveBeenCalledWith(
        jasmine.objectContaining({
          filterData: jasmine.objectContaining({
            filters: jasmine.arrayContaining([
              jasmine.objectContaining({
                filterValue: undefined,
              }),
            ]),
            filtersApplied: false,
          }),
        }),
        'filterBarComponent',
      );
    });

    it('should show clear button when data manager has active filters', () => {
      expect(getClearFiltersButton()).toBeTruthy();
    });
  });

  describe('filter picker workflow', () => {
    beforeEach(async () => {
      await setupWithoutDataManager();
    });

    it('should open selection modal when filter picker button is clicked', () => {
      spyOn(getFilterBarComponent(), 'openFilters');

      const filterPickerButton = getFilterPickerButton();
      filterPickerButton?.click();

      expect(getFilterBarComponent().openFilters).toHaveBeenCalled();
    });

    it('should pass search function to filter bar component', () => {
      const filterBarComponent = getFilterBarComponent();
      expect(filterBarComponent.filterAsyncSearchFn()).toBe(component.searchFn);
    });
  });

  describe('integration tests', () => {
    beforeEach(async () => {
      await setupWithoutDataManager();
    });

    it('should handle complete user workflow: add filter, update value, clear all', () => {
      const filterBarComponent = getFilterBarComponent();

      // 1. Add filter value
      const filters = component.filters();
      filters[0].filterValue = { value: 'test value' };
      component.filters.set([...filters]);
      fixture.detectChanges();

      // Verify filter is active and clear button shows
      expect(getClearFiltersButton()).toBeTruthy();

      // 2. Update filter value
      const newValue = { value: 'updated value' };
      filterBarComponent.updateFilters(newValue, filters[0]);

      expect(component.filters()[0].filterValue).toEqual(newValue);

      // 3. Clear all filters
      const closed$ = of({ action: 'save' });
      confirmServiceSpy.open.and.returnValue({
        closed: closed$,
      } as SkyConfirmInstance);

      filterBarComponent.clearFilters();

      // Verify all filters are cleared and clear button is hidden
      expect(component.filters()[0].filterValue).toBeUndefined();
      fixture.detectChanges();
      expect(getClearFiltersButton()).toBeFalsy();
    });
  });
});
