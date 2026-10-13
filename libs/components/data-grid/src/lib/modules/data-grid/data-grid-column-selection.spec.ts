import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAgGridService } from '@skyux/ag-grid';
import { SkyViewkeeperService } from '@skyux/core';
import {
  SkyDataColumnSource,
  SkyDataSelectionSource,
  SkyDataSortSource,
} from '@skyux/lists';

import {
  GridApi,
  SELECTION_COLUMN_ID,
  getGridApi as getAgGridApi,
} from 'ag-grid-community';

import { SkyDataGrid } from './data-grid';
import { ColumnSelectionTestComponent } from './fixtures/column-selection-test.component';

describe('SkyDataGrid data sources', () => {
  let fixture: ComponentFixture<ColumnSelectionTestComponent>;

  function getGrid(): SkyDataGrid {
    return fixture.debugElement.query(
      (node) => node.componentInstance instanceof SkyDataGrid,
    ).componentInstance as SkyDataGrid;
  }

  function getColumnSource(): SkyDataColumnSource {
    return fixture.debugElement
      .query((node) => node.componentInstance instanceof SkyDataGrid)
      .injector.get(SkyDataColumnSource);
  }

  function getGridApi(): GridApi {
    return getAgGridApi(
      (fixture.nativeElement as HTMLElement).querySelector(
        '.ag-root',
      ) as HTMLElement,
    ) as GridApi;
  }

  async function detect(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
  }

  /**
   * Moves a column one position to the right with the keyboard, the way a
   * user reorders columns.
   */
  function moveColumnRight(columnId: string): void {
    const header = (fixture.nativeElement as HTMLElement).querySelector(
      `.ag-header-cell[col-id="${columnId}"]`,
    ) as HTMLElement;
    header.focus();
    header.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        shiftKey: true,
        bubbles: true,
      }),
    );
  }

  /**
   * Drags a column header past another column header without releasing the
   * mouse button.
   */
  function dragColumnPast(columnId: string, pastColumnId: string): void {
    const el = fixture.nativeElement as HTMLElement;
    const header = el.querySelector(
      `.ag-header-cell[col-id="${columnId}"] .ag-header-cell-text`,
    ) as HTMLElement;
    const start = header.getBoundingClientRect();
    const end = (
      el.querySelector(
        `.ag-header-cell[col-id="${pastColumnId}"]`,
      ) as HTMLElement
    ).getBoundingClientRect();
    const fire = (target: EventTarget, type: string, x: number): void => {
      target.dispatchEvent(
        new MouseEvent(type, {
          bubbles: true,
          buttons: 1,
          clientX: x,
          clientY: start.top + start.height / 2,
        }),
      );
    };

    fire(header, 'mousedown', start.left + 5);
    for (let x = start.left + 5; x <= end.right; x += 10) {
      fire(document, 'mousemove', x);
    }
  }

  function releaseMouseOutsideGrid(): void {
    for (const type of ['mousemove', 'mouseup']) {
      document.dispatchEvent(
        new MouseEvent(type, {
          bubbles: true,
          buttons: 1,
          clientX: 0,
          clientY: 5000,
        }),
      );
    }
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnSelectionTestComponent);
  });

  it('should provide itself as each data source', async () => {
    await detect();

    const injector = fixture.debugElement.query(
      (node) => node.componentInstance instanceof SkyDataGrid,
    ).injector;
    expect(injector.get(SkyDataColumnSource)).toBe(getGrid());
    expect(injector.get(SkyDataSelectionSource)).toBe(getGrid());
    expect(injector.get(SkyDataSortSource)).toBe(getGrid());
  });

  it('should keep its column headers visible while the page scrolls', async () => {
    const createSpy = spyOn(
      TestBed.inject(SkyViewkeeperService),
      'create',
    ).and.callThrough();
    await detect();

    expect(getColumnSource().viewkeeperClasses()).toEqual(['.ag-header']);
    expect(
      createSpy.calls
        .allArgs()
        .map(([options]) => options.el?.classList.contains('ag-header')),
    ).toEqual([true]);
  });

  it('should stop keeping its column headers visible when a container keeps them visible', async () => {
    const createSpy = spyOn(TestBed.inject(SkyViewkeeperService), 'create');
    getColumnSource().disableViewkeeper();
    await detect();

    expect(createSpy).not.toHaveBeenCalled();
  });

  it('should describe the declared columns as column options', async () => {
    fixture.componentRef.setInput('lockedDescription', 'Always shown.');
    await detect();

    expect(getColumnSource().columnOptions()).toEqual([
      {
        alwaysDisplayed: true,
        description: 'Always shown.',
        id: 'locked',
        initialHide: false,
        labelText: 'Locked',
      },
      {
        alwaysDisplayed: false,
        description: undefined,
        id: 'name',
        initialHide: false,
        labelText: 'Name',
      },
      {
        alwaysDisplayed: false,
        description: undefined,
        id: 'age',
        initialHide: false,
        labelText: 'Age',
      },
      {
        alwaysDisplayed: false,
        description: undefined,
        id: 'extra',
        initialHide: false,
        labelText: 'Extra',
      },
    ]);
  });

  it('should omit columns that have neither a columnId nor a field from the column options', async () => {
    fixture.componentRef.setInput('showInvalid', true);
    await detect();

    expect(
      getColumnSource()
        .columnOptions()
        .map((col) => col.id),
    ).toEqual(['locked', 'name', 'age', 'extra']);
  });

  it('should keep columns that share a field', async () => {
    fixture.componentRef.setInput('showDuplicateName', true);
    await detect();

    expect(
      getGridApi()
        .getAllDisplayedColumns()
        .map((column) => column.getColDef().headerName),
    ).toEqual(['Locked', 'Name', 'Age', 'Extra', 'Name again']);
    expect(getColumnSource().displayedColumnIds()).toEqual([
      'locked',
      'name',
      'age',
      'extra',
      'name_1',
    ]);
  });

  it('should display every column in declaration order by default', async () => {
    await detect();

    expect(getColumnSource().displayedColumnIds()).toEqual([
      'locked',
      'name',
      'age',
      'extra',
    ]);
  });

  it('should hide columns marked columnHidden by default', async () => {
    fixture.componentRef.setInput('extraHidden', true);
    await detect();

    expect(getColumnSource().displayedColumnIds()).toEqual([
      'locked',
      'name',
      'age',
    ]);
    expect(getColumnSource().columnOptions()[3].initialHide).toBeTrue();
  });

  it('should display only the columns named by selectedColumnIds, in order', async () => {
    fixture.componentInstance.selectedColumnIds.set(['age', 'name']);
    await detect();

    expect(getColumnSource().displayedColumnIds()).toEqual(['age', 'name']);
  });

  it('should list locked columns first, as the grid displays them', async () => {
    fixture.componentInstance.selectedColumnIds.set(['name', 'locked', 'age']);
    await detect();

    expect(getColumnSource().displayedColumnIds()).toEqual([
      'locked',
      'name',
      'age',
    ]);
  });

  it('should drop IDs for columns that do not exist', async () => {
    fixture.componentInstance.selectedColumnIds.set([
      'locked',
      'nonexistent',
      'name',
    ]);
    await detect();

    expect(getColumnSource().displayedColumnIds()).toEqual(['locked', 'name']);
  });

  it('should update the displayed columns when setDisplayedColumnIds is called', async () => {
    await detect();

    getColumnSource().setDisplayedColumnIds(['locked', 'name']);
    await detect();

    expect(getColumnSource().displayedColumnIds()).toEqual(['locked', 'name']);
    expect(fixture.componentInstance.selectedColumnIds()).toEqual([
      'locked',
      'name',
    ]);
  });

  it('should not emit when setDisplayedColumnIds matches selectedColumnIds', async () => {
    fixture.componentInstance.selectedColumnIds.set(['locked', 'name']);
    await detect();

    const selectedColumnIds = fixture.componentInstance.selectedColumnIds();
    getColumnSource().setDisplayedColumnIds(['locked', 'name']);
    await detect();

    expect(fixture.componentInstance.selectedColumnIds()).toBe(
      selectedColumnIds,
    );
  });

  it('should keep hidden columns defined so they can be shown again', async () => {
    fixture.componentInstance.selectedColumnIds.set(['locked', 'name']);
    await detect();

    expect(
      getGridApi()
        .getColumnState()
        .map((state) => ({ id: state.colId, hide: !!state.hide })),
    ).toEqual([
      { id: 'locked', hide: false },
      { id: 'name', hide: false },
      { id: 'age', hide: true },
      { id: 'extra', hide: true },
    ]);
  });

  it('should apply the column order to the grid', async () => {
    await detect();

    fixture.componentInstance.selectedColumnIds.set(['locked', 'age', 'name']);
    await detect();

    expect(
      getGridApi()
        .getColumnState()
        .filter((state) => !state.hide)
        .map((state) => state.colId),
    ).toEqual(['locked', 'age', 'name']);
  });

  it('should keep the width of a resized flex column when the displayed columns change', async () => {
    await detect();

    getGridApi().setColumnWidths(
      [{ key: 'name', newWidth: 400 }],
      true,
      'uiColumnResized',
    );
    fixture.componentInstance.selectedColumnIds.set(['locked', 'age', 'name']);
    await detect();

    expect(getGridApi().getColumn('name')?.getActualWidth()).toBe(400);
  });

  it('should not fit the columns to the container when a column flexes', async () => {
    await detect();

    const sizeColumnsToFitSpy = spyOn(getGridApi(), 'sizeColumnsToFit');
    getColumnSource().setDisplayedColumnIds(['locked', 'name', 'age']);
    await detect();

    expect(sizeColumnsToFitSpy).not.toHaveBeenCalled();
  });

  it('should emit the new order when the user moves a column', async () => {
    fixture.componentInstance.selectedColumnIds.set([
      'locked',
      'name',
      'age',
      'extra',
    ]);
    await detect();

    moveColumnRight('name');
    await detect();

    expect(fixture.componentInstance.selectedColumnIds()).toEqual([
      'locked',
      'age',
      'name',
      'extra',
    ]);
  });

  it('should emit the new order when the user drags a column and releases it outside the grid', async () => {
    fixture.componentInstance.selectedColumnIds.set([
      'locked',
      'name',
      'age',
      'extra',
    ]);
    await detect();

    dragColumnPast('name', 'extra');
    releaseMouseOutsideGrid();
    await detect();

    expect(fixture.componentInstance.selectedColumnIds()).toEqual([
      'locked',
      'age',
      'extra',
      'name',
    ]);
  });

  it('should emit the new order when the user cancels a column drag', async () => {
    fixture.componentInstance.selectedColumnIds.set([
      'locked',
      'name',
      'age',
      'extra',
    ]);
    await detect();

    // A drag moves columns as it goes, and cancelling it leaves them moved.
    dragColumnPast('name', 'extra');
    document.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }),
    );
    await detect();

    expect(fixture.componentInstance.selectedColumnIds()).toEqual([
      'locked',
      'age',
      'extra',
      'name',
    ]);
  });

  it('should keep the IDs of undeclared columns when the user moves a column', async () => {
    fixture.componentRef.setInput('showExtra', false);
    fixture.componentInstance.selectedColumnIds.set([
      'locked',
      'name',
      'age',
      'extra',
    ]);
    await detect();

    moveColumnRight('name');
    await detect();

    expect(fixture.componentInstance.selectedColumnIds()).toEqual([
      'locked',
      'age',
      'name',
      'extra',
    ]);

    fixture.componentRef.setInput('showExtra', true);
    await detect();

    expect(getColumnSource().displayedColumnIds()).toEqual([
      'locked',
      'age',
      'name',
      'extra',
    ]);
  });

  it('should leave out the multiselect column when the user moves a column', async () => {
    fixture.componentRef.setInput('multiselect', true);
    fixture.componentInstance.selectedColumnIds.set([
      'locked',
      'name',
      'age',
      'extra',
    ]);
    await detect();

    moveColumnRight('name');
    await detect();

    expect(fixture.componentInstance.selectedColumnIds()).toEqual([
      'locked',
      'age',
      'name',
      'extra',
    ]);
  });

  it('should keep the multiselect column first when the displayed columns change', async () => {
    fixture.componentRef.setInput('multiselect', true);
    await detect();

    fixture.componentInstance.selectedColumnIds.set(['locked', 'age', 'name']);
    await detect();

    expect(
      getGridApi()
        .getAllDisplayedColumns()
        .map((column) => column.getColId()),
    ).toEqual(['ag-Grid-SelectionColumn', 'locked', 'age', 'name']);
  });

  it('should not track column moves until selectedColumnIds is set', async () => {
    await detect();

    moveColumnRight('name');
    await detect();
    fixture.componentRef.setInput('extraHidden', true);
    await detect();

    expect(fixture.componentInstance.selectedColumnIds()).toBeUndefined();
    expect(getColumnSource().displayedColumnIds()).toEqual([
      'locked',
      'name',
      'age',
    ]);
  });

  it('should not mistake applying a column layout for a user moving a column', async () => {
    await detect();

    // The grid moves columns to apply the layout. Storing that as a user move
    // would replace the IDs given with the grid's order, dropping "missing".
    getColumnSource().setDisplayedColumnIds([
      'locked',
      'missing',
      'age',
      'name',
    ]);
    await detect();

    expect(fixture.componentInstance.selectedColumnIds()).toEqual([
      'locked',
      'missing',
      'age',
      'name',
    ]);
  });

  it('should drop a column from the display when it is removed from the template', async () => {
    fixture.componentInstance.selectedColumnIds.set([
      'locked',
      'name',
      'extra',
    ]);
    await detect();

    expect(getColumnSource().displayedColumnIds()).toContain('extra');

    fixture.componentRef.setInput('showExtra', false);
    await detect();

    expect(getColumnSource().displayedColumnIds()).toEqual(['locked', 'name']);
  });
  describe('sort', () => {
    it('should emit the sort a user applies by clicking a column header', async () => {
      await detect();

      (
        (fixture.nativeElement as HTMLElement).querySelector(
          '.ag-header-cell.ag-header-cell-sortable[col-id="name"] button.ag-header-cell-label-sortable',
        ) as HTMLElement
      ).click();
      await detect();

      expect(fixture.componentInstance.sort()).toEqual({
        direction: 'asc',
        field: 'name',
      });
    });

    it('should apply a sort that setSort sets', async () => {
      await detect();

      getGrid().setSort({ direction: 'desc', field: 'name' });
      await detect();

      expect(fixture.componentInstance.sort()).toEqual({
        direction: 'desc',
        field: 'name',
      });
      expect(getGridApi().getColumn('name')?.getSort()).toBe('desc');

      getGrid().setSort({ direction: 'asc', field: 'name' });
      await detect();

      expect(getGridApi().getColumn('name')?.getSort()).toBe('asc');

      getGrid().setSort(undefined);
      await detect();

      expect(fixture.componentInstance.sort()).toBeUndefined();
      expect(getGridApi().getColumn('name')?.getSort()).toBeFalsy();
    });

    it('should not emit when setSort matches the sort', async () => {
      fixture.componentInstance.sort.set({ direction: 'asc', field: 'name' });
      await detect();

      const sort = fixture.componentInstance.sort();
      getGrid().setSort({ direction: 'asc', field: 'name' });
      await detect();

      expect(fixture.componentInstance.sort()).toBe(sort);
    });
  });

  describe('row selection', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('multiselect', true);
    });

    it('should select the rows that setSelectedRowIds sets', async () => {
      await detect();

      getGrid().setSelectedRowIds(['2']);
      await detect();

      expect(fixture.componentInstance.selectedRowIds()).toEqual(['2']);
      expect(
        getGridApi()
          .getSelectedNodes()
          .map((node) => node.id),
      ).toEqual(['2']);
    });

    it('should not emit when setSelectedRowIds matches the selection', async () => {
      fixture.componentInstance.selectedRowIds.set(['1']);
      await detect();

      const selectedRowIds = fixture.componentInstance.selectedRowIds();
      getGrid().setSelectedRowIds(['1']);
      await detect();

      expect(fixture.componentInstance.selectedRowIds()).toBe(selectedRowIds);
    });

    it('should keep the IDs of rows that are not in the data once selection pruning is disabled', async () => {
      fixture.componentInstance.selectedRowIds.set(['1', '2']);
      getGrid().disableSelectionPruning();
      await detect();

      fixture.componentRef.setInput('data', [
        { id: '1', name: 'Amy', age: 30 },
      ]);
      await detect();

      expect(fixture.componentInstance.selectedRowIds()).toEqual(['1', '2']);
    });

    it('should keep the IDs of hidden rows when the user selects a row', async () => {
      fixture.componentRef.setInput('data', [
        { id: '1', name: 'Amy', age: 30 },
      ]);
      fixture.componentInstance.selectedRowIds.set(['2']);
      getGrid().disableSelectionPruning();
      await detect();

      getGridApi().getRowNode('1')?.setSelected(true);
      // AG Grid emits `selectionChanged` in a later task, which `whenStable()`
      // does not await on its own.
      await new Promise((resolve) => setTimeout(resolve));
      await detect();

      expect(fixture.componentInstance.selectedRowIds()).toEqual(['1', '2']);
    });
  });

  describe('column widths', () => {
    /**
     * Resizes a column, then waits for the grid to handle the resize. AG Grid
     * reports resizes in a later task, which `whenStable()` does not await on
     * its own.
     */
    async function resizeColumn(
      columnId: string,
      width: number,
      finished = true,
      source: 'api' | 'uiColumnResized' = 'uiColumnResized',
    ): Promise<void> {
      getGridApi().setColumnWidths(
        [{ key: columnId, newWidth: width }],
        finished,
        source,
      );
      await new Promise((resolve) => setTimeout(resolve));
      await detect();
    }

    it('should not track the widths users set until widths are set', async () => {
      await detect();

      await resizeColumn('age', 150);

      expect(getGrid().columnWidths()).toEqual({});
    });

    it('should track the width of a column a user resizes', async () => {
      getGrid().setColumnWidths({});
      await detect();

      await resizeColumn('age', 150, false);
      await resizeColumn('age', 160, true, 'api');

      expect(getGrid().columnWidths()).toEqual({});

      await resizeColumn('age', 150);

      expect(getGrid().columnWidths()).toEqual({ age: 150 });

      const columnWidths = getGrid().columnWidths();
      await resizeColumn('age', 150);

      expect(getGrid().columnWidths()).toBe(columnWidths);

      await resizeColumn('age', 170);

      expect(getGrid().columnWidths()).toEqual({ age: 170 });
    });

    it('should not track the widths of flex columns that fill the space a resized column leaves', async () => {
      getGrid().setColumnWidths({});
      await detect();

      await resizeColumn('locked', 150);

      expect(getGrid().columnWidths()).toEqual({ locked: 150 });
    });

    it('should keep the widths of undeclared columns when a user resizes a column', async () => {
      getGrid().setColumnWidths({ missing: 50 });
      await detect();

      await resizeColumn('age', 150);

      expect(getGrid().columnWidths()).toEqual({ missing: 50, age: 150 });
    });

    it('should apply column widths, which stops the columns flexing', async () => {
      await detect();

      getGrid().setColumnWidths({ age: 150, name: 300 });
      await detect();

      expect(getGridApi().getColumn('name')?.getActualWidth()).toBe(300);
      expect(getGridApi().getColumn('name')?.getFlex()).toBeNull();
      expect(getGridApi().getColumn('age')?.getActualWidth()).toBe(150);
    });

    it('should apply column widths set before the grid is created', async () => {
      getGrid().setColumnWidths({ age: 150 });
      await detect();

      expect(getGridApi().getColumn('age')?.getActualWidth()).toBe(150);
    });

    it('should return columns without a width to their declared sizing', async () => {
      getGrid().setColumnWidths({ age: 150, name: 300 });
      await detect();

      getGrid().setColumnWidths({});
      await detect();

      expect(getGridApi().getColumn('name')?.getFlex()).toBe(1);
      expect(getGridApi().getColumn('age')?.getActualWidth()).toBe(100);
    });

    it('should return a column the grid sizes to the width the grid gave it', async () => {
      await detect();

      const gridSizedWidth = getGridApi()
        .getColumn('locked')
        ?.getActualWidth() as number;
      getGrid().setColumnWidths({ locked: gridSizedWidth + 100 });
      await detect();

      expect(getGridApi().getColumn('locked')?.getActualWidth()).toBe(
        gridSizedWidth + 100,
      );

      getGrid().setColumnWidths({});
      await detect();

      expect(getGridApi().getColumn('locked')?.getActualWidth()).toBe(
        gridSizedWidth,
      );
    });

    it('should return a column that does not flex to the width the grid gave it', async () => {
      fixture.componentRef.setInput('nameFlexWidth', 0);
      await detect();

      const gridSizedWidth = getGridApi()
        .getColumn('name')
        ?.getActualWidth() as number;
      getGrid().setColumnWidths({ name: gridSizedWidth + 100 });
      await detect();
      getGrid().setColumnWidths({});
      await detect();

      expect(getGridApi().getColumn('name')?.getActualWidth()).toBe(
        gridSizedWidth,
      );
    });

    it('should return a column the user resized to the width the grid gave it', async () => {
      getGrid().setColumnWidths({});
      await detect();

      const gridSizedWidth = getGridApi()
        .getColumn('locked')
        ?.getActualWidth() as number;
      await resizeColumn('locked', gridSizedWidth + 100);

      expect(getGrid().columnWidths()).toEqual({
        locked: gridSizedWidth + 100,
      });

      getGrid().setColumnWidths({});
      await detect();

      expect(getGridApi().getColumn('locked')?.getActualWidth()).toBe(
        gridSizedWidth,
      );
    });

    it('should return a column declared after the grid is ready to the width the grid gave it', async () => {
      fixture.componentRef.setInput('showExtra', false);
      await detect();

      fixture.componentRef.setInput('showExtra', true);
      await detect();

      const gridSizedWidth = getGridApi()
        .getColumn('extra')
        ?.getActualWidth() as number;
      getGrid().setColumnWidths({ extra: gridSizedWidth + 100 });
      await detect();
      getGrid().setColumnWidths({});
      await detect();

      expect(getGridApi().getColumn('extra')?.getActualWidth()).toBe(
        gridSizedWidth,
      );
    });

    it('should not apply column widths that match the widths', async () => {
      getGrid().setColumnWidths({ age: 150 });
      await detect();

      const applyColumnStateSpy = spyOn(
        getGridApi(),
        'applyColumnState',
      ).and.callThrough();
      getGrid().setColumnWidths({ age: 150 });

      expect(applyColumnStateSpy).not.toHaveBeenCalled();
    });

    it('should keep the column widths when the column definitions change', async () => {
      getGrid().setColumnWidths({ name: 300 });
      await detect();

      fixture.componentRef.setInput('showDuplicateName', true);
      await detect();

      expect(getGridApi().getColumn('name')?.getActualWidth()).toBe(300);
      expect(getGridApi().getColumn('name')?.getFlex()).toBeNull();
    });

    it('should not change the column definitions when a user resizes a column', async () => {
      getGrid().setColumnWidths({});
      await detect();

      const setGridOptionSpy = spyOn(
        getGridApi(),
        'setGridOption',
      ).and.callThrough();
      await resizeColumn('age', 150);

      expect(setGridOptionSpy).not.toHaveBeenCalledWith(
        'columnDefs',
        jasmine.anything(),
      );
    });

    describe('with columns sized to their content', () => {
      let resolveContentSizing: (() => void) | undefined;

      /**
       * Resolves once the grid handles the next time columns are sized to
       * their content, which the grid first does in a later task after its
       * rows render.
       */
      function waitForContentSizing(): Promise<void> {
        return new Promise((resolve) => {
          resolveContentSizing = resolve;
        });
      }

      beforeEach(() => {
        // A grid without flex columns sizes its columns to their content.
        fixture.componentRef.setInput('nameFlexWidth', undefined);

        const gridService = TestBed.inject(SkyAgGridService);
        const getGridOptions = gridService.getGridOptions.bind(gridService);
        spyOn(gridService, 'getGridOptions').and.callFake((args) => {
          const gridOptions = getGridOptions(args);
          const onColumnResized = gridOptions.onColumnResized;
          gridOptions.onColumnResized = (event): void => {
            onColumnResized?.(event);
            if (event.source === 'autosizeColumns') {
              resolveContentSizing?.();
            }
          };
          return gridOptions;
        });
      });

      it('should apply the column widths again after the grid sizes its columns to their content', async () => {
        getGrid().setColumnWidths({ name: 300 });
        const contentSizing = waitForContentSizing();
        await detect();
        await contentSizing;
        await detect();

        expect(getGridApi().getColumn('name')?.getActualWidth()).toBe(300);
        expect(getGrid().columnWidths()).toEqual({ name: 300 });
      });

      it('should track the width of a column a user sizes to its content', async () => {
        getGrid().setColumnWidths({});
        const initialContentSizing = waitForContentSizing();
        await detect();
        await initialContentSizing;

        const contentSizing = waitForContentSizing();
        getGridApi().autoSizeColumns(['name']);
        await contentSizing;
        await detect();

        expect(getGrid().columnWidths()).toEqual({
          name: getGridApi().getColumn('name')?.getActualWidth() as number,
        });
      });

      it('should return a column to the width the grid sized it to when its width is cleared', async () => {
        const initialContentSizing = waitForContentSizing();
        await detect();
        await initialContentSizing;
        await detect();

        const contentWidth = getGridApi()
          .getColumn('name')
          ?.getActualWidth() as number;
        getGrid().setColumnWidths({ name: contentWidth + 100 });
        await detect();

        expect(getGridApi().getColumn('name')?.getActualWidth()).toBe(
          contentWidth + 100,
        );

        getGrid().setColumnWidths({});
        await detect();

        expect(getGridApi().getColumn('name')?.getActualWidth()).toBe(
          contentWidth,
        );
      });

      describe('when the displayed columns change', () => {
        function getDisplayedWidth(): number {
          return getGridApi()
            .getAllDisplayedColumns()
            .reduce((total, column) => total + column.getActualWidth(), 0);
        }

        function getContainerWidth(): number {
          return (
            (fixture.nativeElement as HTMLElement).querySelector(
              '.ag-grid-viewport',
            ) as HTMLElement
          ).clientWidth;
        }

        async function detectAfterContentSizing(): Promise<void> {
          const contentSizing = waitForContentSizing();
          await detect();
          await contentSizing;
          await detect();
        }

        it('should fit the columns to the container when a column is hidden', async () => {
          await detectAfterContentSizing();

          expect(getDisplayedWidth()).toBe(getContainerWidth());

          getColumnSource().setDisplayedColumnIds(['locked', 'name', 'age']);
          await detect();

          expect(getGridApi().getAllDisplayedColumns().length).toBe(3);
          expect(getDisplayedWidth()).toBe(getContainerWidth());
        });

        it('should fit the columns to the container when a column is shown', async () => {
          fixture.componentInstance.selectedColumnIds.set([
            'locked',
            'name',
            'age',
          ]);
          await detectAfterContentSizing();

          getColumnSource().setDisplayedColumnIds([
            'locked',
            'name',
            'age',
            'extra',
          ]);
          await detect();

          expect(getGridApi().getAllDisplayedColumns().length).toBe(4);
          expect(getDisplayedWidth()).toBe(getContainerWidth());
        });

        it('should keep the width of the multiselect column', async () => {
          fixture.componentRef.setInput('multiselect', true);
          await detectAfterContentSizing();

          const selectionWidth = getGridApi()
            .getColumn(SELECTION_COLUMN_ID)
            ?.getActualWidth();
          getColumnSource().setDisplayedColumnIds(['locked', 'name', 'age']);
          await detect();

          expect(
            getGridApi().getColumn(SELECTION_COLUMN_ID)?.getActualWidth(),
          ).toBe(selectionWidth);
          expect(getDisplayedWidth()).toBe(getContainerWidth());
        });

        it('should keep the widths of columns with a declared or user-set width', async () => {
          getGrid().setColumnWidths({ name: 300 });
          await detectAfterContentSizing();

          getColumnSource().setDisplayedColumnIds(['locked', 'name', 'age']);
          await detect();

          expect(getGridApi().getColumn('name')?.getActualWidth()).toBe(300);
          expect(getGridApi().getColumn('age')?.getActualWidth()).toBe(100);
          expect(getDisplayedWidth()).toBe(getContainerWidth());
        });

        it('should keep the width a user gave a column when columns only move', async () => {
          fixture.componentInstance.selectedColumnIds.set([
            'locked',
            'name',
            'age',
            'extra',
          ]);
          await detectAfterContentSizing();

          await new Promise((resolve) => setTimeout(resolve));
          getGridApi().setColumnWidths(
            [{ key: 'name', newWidth: 150 }],
            true,
            'uiColumnResized',
          );
          getColumnSource().setDisplayedColumnIds([
            'locked',
            'age',
            'name',
            'extra',
          ]);
          await detect();

          expect(
            getGridApi()
              .getAllDisplayedColumns()
              .map((column) => column.getColId()),
          ).toEqual(['locked', 'age', 'name', 'extra']);
          expect(getGridApi().getColumn('name')?.getActualWidth()).toBe(150);
        });

        it('should not fit the columns to the container when the grid fits to content', async () => {
          fixture.componentRef.setInput('columnFit', 'content');
          await detectAfterContentSizing();

          const nameWidth = getGridApi().getColumn('name')?.getActualWidth();
          getColumnSource().setDisplayedColumnIds(['locked', 'name', 'age']);
          await detect();

          expect(getGridApi().getColumn('name')?.getActualWidth()).toBe(
            nameWidth,
          );
        });
      });
    });
  });
});
