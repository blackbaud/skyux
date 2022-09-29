import { PortalModule } from '@angular/cdk/portal';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAgGridHeaderParams } from '@skyux/ag-grid';
import { SkyIconModule } from '@skyux/indicators';
import { SkyThemeModule } from '@skyux/theme';

import { Column, ColumnApi } from 'ag-grid-community';

import { SkyAgGridHeaderComponent } from './header.component';

@Component({
  template: `<span class="test-help-component">Help text</span>`,
})
class TestHelpComponent {}

describe('HeaderComponent', () => {
  let component: SkyAgGridHeaderComponent;
  let fixture: ComponentFixture<SkyAgGridHeaderComponent>;
  let apiEvents: { [key: string]: Function[] };
  let columnEvents: { [key: string]: Function[] };
  let params: SkyAgGridHeaderParams;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SkyAgGridHeaderComponent],
      imports: [SkyIconModule, PortalModule, SkyThemeModule],
    });

    fixture = TestBed.createComponent(SkyAgGridHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    apiEvents = {};
    columnEvents = {};
    params = {
      displayName: 'Test Column',
      showColumnMenu: () => {},
      progressSort: () => {},
      api: {
        addEventListener(eventType: string, listener: Function) {
          apiEvents[eventType] = apiEvents[eventType] || [];
          apiEvents[eventType].push(listener);
        },
        removeEventListener(eventType: string, listener: Function) {
          apiEvents[eventType] = apiEvents[eventType] || [];
          apiEvents[eventType] = apiEvents[eventType].filter(
            (l) => l !== listener
          );
        },
      },
      column: {
        addEventListener(eventType: string, listener: Function) {
          columnEvents[eventType] = columnEvents[eventType] || [];
          columnEvents[eventType].push(listener);
        },
        removeEventListener(eventType: string, listener: Function) {
          columnEvents[eventType] = columnEvents[eventType] || [];
          columnEvents[eventType] = columnEvents[eventType].filter(
            (l) => l !== listener
          );
        },
        isFilterActive() {
          return false;
        },
        isFilterAllowed(): boolean {
          return false;
        },
        isSortAscending() {
          return false;
        },
        isSortDescending() {
          return false;
        },
        isSortNone(): boolean {
          return true;
        },
        getSort(): 'asc' | 'desc' | null | undefined {
          return undefined;
        },
        getSortIndex() {
          return undefined;
        },
        getColId(): string {
          return 'test';
        },
      } as Column,
      enableSorting: false,
      columnApi: {
        getAllColumns() {
          return [];
        },
      } as ColumnApi,
    } as unknown as SkyAgGridHeaderParams;
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
    expect(fixture.nativeElement.matches('.ag-sort-ascending-icon')).toBe(true);
    useSort = undefined;
    apiEvents['sortChanged'].forEach((listener) => listener());
    columnEvents['sortChanged'].forEach((listener) => listener());
    expect(fixture.nativeElement.matches('.ag-sort-ascending-icon')).toBe(
      false
    );

    columnEvents['filterChanged'].forEach((listener) => listener());
    expect(component.filterEnabled$.getValue()).toBe(true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.debugElement.query(By.css('.ag-filter-icon'))).toBeTruthy();
  });

  it('should inject help component', () => {
    params = {
      ...params,
      appendComponent: TestHelpComponent,
    };
    component.agInit(params);
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('.test-help-component'))
    ).toBeTruthy();
  });
});
