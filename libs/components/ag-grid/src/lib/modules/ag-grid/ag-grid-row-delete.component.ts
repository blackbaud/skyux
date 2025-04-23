import { Component, ElementRef, computed, inject, signal } from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { SkyAffixModule, SkyResizeObserverService } from '@skyux/core';
import { SkyInlineDeleteModule } from '@skyux/layout';

import { GridApi } from 'ag-grid-community';
import {
  filter,
  fromEvent,
  map,
  merge,
  of,
  scan,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs';

import { SKY_AG_GRID_ROW_DELETE_CONTEXT } from './ag-grid-row-delete-context';

/**
 * Component for rendering the inline delete template in the overlay.
 * @internal
 */
@Component({
  selector: 'sky-ag-grid-row-delete',
  templateUrl: './ag-grid-row-delete.component.html',
  styleUrl: './ag-grid-row-delete.component.css',
  imports: [SkyInlineDeleteModule, SkyAffixModule],
  host: {
    '[style]': '"--table-width: " + tableWidthStyle()',
  },
})
export class SkyAgGridRowDeleteComponent {
  public readonly service = inject(SKY_AG_GRID_ROW_DELETE_CONTEXT);

  protected tableWidthStyle = computed(() => {
    const tableWidth = this.tableWidth();
    if (tableWidth > 0) {
      return `${tableWidth}px`;
    }
    return 'auto';
  });

  protected rowsWithElements = computed(
    (): { rowId: string; increment: string; element: HTMLElement | null }[] => {
      const rows = this.service.rows();
      const gridElement = this.service.gridElement();
      const gridApi = this.service.gridApi();
      const increment = this.gridChanges();
      if (!gridElement || !gridApi) {
        return [];
      }
      return rows
        .filter((rowId) => !!rowId && !!gridApi.getRowNode(rowId))
        .map((rowId) => {
          const element = gridElement[0]?.nativeElement
            .querySelector<HTMLElement>(`
          [row-id="${rowId}"] div[aria-colindex],
          .ag-row.sky-ag-grid-row-${rowId} div[aria-colindex]
        `);
          return { rowId, element, increment: `${rowId}-${increment}` };
        });
    },
  );

  protected readonly pending = signal<string[]>([]);
  protected readonly tableWidth = signal<number>(0);

  // Force redrawing overlays when the grid changes by incrementing a number.
  protected readonly gridChanges = toSignal(
    toObservable(this.service.gridApi).pipe(
      switchMap((gridApi) =>
        gridApi
          ? merge(
              fromEvent(gridApi, 'componentStateChanged'),
              fromEvent(gridApi, 'firstDataRendered'),
              fromEvent(gridApi, 'gridSizeChanged'),
              fromEvent(gridApi, 'modelUpdated'),
              fromEvent(gridApi, 'rowDataUpdated'),
            ).pipe(takeUntil(fromEvent(gridApi, 'gridPreDestroyed')))
          : of(undefined),
      ),
      startWith(1),
      map(() => 1),
      scan((acc, val) => acc + val),
    ),
    { initialValue: 0 },
  );

  readonly #resizeObserverSvc = inject(SkyResizeObserverService);

  constructor() {
    // Maintain table width when the grid is resized.
    toObservable(this.service.gridElement)
      .pipe(
        filter(
          (el): el is ElementRef<HTMLElement>[] => Array.isArray(el) && !!el[0],
        ),
        switchMap((gridElement) =>
          this.#resizeObserverSvc
            .observe(gridElement[0])
            .pipe(map(() => gridElement[0].nativeElement.offsetWidth)),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((tableWidth) => {
        this.tableWidth.set(tableWidth);
      });

    // Clean up pending rows when the grid data is updated.
    toObservable(this.service.gridApi)
      .pipe(
        filter((gridApi): gridApi is GridApi => !!gridApi),
        switchMap((gridApi) =>
          fromEvent(gridApi, 'rowDataUpdated').pipe(
            takeUntil(fromEvent(gridApi, 'gridPreDestroyed')),
            map(() => gridApi),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((gridApi) => {
        this.pending.update((pending) =>
          pending.filter((rowId) => !!gridApi.getRowNode(rowId)),
        );
      });
  }

  protected cancelDelete(rowId: string): void {
    this.service.cancelRowDelete.next(rowId);
  }

  protected confirmDelete(rowId: string): void {
    this.pending.update((pending) => pending.concat(rowId));
    this.service.confirmRowDelete.next(rowId);
  }
}
