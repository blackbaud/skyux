import { DOCUMENT } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ContentChild,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  Optional,
  Type,
} from '@angular/core';
import {
  SkyDynamicComponentLocation,
  SkyDynamicComponentService,
} from '@skyux/core';
import { SkyThemeService } from '@skyux/theme';

import { AgGridAngular } from 'ag-grid-angular';
import { Column, DetailGridInfo, Events } from 'ag-grid-community';
import { Subject, fromEvent } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { SkyAgGridAdapterService } from './ag-grid-adapter.service';
import { SkyAgGridHeader } from './header/header-token';
import { SkyAgGridHeaderInfo } from './types/header-info';

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

  public enableTopScroll = false;
  public isDefaultTheme = true;
  public isModernLightTheme = false;
  public isModernDarkTheme = false;

  private _viewkeeperClasses: string[] = [];

  #ngUnsubscribe = new Subject<void>();
  #themeSvc: SkyThemeService;
  #columnInlineHelpComponents = new Map<string, ComponentRef<unknown>>();
  #dynamicComponentService: SkyDynamicComponentService;

  constructor(
    private adapterService: SkyAgGridAdapterService,
    private changeDetector: ChangeDetectorRef,
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private document: Document,
    dynamicComponentService: SkyDynamicComponentService,
    @Optional() themeSvc?: SkyThemeService
  ) {
    idIndex++;
    this.afterAnchorId = 'sky-ag-grid-nav-anchor-after-' + idIndex;
    this.beforeAnchorId = 'sky-ag-grid-nav-anchor-before-' + idIndex;
    this.gridId = 'sky-ag-grid-' + idIndex;
    this.#dynamicComponentService = dynamicComponentService;
    this.#themeSvc = themeSvc;
  }

  public ngAfterContentInit(): void {
    if (
      this.agGrid.gridOptions &&
      this.agGrid.gridOptions.domLayout === 'autoHeight'
    ) {
      if (this.agGrid.gridOptions.context?.enableTopScroll) {
        this.enableTopScroll = true;
        this.viewkeeperClasses.push('.ag-header', '.ag-body-horizontal-scroll');
      } else {
        this.enableTopScroll = false;
        this.viewkeeperClasses.push('.ag-header');
      }
    }
    this.agGrid.gridReady.pipe(takeUntil(this.#ngUnsubscribe)).subscribe(() => {
      this.#moveHorizontalScroll();
      this.agGrid.columnApi.getAllDisplayedColumns().forEach((column) => {
        this.#updateInlineHelp(column);
      });

      [
        Events.EVENT_COLUMN_MOVED,
        Events.EVENT_COLUMN_RESIZED,
        Events.EVENT_COLUMN_VISIBLE,
        Events.EVENT_DISPLAYED_COLUMNS_CHANGED,
        Events.EVENT_GRID_COLUMNS_CHANGED,
        Events.EVENT_NEW_COLUMNS_LOADED,
        Events.EVENT_VIEWPORT_CHANGED,
        Events.EVENT_VIRTUAL_COLUMNS_CHANGED,
      ].forEach((event) => {
        fromEvent(this.agGrid.api, event)
          .pipe(takeUntil(this.#ngUnsubscribe), debounceTime(10))
          .subscribe(() => {
            this.agGrid.columnApi.getAllDisplayedColumns().forEach((column) => {
              this.#updateInlineHelp(column);
            });
          });
      });
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
        const themeName = settings.currentSettings.theme.name;
        const themeMode = settings.currentSettings.mode.name;
        this.isDefaultTheme = themeName === 'default';
        this.isModernLightTheme =
          themeName === 'modern' && themeMode === 'light';
        this.isModernDarkTheme = themeName === 'modern' && themeMode === 'dark';
        this.changeDetector.markForCheck();
      });
  }

  /**
   * Prevent closing a modal when focused in AG Grid.
   */
  public onKeyUpEscape($event: Event) {
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

  #moveHorizontalScroll() {
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

  #updateInlineHelp(column: Column, context?: any): void {
    const colId = column.getId();
    const columnHeader = this.elementRef.nativeElement.querySelector(
      `div.ag-header-cell[col-id="${colId}"] div.ag-cell-label-container`
    ) as HTMLElement;
    const inlineHelpComponent: Type<unknown> | undefined =
      column.getColDef().headerComponentParams?.inlineHelpComponent;
    const currentComponent: ComponentRef<unknown> | undefined =
      this.#columnInlineHelpComponents.get(colId);

    const getHostElement = (): HTMLElement => {
      if (!columnHeader.querySelector(`span.sky-control-help-container`)) {
        const inlineHelpContainer = this.document.createElement('span');
        inlineHelpContainer.classList.add('sky-control-help-container');
        columnHeader.appendChild(inlineHelpContainer);
      }
      return columnHeader.querySelector(`span.sky-control-help-container`);
    };

    if (inlineHelpComponent) {
      const referenceEl = getHostElement();
      if (currentComponent) {
        if (
          currentComponent.componentType !== inlineHelpComponent ||
          referenceEl.firstElementChild !==
            currentComponent.location.nativeElement
        ) {
          currentComponent.destroy();
        } else {
          return;
        }
      }
      const componentRef = this.#dynamicComponentService.createComponent(
        inlineHelpComponent,
        {
          location: SkyDynamicComponentLocation.ElementBottom,
          referenceEl,
          providers: [
            {
              provide: SkyAgGridHeader,
              useValue: {
                column,
                context,
                displayName: column.getColDef().headerName,
              } as SkyAgGridHeaderInfo,
            },
          ],
        }
      );
      this.#columnInlineHelpComponents.set(colId, componentRef);
    } else if (currentComponent) {
      currentComponent.destroy();
    }
  }
}
