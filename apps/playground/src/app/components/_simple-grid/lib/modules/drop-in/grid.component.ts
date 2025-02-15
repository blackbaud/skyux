/* eslint-disable @angular-eslint/component-selector */
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SkyAgGridModule, SkyAgGridService, SkyCellType } from '@skyux/ag-grid';
import { SkyResizeObserverService } from '@skyux/core';

import { AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  SelectionChangedEvent,
} from 'ag-grid-community';
import { debounceTime } from 'rxjs';

import {
  SkyGridColumnAlignment,
  SkyGridColumnComponent,
} from './grid-column.component';

export enum SkyGridSelectedRowsSource {
  CheckboxChange,
  ClearAll,
  RowClick,
  SelectAll,
  SelectedRowIdsChange,
}

export interface SkyGridSelectedRowsModelChange {
  /**
   * The IDs of the rows that are selected.
   */
  selectedRowIds?: string[];

  /**
   * @internal
   * Defines the source of the change. This will typically be used to determine
   * if the change came from user interaction or a programmatic source.
   */
  source?: SkyGridSelectedRowsSource;
}

type SkyGridFit = 'scroll' | 'width';

function toCellType(
  alignment: SkyGridColumnAlignment,
): SkyCellType | undefined {
  switch (alignment) {
    case 'right':
      return SkyCellType.RightAligned;
    default:
      return undefined;
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AgGridModule, SkyAgGridModule],
  selector: 'sky-grid',
  styles: `
    :host {
      display: block;
    }
  `,
  template: `@if (activated()) {
      <sky-ag-grid-wrapper>
        <ag-grid-angular
          skyBackToTop
          [gridOptions]="gridOptions()"
          [rowData]="rowData()"
          (gridReady)="onGridReady($event)"
          (selectionChanged)="onSelectionChanged($event)"
        />
      </sky-ag-grid-wrapper>
    }

    <ng-container>
      <ng-content select="sky-grid-column" />
    </ng-container> `,
})
export class SkyGridComponent {
  readonly #agGridSvc = inject(SkyAgGridService);
  readonly #resizeObserver = inject(SkyResizeObserverService);

  //#region heavily used
  public data = input.required<unknown[]>();
  public enableMultiselect = input(false, { transform: booleanAttribute });
  public fit = input<SkyGridFit>('width');
  //#endregion

  //#region rarely used
  public selectedColumnIds = input();
  public selectedRowIds = input();
  public multiselectSelectionChange = output<SkyGridSelectedRowsModelChange>();
  public sortFieldChange = output();
  //#endregion

  protected columnRefs = contentChildren(SkyGridColumnComponent);
  protected activated = signal(false);

  #gridApi: GridApi | undefined;

  protected gridOptions = signal<GridOptions | undefined>(undefined);

  protected rowData = computed(() => {
    const data = this.data();
    return data;
  });

  protected columnDefs = computed(() => {
    const columnRefs = this.columnRefs();
    const defs: ColDef[] = [];

    if (this.enableMultiselect()) {
      defs.push({
        field: 'selected',
        type: SkyCellType.RowSelector,
      });
    }

    for (const columnRef of columnRefs) {
      const types: string[] = [];

      const alignmentType = toCellType(columnRef.alignment());

      if (alignmentType) {
        types.push(alignmentType);
      }

      const extras: ColDef = {};

      if (columnRef.template()) {
        types.push(SkyCellType.Template);
        extras.cellRendererParams = {
          template: columnRef.template(),
        };
      }

      defs.push({
        colId: columnRef.id(),
        field: columnRef.field(),
        headerName: columnRef.heading(),
        hide: columnRef.hidden(),
        sortable: columnRef.isSortable(),
        lockPosition: columnRef.locked(),
        maxWidth: columnRef.width(),
        type: types,
        ...extras,
      });
    }

    return defs;
  });

  constructor() {
    effect(() => {
      const columnDefs = this.columnDefs();

      const gridOptions: GridOptions = {
        columnDefs,
      };

      const options = this.#agGridSvc.getGridOptions({
        gridOptions,
      });

      this.gridOptions.set(options);
      this.#reactivateGrid();
    });

    this.#resizeObserver
      .observe(inject(ElementRef))
      .pipe(takeUntilDestroyed(), debounceTime(200))
      .subscribe(() => {
        this.#gridApi?.sizeColumnsToFit();
      });
  }

  /**
   * Need to destroy and recreate the grid if options change.
   * @see https://www.ag-grid.com/angular-data-grid/grid-interface/#initial-grid-options
   * @see https://ag-grid.zendesk.com/hc/en-us/articles/360016033371-Create-and-destroy-grids
   */
  #reactivateGrid(): void {
    this.activated.set(false);

    setTimeout(() => {
      this.activated.set(true);
    });
  }

  protected onGridReady({ api }: GridReadyEvent): void {
    this.#gridApi = api;

    api.sizeColumnsToFit();
    api.resetRowHeights();
  }

  protected onSelectionChanged({ api }: SelectionChangedEvent): void {
    if (this.enableMultiselect()) {
      this.multiselectSelectionChange.emit({
        selectedRowIds: api.getSelectedNodes().map((n) => n.data.id),
      });
    }
  }
}
