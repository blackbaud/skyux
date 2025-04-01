import {
  AfterContentInit,
  AfterViewInit,
  DestroyRef,
  Directive,
  ElementRef,
  EnvironmentInjector,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
  contentChild,
  inject,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  SKY_STACKING_CONTEXT,
  SkyAffixAutoFitContext,
  SkyAffixService,
  SkyAffixer,
  SkyDynamicComponentService,
  SkyOverlayService,
  SkyScrollableHostService,
  SkyStackingContextService,
  SkyStackingContextStratum,
} from '@skyux/core';

import { AgGridAngular } from 'ag-grid-angular';
import { IRowNode } from 'ag-grid-community';
import {
  BehaviorSubject,
  Subject,
  animationFrames,
  asapScheduler,
  delay,
  filter,
  map,
  merge,
  observeOn,
  sample,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

import { SkyAgGridRowDeleteComponent } from './ag-grid-row-delete.component';
import { SkyAgGridRowDeleteCancelArgs } from './types/ag-grid-row-delete-cancel-args';
import { SkyAgGridRowDeleteConfig } from './types/ag-grid-row-delete-config';
import { SkyAgGridRowDeleteConfirmArgs } from './types/ag-grid-row-delete-confirm-args';
import { SkyAgGridRowDeleteContents } from './types/ag-grid-row-delete-contents';

@Directive({ selector: '[skyAgGridRowDelete]' })
export class SkyAgGridRowDeleteDirective
  implements AfterContentInit, AfterViewInit, OnDestroy
{
  /**
   * The IDs of the data in the rows where the inline delete appears.
   */
  public readonly rowDeleteIds = input<string[], unknown>([], {
    transform: (value) => (Array.isArray(value) ? value.map(String) : []),
  });
  public readonly rowDeleteIdsChange = output<string[]>();

  /**
   * Emits a `SkyAgGridRowDeleteCancelArgs` object when a row's inline delete is cancelled.
   */
  public rowDeleteCancel = output<SkyAgGridRowDeleteCancelArgs>();

  /**
   * Emits a `SkyAgGridRowDeleteConfirmArgs` object when a row's inline delete is confirmed.
   */
  public rowDeleteConfirm = output<SkyAgGridRowDeleteConfirmArgs>();

  protected readonly agGrid = contentChild(AgGridAngular);

  readonly #ngUnsubscribe = new Subject<void>();
  #rowDeleteComponent: SkyAgGridRowDeleteComponent | undefined;
  #rowDeleteConfigs: SkyAgGridRowDeleteConfig[] = [];
  readonly #rowDeleteContents: SkyAgGridRowDeleteContents[] = [];
  #rowDeleteContentsQueue: Pick<
    SkyAgGridRowDeleteContents,
    'id' | 'overlay'
  >[] = [];
  readonly #rowDeleteContentsQueued = new Subject<void>();
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
  readonly #affixService = inject(SkyAffixService);
  readonly #dynamicComponentSvc = inject(SkyDynamicComponentService);
  readonly #elementRef = inject(ElementRef<HTMLElement>);
  readonly #environmentInjector = inject(EnvironmentInjector);
  readonly #overlayService = inject(SkyOverlayService);
  readonly #scrollableHostService = inject(SkyScrollableHostService);
  readonly #stackingContext = inject(SKY_STACKING_CONTEXT, { optional: true });
  readonly #viewContainerRef = inject(ViewContainerRef);
  readonly #viewUpdate = new Subject<void>();

  constructor() {
    if (this.#stackingContext) {
      this.#stackingContext.zIndex
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((zIndex) => {
          this.#zIndex.next(zIndex);
        });
    }
    const rowDeleteIds = toObservable<string[]>(this.#rowDeleteIdsInternal);
    toObservable(this.agGrid)
      .pipe(
        takeUntil(this.#ngUnsubscribe),
        filter((agGrid) => !!agGrid),
        switchMap((agGrid: AgGridAngular) =>
          merge(
            agGrid.componentStateChanged,
            agGrid.filterChanged,
            agGrid.firstDataRendered,
            agGrid.gridReady,
            agGrid.gridSizeChanged.pipe(delay(500)),
            agGrid.rowDataUpdated.pipe(
              takeUntil(this.#ngUnsubscribe),
              tap((evt) => {
                const ids = this.#rowDeleteIdsInternal();
                this.#rowDeleteIdsInternal.set(
                  ids.filter((id) => evt.api.getRowNode(id)),
                );
              }),
            ),
            agGrid.sortChanged,
            this.#viewUpdate.pipe(delay(200)),
            rowDeleteIds.pipe(
              takeUntil(this.#ngUnsubscribe),
              tap((value) => {
                this.#rowDeleteConfigs = this.#rowDeleteConfigs.filter(
                  (config) => value.includes(config.id),
                );

                for (const id of value) {
                  if (
                    !this.#rowDeleteConfigs.some((config) => config.id === id)
                  ) {
                    this.#rowDeleteConfigs.push({
                      id,
                      pending: false,
                    });
                  }
                }

                this.rowDeleteIdsChange.emit(value);
              }),
            ),
          ).pipe(
            takeUntil(this.#ngUnsubscribe),
            // After change detection.
            observeOn(asapScheduler),
            // Wait for a render cycle.
            sample(animationFrames()),
            map(() => undefined),
          ),
        ),
      )
      .subscribe(() => {
        this.#updateRowDeleteStates();
      });

    this.#rowDeleteContentsQueued
      .pipe(
        takeUntil(this.#ngUnsubscribe),
        // After change detection.
        observeOn(asapScheduler),
        // Wait for a render cycle.
        sample(animationFrames()),
      )
      .subscribe(() => {
        const queue = [...this.#rowDeleteContentsQueue];
        this.#rowDeleteContentsQueue = [];
        queue.forEach(({ id, overlay }) => {
          if (
            this.#rowDeleteContents.findIndex(
              (content) => content.id === id,
            ) === -1 &&
            this.#rowDeleteIdsInternal().includes(id)
          ) {
            const inlineDeleteRef = this.#rowDeleteComponent
              ?.inlineDeleteRefs()
              .find(
                (elRef) => elRef.nativeElement.id === 'row-delete-ref-' + id,
              );
            const rowNode = this.agGrid()?.api.getRowNode(id);
            if (rowNode && inlineDeleteRef) {
              const affixer = this.#affixService.createAffixer(inlineDeleteRef);
              this.#affixToRow(affixer, id);
              this.#rowDeleteContents.push({ id, affixer, overlay });
              return;
            }
          }
          this.#overlayService.close(overlay);
        });
      });
  }

  public ngAfterContentInit(): void {
    this.#rowDeleteComponent = this.#dynamicComponentSvc.createComponent(
      SkyAgGridRowDeleteComponent,
      {
        environmentInjector: this.#environmentInjector,
        viewContainerRef: this.#viewContainerRef,
      },
    ).instance;
  }

  public ngAfterViewInit(): void {
    if (this.#stackingContext) {
      this.#scrollableHostService
        .watchScrollableHostClipPathChanges(this.#elementRef)
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((clipPath) => {
          this.#clipPath.next(clipPath);
        });
    }
    this.#viewUpdate.next();
  }

  public ngOnDestroy(): void {
    this.#viewUpdate.complete();
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();

    this.#rowDeleteContents.forEach(({ id }) => {
      this.#destroyRowDelete(id);
    });
  }

  public cancelRowDelete(row: IRowNode): void {
    if (row.id) {
      this.#rowDeleteIdsInternal.set(
        this.#rowDeleteIdsInternal().filter((id) => id !== row.id),
      );
      this.rowDeleteCancel.emit({ id: row.id });
    }
  }

  public confirmRowDelete(row: IRowNode): void {
    const rowConfig = this.#rowDeleteConfigs.find(
      (config) => config.id === row.id,
    );
    if (row.id && rowConfig) {
      rowConfig.pending = true;
      this.rowDeleteConfirm.emit({ id: row.id });
    }
  }

  public getRowDeleteItem(row: IRowNode): SkyAgGridRowDeleteConfig {
    return (
      this.#rowDeleteConfigs.find((config) => config.id === row.id) ?? {
        id: `${row.id}`,
        pending: false,
      }
    );
  }

  #affixToRow(affixer: SkyAffixer, id: string): void {
    const rowElement = this.#elementRef.nativeElement.querySelector(`
      [row-id="${id}"] div[aria-colindex],
      .ag-row.sky-ag-grid-row-${id} div[aria-colindex]
    `);
    const values = this.#rowDeleteIdsInternal();

    if (rowElement && values.includes(id)) {
      affixer.affixTo(rowElement, {
        autoFitContext: SkyAffixAutoFitContext.Viewport,
        isSticky: true,
        placement: 'above',
        verticalAlignment: 'top',
        horizontalAlignment: 'left',
        enableAutoFit: false,
      });
    }
  }

  #destroyRowDelete(id: string): void {
    const idx = this.#rowDeleteContents.findIndex(
      (content) => content.id === id,
    );
    if (idx > -1 && this.#rowDeleteContents[idx].overlay) {
      this.#rowDeleteContents[idx].affixer.destroy();
      this.#overlayService.close(this.#rowDeleteContents[idx].overlay);
      this.#rowDeleteContents.splice(idx, 1);
    }
  }

  #updateRowDeleteStates(): void {
    const deleteTemplateRef =
      this.#rowDeleteComponent?.inlineDeleteTemplateRef();
    const agGrid = this.agGrid();
    const value = this.#rowDeleteIdsInternal();

    const contentIds = this.#rowDeleteContents.map((content) => content.id);
    for (const id of contentIds) {
      if (!value.includes(id)) {
        this.#destroyRowDelete(id);
      }
    }

    if (deleteTemplateRef && agGrid) {
      for (const id of value) {
        this.#updateOneRowDeleteState(id, agGrid, deleteTemplateRef);
      }
    }
  }

  #updateOneRowDeleteState(
    id: string,
    agGrid: AgGridAngular,
    deleteTemplateRef: TemplateRef<unknown>,
  ): void {
    const rowNode = agGrid.api.getRowNode(id);
    const idx = this.#rowDeleteContents.findIndex(
      (content) => content.id === id,
    );
    if (idx > -1) {
      if (rowNode?.displayed) {
        // We must reaffix things when the data changes because the rows rerender and the previous element that the delete was affixed
        // to is destroyed.
        this.#affixToRow(this.#rowDeleteContents[idx].affixer, id);
      } else {
        this.#destroyRowDelete(id);
      }
    } else if (rowNode) {
      const overlay = this.#overlayService.create({
        enableScroll: true,
        environmentInjector: this.#environmentInjector,
        showBackdrop: false,
        closeOnNavigation: true,
        enableClose: false,
        enablePointerEvents: true,
      });

      overlay.attachTemplate(deleteTemplateRef, {
        $implicit: rowNode,
        tableWidth: () =>
          this.#elementRef.nativeElement.querySelector('.sky-ag-grid')
            .offsetWidth,
        getRowDeleteItem: (row: IRowNode) => this.getRowDeleteItem(row),
        cancelRowDelete: (row: IRowNode) => this.cancelRowDelete(row),
        confirmRowDelete: (row: IRowNode) => this.confirmRowDelete(row),
      });

      /**
       * We are manually setting the z-index here because overlays will always be on top of
       * the omnibar. The default manual setting is 2 less than the omnibar's z-index of 1000 and one less than
       * the header row's viewkeeper which is 999. We discussed changing the overlay service to allow for this
       * but decided against that change at this time due to its niche nature.
       */
      this.#zIndex
        .pipe(takeUntil(this.#ngUnsubscribe), takeUntil(overlay.closed))
        .subscribe((zIndex) => {
          overlay.componentRef.instance.zIndex = zIndex.toString(10);
        });
      this.#clipPath
        .pipe(takeUntil(this.#ngUnsubscribe), takeUntil(overlay.closed))
        .subscribe((clipPath) => {
          overlay.componentRef.instance.updateClipPath(clipPath);
        });
      this.#rowDeleteContentsQueue.push({ id, overlay });
      this.#rowDeleteContentsQueued.next();
    }
  }
}
