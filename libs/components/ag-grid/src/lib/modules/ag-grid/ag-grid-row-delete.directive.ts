import {
  AfterContentInit,
  ChangeDetectorRef,
  ContentChild,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewContainerRef,
} from '@angular/core';
import {
  SkyAffixAutoFitContext,
  SkyAffixService,
  SkyAffixer,
  SkyOverlayService,
} from '@skyux/core';

import { AgGridAngular } from 'ag-grid-angular';
import { RowNode } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyAgGridRowDeleteComponent } from './ag-grid-row-delete.component';
import { SkyAgGridRowDeleteCancelArgs } from './types/ag-grid-row-delete-cancel-args';
import { SkyAgGridRowDeleteConfig } from './types/ag-grid-row-delete-config';
import { SkyAgGridRowDeleteConfirmArgs } from './types/ag-grid-row-delete-confirm-args';
import { SkyAgGridRowDeleteContents } from './types/ag-grid-row-delete-contents';

@Directive({
  selector: '[skyAgGridRowDelete]',
})
export class SkyAgGridRowDeleteDirective
  implements AfterContentInit, OnDestroy
{
  /**
   * The ids of the data in the rows on which inline delete's should be shown.
   */
  @Input()
  public set rowDeleteIds(value: string[] | undefined) {
    this.#rowDeleteIdsInternal = value;

    if (!value) {
      for (const config of this.#rowDeleteConfigs) {
        this.#destroyRowDelete(config.id);
      }

      this.#changeDetector.markForCheck();

      return;
    }

    for (const id of value) {
      const existingConfig = this.#rowDeleteConfigs.find(
        (config) => config.id === id
      );
      if (existingConfig) {
        existingConfig.pending = false;
      } else if (this.#rowDeleteComponent && this.agGrid) {
        this.#rowDeleteConfigs.push({
          id: id,
          pending: false,
        });

        const overlay = this.#overlayService.create({
          enableScroll: true,
          showBackdrop: false,
          closeOnNavigation: true,
          enableClose: false,
          enablePointerEvents: true,
        });

        if (this.#rowDeleteComponent.inlineDeleteTemplateRef) {
          overlay.attachTemplate(
            this.#rowDeleteComponent.inlineDeleteTemplateRef,
            {
              $implicit: this.agGrid.api.getRowNode(id),
              tableWidth: () =>
                this.#elementRef.nativeElement.querySelector('.sky-ag-grid')
                  .offsetWidth,
              getRowDeleteItem: (row: RowNode) => this.getRowDeleteItem(row),
              cancelRowDelete: (row: RowNode) => this.cancelRowDelete(row),
              confirmRowDelete: (row: RowNode) => this.confirmRowDelete(row),
            }
          );
        }

        /**
         * We are manually setting the z-index here because overlays will always be on top of
         * the omnibar. This manual setting is 2 less than the omnibar's z-index of 1000 and one less than
         * the header row's viewkeeper which is 999. We discussed changing the overlay service to allow for this
         * but decided against that change at this time due to its niche nature.
         */
        overlay.componentRef.instance.zIndex = '998';

        setTimeout(() => {
          const inlineDeleteRef = this.#rowDeleteComponent?.inlineDeleteRefs
            ?.toArray()
            .find(
              (elRef) => elRef.nativeElement.id === 'row-delete-ref-' + id
            ) as ElementRef;
          const affixer = this.#affixService.createAffixer(inlineDeleteRef);

          this.#affixToRow(affixer, id);

          this.#rowDeleteContents[id] = {
            affixer: affixer,
            overlay: overlay,
          };
        });
      }
    }

    for (const config of this.#rowDeleteConfigs) {
      if (value.indexOf(config.id) < 0) {
        this.#destroyRowDelete(config.id);
      }
    }

    this.#changeDetector.markForCheck();
  }

  get rowDeleteIds(): string[] | undefined {
    return this.#rowDeleteIdsInternal;
  }

  /**
   * Emits a `SkyAgGridRowDeleteCancelArgs` object when a row's inline delete is cancelled.
   */
  @Output()
  public rowDeleteCancel = new EventEmitter<SkyAgGridRowDeleteCancelArgs>();

  /**
   * Emits a `SkyAgGridRowDeleteConfirmArgs` object when a row's inline delete is confirmed.
   */
  @Output()
  public rowDeleteConfirm = new EventEmitter<SkyAgGridRowDeleteConfirmArgs>();

  /**
   * Emits when the list of ids of the data in the rows where inline deletes are shown changes.
   */
  @Output()
  public rowDeleteIdsChange = new EventEmitter<string[]>();

  #rowDeleteConfigs: SkyAgGridRowDeleteConfig[] = [];

  @ContentChild(AgGridAngular)
  public agGrid: AgGridAngular | undefined;

  #ngUnsubscribe = new Subject<void>();
  #rowDeleteComponent: SkyAgGridRowDeleteComponent | undefined;
  #rowDeleteContents: { [id: string]: SkyAgGridRowDeleteContents } = {};

  #rowDeleteIdsInternal: string[] | undefined;
  #affixService: SkyAffixService;
  #changeDetector: ChangeDetectorRef;
  #elementRef: ElementRef;
  #overlayService: SkyOverlayService;
  #viewContainerRef: ViewContainerRef;

  constructor(
    affixService: SkyAffixService,
    changeDetector: ChangeDetectorRef,
    elementRef: ElementRef,
    overlayService: SkyOverlayService,
    viewContainerRef: ViewContainerRef
  ) {
    this.#affixService = affixService;
    this.#changeDetector = changeDetector;
    this.#elementRef = elementRef;
    this.#overlayService = overlayService;
    this.#viewContainerRef = viewContainerRef;
  }

  public ngAfterContentInit(): void {
    this.#rowDeleteComponent = this.#viewContainerRef.createComponent(
      SkyAgGridRowDeleteComponent
    ).instance;

    if (this.agGrid) {
      this.agGrid.rowDataUpdated
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe(() => {
          this.#updateRowDeleteStates();
        });

      this.agGrid.sortChanged
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe(() => {
          this.#updateRowDeleteStates();
        });

      this.agGrid.filterChanged
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe(() => {
          this.#updateRowDeleteStates();
        });
    }
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();

    Object.keys(this.#rowDeleteContents).forEach((id) => {
      this.#destroyRowDelete(id);
    });
  }

  public cancelRowDelete(row: RowNode): void {
    if (row.id) {
      this.#rowDeleteConfigs = this.#rowDeleteConfigs.filter(
        (config) => config.id !== row.id
      );
      this.rowDeleteCancel.emit({ id: row.id });

      this.#destroyRowDelete(row.id);
    }
  }

  public confirmRowDelete(row: RowNode): void {
    if (row.id) {
      const rowConfig = this.#rowDeleteConfigs.find(
        (config) => config.id === row.id
      );

      if (rowConfig) {
        rowConfig.pending = true;
        this.rowDeleteConfirm.emit({ id: row.id });
      }
    }
  }

  public getRowDeleteItem(row: RowNode): SkyAgGridRowDeleteConfig | undefined {
    return this.#rowDeleteConfigs.find((rowDelete) => rowDelete.id === row.id);
  }

  #affixToRow(affixer: SkyAffixer, id: string): void {
    let rowElement: HTMLElement = this.#elementRef.nativeElement.querySelector(`
      [row-id="${id}"] div[aria-colindex="1"],
      .ag-row.sky-ag-grid-row-${id} div[aria-colindex="1"]
    `);

    // This covers cases where AG Grid places the column index on an inner element (such as with the `enableCellTextSelection` option)
    // This appears to have been fixed by AG Grid in version 24 and so it is not testable after that version.
    /* istanbul ignore if */
    if (!rowElement) {
      const columns = this.#elementRef.nativeElement.querySelectorAll(
        '[row-id="' + id + '"] > div'
      );

      for (let i = 0; i < columns.length; i++) {
        if (columns[i].querySelector('[aria-colindex="1"]')) {
          rowElement = columns[i];
          break;
        }
      }
    }

    affixer.affixTo(rowElement, {
      autoFitContext: SkyAffixAutoFitContext.Viewport,
      isSticky: true,
      placement: 'above',
      verticalAlignment: 'top',
      horizontalAlignment: 'left',
      enableAutoFit: false,
    });
  }

  #destroyRowDelete(id: string): void {
    const rowDeleteContents = this.#rowDeleteContents[id];

    /* sanity check */
    /* istanbul ignore else */
    if (rowDeleteContents) {
      rowDeleteContents.affixer.destroy();
      this.#overlayService.close(rowDeleteContents.overlay);
      delete this.#rowDeleteContents[id];
      this.#rowDeleteConfigs = this.#rowDeleteConfigs.filter(
        (config) => config.id !== id
      );
      this.#rowDeleteIdsInternal = this.rowDeleteIds?.filter(
        (arrayId) => arrayId !== id
      );
      this.rowDeleteIdsChange.emit(this.#rowDeleteIdsInternal);
    }
  }

  #updateRowDeleteStates(): void {
    this.#rowDeleteConfigs.forEach((config: SkyAgGridRowDeleteConfig) => {
      if (!this.agGrid?.api.getRowNode(config.id)) {
        this.#destroyRowDelete(config.id);
      } else {
        // We must reaffix things when the data changes because the rows rerender and the previous element that the delete was affixed
        // to is destroyed.
        this.#affixToRow(this.#rowDeleteContents[config.id].affixer, config.id);
      }
    });
    this.#changeDetector.markForCheck();
  }
}
