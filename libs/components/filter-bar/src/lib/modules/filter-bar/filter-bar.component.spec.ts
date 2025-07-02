import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { SkyConfirmInstance, SkyConfirmService } from '@skyux/modals';

import { of } from 'rxjs';

import { SkyFilterBarItemComponent } from './filter-bar-item.component';
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

  //#endregion

  let component: SkyFilterBarTestComponent;
  let componentRef: ComponentRef<SkyFilterBarTestComponent>;
  let fixture: ComponentFixture<SkyFilterBarTestComponent>;
  let confirmServiceSpy: jasmine.SpyObj<SkyConfirmService>;

  beforeEach(async () => {
    confirmServiceSpy = jasmine.createSpyObj('SkyConfirmService', ['open']);

    await TestBed.configureTestingModule({
      imports: [SkyFilterBarTestComponent /* , SkyModalTestingModule */],
      providers: [
        provideNoopAnimations(),
        { provide: SkyConfirmService, useValue: confirmServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SkyFilterBarTestComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
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

  it('should not have a selection modal button if no search function is specified', () => {
    component.searchFn = undefined;

    fixture.detectChanges();

    const filterPickerButton = getFilterPickerButton();

    expect(filterPickerButton).toBeNull();
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
