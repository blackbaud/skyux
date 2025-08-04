import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import {
  SkySelectionModalInstance,
  SkySelectionModalService,
} from '@skyux/lookup';
import { SkyConfirmInstance, SkyConfirmService } from '@skyux/modals';

import { of } from 'rxjs';

import { SkyFilterBarButtonComponent } from './filter-bar-button.component';
import { SkyFilterBarComponent } from './filter-bar.component';
import { SkyFilterBarTestComponent } from './fixtures/filter-bar.component.fixture';

describe('Filter bar component', () => {
  //#region helpers

  function getFilterPickerButton(): HTMLButtonElement | null {
    return fixture.nativeElement.querySelector(
      '.sky-btn.sky-btn-icon.sky-filter-bar-btn',
    );
  }

  function getClearFiltersButton(): HTMLButtonElement | null {
    return fixture.nativeElement.querySelector('.sky-btn-link');
  }

  function getFilterBarComponent(): SkyFilterBarComponent {
    return fixture.debugElement.query(By.directive(SkyFilterBarComponent))
      .componentInstance;
  }

  function getFilterItems(): DebugElement[] {
    return fixture.debugElement.queryAll(
      By.directive(SkyFilterBarButtonComponent),
    );
  }

  //#endregion

  let component: SkyFilterBarTestComponent;
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

    it('should display filter items from the model', () => {
      const filterItems = getFilterItems();

      expect(filterItems.length).toBe(3);
      expect(filterItems[0].componentInstance.filterName()).toBe('filter 1');
      expect(filterItems[1].componentInstance.filterName()).toBe('filter 2');
      expect(filterItems[2].componentInstance.filterName()).toBe('filter 3');
    });

    it('should show/hide filter picker button based on input', () => {
      expect(getFilterPickerButton()).toBeTruthy();

      component.showFilterSelector.set(false);
      fixture.detectChanges();

      expect(getFilterPickerButton()).toBeFalsy();
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
      fixture.detectChanges();

      const filterItems = getFilterItems();
      expect(filterItems.length).toBe(0);
    });

    it('should open selection modal when filter picker button is clicked', () => {
      spyOn(getFilterBarComponent(), 'openFilters');

      getFilterPickerButton()?.click();

      expect(getFilterBarComponent().openFilters).toHaveBeenCalled();
    });
  });

  describe('filter management', () => {
    beforeEach(async () => {
      await setupTestBed();
    });

    it('should update individual filter values', () => {
      const filterBarComponent = getFilterBarComponent();
      const filters = component.filters();
      const newFilterValue = { value: 'updated value' };

      filterBarComponent.updateFilters(newFilterValue, filters[0].id);

      expect(component.filters()[0].filterValue).toEqual(newFilterValue);
    });

    it('should clear individual filter values', () => {
      // Set initial filter value
      const filters = component.filters();
      filters[0].filterValue = { value: 'initial' };
      component.filters.set([...filters]);
      fixture.detectChanges();

      const filterBarComponent = getFilterBarComponent();
      filterBarComponent.updateFilters(undefined, filters[0].id);

      expect(component.filters()[0].filterValue).toBeUndefined();
    });

    it('should emit filterUpdated event when filter item is updated', () => {
      const filterItem = getFilterItems()[0];
      const newFilterValue = { value: 'emitted value' };

      filterItem.componentInstance.filterUpdated.emit(newFilterValue);

      expect(component.filters()[0].filterValue).toEqual(newFilterValue);
    });

    it('should show/hide clear filters button based on active filters', () => {
      // Initially no active filters
      expect(getClearFiltersButton()).toBeFalsy();

      // Add filter value
      const filters = component.filters();
      filters[0].filterValue = { value: 'test' };
      component.filters.set([...filters]);
      fixture.detectChanges();

      expect(getClearFiltersButton()).toBeTruthy();
    });

    it('should clear all filters when confirmed', () => {
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

      getFilterBarComponent().clearFilters();

      expect(component.filters()[0].filterValue).toBeUndefined();
      expect(component.filters()[1].filterValue).toBeUndefined();
    });

    it('should not clear filters when cancelled', () => {
      const filters = component.filters();
      filters[0].filterValue = { value: 'value1' };
      component.filters.set([...filters]);
      fixture.detectChanges();

      const closed$ = of({ action: 'cancel' });
      confirmServiceSpy.open.and.returnValue({
        closed: closed$,
      } as SkyConfirmInstance);

      getFilterBarComponent().clearFilters();

      expect(component.filters()[0].filterValue).toEqual({ value: 'value1' });
    });
  });

  describe('integration workflow', () => {
    beforeEach(async () => {
      await setupTestBed();
    });

    it('should handle complete user workflow: add, update, clear', () => {
      const filterBarComponent = getFilterBarComponent();

      // 1. Add filter value
      const filters = component.filters();
      filters[0].filterValue = { value: 'test value' };
      component.filters.set([...filters]);
      fixture.detectChanges();

      expect(getClearFiltersButton()).toBeTruthy();

      // 2. Update filter value
      const newValue = { value: 'updated value' };
      filterBarComponent.updateFilters(newValue, filters[0].id);

      expect(component.filters()[0].filterValue).toEqual(newValue);

      // 3. Clear all filters
      const closed$ = of({ action: 'save' });
      confirmServiceSpy.open.and.returnValue({
        closed: closed$,
      } as SkyConfirmInstance);

      filterBarComponent.clearFilters();

      expect(component.filters()[0].filterValue).toBeUndefined();
      fixture.detectChanges();
      expect(getClearFiltersButton()).toBeFalsy();
    });
  });
});
