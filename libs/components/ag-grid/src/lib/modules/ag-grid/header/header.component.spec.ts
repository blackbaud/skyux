import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/icon';
import { SkyThemeModule } from '@skyux/theme';

import { AgColumn, GridApi } from 'ag-grid-community';

import { SkyAgGridHeaderParams } from '../types/header-params';

import { SkyAgGridHeaderComponent } from './header.component';

@Component({
  template: `<span class="test-help-component">Help text</span>`,
  imports: [SkyI18nModule, SkyIconModule, SkyThemeModule],
})
class TestHelpComponent {}

@Component({
  template: `<span class="other-help-component">Other help text</span>`,
  imports: [SkyI18nModule, SkyIconModule, SkyThemeModule],
})
class OtherTestHelpComponent {}

describe('HeaderComponent', () => {
  let component: SkyAgGridHeaderComponent;
  let fixture: ComponentFixture<SkyAgGridHeaderComponent>;
  let apiEvents: Record<string, ((a?: object) => void)[]>;
  let columnEvents: Record<string, (() => void)[]>;
  let params: SkyAgGridHeaderParams;
  let columnLeft: number | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyI18nModule,
        SkyIconModule,
        SkyThemeModule,
        SkyAgGridHeaderComponent,
        TestHelpComponent,
        OtherTestHelpComponent,
      ],
    });
    apiEvents = {};
    columnEvents = {};
    columnLeft = 100;
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
            (l) => l !== listener,
          );
        },
        getColumns: () => [],
      },
      column: {
        addEventListener: (eventType: string, listener: () => void) => {
          columnEvents[eventType] = columnEvents[eventType] || [];
          columnEvents[eventType].push(listener);
        },
        removeEventListener: (eventType: string, listener: () => void) => {
          columnEvents[eventType] = columnEvents[eventType] || [];
          columnEvents[eventType] = columnEvents[eventType].filter(
            (l) => l !== listener,
          );
        },
        isFilterActive: () => false,
        isFilterAllowed: () => false,
        getSort: (): 'asc' | 'desc' | null | undefined => undefined,
        getSortIndex: () => undefined,
        getColDef: () => ({}),
        getColId: () => 'test',
        getLeft: () => columnLeft,
      } as AgColumn,
      eGridHeader: {
        focus: () => undefined,
      } as HTMLElement,
      enableSorting: false,
      node: {
        isSelected: () => false,
        rowIndex: 0,
      },
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
    params = {
      ...params,
      enableSorting: true,
    };
    component.agInit(params);
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('.ag-header-cell-text')).nativeElement
        .textContent,
    ).toBe('Test Column');
    const sortSpy = spyOn(params, 'progressSort');
    component.onSortRequested({ shiftKey: false } as MouseEvent);
    expect(sortSpy).toHaveBeenCalled();
    const menuSpy = spyOn(params, 'showColumnMenu');
    component.onMenuClick({ target: {} } as Event);
    expect(menuSpy).toHaveBeenCalled();
    expect(component.refresh(params)).toBe(false);
  });

  it('should handle events', async () => {
    let useSort: string | undefined = 'asc';
    params = {
      ...params,
      enableSorting: true,
      column: {
        ...params.column,
        getSort: () => useSort,
        getSortIndex: () => useSort && 0,
        isFilterActive: () => true,
        isFilterAllowed: () => true,
      } as AgColumn,
      api: {
        ...params.api,
        getColumns() {
          return [
            {
              getColId: (): string => 'test',
              getSort: (): string | undefined => useSort,
            },
            {
              getColId: (): string => 'other',
              getSort: (): string | undefined => useSort,
            },
          ];
        },
      } as unknown as GridApi,
    };
    component.agInit(params);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(apiEvents['sortChanged'].length).toBeGreaterThanOrEqual(1);
    expect(columnEvents['sortChanged'].length).toBeGreaterThanOrEqual(1);
    expect(columnEvents['filterChanged'].length).toBeGreaterThanOrEqual(1);
    apiEvents['sortChanged'].forEach((listener) => listener());
    columnEvents['sortChanged'].forEach((listener) => listener());
    expect(
      fixture.debugElement.query(
        By.css('.ag-sort-indicator-container sky-icon'),
      ).attributes['iconName'],
    ).toBe('chevron-up');
    expect(
      document.querySelector('.ag-sort-indicator-container'),
    ).not.toBeNull();
    useSort = 'desc';
    apiEvents['sortChanged'].forEach((listener) => listener());
    columnEvents['sortChanged'].forEach((listener) => listener());
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      fixture.debugElement.query(
        By.css('.ag-sort-indicator-container sky-icon'),
      ).attributes['iconName'],
    ).toBe('chevron-down');
    expect(
      document.querySelector('.ag-sort-indicator-container'),
    ).not.toBeNull();
    useSort = undefined;
    apiEvents['sortChanged'].forEach((listener) => listener());
    columnEvents['sortChanged'].forEach((listener) => listener());
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      fixture.debugElement.query(By.css('.ag-header-label-icon')),
    ).toBeFalsy();
    expect(document.querySelector('.ag-sort-indicator-container')).toBeNull();

    columnEvents['filterChanged'].forEach((listener) => listener());
    expect(component.filterEnabled$.getValue()).toBe(true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.debugElement.query(By.css('.ag-filter-icon'))).toBeTruthy();
  });

  it('should not show sort button when sort is disabled', () => {
    params = {
      ...params,
      enableSorting: false,
    };
    component.agInit(params);
    fixture.detectChanges();
    expect(document.querySelector('.ag-sort-indicator-container')).toBeNull();
  });

  it('should not sort when sort is disabled', () => {
    params = {
      ...params,
      enableSorting: false,
    };
    const sortSpy = spyOn(params, 'progressSort');
    component.agInit(params);
    fixture.detectChanges();
    component.onSortRequested({ shiftKey: false } as MouseEvent);
    expect(sortSpy).not.toHaveBeenCalled();
    component.onSortRequested({ shiftKey: true } as MouseEvent);
    expect(sortSpy).not.toHaveBeenCalled();
  });

  it('should inject help component', () => {
    component.agInit({
      ...params,
      inlineHelpComponent: TestHelpComponent,
    });
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('.test-help-component')),
    ).toBeTruthy();
    component.refresh({
      ...params,
      inlineHelpComponent: OtherTestHelpComponent,
    });
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('.test-help-component')),
    ).toBeFalsy();
    expect(
      fixture.debugElement.query(By.css('.other-help-component')),
    ).toBeTruthy();
  });

  it('should re-focus the header cell when the column is arrowed to the left', async () => {
    component.agInit(params);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(apiEvents['columnMoved'].length).toBeGreaterThanOrEqual(1);
    const columnMovedSpy = spyOn(params.eGridHeader, 'focus');
    columnLeft = 50;
    apiEvents['columnMoved'].forEach((listener) =>
      listener({
        column: params.column,
        source: 'uiColumnMoved',
      }),
    );
    expect(columnMovedSpy).toHaveBeenCalled();
  });

  it('should load when left is undefined', async () => {
    columnLeft = undefined;
    component.agInit(params);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });

  describe('accessibility', () => {
    it('should be accessible with sorting off', async () => {
      component.agInit(params);
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible with sorting on', async () => {
      component.agInit({
        ...params,
        enableSorting: true,
      });
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});
