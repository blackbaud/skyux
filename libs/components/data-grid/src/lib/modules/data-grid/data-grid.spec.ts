import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideLocationMocks } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { SkyAppTestUtility } from '@skyux-sdk/testing';
import { SkyLogService } from '@skyux/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SkyAgGridWrapperHarness } from '@skyux/ag-grid/testing';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SkyWaitHarness } from '@skyux/indicators/testing';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SkyPagingHarness } from '@skyux/lists/testing';

import { getGridApi } from 'ag-grid-community';
import { SkyDataGrid } from './data-grid';
import { DataGridTestComponent } from './fixtures/data-grid-test.component';
import { FlexWidthTestComponent } from './fixtures/flex-width-test.component';
import { ResourceDataTestComponent } from './fixtures/resource-data-test.component';
import { TemplateColumnTestComponent } from './fixtures/template-column-test.component';

describe('SkyDataGrid', () => {
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
      expect(fixture.debugElement.queryAll(By.directive(SkyDataGrid))).toEqual(
        [],
      );

      fixture.componentRef.setInput('showAllGrids', true);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(
        fixture.debugElement.queryAll(By.directive(SkyDataGrid)).length,
      ).toEqual(3);
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
      ).toEqual(3 + 5 + 3); // grid (3 cols) + multiselect-grid (4 cols + select column) + inline-help-grid (3 cols)

      fixture.componentRef.setInput('showCol3', false);
      fixture.detectChanges();
      await fixture.whenStable();
      let visibleColumnIds = await Promise.all(
        grids.map((grid) => grid.getDisplayedColumnIds()),
      );
      expect(
        visibleColumnIds.map((id) => id.length).reduce((a, b) => a + b, 0),
      ).toEqual(2 + 4 + 2); // column3 hidden: grid (2 cols) + multiselect-grid (3 cols + select column) + inline-help-grid (2 cols)
      expect(visibleColumnIds[0]).toEqual(['column1', 'column2']);

      fixture.componentRef.setInput('showCol3', true);
      fixture.detectChanges();
      await fixture.whenStable();
      visibleColumnIds = await Promise.all(
        grids.map((grid) => grid.getDisplayedColumnIds()),
      );
      expect(
        visibleColumnIds.map((id) => id.length).reduce((a, b) => a + b, 0),
      ).toEqual(3 + 5 + 3); // column3 restored: grid (3 cols) + multiselect-grid (4 cols + select column) + inline-help-grid (3 cols)
      expect(visibleColumnIds[0]).toEqual(['column1', 'column2', 'column3']);

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

      fixture.componentRef.setInput('sort', {
        fieldSelector: 'column1',
        descending: false,
      });
      fixture.detectChanges();
      await fixture.whenStable();
      expect(api?.getState()?.sort?.sortModel).toEqual([
        {
          colId: 'column1',
          sort: 'asc',
          type: 'default',
        },
      ]);

      fixture.componentRef.setInput('sort', {
        fieldSelector: 'column1',
        descending: true,
      });
      fixture.detectChanges();
      await fixture.whenStable();
      expect(api?.getState()?.sort?.sortModel).toEqual([
        {
          colId: 'column1',
          sort: 'desc',
          type: 'default',
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

      expect(fixture.componentInstance.sort()).toEqual({
        fieldSelector: 'column2',
        descending: true,
      });
      expect(api?.getState()?.sort?.sortModel).toEqual([
        {
          colId: 'column2',
          sort: 'desc',
          type: 'default',
        },
      ]);

      fixture.componentRef.setInput('sort', undefined);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(api?.getState()?.sort?.sortModel).toBeUndefined();
    });

    it('should preserve user column order when the sort changes', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      const gridElement = fixture.nativeElement.querySelector(
        '[data-sky-id="grid"] ag-grid-angular',
      );
      const api = getGridApi(gridElement);
      expect(api).toBeTruthy();
      expect(api?.getColumnState().map((col) => col.colId)).toEqual([
        'column1',
        'column2',
        'column3',
      ]);

      // Simulate a user dragging "column1" to the end of the grid.
      api?.moveColumnByIndex(0, 2);
      await fixture.whenStable();
      expect(api?.getColumnState().map((col) => col.colId)).toEqual([
        'column2',
        'column3',
        'column1',
      ]);

      // Sorting programmatically must not reset the user's column order.
      fixture.componentRef.setInput('sort', {
        fieldSelector: 'column2',
        descending: true,
      });
      fixture.detectChanges();
      await fixture.whenStable();
      expect(api?.getState()?.sort?.sortModel).toEqual([
        { colId: 'column2', sort: 'desc', type: 'default' },
      ]);
      expect(api?.getColumnState().map((col) => col.colId)).toEqual([
        'column2',
        'column3',
        'column1',
      ]);

      // Sorting via a column header click must also keep the column order.
      const column1SortButton = gridElement.querySelector(
        '.ag-header-cell.ag-header-cell-sortable[col-id="column1"] button.ag-header-cell-label-sortable',
      ) as HTMLButtonElement;
      expect(column1SortButton).toBeTruthy();
      SkyAppTestUtility.fireDomEvent(column1SortButton, 'click');
      await fixture.whenStable();
      expect(fixture.componentInstance.sort()).toEqual({
        fieldSelector: 'column1',
        descending: false,
      });
      expect(api?.getColumnState().map((col) => col.colId)).toEqual([
        'column2',
        'column3',
        'column1',
      ]);
    });

    it('should apply an initial descending sort set before the grid renders', async () => {
      fixture.componentRef.setInput('sort', {
        fieldSelector: 'column1',
        descending: true,
      });
      fixture.detectChanges();
      await fixture.whenStable();
      const api = getGridApi(
        fixture.nativeElement.querySelector(
          '[data-sky-id="grid"] ag-grid-angular',
        ),
      );
      expect(api?.getState()?.sort?.sortModel).toEqual([
        { colId: 'column1', sort: 'desc', type: 'default' },
      ]);
    });

    it('should apply an initial ascending sort set before the grid renders', async () => {
      fixture.componentRef.setInput('sort', {
        fieldSelector: 'column2',
        descending: false,
      });
      fixture.detectChanges();
      await fixture.whenStable();
      const api = getGridApi(
        fixture.nativeElement.querySelector(
          '[data-sky-id="grid"] ag-grid-angular',
        ),
      );
      expect(api?.getState()?.sort?.sortModel).toEqual([
        { colId: 'column2', sort: 'asc', type: 'default' },
      ]);
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
      ).toBeResolvedTo([false, false, false]);
      const api = getGridApi(
        fixture.nativeElement.querySelector(
          '[data-sky-id="multiselect-grid"] ag-grid-angular',
        ),
      );
      expect(api).toBeTruthy();
      expect(api?.getSelectedNodes()).toHaveSize(0);
      component.selectedRowIds.set(['2', '4', '6']);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(api?.getSelectedNodes()).toHaveSize(3);
    });

    it('should deselect rows when selectedRowIds is reduced programmatically', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      const api = getGridApi(
        fixture.nativeElement.querySelector(
          '[data-sky-id="multiselect-grid"] ag-grid-angular',
        ),
      );
      expect(api).toBeTruthy();
      component.selectedRowIds.set(['2', '4', '6']);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(api?.getSelectedNodes()).toHaveSize(3);

      // Reducing the bound set must deselect the rows no longer included.
      component.selectedRowIds.set(['2']);
      fixture.detectChanges();
      await fixture.whenStable();
      const selectedNodes = api?.getSelectedNodes();
      expect(selectedNodes).toHaveSize(1);
      expect(selectedNodes?.[0]?.id).toBe('2');
    });

    it('should update selectedRowIds when data changes to remove IDs no longer in data', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      // Select some rows
      component.selectedRowIds.set(['1', '2', '3', '4', '5']);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.selectedRowIds()).toEqual(['1', '2', '3', '4', '5']);

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
      expect(component.selectedRowIds()).toEqual(['1', '3', '5']);
      const api = getGridApi(
        fixture.nativeElement.querySelector(
          '[data-sky-id="multiselect-grid"] ag-grid-angular',
        ),
      );
      expect(api).toBeTruthy();
      api?.getRowNode('3')?.setSelected(false);
      // AG Grid emits `selectionChanged` for a programmatic deselect on a
      // macrotask, which `whenStable()` does not await on its own.
      await new Promise((resolve) => setTimeout(resolve));
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.selectedRowIds()).toEqual(['1', '5']);
    });

    it('should update selectedRowIds when data changes from populated to fewer items', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      // Select all rows
      component.selectedRowIds.set(['1', '2', '3', '4', '5', '6', '7']);
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
      expect(component.selectedRowIds()).toEqual(['1', '2']);
    });

    it('should clear selectedRowIds when data changes to empty', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      // Select some rows
      component.selectedRowIds.set(['1', '2', '3']);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.selectedRowIds()).toEqual(['1', '2', '3']);

      // Clear the data
      component.dataForSimpleGridWithMultiselect = [];
      fixture.detectChanges();
      await fixture.whenStable();

      // selectedRowIds should be empty
      expect(component.selectedRowIds()).toEqual([]);
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

    it('should not use grid paging when autoPage is false', async () => {
      fixture.componentRef.setInput('autoPage', false);
      fixture.componentRef.setInput('pageSize', 200);
      fixture.componentRef.setInput('rowCount', 1000);
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
      const api = getGridApi(
        fixture.nativeElement.querySelector(
          '[data-sky-id="grid"] ag-grid-angular',
        ),
      );
      expect(api).toBeTruthy();
      expect(api?.getGridOption('pagination')).toBeFalsy();
    });

    it('should limit data to pageSize and warn when autoPage is false and data exceeds pageSize', async () => {
      const warnSpy = spyOn(TestBed.inject(SkyLogService), 'warn');
      fixture.componentRef.setInput('autoPage', false);
      fixture.componentRef.setInput('pageSize', 2);
      fixture.detectChanges();
      await fixture.whenStable();
      const api = getGridApi(
        fixture.nativeElement.querySelector(
          '[data-sky-id="grid"] ag-grid-angular',
        ),
      );
      expect(api).toBeTruthy();
      // `dataForSimpleGrid` has 7 rows; only `pageSize` rows should render.
      expect(api?.getDisplayedRowCount()).toBe(2);
      expect(warnSpy).toHaveBeenCalled();
    });

    it('should set initialFlex=0, suppressSizeToFit, and suppressAutoSize when flexWidth is 0', async () => {
      const flexFixture = TestBed.createComponent(FlexWidthTestComponent);
      flexFixture.detectChanges();
      await flexFixture.whenStable();
      const api = getGridApi(
        flexFixture.nativeElement.querySelector('ag-grid-angular'),
      );
      expect(api).toBeTruthy();
      const colDef = api?.getColumn('column1')?.getColDef();
      expect(colDef?.initialFlex).toBe(0);
      expect(colDef?.suppressSizeToFit).toBeTrue();
      expect(colDef?.suppressAutoSize).toBeTrue();
    });

    it('should render a custom cell template with access to the row data', async () => {
      const templateFixture = TestBed.createComponent(
        TemplateColumnTestComponent,
      );
      templateFixture.detectChanges();
      await templateFixture.whenStable();
      templateFixture.detectChanges();
      const cells = Array.from(
        templateFixture.nativeElement.querySelectorAll(
          '.custom-cell',
        ) as NodeListOf<HTMLElement>,
      );
      expect(cells).toHaveSize(2);
      expect(cells[0].textContent).toContain('Row 1: A');
      expect(cells[1].textContent).toContain('Row 2: C');
    });

    it('should apply locked, width, and sortable settings to a column', async () => {
      const templateFixture = TestBed.createComponent(
        TemplateColumnTestComponent,
      );
      templateFixture.detectChanges();
      await templateFixture.whenStable();
      const api = getGridApi(
        templateFixture.nativeElement.querySelector('ag-grid-angular'),
      );
      expect(api).toBeTruthy();
      const colDef = api?.getColumn('actions')?.getColDef();
      expect(colDef?.lockPosition).toBeTrue();
      expect(colDef?.suppressMovable).toBeTrue();
      expect(colDef?.sortable).toBeFalse();
      expect(colDef?.minWidth).toBe(40);
      expect(colDef?.suppressSizeToFit).toBeTrue();
    });

    it('should set a no-op comparator on columns when autoSort is false', async () => {
      fixture.componentRef.setInput('autoSort', false);
      fixture.detectChanges();
      await fixture.whenStable();
      const api = getGridApi(
        fixture.nativeElement.querySelector(
          '[data-sky-id="grid"] ag-grid-angular',
        ),
      );
      expect(api).toBeTruthy();
      const comparator = api?.getColumn('column1')?.getColDef().comparator as
        | ((valueA: unknown, valueB: unknown) => number)
        | undefined;
      expect(comparator).toEqual(jasmine.any(Function));
      // The no-op always returns 0 regardless of the values compared, so AG Grid
      // never reorders rows on its own.
      expect(comparator?.('b', 'a')).toBe(0);
    });

    it('should not set a comparator on columns when autoSort is true', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      const api = getGridApi(
        fixture.nativeElement.querySelector(
          '[data-sky-id="grid"] ag-grid-angular',
        ),
      );
      expect(api).toBeTruthy();
      expect(api?.getColumn('column1')?.getColDef().comparator).toBeUndefined();
    });

    it('should apply the date cell data type to a date column', async () => {
      const templateFixture = TestBed.createComponent(
        TemplateColumnTestComponent,
      );
      templateFixture.detectChanges();
      await templateFixture.whenStable();
      const api = getGridApi(
        templateFixture.nativeElement.querySelector('ag-grid-angular'),
      );
      expect(api).toBeTruthy();
      const colDef = api?.getColumn('date')?.getColDef();
      expect(colDef?.cellDataType).toBe('dateString');
    });

    it('should retain selectedRowIds set before data loads', async () => {
      // Start with the multiselect grid in a loading state (no data yet).
      component.dataForSimpleGridWithMultiselect = undefined;
      fixture.detectChanges();
      await fixture.whenStable();

      // A consumer pre-selects rows while the grid is still loading.
      component.selectedRowIds.set(['1', '2']);
      fixture.detectChanges();
      await fixture.whenStable();

      // The selection must survive until the data arrives.
      expect(component.selectedRowIds()).toEqual(['1', '2']);

      // Data arrives and the pre-selected rows become selected.
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

      const api = getGridApi(
        fixture.nativeElement.querySelector(
          '[data-sky-id="multiselect-grid"] ag-grid-angular',
        ),
      );
      expect(component.selectedRowIds()).toEqual(['1', '2']);
      expect(api?.getSelectedNodes()).toHaveSize(2);
    });

    it('should not throw when a number column value getter receives a row without data', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      const api = getGridApi(
        fixture.nativeElement.querySelector(
          '[data-sky-id="multiselect-grid"] ag-grid-angular',
        ),
      );
      const valueGetter = api?.getColumn('myId')?.getColDef().valueGetter as
        | ((params: { data: unknown }) => number)
        | undefined;
      expect(valueGetter).toEqual(jasmine.any(Function));
      expect(() => valueGetter?.({ data: undefined })).not.toThrow();
      expect(valueGetter?.({ data: undefined })).toBeNaN();
    });

    it('should render rows and reflect the loading state from a resource data source', async () => {
      const resourceFixture = TestBed.createComponent(
        ResourceDataTestComponent,
      );
      resourceFixture.detectChanges();
      await resourceFixture.whenStable();

      const api = getGridApi(
        resourceFixture.nativeElement.querySelector(
          '[data-sky-id="resource-grid"] ag-grid-angular',
        ),
      );
      expect(api).toBeTruthy();
      // No rows render while the resource is still loading.
      expect(api?.getDisplayedRowCount()).toBe(0);

      // The resource resolves with data and reports it is no longer loading.
      resourceFixture.componentInstance.value.set([
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
      ]);
      resourceFixture.componentInstance.loading.set(false);
      resourceFixture.detectChanges();
      await resourceFixture.whenStable();
      expect(api?.getGridOption('loading')).toBeFalse();
      expect(api?.getDisplayedRowCount()).toBe(2);

      // The grid's loading overlay tracks the resource's `isLoading` signal.
      resourceFixture.componentInstance.loading.set(true);
      resourceFixture.detectChanges();
      await resourceFixture.whenStable();
      expect(api?.getGridOption('loading')).toBeTrue();
    });

    it('should retain selectedRowIds set while a resource data source loads', async () => {
      const resourceFixture = TestBed.createComponent(
        ResourceDataTestComponent,
      );
      resourceFixture.detectChanges();
      await resourceFixture.whenStable();

      // Pre-select rows while the resource is still loading.
      resourceFixture.componentInstance.selectedRowIds.set(['1', '2']);
      resourceFixture.detectChanges();
      await resourceFixture.whenStable();
      expect(resourceFixture.componentInstance.selectedRowIds()).toEqual([
        '1',
        '2',
      ]);

      // The resource resolves and the pre-selected rows become selected.
      resourceFixture.componentInstance.value.set([
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
      ]);
      resourceFixture.componentInstance.loading.set(false);
      resourceFixture.detectChanges();
      await resourceFixture.whenStable();

      const api = getGridApi(
        resourceFixture.nativeElement.querySelector(
          '[data-sky-id="resource-grid"] ag-grid-angular',
        ),
      );
      expect(resourceFixture.componentInstance.selectedRowIds()).toEqual([
        '1',
        '2',
      ]);
      expect(api?.getSelectedNodes()).toHaveSize(2);
    });
  });
});
