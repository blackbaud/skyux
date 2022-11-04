import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyIconModule } from '@skyux/indicators';
import { SkyThemeModule } from '@skyux/theme';

import { Column, ColumnApi } from 'ag-grid-community';

import { SkyAgGridHeaderParams } from '../types/header-params';

import { SkyAgGridHeaderComponent } from './header.component';

@Component({
  template: `<span class="test-help-component">Help text</span>`,
})
class TestHelpComponent {}

@Component({
  template: `<span class="other-help-component">Other help text</span>`,
})
class OtherTestHelpComponent {}

describe('HeaderComponent', () => {
  let component: SkyAgGridHeaderComponent;
  let fixture: ComponentFixture<SkyAgGridHeaderComponent>;
  let apiEvents: { [key: string]: (() => void)[] };
  let columnEvents: { [key: string]: (() => void)[] };
  let params: SkyAgGridHeaderParams;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SkyAgGridHeaderComponent,
        TestHelpComponent,
        OtherTestHelpComponent,
      ],
      imports: [SkyIconModule, SkyThemeModule],
    });
    apiEvents = {};
    columnEvents = {};
    params = {
      displayName: 'Test Column',
      showColumnMenu: () => undefined,
      progressSort: () => undefined,
      api: {
        addEventListener: (eventType: string, listener: () => void) => {
          apiEvents[eventType] = apiEvents[eventType] || [];
          apiEvents[eventType].push(listener);
        },
        removeEventListener: (eventType: string, listener: () => void) => {
          apiEvents[eventType] = apiEvents[eventType] || [];
          apiEvents[eventType] = apiEvents[eventType].filter(
            (l) => l !== listener
          );
        },
      },
      column: {
        addEventListener: (eventType: string, listener: () => void) => {
          columnEvents[eventType] = columnEvents[eventType] || [];
          columnEvents[eventType].push(listener);
        },
        removeEventListener: (eventType: string, listener: () => void) => {
          columnEvents[eventType] = columnEvents[eventType] || [];
          columnEvents[eventType] = columnEvents[eventType].filter(
            (l) => l !== listener
          );
        },
        isFilterActive: () => false,
        isFilterAllowed: () => false,
        isSortAscending: () => false,
        isSortDescending: () => false,
        isSortNone: () => true,
        getSort: (): 'asc' | 'desc' | null | undefined => undefined,
        getSortIndex: () => undefined,
        getColId: () => 'test',
      } as Column,
      enableSorting: false,
      columnApi: {
        getAllColumns: () => [],
      } as ColumnApi,
    } as unknown as SkyAgGridHeaderParams;

    fixture = TestBed.createComponent(SkyAgGridHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.agInit(undefined);
    expect(component).toBeTruthy();
  });

  it('should implement IHeaderAngularComp', () => {
    component.agInit(params);
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('.ag-header-cell-text')).nativeElement
        .textContent
    ).toBe('Test Column');
    const sortSpy = spyOn(params, 'progressSort');
    component.onSortRequested({ shiftKey: false });
    expect(sortSpy).toHaveBeenCalled();
    const menuSpy = spyOn(params, 'showColumnMenu');
    component.onMenuClick({ target: {} } as Event);
    expect(menuSpy).toHaveBeenCalled();
    expect(component.refresh(params)).toBe(false);
  });

  it('should handle events', async () => {
    let useSort = 'asc';
    params = {
      ...params,
      enableSorting: true,
      column: {
        ...params.column,
        getSort: () => useSort,
        getSortIndex: () => useSort && 0,
        isFilterActive: () => true,
        isFilterAllowed: () => true,
        isSortAscending: () => useSort === 'asc',
        isSortDescending: () => useSort === 'desc',
        isSortNone: () => !useSort,
      } as unknown as Column,
      columnApi: {
        ...params.columnApi,
        getAllColumns() {
          return [
            {
              getColId: () => 'test',
              getSort: () => useSort,
            },
            {
              getColId: () => 'other',
              getSort: () => useSort,
            },
          ];
        },
      } as unknown as ColumnApi,
    };
    component.agInit(params);
    fixture.detectChanges();
    expect(apiEvents['sortChanged'].length).toBeGreaterThanOrEqual(1);
    expect(columnEvents['sortChanged'].length).toBeGreaterThanOrEqual(1);
    expect(columnEvents['filterChanged'].length).toBeGreaterThanOrEqual(1);
    apiEvents['sortChanged'].forEach((listener) => listener());
    columnEvents['sortChanged'].forEach((listener) => listener());
    expect(
      fixture.debugElement.query(By.css('.ag-header-label-icon')).attributes[
        'icon'
      ]
    ).toBe('caret-up');
    useSort = undefined;
    apiEvents['sortChanged'].forEach((listener) => listener());
    columnEvents['sortChanged'].forEach((listener) => listener());
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      fixture.debugElement.query(By.css('.ag-header-label-icon'))
    ).toBeFalsy();

    columnEvents['filterChanged'].forEach((listener) => listener());
    expect(component.filterEnabled$.getValue()).toBe(true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.debugElement.query(By.css('.ag-filter-icon'))).toBeTruthy();
  });

  it('should inject help component', () => {
    component.agInit({
      ...params,
      inlineHelpComponent: TestHelpComponent,
    });
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('.test-help-component'))
    ).toBeTruthy();
    component.refresh({
      ...params,
      inlineHelpComponent: OtherTestHelpComponent,
    });
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('.test-help-component'))
    ).toBeFalsy();
    expect(
      fixture.debugElement.query(By.css('.other-help-component'))
    ).toBeTruthy();
  });
});
