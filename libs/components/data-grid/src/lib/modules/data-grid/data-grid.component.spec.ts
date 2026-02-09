import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideLocationMocks } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { SkyAppTestUtility } from '@skyux-sdk/testing';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SkyAgGridWrapperHarness } from '@skyux/ag-grid/testing';
import { SkyLogService } from '@skyux/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SkyDataManagerHarness } from '@skyux/data-manager/testing';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SkyWaitHarness } from '@skyux/indicators/testing';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SkyPagingHarness } from '@skyux/lists/testing';
import { SkySearchHarness } from '@skyux/lookup/testing';

import { getGridApi } from 'ag-grid-community';

import { SkyDataGridComponent } from './data-grid.component';
import { DataGridTestComponent } from './fixtures/data-grid-test.component';
import { DataGridWDataManagerTestComponent } from './fixtures/data-grid-w-data-manager-test.component';

describe('SkyDataGridComponent', () => {
  describe('without data manager', () => {
    let fixture: ComponentFixture<DataGridTestComponent>;
    let component: DataGridTestComponent;
    let loader: HarnessLoader;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideRouter([]), provideLocationMocks()],
      });
      fixture = TestBed.createComponent(DataGridTestComponent);
      loader = TestbedHarnessEnvironment.loader(fixture);
      component = fixture.componentInstance;
    });

    it('should create', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should destroy and recreate grid', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component).toBeTruthy();

      fixture.componentRef.setInput('showAllGrids', false);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(
        fixture.debugElement.queryAll(By.directive(SkyDataGridComponent)),
      ).toEqual([]);

      fixture.componentRef.setInput('showAllGrids', true);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(
        fixture.debugElement.queryAll(By.directive(SkyDataGridComponent))
          .length,
      ).toEqual(4);
    });

    it('should destroy and recreate columns', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component).toBeTruthy();
      const grids = await loader.getAllHarnesses(SkyAgGridWrapperHarness);
      expect(
        await Promise.all(
          grids.map((grid) => grid.getDisplayedColumnIds()),
        ).then((cols) =>
          cols.map((id) => id.length).reduce((a, b) => a + b, 0),
        ),
      ).toEqual(4 * 3 + 3); // 4 grids with 3 columns each, plus 3 extra headers for the multi-select and row delete grid

      fixture.componentRef.setInput('showCol3', false);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(
        await Promise.all(
          grids.map((grid) => grid.getDisplayedColumnIds()),
        ).then((cols) =>
          cols.map((id) => id.length).reduce((a, b) => a + b, 0),
        ),
      ).toEqual(4 * 2 + 4); // 4 grids with 2 columns each, plus 4 extra headers for multi-select, row delete, and date column
      expect(component.visibleColumnIds()).toEqual(['column1', 'column2']);

      fixture.componentRef.setInput('showCol3', true);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(
        await Promise.all(
          grids.map((grid) => grid.getDisplayedColumnIds()),
        ).then((cols) =>
          cols.map((id) => id.length).reduce((a, b) => a + b, 0),
        ),
      ).toEqual(4 * 3 + 3); // 4 grids with 3 columns each, plus 3 extra headers for the multi-select and row delete grid
      expect(component.visibleColumnIds()).toEqual([
        'column1',
        'column2',
        'column3',
      ]);

      fixture.componentRef.setInput('showAllColumns', false);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(
        fixture.nativeElement.querySelectorAll('sky-ag-grid-wrapper'),
      ).toHaveSize(0);
    });

    it('should respond to displayedColumnIds input', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component).toBeTruthy();
      const grids = await loader.getAllHarnesses(SkyAgGridWrapperHarness);
      expect(
        await Promise.all(
          grids.map((grid) => grid.getDisplayedColumnIds()),
        ).then((cols) => cols.flatMap((id) => id).length),
      ).toEqual(4 * 3 + 3); // 4 grids with 3 columns each, plus 3 extra headers for the multi-select and row delete grid

      fixture.componentRef.setInput('displayedColumnIds', [
        'column1',
        'column2',
      ]);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(
        await Promise.all(
          grids.map((grid) => grid.getDisplayedColumnIds()),
        ).then((cols) => cols.flatMap((id) => id).length),
      ).toEqual(4 * 2 + 1); // 4 grids with 2 columns each, plus 1 extra header for multi-select
      expect(component.visibleColumnIds()).toEqual(['column1', 'column2']);

      fixture.componentRef.setInput('displayedColumnIds', [
        'column1',
        'column2',
        'column3',
      ]);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(
        await Promise.all(
          grids.map((grid) => grid.getDisplayedColumnIds()),
        ).then((cols) => cols.flatMap((id) => id).length),
      ).toEqual(4 * 3 + 1); // 4 grids with 3 columns each, plus 1 extra header for multi-select
      expect(component.visibleColumnIds()).toEqual([
        'column1',
        'column2',
        'column3',
      ]);

      fixture.componentRef.setInput('showAllColumns', false);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(
        fixture.nativeElement.querySelectorAll('sky-ag-grid-wrapper'),
      ).toHaveSize(0);
    });

    it('should handle empty data', async () => {
      component.dataForSimpleGrid = undefined;
      fixture.detectChanges();
      expect(component).toBeTruthy();
      const waitHarness =
        await TestbedHarnessEnvironment.loader(fixture).getHarness(
          SkyWaitHarness,
        );
      await expectAsync(waitHarness.isWaiting()).toBeResolvedTo(false);
      expect(
        Array.from(
          fixture.nativeElement
            .querySelector('.ag-viewport')
            .querySelectorAll('[role="row"]'),
        ),
      ).toHaveSize(0);
    });

    it('should handle data changing from populated to undefined', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      const api = getGridApi(
        fixture.nativeElement.querySelector(
          '[data-sky-id="grid"] ag-grid-angular',
        ),
      );
      expect(api).toBeTruthy();
      expect(api?.getDisplayedRowCount()).toBe(7);

      component.dataForSimpleGrid = undefined;
      fixture.detectChanges();
      await fixture.whenStable();
      expect(api?.getDisplayedRowCount()).toBe(0);
    });

    it('should handle data changing from undefined to populated', async () => {
      component.dataForSimpleGrid = undefined;
      fixture.detectChanges();
      await fixture.whenStable();
      const api = getGridApi(
        fixture.nativeElement.querySelector(
          '[data-sky-id="grid"] ag-grid-angular',
        ),
      );
      expect(api).toBeTruthy();
      expect(api?.getDisplayedRowCount()).toBe(0);

      component.dataForSimpleGrid = [
        { id: '1', column1: '1', column2: 'Apple', column3: true },
        { id: '2', column1: '01', column2: 'Banana', column3: false },
      ];
      fixture.detectChanges();
      await fixture.whenStable();
      expect(api?.getDisplayedRowCount()).toBe(2);
    });

    it('should handle data sort', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      const gridElement = fixture.nativeElement.querySelector(
        '[data-sky-id="grid"] ag-grid-angular',
      );
      const api = getGridApi(gridElement);
      expect(api).toBeTruthy();
      expect(api?.getState()?.sort?.sortModel).toBeUndefined();

      fixture.componentRef.setInput('sortField', {
        fieldSelector: 'column1',
        descending: false,
      });
      fixture.detectChanges();
      await fixture.whenStable();
      expect(api?.getState()?.sort?.sortModel).toEqual([
        {
          colId: 'column1',
          sort: 'asc',
        },
      ]);

      fixture.componentRef.setInput('sortField', {
        fieldSelector: 'column1',
        descending: true,
      });
      fixture.detectChanges();
      await fixture.whenStable();
      expect(api?.getState()?.sort?.sortModel).toEqual([
        {
          colId: 'column1',
          sort: 'desc',
        },
      ]);

      const column2SortButton = gridElement.querySelector(
        '.ag-header-cell.ag-header-cell-sortable[col-id="column2"] button.ag-header-cell-label-sortable',
      ) as HTMLButtonElement;
      expect(column2SortButton).toBeTruthy();
      SkyAppTestUtility.fireDomEvent(column2SortButton, 'click');
      await fixture.whenStable();
      SkyAppTestUtility.fireDomEvent(column2SortButton, 'click');
      await fixture.whenStable();

      expect(fixture.componentInstance.sortField()).toEqual({
        fieldSelector: 'column2',
        descending: true,
      });
      expect(api?.getState()?.sort?.sortModel).toEqual([
        {
          colId: 'column2',
          sort: 'desc',
        },
      ]);

      fixture.componentRef.setInput('sortField', undefined);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(api?.getState()?.sort?.sortModel).toBeUndefined();
    });

    it('should update grid options when pageSize changes', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      const api = getGridApi(
        fixture.nativeElement.querySelector(
          '[data-sky-id="grid"] ag-grid-angular',
        ),
      );
      expect(api).toBeTruthy();
      expect(api?.getGridOption('pagination')).toBeFalsy();

      fixture.componentRef.setInput('pageSize', 2);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(api?.getGridOption('pagination')).toBeTruthy();
      expect(api?.getGridOption('paginationPageSize')).toBe(2);
    });

    it('should constrict grid page size when using externalRowCount', async () => {
      fixture.componentRef.setInput('pageSize', 2);
      fixture.componentRef.setInput('externalRowCount', 123);
      fixture.detectChanges();
      await fixture.whenStable();
      const api = getGridApi(
        fixture.nativeElement.querySelector(
          '[data-sky-id="grid"] ag-grid-angular',
        ),
      );
      expect(api).toBeTruthy();
      expect(api?.getGridOption('pagination')).toBeFalsy();
      expect(api?.getDisplayedRowCount()).toBe(2);
    });

    it('should reset page number when it is no longer valid', async () => {
      fixture.componentRef.setInput('pageSize', 2);
      fixture.detectChanges();
      await fixture.whenStable();
      const grid = await loader.getHarness(SkyAgGridWrapperHarness);
      expect(await grid.isGridReady()).toBeTrue();
      expect(component.page()).toBe(1);
      component.page.set(2);
      fixture.detectChanges();
      await fixture.whenStable();
      const gridApi = getGridApi(
        fixture.nativeElement.querySelector('ag-grid-angular'),
      );
      expect(gridApi?.paginationGetCurrentPage()).toBe(1); // zero-based
      fixture.componentRef.setInput('pageSize', 10);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.page()).toBe(1);
    });

    it('should update grid options when height changes', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      const api = getGridApi(
        fixture.nativeElement.querySelector(
          '[data-sky-id="grid"] ag-grid-angular',
        ),
      );
      expect(api).toBeTruthy();
      expect(api?.getGridOption('domLayout')).toBe('autoHeight');

      fixture.componentRef.setInput('height', 200);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(api?.getGridOption('domLayout')).toBe('normal');

      fixture.componentRef.setInput('height', 0);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(api?.getGridOption('domLayout')).toBe('autoHeight');
    });

    it('should update grid options when multiselect changes', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      const api = getGridApi(
        fixture.nativeElement.querySelector(
          '[data-sky-id="grid"] ag-grid-angular',
        ),
      );
      expect(api).toBeTruthy();
      expect(api?.getGridOption('rowSelection')).toEqual(
        jasmine.objectContaining({
          mode: 'singleRow',
          enableClickSelection: false,
          enableSelectionWithoutKeys: true,
          checkboxes: false,
        }),
      );

      fixture.componentRef.setInput('multiselect', true);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(api?.getGridOption('rowSelection')).toEqual({
        mode: 'multiRow',
        checkboxes: true,
        headerCheckbox: true,
        checkboxLocation: 'selectionColumn',
      });
    });

    it('should select all rows', async () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
      const waitHarness =
        await TestbedHarnessEnvironment.loader(fixture).getHarness(
          SkyWaitHarness,
        );
      await expectAsync(waitHarness.isWaiting()).toBeResolvedTo(false);
      const api = getGridApi(
        fixture.nativeElement.querySelector(
          '[data-sky-id="multiselect-grid"] ag-grid-angular',
        ),
      );
      expect(api).toBeTruthy();
      expect(api?.getSelectedNodes()).toHaveSize(0);
      api?.selectAll();
      expect(api?.getSelectedNodes()).toHaveSize(7);
    });

    it('should select some rows', async () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
      fixture.detectChanges();
      await fixture.whenStable();
      const waitHarnesses =
        await TestbedHarnessEnvironment.loader(fixture).getAllHarnesses(
          SkyWaitHarness,
        );
      await expectAsync(
        Promise.all(
          waitHarnesses.map((waitHarness) => waitHarness.isWaiting()),
        ),
      ).toBeResolvedTo([false, false, false, false]);
      const api = getGridApi(
        fixture.nativeElement.querySelector(
          '[data-sky-id="multiselect-grid"] ag-grid-angular',
        ),
      );
      expect(api).toBeTruthy();
      expect(api?.getSelectedNodes()).toHaveSize(0);
      component.selectedRowIds.set(['102', '104', '106']);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(api?.getSelectedNodes()).toHaveSize(3);
    });

    it('should update selectedRowIds when data changes to remove IDs no longer in data', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      // Select some rows
      component.selectedRowIds.set(['101', '102', '103', '104', '105']);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.selectedRowIds()).toEqual([
        '101',
        '102',
        '103',
        '104',
        '105',
      ]);

      // Remove some items from the data (remove myId 102, 104)
      component.dataForSimpleGridWithMultiselect = [
        { id: '1', column1: '1', column2: 'Apple', column3: true, myId: '101' },
        {
          id: '3',
          column1: '11',
          column2: 'Banana',
          column3: true,
          myId: '103',
        },
        {
          id: '5',
          column1: '13',
          column2: 'Edamame',
          column3: true,
          myId: '105',
        },
      ];
      fixture.detectChanges();
      await fixture.whenStable();

      // selectedRowIds should be updated to only include IDs still in the data
      expect(component.selectedRowIds()).toEqual(['101', '103', '105']);
    });

    it('should update selectedRowIds when data changes from populated to fewer items', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      // Select all rows
      component.selectedRowIds.set([
        '101',
        '102',
        '103',
        '104',
        '105',
        '106',
        '107',
      ]);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.selectedRowIds()).toHaveSize(7);

      // Reduce data to just 2 items
      component.dataForSimpleGridWithMultiselect = [
        { id: '1', column1: '1', column2: 'Apple', column3: true, myId: '101' },
        {
          id: '2',
          column1: '01',
          column2: 'Banana',
          column3: false,
          myId: '102',
        },
      ];
      fixture.detectChanges();
      await fixture.whenStable();

      // selectedRowIds should only include IDs that are still in the data
      expect(component.selectedRowIds()).toEqual(['101', '102']);
    });

    it('should clear selectedRowIds when data changes to empty', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      // Select some rows
      component.selectedRowIds.set(['101', '102', '103']);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.selectedRowIds()).toEqual(['101', '102', '103']);

      // Clear the data
      component.dataForSimpleGridWithMultiselect = [];
      fixture.detectChanges();
      await fixture.whenStable();

      // selectedRowIds should be empty
      expect(component.selectedRowIds()).toEqual([]);
    });

    it('should update selectedRowIds when filters are applied to remove IDs of filtered-out rows', async () => {
      fixture.componentRef.setInput('showAllGrids', false);
      fixture.componentRef.setInput('showFilteredMultiselectGrid', true);
      fixture.detectChanges();
      await fixture.whenStable();

      const api = getGridApi(
        fixture.nativeElement.querySelector(
          '[data-sky-id="filtered-multiselect-grid"] ag-grid-angular',
        ),
      );
      expect(api).toBeTruthy();
      expect(api?.getDisplayedRowCount()).toBe(7);

      // Select some rows (ids 1, 2, 3, 4, 5)
      component.selectedRowIds.set(['1', '2', '3', '4', '5']);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.selectedRowIds()).toEqual(['1', '2', '3', '4', '5']);

      // Apply a filter that only shows rows where column2 starts with 'B' (Banana)
      // This should only include rows with ids 2 and 3
      fixture.componentRef.setInput('appliedFilters', [
        {
          filterId: 'column2Filter',
          filterValue: { value: 'B', displayValue: 'Starts with B' },
        },
      ]);
      fixture.detectChanges();
      await fixture.whenStable();

      // Should have 2 rows displayed
      expect(api?.getDisplayedRowCount()).toBe(2);

      // selectedRowIds should only include IDs of visible rows (2 and 3)
      expect(component.selectedRowIds()).toEqual(['2', '3']);
    });

    it('should restore selectedRowIds when filters are cleared', async () => {
      fixture.componentRef.setInput('showAllGrids', false);
      fixture.componentRef.setInput('showFilteredMultiselectGrid', true);
      fixture.detectChanges();
      await fixture.whenStable();

      const api = getGridApi(
        fixture.nativeElement.querySelector(
          '[data-sky-id="filtered-multiselect-grid"] ag-grid-angular',
        ),
      );
      expect(api).toBeTruthy();

      // Select rows 2 and 3 (Banana rows)
      component.selectedRowIds.set(['2', '3']);
      fixture.detectChanges();
      await fixture.whenStable();

      // Apply filter that shows Banana rows
      fixture.componentRef.setInput('appliedFilters', [
        {
          filterId: 'column2Filter',
          filterValue: { value: 'B', displayValue: 'Starts with B' },
        },
      ]);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(api?.getDisplayedRowCount()).toBe(2);
      expect(component.selectedRowIds()).toEqual(['2', '3']);

      // Clear filters - all rows should be visible again
      fixture.componentRef.setInput('appliedFilters', []);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(api?.getDisplayedRowCount()).toBe(7);

      // selectedRowIds should still be ['2', '3'] since those IDs are still valid
      expect(component.selectedRowIds()).toEqual(['2', '3']);
    });

    it('should update selectedRowIds when filter changes to a more restrictive filter', async () => {
      fixture.componentRef.setInput('showAllGrids', false);
      fixture.componentRef.setInput('showFilteredMultiselectGrid', true);
      fixture.detectChanges();
      await fixture.whenStable();

      const api = getGridApi(
        fixture.nativeElement.querySelector(
          '[data-sky-id="filtered-multiselect-grid"] ag-grid-angular',
        ),
      );
      expect(api).toBeTruthy();

      // Select all rows
      component.selectedRowIds.set(['1', '2', '3', '4', '5', '6', '7']);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.selectedRowIds()).toHaveSize(7);

      // Apply a filter that shows rows where column1 contains '1'
      // Rows: 1 (column1='1'), 2 (column1='01'), 3 (column1='11'), 4 (column1='12'), 5 (column1='13'), 7 (column1='21')
      fixture.componentRef.setInput('appliedFilters', [
        {
          filterId: 'column1Filter',
          filterValue: { value: '1', displayValue: 'Contains 1' },
        },
      ]);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(api?.getDisplayedRowCount()).toBe(6);
      expect(component.selectedRowIds()).toEqual([
        '1',
        '2',
        '3',
        '4',
        '5',
        '7',
      ]);

      // Apply a more restrictive filter that shows only rows starting with 'B'
      fixture.componentRef.setInput('appliedFilters', [
        {
          filterId: 'column1Filter',
          filterValue: { value: '1', displayValue: 'Contains 1' },
        },
        {
          filterId: 'column2Filter',
          filterValue: { value: 'B', displayValue: 'Starts with B' },
        },
      ]);
      fixture.detectChanges();
      await fixture.whenStable();

      // Only rows 2 and 3 match both filters
      expect(api?.getDisplayedRowCount()).toBe(2);
      expect(component.selectedRowIds()).toEqual(['2', '3']);
    });

    it('should highlight row', async () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
      const waitHarness = await TestbedHarnessEnvironment.loader(
        fixture,
      ).getHarness(SkyWaitHarness.with({ ancestor: '[data-sky-id="grid"]' }));
      await expectAsync(waitHarness.isWaiting()).toBeResolvedTo(false);
      const api = getGridApi(
        fixture.nativeElement.querySelector(
          '[data-sky-id="grid"] ag-grid-angular',
        ),
      );
      expect(api).toBeTruthy();
      expect(api?.getRowNode('2')?.isSelected()).toBeFalse();
      fixture.componentRef.setInput('rowHighlightedId', '2');
      fixture.detectChanges();
      await fixture.whenStable();
      expect(api?.getRowNode('2')?.isSelected()).toBeTrue();
    });

    it('should handle paging without url changes', async () => {
      fixture.componentRef.setInput('pageSize', 4);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component).toBeTruthy();
      const pagingHarness =
        await TestbedHarnessEnvironment.loader(fixture).getHarness(
          SkyPagingHarness,
        );
      await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(1);
      await pagingHarness.clickNextButton();
      await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(2);
      await pagingHarness.clickPreviousButton();
      await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(1);
    });

    it('should handle paging with url changes', async () => {
      fixture.componentRef.setInput('pageSize', 2);
      component.pageQueryParam = 'page';
      const router = TestBed.inject(Router);
      const navSpy = spyOn(router, 'navigate');
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component).toBeTruthy();
      const pagingHarness =
        await TestbedHarnessEnvironment.loader(fixture).getHarness(
          SkyPagingHarness,
        );
      await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(1);
      await pagingHarness.clickPageButton(2);
      await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(2);
      expect(navSpy).toHaveBeenCalledWith([], {
        relativeTo: jasmine.any(ActivatedRoute),
        queryParams: { page: 2 },
        queryParamsHandling: 'merge',
      });
      navSpy.calls.reset();

      component.page.set(2);
      fixture.detectChanges();

      await pagingHarness.clickPageButton(1);
      await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(1);
      expect(navSpy).toHaveBeenCalledWith([], {
        relativeTo: jasmine.any(ActivatedRoute),
        queryParams: { page: null },
        queryParamsHandling: 'merge',
      });
      navSpy.calls.reset();

      component.page.set(1);
      fixture.detectChanges();

      await pagingHarness.clickPageButton(3);
      await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(3);
      expect(navSpy).toHaveBeenCalledWith([], {
        relativeTo: jasmine.any(ActivatedRoute),
        queryParams: { page: 3 },
        queryParamsHandling: 'merge',
      });
      navSpy.calls.reset();

      component.page.set(3);
      fixture.detectChanges();

      await pagingHarness.clickPageButton(2);
      await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(2);
      expect(navSpy).toHaveBeenCalledWith([], {
        relativeTo: jasmine.any(ActivatedRoute),
        queryParams: { page: 2 },
        queryParamsHandling: 'merge',
      });
      navSpy.calls.reset();

      component.page.set(0);
      fixture.detectChanges();
      expect(navSpy).not.toHaveBeenCalledWith([], {
        relativeTo: jasmine.any(ActivatedRoute),
        queryParams: { page: 0 },
        queryParamsHandling: 'merge',
      });

      component.page.set(Number.POSITIVE_INFINITY);
      fixture.detectChanges();
      expect(navSpy).not.toHaveBeenCalledWith([], {
        relativeTo: jasmine.any(ActivatedRoute),
        queryParams: { page: Number.POSITIVE_INFINITY },
        queryParamsHandling: 'merge',
      });
    });
  });

  describe('with data manager', () => {
    let fixture: ComponentFixture<DataGridWDataManagerTestComponent>;
    let loader: HarnessLoader;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideRouter([]),
          provideLocationMocks(),
          provideNoopAnimations(),
        ],
      });
      fixture = TestBed.createComponent(DataGridWDataManagerTestComponent);
      loader = TestbedHarnessEnvironment.loader(fixture);
      const logger = TestBed.inject(SkyLogService);
      spyOn(logger, 'warn');
    });

    it('should pick up displayed columns from data manager', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      const dm = await loader.getHarness(
        SkyDataManagerHarness.with({ dataSkyId: 'my-data-manager' }),
      );
      const columnChooser = await dm
        .getToolbar()
        .then(async (toolbar) => await toolbar.openColumnPicker());
      await columnChooser.clearAll();
      await columnChooser.selectColumns({ titleText: 'Name' });
      await columnChooser.saveAndClose();
      const gridElement =
        fixture.nativeElement.querySelector('ag-grid-angular');
      expect(gridElement).toBeTruthy();
      const gridApi = getGridApi(gridElement);
      expect(gridApi?.getAllDisplayedColumns()).toHaveSize(1);
    });

    it('should handle displayed columns from data manager when not specified', async () => {
      fixture.componentInstance.displayedColumnIds = undefined;
      fixture.detectChanges();
      await fixture.whenStable();
      const grid = await loader.getHarness(SkyAgGridWrapperHarness);
      expect(await grid.isGridReady()).toBeTrue();
      const gridElement =
        fixture.nativeElement.querySelector('ag-grid-angular');
      expect(gridElement).toBeTruthy();
      const gridApi = getGridApi(gridElement);
      expect(gridApi?.getColumns()).toHaveSize(2);
      expect(await grid.getDisplayedColumnIds()).toHaveSize(2);
    });

    it('should not pick up search text from data manager', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      const gridElement =
        fixture.nativeElement.querySelector('ag-grid-angular');
      expect(gridElement).toBeTruthy();
      const gridApi = getGridApi(gridElement);
      expect(gridApi?.isDestroyed()).toBeFalse();
      const dm = await loader.getHarness(
        SkyDataManagerHarness.with({ dataSkyId: 'my-data-manager' }),
      );
      const toolbar = await dm.getToolbar();
      const search = (await toolbar.getSearch()) as SkySearchHarness;
      expect(search).toBeTruthy();
      if (await search.isCollapsed()) {
        await search.clickOpenSearchButton();
      }
      await search.enterText('fruit');
      fixture.detectChanges();
      await fixture.whenStable();
      expect(gridApi?.getGridOption('quickFilterText')).not.toBe('fruit');
    });

    it('should send sort field update through data manager', async () => {
      fixture.componentRef.setInput('sortField', {
        fieldSelector: 'category',
        descending: false,
      });
      fixture.detectChanges();
      await fixture.whenStable();
      expect(
        fixture.componentInstance.dataManagerState().activeSortOption,
      ).toEqual({
        id: 'category',
        propertyName: 'category',
        label: 'Category',
        descending: false,
      });
    });
  });
});
