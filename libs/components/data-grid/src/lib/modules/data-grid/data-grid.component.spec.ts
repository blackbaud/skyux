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
    let loggerSpy: jasmine.Spy;
    let loader: HarnessLoader;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideRouter([]), provideLocationMocks()],
      });
      fixture = TestBed.createComponent(DataGridTestComponent);
      loader = TestbedHarnessEnvironment.loader(fixture);
      component = fixture.componentInstance;
      const logger = TestBed.inject(SkyLogService);
      loggerSpy = spyOn(logger, 'warn').and.returnValue(undefined);
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

    it('should respond to displayedColumns input', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component).toBeTruthy();
      const grids = await loader.getAllHarnesses(SkyAgGridWrapperHarness);
      expect(
        await Promise.all(
          grids.map((grid) => grid.getDisplayedColumnIds()),
        ).then((cols) => cols.flatMap((id) => id).length),
      ).toEqual(4 * 3 + 3); // 4 grids with 3 columns each, plus 3 extra headers for the multi-select and row delete grid

      fixture.componentRef.setInput('displayedColumns', ['column1', 'column2']);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(
        await Promise.all(
          grids.map((grid) => grid.getDisplayedColumnIds()),
        ).then((cols) => cols.flatMap((id) => id).length),
      ).toEqual(4 * 2 + 1); // 4 grids with 2 columns each, plus 1 extra header for multi-select
      expect(component.visibleColumnIds()).toEqual(['column1', 'column2']);

      fixture.componentRef.setInput('displayedColumns', [
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

      fixture.componentRef.setInput('gridSort', {
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

      fixture.componentRef.setInput('gridSort', {
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

      expect(fixture.componentInstance.gridSort()).toEqual({
        fieldSelector: 'column2',
        descending: true,
      });
      expect(api?.getState()?.sort?.sortModel).toEqual([
        {
          colId: 'column2',
          sort: 'desc',
        },
      ]);

      fixture.componentRef.setInput('gridSort', undefined);
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

    it('should constrict grid page size when using totalRowCount', async () => {
      fixture.componentRef.setInput('pageSize', 2);
      fixture.componentRef.setInput('totalRowCount', 123);
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

    it('should update grid options when enableMultiselect changes', async () => {
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

      fixture.componentRef.setInput('enableMultiselect', true);
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

      component.page = 2;
      fixture.detectChanges();

      await pagingHarness.clickPageButton(1);
      await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(1);
      expect(navSpy).toHaveBeenCalledWith([], {
        relativeTo: jasmine.any(ActivatedRoute),
        queryParams: { page: null },
        queryParamsHandling: 'merge',
      });
      navSpy.calls.reset();

      component.page = 1;
      fixture.detectChanges();

      await pagingHarness.clickPageButton(3);
      await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(3);
      expect(navSpy).toHaveBeenCalledWith([], {
        relativeTo: jasmine.any(ActivatedRoute),
        queryParams: { page: 3 },
        queryParamsHandling: 'merge',
      });
      navSpy.calls.reset();

      component.page = 3;
      fixture.detectChanges();

      await pagingHarness.clickPageButton(2);
      await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(2);
      expect(navSpy).toHaveBeenCalledWith([], {
        relativeTo: jasmine.any(ActivatedRoute),
        queryParams: { page: 2 },
        queryParamsHandling: 'merge',
      });
      navSpy.calls.reset();

      component.page = 0;
      fixture.detectChanges();
      expect(navSpy).not.toHaveBeenCalledWith([], {
        relativeTo: jasmine.any(ActivatedRoute),
        queryParams: { page: 0 },
        queryParamsHandling: 'merge',
      });

      component.page = Number.POSITIVE_INFINITY;
      fixture.detectChanges();
      expect(navSpy).not.toHaveBeenCalledWith([], {
        relativeTo: jasmine.any(ActivatedRoute),
        queryParams: { page: Number.POSITIVE_INFINITY },
        queryParamsHandling: 'merge',
      });
    });

    describe('apply filters', () => {
      it('should not apply filter when totalRowCount is set', async () => {
        fixture.componentRef.setInput('showAllGrids', false);
        fixture.componentRef.setInput('showFilteredGrid', true);
        fixture.componentRef.setInput('totalRowCount', 123);
        fixture.detectChanges();
        await fixture.whenStable();

        const api = getGridApi(
          fixture.nativeElement.querySelector(
            '[data-sky-id="filtered-grid"] ag-grid-angular',
          ),
        );
        expect(api).toBeTruthy();
        expect(api?.getDisplayedRowCount()).toBe(7);

        // Apply a text filter
        fixture.componentRef.setInput('appliedFilters', [
          {
            filterId: 'column1Filter',
            filterValue: { value: ['1'], displayValue: 'Contains "1"' },
          },
          {
            filterId: 'column2Filter',
            filterValue: { value: 'Ban', displayValue: 'Starts with Ban' },
          },
        ]);
        fixture.detectChanges();
        await fixture.whenStable();

        // Should not filter rows because totalRowCount is set and data has not been updated.
        expect(api?.getDisplayedRowCount()).toBe(7);
      });

      it('should apply text filter to grid', async () => {
        fixture.componentRef.setInput('showAllGrids', false);
        fixture.componentRef.setInput('showFilteredGrid', true);
        fixture.detectChanges();
        await fixture.whenStable();

        const api = getGridApi(
          fixture.nativeElement.querySelector(
            '[data-sky-id="filtered-grid"] ag-grid-angular',
          ),
        );
        expect(api).toBeTruthy();
        expect(api?.getDisplayedRowCount()).toBe(7);

        // Apply a text filter
        fixture.componentRef.setInput('appliedFilters', [
          {
            filterId: 'column1Filter',
            filterValue: { value: ['1'], displayValue: 'Contains "1"' },
          },
          {
            filterId: 'column2Filter',
            filterValue: { value: 'Ban', displayValue: 'Starts with Ban' },
          },
        ]);
        fixture.detectChanges();
        await fixture.whenStable();

        // Should filter to rows where column2 starts with 'Ban' (Banana)
        expect(api?.getDisplayedRowCount()).toBe(2);
      });

      it('should apply multiple filters simultaneously', async () => {
        fixture.componentRef.setInput('showAllGrids', false);
        fixture.componentRef.setInput('showFilteredGrid', true);
        fixture.detectChanges();
        await fixture.whenStable();

        const api = getGridApi(
          fixture.nativeElement.querySelector(
            '[data-sky-id="filtered-grid"] ag-grid-angular',
          ),
        );
        expect(api).toBeTruthy();
        expect(api?.getDisplayedRowCount()).toBe(7);

        // Apply multiple filters
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

        // Should filter to rows where column1 contains '1' AND column2 starts with 'B'
        // column1='1' has column2='Apple' (no match)
        // column1='01' has column2='Banana' (match)
        // column1='11' has column2='Banana' (match)
        // column1='12' has column2='Daikon' (no match)
        // column1='13' has column2='Edamame' (no match)
        expect(api?.getDisplayedRowCount()).toBe(2);
      });

      it('should clear filters when appliedFilters is set to empty', async () => {
        fixture.componentRef.setInput('showAllGrids', false);
        fixture.componentRef.setInput('showFilteredGrid', true);
        fixture.detectChanges();
        await fixture.whenStable();

        const api = getGridApi(
          fixture.nativeElement.querySelector(
            '[data-sky-id="filtered-grid"] ag-grid-angular',
          ),
        );
        expect(api).toBeTruthy();
        expect(api?.getDisplayedRowCount()).toBe(7);

        // Apply filter first
        fixture.componentRef.setInput('appliedFilters', [
          {
            filterId: 'column2Filter',
            filterValue: { value: 'Ban', displayValue: 'Starts with Ban' },
          },
        ]);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(api?.getDisplayedRowCount()).toBe(2);

        // Clear filters
        fixture.componentRef.setInput('appliedFilters', []);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(api?.getDisplayedRowCount()).toBe(7);
      });

      it('should clear filters when appliedFilters is set to undefined', async () => {
        fixture.componentRef.setInput('showAllGrids', false);
        fixture.componentRef.setInput('showFilteredGrid', true);
        fixture.detectChanges();
        await fixture.whenStable();

        const api = getGridApi(
          fixture.nativeElement.querySelector(
            '[data-sky-id="filtered-grid"] ag-grid-angular',
          ),
        );
        expect(api).toBeTruthy();
        expect(api?.getDisplayedRowCount()).toBe(7);

        // Apply filter first
        fixture.componentRef.setInput('appliedFilters', [
          {
            filterId: 'column2Filter',
            filterValue: { value: 'Ban', displayValue: 'Starts with Ban' },
          },
        ]);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(api?.getDisplayedRowCount()).toBe(2);

        // Clear filters by setting undefined
        fixture.componentRef.setInput('appliedFilters', undefined);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(api?.getDisplayedRowCount()).toBe(7);
      });

      it('should ignore filters without matching column filterId', async () => {
        fixture.componentRef.setInput('showAllGrids', false);
        fixture.componentRef.setInput('showFilteredGrid', true);
        fixture.detectChanges();
        await fixture.whenStable();

        const api = getGridApi(
          fixture.nativeElement.querySelector(
            '[data-sky-id="filtered-grid"] ag-grid-angular',
          ),
        );
        expect(api).toBeTruthy();
        expect(api?.getDisplayedRowCount()).toBe(7);

        // Apply a filter with non-existent filterId
        fixture.componentRef.setInput('appliedFilters', [
          {
            filterId: 'nonExistentFilter',
            filterValue: { value: 'test', displayValue: 'Test' },
          },
        ]);
        fixture.detectChanges();
        await fixture.whenStable();

        // Should not filter any rows since the filterId doesn't match any column
        expect(api?.getDisplayedRowCount()).toBe(7);
      });

      it('should ignore filters with undefined value', async () => {
        fixture.componentRef.setInput('showAllGrids', false);
        fixture.componentRef.setInput('showFilteredGrid', true);
        fixture.detectChanges();
        await fixture.whenStable();

        const api = getGridApi(
          fixture.nativeElement.querySelector(
            '[data-sky-id="filtered-grid"] ag-grid-angular',
          ),
        );
        expect(api).toBeTruthy();
        expect(api?.getDisplayedRowCount()).toBe(7);

        // Apply a filter with undefined value
        fixture.componentRef.setInput('appliedFilters', [
          {
            filterId: 'column2Filter',
            filterValue: undefined,
          },
        ]);
        fixture.detectChanges();
        await fixture.whenStable();

        // Should not filter any rows since the value is undefined
        expect(api?.getDisplayedRowCount()).toBe(7);
      });

      it('should update filter when appliedFilters changes', async () => {
        fixture.componentRef.setInput('showAllGrids', false);
        fixture.componentRef.setInput('showFilteredGrid', true);
        fixture.detectChanges();
        await fixture.whenStable();

        const api = getGridApi(
          fixture.nativeElement.querySelector(
            '[data-sky-id="filtered-grid"] ag-grid-angular',
          ),
        );
        expect(api).toBeTruthy();

        // Apply initial filter
        fixture.componentRef.setInput('appliedFilters', [
          {
            filterId: 'column2Filter',
            filterValue: { value: 'A', displayValue: 'Starts with A' },
          },
        ]);
        fixture.detectChanges();
        await fixture.whenStable();

        // Should filter to Apple only
        expect(api?.getDisplayedRowCount()).toBe(1);

        // Update filter
        fixture.componentRef.setInput('appliedFilters', [
          {
            filterId: 'column2Filter',
            filterValue: { value: 'B', displayValue: 'Starts with B' },
          },
        ]);
        fixture.detectChanges();
        await fixture.whenStable();

        // Should now filter to Banana rows
        expect(api?.getDisplayedRowCount()).toBe(2);
      });

      it('should apply text filter with operators', async () => {
        fixture.componentRef.setInput('showAllGrids', false);
        fixture.componentRef.setInput('showFilteredGrid', true);
        fixture.detectChanges();
        await fixture.whenStable();

        const api = getGridApi(
          fixture.nativeElement.querySelector(
            '[data-sky-id="filtered-grid"] ag-grid-angular',
          ),
        );
        expect(api).toBeTruthy();
        expect(api?.getDisplayedRowCount()).toBe(7);

        // Apply a text filter using a column without filterOperator (should default to 'contains')
        fixture.componentRef.setInput('appliedFilters', [
          {
            filterId: 'column2VarOperatorFilter',
            filterValue: { value: 'ana', displayValue: 'Contains ana' },
          },
        ]);
        fixture.detectChanges();
        await fixture.whenStable();

        // Should filter to rows where column2 contains 'ana' (Banana)
        expect(api?.getDisplayedRowCount()).toBe(2);

        fixture.componentRef.setInput('textFilterOperator', 'startsWith');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(api?.getDisplayedRowCount()).toBe(0);

        fixture.componentRef.setInput('textFilterOperator', 'endsWith');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(api?.getDisplayedRowCount()).toBe(2);

        fixture.componentRef.setInput('textFilterOperator', 'notContains');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(api?.getDisplayedRowCount()).toBe(5);

        fixture.componentRef.setInput('textFilterOperator', 'equals');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(api?.getDisplayedRowCount()).toBe(0);

        fixture.componentRef.setInput('textFilterOperator', 'notEqual');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(api?.getDisplayedRowCount()).toBe(7);

        // Does not apply to text filters, but verify no errors occur.
        fixture.componentRef.setInput('textFilterOperator', 'lessThanOrEqual');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(api?.getDisplayedRowCount()).toBe(7);
        expect(loggerSpy).toHaveBeenCalledWith(
          `Unsupported text filter operator: lessThanOrEqual`,
        );

        // Update filter to use 'startsWith' operator
        fixture.componentRef.setInput('textFilterOperator', 'startsWith');
        fixture.componentRef.setInput('appliedFilters', [
          {
            filterId: 'column2VarOperatorFilter',
            filterValue: { value: 'Ban', displayValue: 'Starts with Ban' },
          },
        ]);
        fixture.detectChanges();
        await fixture.whenStable();

        // Should still filter to rows where column2 starts with 'Ban' (Banana)
        expect(api?.getDisplayedRowCount()).toBe(2);

        component.dataForFilteredGrid = [
          ...component.dataForFilteredGrid.map((item) => ({
            ...item,
            column2: null,
          })),
        ];
        fixture.detectChanges();
        await fixture.whenStable();
        expect(api?.getDisplayedRowCount()).toBe(0);
      });

      it('should apply number filter to grid', async () => {
        fixture.componentRef.setInput('showAllGrids', false);
        fixture.componentRef.setInput('showFilteredGrid', true);
        fixture.detectChanges();
        await fixture.whenStable();

        const api = getGridApi(
          fixture.nativeElement.querySelector(
            '[data-sky-id="filtered-grid"] ag-grid-angular',
          ),
        );
        expect(api).toBeTruthy();
        expect(api?.getDisplayedRowCount()).toBe(7);

        // Apply a number filter (equals)
        fixture.componentRef.setInput('appliedFilters', [
          {
            filterId: 'numericFilter',
            filterValue: { value: 200, displayValue: 'Equals 200' },
          },
        ]);
        fixture.detectChanges();
        await fixture.whenStable();

        // Should filter to rows where numericColumn equals 200
        expect(api?.getDisplayedRowCount()).toBe(1);

        fixture.componentRef.setInput('numberFilterOperator', 'notEqual');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(api?.getDisplayedRowCount()).toBe(6);

        fixture.componentRef.setInput(
          'numberFilterOperator',
          'lessThanOrEqual',
        );
        fixture.detectChanges();
        await fixture.whenStable();
        expect(api?.getDisplayedRowCount()).toBe(5);

        fixture.componentRef.setInput('numberFilterOperator', 'lessThan');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(api?.getDisplayedRowCount()).toBe(4);

        fixture.componentRef.setInput(
          'numberFilterOperator',
          'greaterThanOrEqual',
        );
        fixture.detectChanges();
        await fixture.whenStable();
        expect(api?.getDisplayedRowCount()).toBe(3);

        fixture.componentRef.setInput('numberFilterOperator', 'greaterThan');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(api?.getDisplayedRowCount()).toBe(2);

        // Does not apply to number filters, but verify no errors occur.
        fixture.componentRef.setInput('numberFilterOperator', 'contains');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(api?.getDisplayedRowCount()).toBe(7);
        expect(loggerSpy).toHaveBeenCalledWith(
          `Unsupported number or date filter operator: contains`,
        );
      });

      it('should apply number range filter to grid', async () => {
        fixture.componentRef.setInput('showAllGrids', false);
        fixture.componentRef.setInput('showFilteredGrid', true);
        fixture.detectChanges();
        await fixture.whenStable();

        const api = getGridApi(
          fixture.nativeElement.querySelector(
            '[data-sky-id="filtered-grid"] ag-grid-angular',
          ),
        );
        expect(api).toBeTruthy();
        expect(api?.getDisplayedRowCount()).toBe(7);

        // Apply a number range filter
        fixture.componentRef.setInput('appliedFilters', [
          {
            filterId: 'numericFilter',
            filterValue: {
              value: { from: 150, to: 250 },
              displayValue: 'Between 150 and 250',
            },
          },
        ]);
        fixture.detectChanges();
        await fixture.whenStable();

        // Should filter to rows where numericColumn is between 150 and 250 (inclusive)
        // Values: 100, 200, 150, 250, 175, 300, 125 -> 200, 150, 250, 175 = 4 rows
        expect(api?.getDisplayedRowCount()).toBe(4);

        fixture.componentRef.setInput('appliedFilters', [
          {
            filterId: 'numericFilter',
            filterValue: {
              value: { from: null, to: 250 },
              displayValue: 'Up to 250',
            },
          },
        ]);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(api?.getDisplayedRowCount()).toBe(6);

        fixture.componentRef.setInput('appliedFilters', [
          {
            filterId: 'numericFilter',
            filterValue: {
              value: { from: 150, to: null },
              displayValue: 'Up from 150',
            },
          },
        ]);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(api?.getDisplayedRowCount()).toBe(5);
      });

      it('should apply date filter to grid', async () => {
        fixture.componentRef.setInput('showAllGrids', false);
        fixture.componentRef.setInput('showFilteredGrid', true);
        fixture.detectChanges();
        await fixture.whenStable();

        const api = getGridApi(
          fixture.nativeElement.querySelector(
            '[data-sky-id="filtered-grid"] ag-grid-angular',
          ),
        );
        expect(api).toBeTruthy();
        expect(api?.getDisplayedRowCount()).toBe(7);

        // Apply a date filter (equals)
        fixture.componentRef.setInput('appliedFilters', [
          {
            filterId: 'dateFilter',
            filterValue: {
              value: new Date('2024-03-10T00:00:00.000Z'),
              displayValue: 'March 10, 2024',
            },
          },
        ]);
        fixture.detectChanges();
        await fixture.whenStable();

        // Should filter to rows where dateColumn equals 2024-03-10
        expect(api?.getDisplayedRowCount()).toBe(1);
      });

      it('should apply date range filter to grid', async () => {
        fixture.componentRef.setInput('showAllGrids', false);
        fixture.componentRef.setInput('showFilteredGrid', true);
        fixture.detectChanges();
        await fixture.whenStable();

        const api = getGridApi(
          fixture.nativeElement.querySelector(
            '[data-sky-id="filtered-grid"] ag-grid-angular',
          ),
        );
        expect(api).toBeTruthy();
        expect(api?.getDisplayedRowCount()).toBe(7);

        // Apply a date range filter
        fixture.componentRef.setInput('appliedFilters', [
          {
            filterId: 'dateFilter',
            filterValue: {
              value: {
                startDate: new Date('2024-02-01T00:00:00.000Z'),
                endDate: new Date('2024-05-01T00:00:00.000Z'),
              },
              displayValue: 'Feb 1 to May 1, 2024',
            },
          },
        ]);
        fixture.detectChanges();
        await fixture.whenStable();

        // Should filter to rows where dateColumn is between Feb 1 and May 1, 2024
        // Dates: Jan 15, Feb 20, Mar 10, Apr 5, May 25, Jun 30, Jul 12
        // In range: Feb 20, Mar 10, Apr 5 = 3 rows
        expect(api?.getDisplayedRowCount()).toBe(3);

        fixture.componentRef.setInput('appliedFilters', [
          {
            filterId: 'dateFilter',
            filterValue: {
              value: {
                endDate: new Date('2024-05-01T00:00:00.000Z'),
              },
              displayValue: 'Before May 1, 2024',
            },
          },
        ]);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(api?.getDisplayedRowCount()).toBe(4);
      });

      it('should apply boolean filter', async () => {
        fixture.componentRef.setInput('showAllGrids', false);
        fixture.componentRef.setInput('showFilteredGrid', true);
        fixture.detectChanges();
        await fixture.whenStable();

        const api = getGridApi(
          fixture.nativeElement.querySelector(
            '[data-sky-id="filtered-grid"] ag-grid-angular',
          ),
        );
        expect(api).toBeTruthy();
        expect(api?.getDisplayedRowCount()).toBe(7);

        // Apply a boolean filter
        fixture.componentRef.setInput('appliedFilters', [
          {
            filterId: 'column3Filter',
            filterValue: { value: true, displayValue: 'True' },
          },
        ]);
        fixture.detectChanges();
        await fixture.whenStable();

        // Boolean filters are not supported by AG Grid, so no filtering should occur
        expect(api?.getDisplayedRowCount()).toBe(4);

        fixture.componentRef.setInput('booleanFilterOperator', 'notEqual');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(api?.getDisplayedRowCount()).toBe(3);

        // Does not apply to boolean filters, but verify no errors occur.
        fixture.componentRef.setInput('booleanFilterOperator', 'contains');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(api?.getDisplayedRowCount()).toBe(7);
        expect(loggerSpy).toHaveBeenCalledWith(
          `Unsupported boolean filter operator: contains`,
        );
      });

      it('should ignore filter when column with filterId does not exist in grid', async () => {
        fixture.componentRef.setInput('showAllGrids', false);
        fixture.componentRef.setInput('showFilteredGrid', true);
        fixture.detectChanges();
        await fixture.whenStable();

        const api = getGridApi(
          fixture.nativeElement.querySelector(
            '[data-sky-id="filtered-grid"] ag-grid-angular',
          ),
        );
        expect(api).toBeTruthy();
        expect(api?.getDisplayedRowCount()).toBe(7);

        // Apply a filter referencing a non-existent column
        fixture.componentRef.setInput('appliedFilters', [
          {
            filterId: 'nonExistentColumnFilter',
            filterValue: { value: 'test', displayValue: 'Test' },
          },
        ]);
        fixture.detectChanges();
        await fixture.whenStable();

        // Should not filter any rows since the column doesn't exist
        expect(api?.getDisplayedRowCount()).toBe(7);
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
      await new Promise((resolve) => setTimeout(resolve));
      fixture.detectChanges();
      await fixture.whenStable();
      const gridElement =
        fixture.nativeElement.querySelector('ag-grid-angular');
      expect(gridElement).toBeTruthy();
      const gridApi = getGridApi(gridElement);
      expect(gridApi?.getColumns()).toHaveSize(2);
      expect(gridApi?.getAllDisplayedColumns()).toHaveSize(2);
    });

    it('should pick up search text from data manager', async () => {
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
      expect(gridApi?.getGridOption('quickFilterText')).toBe('fruit');
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
