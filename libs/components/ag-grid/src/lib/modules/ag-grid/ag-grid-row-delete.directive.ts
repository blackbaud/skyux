import type { AfterContentInit, AfterViewInit, OnDestroy } from '@angular/core';
import {
  Directive,
  ElementRef,
  EnvironmentInjector,
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
  SkyOverlayService,
  SkyScrollableHostService,
} from '@skyux/core';

import { AgGridAngular } from 'ag-grid-angular';
import type { GridApi } from 'ag-grid-community';
import {
  BehaviorSubject,
  Subject,
  distinctUntilChanged,
  filter,
  switchMap,
  takeUntil,
} from 'rxjs';

import {
  SKY_AG_GRID_ROW_DELETE_CONTEXT,
  SkyAgGridRowDeleteContext,
} from './ag-grid-row-delete-context';
import { SkyAgGridRowDeleteComponent } from './ag-grid-row-delete.component';
import type { SkyAgGridRowDeleteCancelArgs } from './types/ag-grid-row-delete-cancel-args';
import type { SkyAgGridRowDeleteConfirmArgs } from './types/ag-grid-row-delete-confirm-args';

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
  protected readonly agGridBodyViewport = new BehaviorSubject<
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
  readonly #zIndex = new BehaviorSubject(998);
  readonly #elementRef = inject(ElementRef<HTMLElement>);
  readonly #environmentInjector = inject(EnvironmentInjector);
  readonly #overlayService = inject(SkyOverlayService);
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
      toSignal(this.agGridBodyViewport),
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
    agGrid
      .pipe(
        filter((agGrid) => !!agGrid),
        switchMap((agGrid: AgGridAngular) => agGrid.gridReady),
        takeUntil(this.#ngUnsubscribe),
      )
      .subscribe(() => {
        this.agGridBodyViewport.next([
          new ElementRef(
            this.#elementRef.nativeElement.querySelector(
              'div.ag-root-wrapper',
            ) as HTMLDivElement,
          ),
        ]);
        this.#rowDeleteSvc.gridApi.set(this.agGrid()?.api);
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
    const overlay = this.#overlayService.create({
      enableScroll: true,
      environmentInjector: this.#environmentInjector,
      showBackdrop: false,
      closeOnNavigation: true,
      enableClose: false,
      enablePointerEvents: true,
    });

    overlay.attachComponent(SkyAgGridRowDeleteComponent, [
      {
        provide: SKY_AG_GRID_ROW_DELETE_CONTEXT,
        useValue: this.#rowDeleteSvc,
      },
    ]);
    this.#zIndex
      .pipe(
        takeUntil(this.#ngUnsubscribe),
        takeUntil(overlay.closed),
        distinctUntilChanged(),
      )
      .subscribe((zIndex) => {
        overlay.componentRef.instance.zIndex = zIndex.toString(10);
      });
    this.#clipPath
      .pipe(
        takeUntil(this.#ngUnsubscribe),
        takeUntil(overlay.closed),
        distinctUntilChanged(),
      )
      .subscribe((clipPath) => {
        overlay.componentRef.instance.updateClipPath(clipPath);
      });
  }

  public ngAfterViewInit(): void {
    this.#scrollableHostService
      .watchScrollableHostClipPathChanges(
        this.#elementRef,
        this.agGridBodyViewport.asObservable(),
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
    this.#overlayService.closeAll();
  }
}
