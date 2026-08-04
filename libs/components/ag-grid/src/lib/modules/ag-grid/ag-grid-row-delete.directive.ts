import {
  DestroyRef,
  Directive,
  ElementRef,
  EnvironmentInjector,
  afterNextRender,
  contentChild,
  inject,
  linkedSignal,
  model,
  output,
  signal,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import {
  SKY_STACKING_CONTEXT,
  SkyOverlayInstance,
  SkyOverlayService,
  SkyScrollableHostService,
} from '@skyux/core';

import { AgGridAngular } from 'ag-grid-angular';
import { GridApi } from 'ag-grid-community';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  shareReplay,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';

import { fromGridEvent } from './ag-grid-event-utils';
import {
  SKY_AG_GRID_ROW_DELETE_CONTEXT,
  SkyAgGridRowDeleteContext,
  SkyAgGridRowDeleteVisibleRegion,
} from './ag-grid-row-delete-context';
import { SkyAgGridRowDeleteComponent } from './ag-grid-row-delete.component';
import { SkyAgGridRowDeleteCancelArgs } from './types/ag-grid-row-delete-cancel-args';
import { SkyAgGridRowDeleteConfirmArgs } from './types/ag-grid-row-delete-confirm-args';

/**
 * Parses the `inset(...)` clip-path produced by
 * `SkyScrollableHostService.watchScrollableHostClipPathChanges` into the
 * visible region it describes, in viewport coordinates. Returns `undefined`
 * when nothing is clipped (e.g. `none`), meaning no row overlay is masked.
 */
function parseClipPathVisibleRegion(
  clipPath: string | undefined,
): SkyAgGridRowDeleteVisibleRegion | undefined {
  const match = clipPath?.match(
    /^inset\((-?[\d.]+)px\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+(-?[\d.]+)px\)$/,
  );
  if (!match) {
    return undefined;
  }
  const [, top, rightInverse, bottomInverse, left] = match.map(Number);
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = document.documentElement.clientHeight;
  return {
    top,
    left,
    right: viewportWidth - rightInverse,
    bottom: viewportHeight - bottomInverse,
  };
}

/**
 * Enables inline row delete functionality for an AG Grid when included
 * on the `SkyAgGridWrapperComponent` element. The directive uses
 * `rowDeleteIds` to determine which rows to add inline delete options to.
 */
@Directive({
  selector: '[skyAgGridRowDelete]',
})
export class SkyAgGridRowDeleteDirective {
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

  readonly #agGridRootElement = new BehaviorSubject<
    ElementRef<HTMLDivElement>[]
  >([]);
  readonly #agGridHeaderElement = new BehaviorSubject<
    ElementRef<HTMLDivElement>[]
  >([]);
  readonly #destroyRef = inject(DestroyRef);
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
  readonly #visibleRegion = new BehaviorSubject<
    SkyAgGridRowDeleteVisibleRegion | undefined
  >(undefined);
  readonly #zIndex = new BehaviorSubject(998);
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
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe((zIndex) => {
          this.#zIndex.next(zIndex);
        });
    }

    this.#rowDeleteSvc = new SkyAgGridRowDeleteContext(
      this.#rowDeleteIdsInternal.asReadonly(),
      toSignal(this.#agGridRootElement),
      signal<GridApi | undefined>(undefined),
      toSignal(this.#visibleRegion),
    );

    const agGrid = toObservable(this.agGrid);
    const agGridReady = agGrid.pipe(
      filter((agGrid) => !!agGrid),
      switchMap((agGrid: AgGridAngular) => agGrid.gridReady),
      take(1),
      takeUntilDestroyed(this.#destroyRef),
    );
    const agGridDestroyed = agGridReady.pipe(
      switchMap((ready) => fromGridEvent(ready.api, 'gridPreDestroyed')),
      take(1),
      takeUntilDestroyed(this.#destroyRef),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    agGridReady.pipe(takeUntil(agGridDestroyed)).subscribe((ready) => {
      const rowsWrapper = this.#elementRef.nativeElement.querySelector(
        'div.ag-grid-scrolling-rows',
      );
      if (rowsWrapper) {
        this.#agGridRootElement.next([
          new ElementRef(rowsWrapper as HTMLDivElement),
        ]);
      }
      const headerWrapper =
        this.#elementRef.nativeElement.querySelector('div.ag-header');
      if (headerWrapper) {
        this.#agGridHeaderElement.next([
          new ElementRef(headerWrapper as HTMLDivElement),
        ]);
      }
      this.#rowDeleteSvc.gridApi.set(ready.api);
    });
    agGridDestroyed.subscribe(() => {
      this.#rowDeleteSvc.gridApi.set(undefined);
    });

    agGrid
      .pipe(
        filter((agGrid) => !!agGrid),
        switchMap((agGrid: AgGridAngular) => agGrid.rowDataUpdated),
        takeUntilDestroyed(this.#destroyRef),
        takeUntil(agGridDestroyed),
      )
      .subscribe((evt) => {
        this.rowDeleteIds.update((rowIds) =>
          (rowIds ?? []).filter((id) => !!evt.api.getRowNode(id)),
        );
      });

    afterNextRender(() => {
      this.#overlay = this.#overlayService.create({
        enableScroll: true,
        environmentInjector: this.#environmentInjector,
        showBackdrop: false,
        closeOnNavigation: false,
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
          takeUntilDestroyed(this.#destroyRef),
          takeUntil(this.#overlay.closed),
          takeUntil(agGridDestroyed),
          distinctUntilChanged(),
        )
        .subscribe((zIndex) => {
          if (this.#overlay) {
            this.#overlay.componentRef.instance.zIndex = zIndex.toString(10);
            this.#overlay.componentRef.changeDetectorRef.markForCheck();
          }
        });
      this.#clipPath
        .pipe(
          takeUntilDestroyed(this.#destroyRef),
          takeUntil(this.#overlay.closed),
          distinctUntilChanged(),
        )
        .subscribe((clipPath) => {
          this.#overlay?.componentRef.instance.updateClipPath(clipPath);
        });

      this.#scrollableHostService
        .watchScrollableHostClipPathChanges(this.#elementRef, {
          additionalContainers: this.#agGridRootElement.asObservable(),
          additionalMasking: { top: this.#agGridHeaderElement.asObservable() },
        })
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe((clipPath) => {
          this.#clipPath.next(clipPath);
          this.#visibleRegion.next(parseClipPathVisibleRegion(clipPath));
        });
    });

    this.#destroyRef.onDestroy(() => {
      this.#rowDeleteSvc.subscription.unsubscribe();
      if (this.#overlay) {
        this.#overlayService.close(this.#overlay);
      }
    });

    this.#rowDeleteSvc.cancelRowDelete
      .pipe(takeUntilDestroyed(this.#destroyRef), takeUntil(agGridDestroyed))
      .subscribe((rowId) => {
        if (rowId) {
          this.rowDeleteIds.update((rowIds) =>
            rowIds.filter((id) => id !== rowId),
          );
          this.rowDeleteCancel.emit({ id: rowId });
        }
      });

    this.#rowDeleteSvc.confirmRowDelete
      .pipe(takeUntilDestroyed(this.#destroyRef), takeUntil(agGridDestroyed))
      .subscribe((rowId) => {
        if (rowId) {
          this.rowDeleteConfirm.emit({ id: rowId });
        }
      });
  }
}
