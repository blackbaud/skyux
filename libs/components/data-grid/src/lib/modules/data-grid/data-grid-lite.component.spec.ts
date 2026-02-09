import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideLocationMocks } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SkyAgGridWrapperHarness } from '@skyux/ag-grid/testing';
import { SkyLogService } from '@skyux/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SkyWaitHarness } from '@skyux/indicators/testing';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SkyPagingHarness } from '@skyux/lists/testing';

import { getGridApi } from 'ag-grid-community';

import { SkyDataGridComponent } from './data-grid.component';
import { DataGridLiteTestComponent } from './fixtures/data-grid-lite-test.component';

describe('SkyDataGridLiteComponent', () => {
  let fixture: ComponentFixture<DataGridLiteTestComponent>;
  let component: DataGridLiteTestComponent;
  let loader: HarnessLoader;
  let loggerSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideLocationMocks()],
    });
    fixture = TestBed.createComponent(DataGridLiteTestComponent, {});
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
      fixture.debugElement.queryAll(By.directive(SkyDataGridComponent)).length,
    ).toEqual(4);
  });

  it('should destroy and recreate columns', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
    const grids = await loader.getAllHarnesses(SkyAgGridWrapperHarness);
    expect(
      await Promise.all(grids.map((grid) => grid.getDisplayedColumnIds())).then(
        (cols) => cols.map((id) => id.length).reduce((a, b) => a + b, 0),
      ),
    ).toEqual(4 * 3 + 3); // 4 grids with 3 columns each, plus 3 extra headers for the multi-select and row delete grid

    fixture.componentRef.setInput('showCol3', false);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      await Promise.all(grids.map((grid) => grid.getDisplayedColumnIds())).then(
        (cols) => cols.map((id) => id.length).reduce((a, b) => a + b, 0),
      ),
    ).toEqual(4 * 2 + 4); // 4 grids with 2 columns each, plus 4 extra headers for multi-select, row delete, and date column

    fixture.componentRef.setInput('showCol3', true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      await Promise.all(grids.map((grid) => grid.getDisplayedColumnIds())).then(
        (cols) => cols.map((id) => id.length).reduce((a, b) => a + b, 0),
      ),
    ).toEqual(4 * 3 + 3); // 4 grids with 3 columns each, plus 3 extra headers for the multi-select and row delete grid

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
    await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for grid to process option change
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for grid to process option change
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for grid to process option change
    expect(api?.getGridOption('pagination')).toBeTruthy();
    expect(api?.getGridOption('paginationPageSize')).toBe(2);
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
      Promise.all(waitHarnesses.map((waitHarness) => waitHarness.isWaiting())),
    ).toBeResolvedTo([false, false, false, false]);
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

  it('should update selectedRowIds when data changes to remove IDs no longer in data', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    // Select some rows
    component.selectedRowIds.set(['101', '102', '103', '104', '105']);
    fixture.detectChanges();
    await fixture.whenStable();
    // None of the IDs were valid.
    expect(component.selectedRowIds()).toEqual([]);

    component.selectedRowIds.set(['1', '2', '3', '4', '5']);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.selectedRowIds()).toEqual(['1', '2', '3', '4', '5']);

    // Remove some items from the data (remove 2, 4)
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

  describe('apply filters', () => {
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

      fixture.componentRef.setInput('numberFilterOperator', 'lessThanOrEqual');
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
