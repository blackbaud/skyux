import { DOCUMENT } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  Optional,
} from '@angular/core';
import { SkyThemeService } from '@skyux/theme';

import { AgGridAngular } from 'ag-grid-angular';
import { DetailGridInfo } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyAgGridAdapterService } from './ag-grid-adapter.service';

let idIndex = 0;

@Component({
  selector: 'sky-ag-grid-wrapper',
  templateUrl: './ag-grid-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyAgGridWrapperComponent
  implements AfterContentInit, OnDestroy, OnInit
{
  @ContentChild(AgGridAngular, {
    static: true,
  })
  public agGrid: AgGridAngular;

  public afterAnchorId: string;
  public beforeAnchorId: string;
  public gridId: string;

  public get viewkeeperClasses(): string[] {
    return this._viewkeeperClasses;
  }

  public set viewkeeperClasses(value: string[]) {
    this._viewkeeperClasses = value;
    this.changeDetector.markForCheck();
  }

  public agThemeClass = 'ag-theme-sky-default';

  private _viewkeeperClasses: string[] = [];

  #ngUnsubscribe = new Subject<void>();
  #themeSvc: SkyThemeService | undefined;

  constructor(
    private adapterService: SkyAgGridAdapterService,
    private changeDetector: ChangeDetectorRef,
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private document: Document,
    @Optional() themeSvc?: SkyThemeService
  ) {
    idIndex++;
    this.afterAnchorId = 'sky-ag-grid-nav-anchor-after-' + idIndex;
    this.beforeAnchorId = 'sky-ag-grid-nav-anchor-before-' + idIndex;
    this.gridId = 'sky-ag-grid-' + idIndex;
    this.#themeSvc = themeSvc;
  }

  public ngAfterContentInit(): void {
    if (
      this.agGrid.gridOptions &&
      this.agGrid.gridOptions.domLayout === 'autoHeight'
    ) {
      if (this.agGrid.gridOptions.context?.enableTopScroll) {
        this.viewkeeperClasses.push('.ag-header', '.ag-body-horizontal-scroll');
      } else {
        this.viewkeeperClasses.push('.ag-header');
      }
    }
    this.agGrid.gridReady.pipe(takeUntil(this.#ngUnsubscribe)).subscribe(() => {
      this.#moveHorizontalScroll();
    });
    this.agGrid.firstDataRendered
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        this.#moveHorizontalScroll();
      });
    this.agGrid.rowDataUpdated
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        this.#moveHorizontalScroll();
      });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public ngOnInit(): void {
    this.#themeSvc?.settingsChange
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((settings) => {
        if (settings.currentSettings.theme.name === 'modern') {
          this.agThemeClass = `ag-theme-sky-modern-${settings.currentSettings.mode.name}`;
        } else {
          this.agThemeClass = `ag-theme-sky-default`;
        }
        this.changeDetector.markForCheck();
      });
  }

  /**
   * Prevent closing a modal when focused in AG Grid.
   */
  public onKeyUpEscape($event: Event): void {
    $event.stopPropagation();
    this.agGrid.api.stopEditing(true);
  }

  public onGridKeydown(event: KeyboardEvent): void {
    if (this.agGrid && !this.isInEditMode && event.key === 'Tab') {
      const idToFocus = event.shiftKey
        ? this.beforeAnchorId
        : this.afterAnchorId;
      this.adapterService.setFocusedElementById(
        this.elementRef.nativeElement,
        idToFocus
      );
    }
  }

  public onAnchorFocus(event: FocusEvent): void {
    const gridId = this.gridId;
    const relatedTarget = event.relatedTarget as HTMLElement;
    const previousFocusedId = relatedTarget && relatedTarget.id;
    const previousWasCell =
      relatedTarget &&
      !!this.adapterService.getElementOrParentWithClass(
        relatedTarget,
        'ag-cell'
      );

    if (previousFocusedId !== gridId && !previousWasCell) {
      const columns = this.agGrid.columnApi.getAllDisplayedColumns();
      const firstColumn = columns && columns[0];
      const rowIndex = this.agGrid.api.getFirstDisplayedRow();

      if (firstColumn && rowIndex >= 0) {
        this.agGrid.api.setFocusedCell(rowIndex, firstColumn);
      }
    }
  }

  private get isInEditMode(): boolean {
    /* Sanity check */
    /* istanbul ignore else */
    if (this.agGrid && this.agGrid.api) {
      const primaryGridEditing = this.agGrid.api.getEditingCells().length > 0;
      if (primaryGridEditing) {
        return true;
      } else {
        let innerEditing = false;
        this.agGrid.api.forEachDetailGridInfo((detailGrid: DetailGridInfo) => {
          if (detailGrid.api.getEditingCells().length > 0) {
            innerEditing = true;
          }
        });

        return innerEditing;
      }
    } else {
      return false;
    }
  }

  #moveHorizontalScroll(): void {
    if (this.agGrid && this.agGrid.api) {
      const toTop = !!this.agGrid.gridOptions.context?.enableTopScroll;
      const root: HTMLElement =
        this.elementRef.nativeElement.querySelector('.ag-root');
      const header: HTMLDivElement | null = root.querySelector('.ag-header');
      const floatingBottom: HTMLDivElement | null = root.querySelector(
        '.ag-floating-bottom'
      );
      const scrollbar: HTMLDivElement | null = root.querySelector(
        '.ag-body-horizontal-scroll'
      );
      if (header && floatingBottom && scrollbar) {
        if (
          scrollbar.style.height !==
          scrollbar.style.getPropertyValue(
            '--sky-ag-body-horizontal-scroll-width'
          )
        ) {
          scrollbar.style.setProperty(
            '--sky-ag-body-horizontal-scroll-width',
            scrollbar.style.height
          );
        }
        const isTop = !!root.children[1].matches('.ag-body-horizontal-scroll');
        if (toTop && !isTop) {
          const fragment = this.document.createDocumentFragment();
          fragment.appendChild(scrollbar);
          header.after(fragment);
        } else if (!toTop && isTop) {
          const fragment = this.document.createDocumentFragment();
          fragment.appendChild(scrollbar);
          floatingBottom.after(fragment);
        }
      }
    }
  }
}
