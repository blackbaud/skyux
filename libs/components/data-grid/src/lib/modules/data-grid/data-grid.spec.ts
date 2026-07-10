import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideLocationMocks } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { expectAsync, SkyAppTestUtility } from '@skyux-sdk/testing';
import { SkyLogService } from '@skyux/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SkyAgGridWrapperHarness } from '@skyux/ag-grid/testing';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SkyWaitHarness } from '@skyux/indicators/testing';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SkyPagingHarness } from '@skyux/lists/testing';

import { getGridApi } from 'ag-grid-community';
import { SkyDataGrid } from './data-grid';
import { ColumnWidthTestComponent } from './fixtures/column-width-test.component';
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

    it('should set the aria-label property', async () => {
      fixture.componentRef.setInput('labelText', 'My test grid');
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      await fixture.whenStable();

      const gridWrapper = fixture.nativeElement.querySelector(
        'sky-ag-grid-wrapper',
      );
      const skyAgGridDiv = gridWrapper.querySelector(
        '.sky-ag-grid [role="grid"]',
      );

      expect(skyAgGridDiv.getAttribute('aria-label')).toBe('My test grid');
    });

    it('should set minHeight and fallback to 50 when undefined or NaN', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      const gridWrapper = fixture.nativeElement.querySelector(
        'sky-ag-grid-wrapper',
      );
      const skyAgGridDiv = gridWrapper.querySelector('.sky-ag-grid');

      // Default
      expect(
        skyAgGridDiv.style.getPropertyValue('--sky-ag-grid-min-height'),
      ).toBe('50px');

      // Set to valid number
      fixture.componentRef.setInput('minHeight', 200);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(
        skyAgGridDiv.style.getPropertyValue('--sky-ag-grid-min-height'),
      ).toBe('200px');

      // Set to undefined
      fixture.componentRef.setInput('minHeight', undefined);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(
        skyAgGridDiv.style.getPropertyValue('--sky-ag-grid-min-height'),
      ).toBe('50px');

      // Set to NaN
      fixture.componentRef.setInput('minHeight', NaN);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(
        skyAgGridDiv.style.getPropertyValue('--sky-ag-grid-min-height'),
      ).toBe('50px');
    });

    it('should update domLayout on dock changes', async () => {
      fixture.componentRef.setInput('dock', 'fill');
      fixture.detectChanges();
      await fixture.whenStable();

      const api = getGridApi(
        fixture.nativeElement.querySelector(
          '[data-sky-id="grid"] ag-grid-angular',
        ),
      );
      expect(api).toBeTruthy();
      expect(api?.getGridOption('domLayout')).toBe('normal');

      fixture.componentRef.setInput('dock', 'none');
      fixture.detectChanges();
      expect(api?.getGridOption('domLayout')).toBe('autoHeight');

      fixture.componentRef.setInput('dock', 'fill');
      fixture.detectChanges();
      expect(api?.getGridOption('domLayout')).toBe('normal');
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
      fixture.componentRef.setInput('dataForSimpleGrid', undefined);
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

      fixture.componentRef.setInput('dataForSimpleGrid', undefined);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(api?.getDisplayedRowCount()).toBe(0);
    });

    it('should handle data changing from undefined to populated', async () => {
      fixture.componentRef.setInput('dataForSimpleGrid', undefined);
      fixture.detectChanges();
      await fixture.whenStable();
      const api = getGridApi(
        fixture.nativeElement.querySelector(
          '[data-sky-id="grid"] ag-grid-angular',
        ),
      );
      expect(api).toBeTruthy();
      expect(api?.getDisplayedRowCount()).toBe(0);

      fixture.componentRef.setInput('dataForSimpleGrid', [
        { id: '1', column1: '1', column2: 'Apple', column3: true },
        { id: '2', column1: '01', column2: 'Banana', column3: false },
      ]);
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
        field: 'column1',
        direction: 'asc',
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
        field: 'column1',
        direction: 'desc',
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
        field: 'column2',
        direction: 'desc',
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
        field: 'column2',
        direction: 'desc',
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
        field: 'column1',
        direction: 'asc',
      });
      expect(api?.getColumnState().map((col) => col.colId)).toEqual([
        'column2',
        'column3',
        'column1',
      ]);
    });

    it('should apply an initial descending sort set before the grid renders', async () => {
      fixture.componentRef.setInput('sort', {
        field: 'column1',
        direction: 'desc',
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
        field: 'column2',
        direction: 'asc',
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
      fixture.componentRef.setInput('dataForSimpleGridWithMultiselect', [
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
      ]);
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
      fixture.componentRef.setInput('dataForSimpleGridWithMultiselect', [
        { id: '1', column1: '1', column2: 'Apple', column3: true, myId: '101' },
        {
          id: '2',
          column1: '01',
          column2: 'Banana',
          column3: false,
          myId: '102',
        },
      ]);
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
      fixture.componentRef.setInput('dataForSimpleGridWithMultiselect', []);
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
      fixture.componentRef.setInput('pageQueryParam', 'page');
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

    it('should update the url when the page is set programmatically', async () => {
      fixture.componentRef.setInput('pageSize', 2);
      fixture.componentRef.setInput('pageQueryParam', 'page');
      const router = TestBed.inject(Router);
      const navSpy = spyOn(router, 'navigate');
      fixture.detectChanges();
      await fixture.whenStable();
      navSpy.calls.reset();

      component.page.set(2);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(navSpy).toHaveBeenCalledWith([], {
        relativeTo: jasmine.any(ActivatedRoute),
        queryParams: { page: 2 },
        queryParamsHandling: 'merge',
      });
    });

    it('should update the page when the url query parameter changes', async () => {
      fixture.componentRef.setInput('pageSize', 2);
      fixture.componentRef.setInput('pageQueryParam', 'page');
      fixture.detectChanges();
      await fixture.whenStable();

      const router = TestBed.inject(Router);
      await router.navigate([], {
        queryParams: { page: 3 },
      });
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.page()).toBe(3);

      const pagingHarness = await loader.getHarness(SkyPagingHarness);
      await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(3);
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

    it('should hide paging and warn when autoPage is false and rowCount is not set', async () => {
      const warnSpy = spyOn(TestBed.inject(SkyLogService), 'warn');
      fixture.componentRef.setInput('autoPage', false);
      fixture.componentRef.setInput('pageSize', 10);

      fixture.detectChanges();
      await fixture.whenStable();

      await expectAsync(
        loader.getAllHarnesses(SkyPagingHarness),
      ).toBeResolvedTo([]);
      expect(warnSpy).toHaveBeenCalledWith(
        jasmine.stringContaining('the `rowCount` input is required'),
      );
    });

    it('should not warn about rowCount when autoPage is false and rowCount is set', async () => {
      const warnSpy = spyOn(TestBed.inject(SkyLogService), 'warn');
      fixture.componentRef.setInput('autoPage', false);
      fixture.componentRef.setInput('pageSize', 10);
      fixture.componentRef.setInput('rowCount', 7);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(warnSpy).not.toHaveBeenCalledWith(
        jasmine.stringContaining('the `rowCount` input is required'),
      );
    });

    it('should not warn about rowCount when autoPage is false and rowCount is set to zero', async () => {
      const warnSpy = spyOn(TestBed.inject(SkyLogService), 'warn');
      fixture.componentRef.setInput('autoPage', false);
      fixture.componentRef.setInput('pageSize', 10);
      fixture.componentRef.setInput('rowCount', 0);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(warnSpy).not.toHaveBeenCalledWith(
        jasmine.stringContaining('the `rowCount` input is required'),
      );
    });

    it('should warn and fall back to setting the page when pageQueryParam is set without a Router or ActivatedRoute available', async () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ providers: [] });
      const noRouterFixture = TestBed.createComponent(DataGridTestComponent);
      const warnSpy = spyOn(TestBed.inject(SkyLogService), 'warn');
      noRouterFixture.componentRef.setInput('pageSize', 2);
      noRouterFixture.componentRef.setInput('pageQueryParam', 'page');
      noRouterFixture.detectChanges();
      await noRouterFixture.whenStable();

      expect(warnSpy).toHaveBeenCalledWith(
        jasmine.stringContaining(
          'a `Router` and `ActivatedRoute` are not available',
        ),
      );

      const pagingHarness =
        await TestbedHarnessEnvironment.loader(noRouterFixture).getHarness(
          SkyPagingHarness,
        );
      await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(1);
      await pagingHarness.clickPageButton(2);
      await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(2);
      expect(noRouterFixture.componentInstance.page()).toBe(2);
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
      // `width` (with no `flexWidth`) sets the column's initial width without
      // pinning a minimum width or suppressing size-to-fit, so the column can
      // still shrink and participate in fitting the grid's width.
      expect(colDef?.initialWidth).toBe(40);
      expect(colDef?.minWidth).not.toBe(40);
    });

    it('should apply flex, initialFlex, and a width-based minimum when flexWidth is greater than 0', async () => {
      const flexFixture = TestBed.createComponent(FlexWidthTestComponent);
      flexFixture.detectChanges();
      await flexFixture.whenStable();
      const api = getGridApi(
        flexFixture.nativeElement.querySelector('ag-grid-angular'),
      );
      expect(api).toBeTruthy();
      const colDef = api?.getColumn('column3')?.getColDef();
      expect(colDef?.flex).toBe(2);
      expect(colDef?.initialFlex).toBe(2);
      // `width` set alongside `flexWidth` acts as the column's minimum width.
      expect(colDef?.minWidth).toBe(120);
    });

    it('should apply min and max width when a column is not resizable', async () => {
      const flexFixture = TestBed.createComponent(ColumnWidthTestComponent);
      flexFixture.detectChanges();
      await flexFixture.whenStable();
      const api = getGridApi(
        flexFixture.nativeElement.querySelector('ag-grid-angular'),
      );
      expect(api).toBeTruthy();
      const colDef = api?.getColumn('column2')?.getColDef();
      expect(colDef?.minWidth).toBe(75);
      expect(colDef?.maxWidth).toBe(75);
    });

    it('should not use auto-size with flex columns', async () => {
      const flexFixture = TestBed.createComponent(ColumnWidthTestComponent);
      flexFixture.detectChanges();
      await flexFixture.whenStable();
      const api = getGridApi(
        flexFixture.nativeElement.querySelector('ag-grid-angular'),
      );
      expect(api).toBeTruthy();
      expect(api?.getGridOption('autoSizeStrategy')).toBeFalsy();
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

    it('should size columns to their content when columnFit is "content"', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      // The default "grid" uses the default columnFit ("container").
      const containerApi = getGridApi(
        fixture.nativeElement.querySelector(
          '[data-sky-id="grid"] ag-grid-angular',
        ),
      );
      expect(containerApi?.getGridOption('autoSizeStrategy')).toEqual({
        type: 'fitCellContents',
        skipHeader: true,
        scaleUpToFitGridWidth: true,
      });

      // The "multiselect-grid" sets columnFit="content" and has no flex columns.
      const contentApi = getGridApi(
        fixture.nativeElement.querySelector(
          '[data-sky-id="multiselect-grid"] ag-grid-angular',
        ),
      );
      expect(contentApi?.getGridOption('autoSizeStrategy')).toEqual({
        type: 'fitCellContents',
        skipHeader: true,
        scaleUpToFitGridWidth: false,
      });
    });

    it('should add the stacked margin class to the host when stacked is true', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      const gridHost = fixture.nativeElement.querySelector(
        '[data-sky-id="grid"]',
      ) as HTMLElement;
      expect(gridHost.classList).not.toContain('sky-margin-stacked-lg');

      fixture.componentRef.setInput('stacked', true);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(gridHost.classList).toContain('sky-margin-stacked-lg');
    });

    it('should enable the top scroll context option when topScrollEnabled is set', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      // The "multiselect-grid" sets topScrollEnabled; the default "grid" does not.
      const topScrollApi = getGridApi(
        fixture.nativeElement.querySelector(
          '[data-sky-id="multiselect-grid"] ag-grid-angular',
        ),
      );
      expect(
        topScrollApi?.getGridOption('context')?.enableTopScroll,
      ).toBeTrue();

      const defaultApi = getGridApi(
        fixture.nativeElement.querySelector(
          '[data-sky-id="grid"] ag-grid-angular',
        ),
      );
      expect(defaultApi?.getGridOption('context')?.enableTopScroll).toBeFalsy();
    });

    it('should render an inline help button in the header when helpPopoverContent is set', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      const helpInlineButtons = fixture.nativeElement.querySelectorAll(
        '[data-sky-id="inline-help-grid"] sky-help-inline',
      );
      expect(helpInlineButtons.length).toBeGreaterThan(0);
    });

    it('should be accessible', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should retain selectedRowIds set before data loads', async () => {
      // Start with the multiselect grid in a loading state (no data yet).
      fixture.componentRef.setInput(
        'dataForSimpleGridWithMultiselect',
        undefined,
      );
      fixture.detectChanges();
      await fixture.whenStable();

      // A consumer pre-selects rows while the grid is still loading.
      component.selectedRowIds.set(['1', '2']);
      fixture.detectChanges();
      await fixture.whenStable();

      // The selection must survive until the data arrives.
      expect(component.selectedRowIds()).toEqual(['1', '2']);

      // Data arrives and the pre-selected rows become selected.
      fixture.componentRef.setInput('dataForSimpleGridWithMultiselect', [
        { id: '1', column1: '1', column2: 'Apple', column3: true, myId: '101' },
        {
          id: '2',
          column1: '01',
          column2: 'Banana',
          column3: false,
          myId: '102',
        },
      ]);
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

    it('should return null instead of NaN when a number column value getter receives a row without data', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      const api = getGridApi(
        fixture.nativeElement.querySelector(
          '[data-sky-id="multiselect-grid"] ag-grid-angular',
        ),
      );
      const valueGetter = api?.getColumn('myId')?.getColDef().valueGetter as
        | ((params: { data: unknown }) => number | null)
        | undefined;
      expect(valueGetter).toEqual(jasmine.any(Function));
      expect(() => valueGetter?.({ data: undefined })).not.toThrow();
      // A non-numeric value renders as a blank cell rather than "NaN".
      expect(valueGetter?.({ data: undefined })).toBeNull();
      expect(valueGetter?.({ data: { myId: '42' } })).toBe(42);
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
