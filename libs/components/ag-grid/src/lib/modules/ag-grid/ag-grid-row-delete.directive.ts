import {
  AfterContentInit,
  AfterViewInit,
  DestroyRef,
  Directive,
  ElementRef,
  EnvironmentInjector,
  OnDestroy,
  contentChild,
  inject,
  linkedSignal,
  model,
  output,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  SKY_STACKING_CONTEXT,
  SkyOverlayInstance,
  SkyOverlayService,
  SkyScrollableHostService,
  SkyStackingContextService,
  SkyStackingContextStratum,
} from '@skyux/core';

import { AgGridAngular } from 'ag-grid-angular';
import { GridApi, GridOptions } from 'ag-grid-community';
import {
  BehaviorSubject,
  Subject,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  merge,
  of,
  startWith,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';

import {
  SKY_AG_GRID_ROW_DELETE_CONTEXT,
  SkyAgGridRowDeleteContext,
} from './ag-grid-row-delete-context';
import { SkyAgGridRowDeleteComponent } from './ag-grid-row-delete.component';
import { SkyAgGridRowDeleteCancelArgs } from './types/ag-grid-row-delete-cancel-args';
import { SkyAgGridRowDeleteConfirmArgs } from './types/ag-grid-row-delete-confirm-args';

@Directive({
  selector: '[skyAgGridRowDelete]',
})
export class SkyAgGridRowDeleteDirective
  implements AfterContentInit, AfterViewInit, OnDestroy
{
  /**
   * The IDs of the data in the rows where the inline delete appears.
   */
  public readonly rowDeleteIds = model<string[]>([]);

  /**
   * Emits a `SkyAgGridRowDeleteCancelArgs` object when a row's inline delete is cancelled.
   */
  public rowDeleteCancel = output<SkyAgGridRowDeleteCancelArgs>();

  /**
   * Emits a `SkyAgGridRowDeleteConfirmArgs` object when a row's inline delete is confirmed.
   */
  public rowDeleteConfirm = output<SkyAgGridRowDeleteConfirmArgs>();

  protected readonly agGrid = contentChild(AgGridAngular);

  readonly #agGridBodyViewport = new BehaviorSubject<
    ElementRef<HTMLDivElement>[]
  >([]);
  readonly #agGridBodyClipElements = new BehaviorSubject<
    ElementRef<HTMLDivElement>[]
  >([]);
  readonly #ngUnsubscribe = new Subject<void>();
  readonly #rowDeleteIdsInternal = linkedSignal<unknown[], string[]>({
    source: this.rowDeleteIds,
    computation: (value) =>
      [...new Set(value)]
        .filter(Boolean)
        .map(String)
        .sort((a, b) => a.localeCompare(b)),
    equal: (a, b) => a.length === b.length && a.every((v, i) => v === b[i]),
  });
  readonly #clipPath = new BehaviorSubject<string | undefined>(undefined);
  readonly #zIndex = new BehaviorSubject(
    inject(SkyStackingContextService).getZIndex(
      inject(SkyStackingContextStratum),
      inject(DestroyRef),
    ),
  );
  readonly #elementRef = inject(ElementRef<HTMLElement>);
  readonly #environmentInjector = inject(EnvironmentInjector);
  readonly #overlayService = inject(SkyOverlayService);
  #overlay: SkyOverlayInstance | undefined;
  readonly #rowDeleteSvc: SkyAgGridRowDeleteContext;
  readonly #scrollableHostService = inject(SkyScrollableHostService);
  readonly #stackingContext = inject(SKY_STACKING_CONTEXT, { optional: true });

  constructor() {
    if (this.#stackingContext) {
      this.#stackingContext.zIndex
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((zIndex) => {
          this.#zIndex.next(zIndex);
        });
    }

    this.#rowDeleteSvc = new SkyAgGridRowDeleteContext(
      this.#rowDeleteIdsInternal.asReadonly(),
      toSignal(this.#agGridBodyViewport),
      signal<GridApi | undefined>(undefined),
    );

    this.#rowDeleteSvc.cancelRowDelete
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((rowId) => {
        if (rowId) {
          this.rowDeleteIds.update((rowIds) =>
            rowIds.filter((id) => id !== rowId),
          );
          this.rowDeleteCancel.emit({ id: rowId });
        }
      });

    this.#rowDeleteSvc.confirmRowDelete
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((rowId) => {
        if (rowId) {
          this.rowDeleteConfirm.emit({ id: rowId });
        }
      });

    const agGrid = toObservable(this.agGrid);
    const agGridReady = agGrid.pipe(
      filter((agGrid) => !!agGrid),
      switchMap((agGrid: AgGridAngular) => agGrid.gridReady),
      take(1),
      takeUntil(this.#ngUnsubscribe),
    );
    agGridReady.subscribe((ready) => {
      this.#agGridBodyViewport.next([
        new ElementRef(
          this.#elementRef.nativeElement.querySelector(
            'div.ag-root-wrapper',
          ) as HTMLDivElement,
        ),
      ]);
      this.#rowDeleteSvc.gridApi.set(ready.api);
    });
    agGrid
      .pipe(
        filter((grid) => !!grid),
        switchMap((grid) =>
          merge(
            grid.firstDataRendered.asObservable(),
            grid.rowDataUpdated.asObservable(),
            agGridReady.pipe(
              switchMap(() => fromEvent(grid.api, 'gridOptionsChanged')),
            ),
          ).pipe(
            takeUntil(this.#ngUnsubscribe),
            takeUntil(
              agGridReady.pipe(
                switchMap(() =>
                  fromEvent(grid.api, 'gridPreDestroyed').pipe(take(1)),
                ),
              ),
            ),
            startWith(grid.api?.getGridOption('domLayout')),
            map(() => grid.api?.getGridOption('domLayout')),
            switchMap((domLayout: GridOptions['domLayout']) => {
              if (domLayout === 'normal') {
                return this.#agGridBodyViewport.asObservable();
              }
              return of([]);
            }),
          ),
        ),
      )
      .subscribe((agGridBodyClipElements) => {
        // When using AG Grid's `domLayout: 'autoHeight'` option,
        // the grid's body viewport is clipped by the scrollable host.
        // But when using `domLayout: 'normal'`, the grid's body viewport
        // should be used as the scrollable host for the row delete overlay.
        this.#agGridBodyClipElements.next(agGridBodyClipElements);
      });

    agGrid
      .pipe(
        filter((agGrid) => !!agGrid),
        switchMap((agGrid: AgGridAngular) => agGrid.rowDataUpdated),
        takeUntil(this.#ngUnsubscribe),
      )
      .subscribe((evt) => {
        this.rowDeleteIds.update((rowIds) =>
          (rowIds ?? []).filter((id) => !!evt.api.getRowNode(id)),
        );
      });
  }

  public ngAfterContentInit(): void {
    this.#overlay = this.#overlayService.create({
      enableScroll: true,
      environmentInjector: this.#environmentInjector,
      showBackdrop: false,
      closeOnNavigation: true,
      enableClose: false,
      enablePointerEvents: true,
    });

    this.#overlay.attachComponent(SkyAgGridRowDeleteComponent, [
      {
        provide: SKY_AG_GRID_ROW_DELETE_CONTEXT,
        useValue: this.#rowDeleteSvc,
      },
    ]);
    this.#zIndex
      .pipe(
        takeUntil(this.#ngUnsubscribe),
        takeUntil(this.#overlay.closed),
        distinctUntilChanged(),
      )
      .subscribe((zIndex) => {
        if (this.#overlay) {
          this.#overlay.componentRef.instance.zIndex = zIndex.toString(10);
        }
      });
    this.#clipPath
      .pipe(
        takeUntil(this.#ngUnsubscribe),
        takeUntil(this.#overlay.closed),
        distinctUntilChanged(),
      )
      .subscribe((clipPath) => {
        this.#overlay?.componentRef.instance.updateClipPath(clipPath);
      });
  }

  public ngAfterViewInit(): void {
    this.#scrollableHostService
      .watchScrollableHostClipPathChanges(
        this.#elementRef,
        this.#agGridBodyClipElements.asObservable(),
      )
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((clipPath) => {
        this.#clipPath.next(clipPath);
      });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
    this.#rowDeleteSvc.subscription.unsubscribe();
    if (this.#overlay) {
      this.#overlayService.close(this.#overlay);
    }
  }
}
