import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyViewkeeperService } from '@skyux/core';
import { SkyDataColumnSource } from '@skyux/lists';

import { GridApi, getGridApi as getAgGridApi } from 'ag-grid-community';

import { SkyDataGrid } from './data-grid';
import { ColumnSelectionTestComponent } from './fixtures/column-selection-test.component';

describe('SkyDataGrid column selection', () => {
  let fixture: ComponentFixture<ColumnSelectionTestComponent>;

  function getColumnSource(): SkyDataColumnSource {
    return fixture.debugElement
      .query((node) => node.componentInstance instanceof SkyDataGrid)
      .injector.get(SkyDataColumnSource);
  }

  function getGridApi(): GridApi {
    return getAgGridApi(
      (fixture.nativeElement as HTMLElement).querySelector(
        'ag-grid-angular',
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

  it('should provide itself as a SkyDataColumnSource', async () => {
    await detect();

    expect(getColumnSource()).toBeInstanceOf(SkyDataGrid);
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
});
