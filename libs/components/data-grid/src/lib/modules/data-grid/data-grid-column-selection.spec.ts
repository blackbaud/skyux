import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyDataColumnSource } from '@skyux/lists';

import { GridApi, getGridApi } from 'ag-grid-community';

import { SkyDataGrid } from './data-grid';
import { ColumnSelectionTestComponent } from './fixtures/column-selection-test.component';

describe('SkyDataGrid column selection', () => {
  let fixture: ComponentFixture<ColumnSelectionTestComponent>;

  function getColumnSource(): SkyDataColumnSource {
    return fixture.debugElement
      .query((node) => node.componentInstance instanceof SkyDataGrid)
      .injector.get(SkyDataColumnSource);
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

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnSelectionTestComponent);
  });

  it('should provide itself as a SkyDataColumnSource', async () => {
    await detect();

    expect(getColumnSource()).toBeInstanceOf(SkyDataGrid);
  });

  it('should derive the column catalog from the declared columns', async () => {
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

  it('should omit columns that have neither a columnId nor a field', async () => {
    fixture.componentRef.setInput('showInvalid', true);
    await detect();

    expect(
      getColumnSource()
        .columnOptions()
        .map((col) => col.id),
    ).toEqual(['locked', 'name', 'age', 'extra']);
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

  it('should not emit when setDisplayedColumnIds matches what displays', async () => {
    await detect();

    getColumnSource().setDisplayedColumnIds(['locked', 'name', 'age', 'extra']);
    await detect();

    expect(fixture.componentInstance.selectedColumnIds()).toBeUndefined();
  });

  it('should keep hidden columns defined so they can be shown again', async () => {
    fixture.componentInstance.selectedColumnIds.set(['locked', 'name']);
    await detect();

    const columnState = (
      getGridApi(
        fixture.nativeElement.querySelector('ag-grid-angular'),
      ) as GridApi
    ).getColumnState();

    expect(
      columnState.map((state) => ({ id: state.colId, hide: !!state.hide })),
    ).toEqual([
      { id: 'locked', hide: false },
      { id: 'name', hide: false },
      { id: 'age', hide: true },
      { id: 'extra', hide: true },
    ]);
  });

  it('should store the new order when the user moves a column', async () => {
    await detect();

    moveColumnRight('name');
    await detect();

    expect(fixture.componentInstance.selectedColumnIds()).toEqual([
      'locked',
      'age',
      'name',
      'extra',
    ]);
    expect(getColumnSource().displayedColumnIds()).toEqual([
      'locked',
      'age',
      'name',
      'extra',
    ]);
  });

  it('should not store a new order when applying a layout moves columns', async () => {
    await detect();

    // Applying a layout moves columns in the grid, which must not be mistaken
    // for a move the user made.
    getColumnSource().setDisplayedColumnIds(['locked', 'age', 'name']);
    await detect();

    expect(fixture.componentInstance.selectedColumnIds()).toEqual([
      'locked',
      'age',
      'name',
    ]);
  });

  it('should apply the column order to the grid', async () => {
    await detect();

    fixture.componentInstance.selectedColumnIds.set(['locked', 'age', 'name']);
    await detect();

    const api = getGridApi(
      fixture.nativeElement.querySelector('ag-grid-angular'),
    ) as GridApi;

    expect(
      api
        .getColumnState()
        .filter((state) => !state.hide)
        .map((state) => state.colId),
    ).toEqual(['locked', 'age', 'name']);
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
