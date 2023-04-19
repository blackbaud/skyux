import { DOCUMENT } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  HostBinding,
  Inject,
  OnDestroy,
  OnInit,
  Optional,
  SkipSelf,
} from '@angular/core';
import { SkyThemeService, SkyThemeSettings } from '@skyux/theme';

import { AgGridAngular } from 'ag-grid-angular';
import { CellEditingStartedEvent, DetailGridInfo } from 'ag-grid-community';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyAgGridAdapterService } from './ag-grid-adapter.service';
import { SkyAgGridService } from './ag-grid.service';

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
  public agGrid: AgGridAngular | undefined;

  @HostBinding('class.sky-ag-grid-layout-normal')
  public isNormalLayout = false;

  public afterAnchorId: string;
  public beforeAnchorId: string;
  public gridId: string;
  public wrapperClasses$: Observable<string[]>;

  public get viewkeeperClasses(): string[] {
    return this.#_viewkeeperClasses;
  }

  public set viewkeeperClasses(value: string[]) {
    this.#_viewkeeperClasses = value;
    this.#changeDetector.markForCheck();
  }

  get #isInEditMode(): boolean {
    /* istanbul ignore else */
    if (this.agGrid && this.agGrid.api) {
      const primaryGridEditing = this.agGrid.api.getEditingCells().length > 0;
      if (primaryGridEditing) {
        return true;
      } else {
        let innerEditing = false;
        this.agGrid.api.forEachDetailGridInfo((detailGrid: DetailGridInfo) => {
          if (detailGrid?.api && detailGrid.api.getEditingCells().length > 0) {
            innerEditing = true;
          }
        });

        return innerEditing;
      }
    } else {
      return false;
    }
  }

  #_viewkeeperClasses: string[] = [];

  #agGridService: SkyAgGridService;
  #ngUnsubscribe = new Subject<void>();
  #themeSvc: SkyThemeService | undefined;
  #wrapperClasses = new BehaviorSubject<string[]>([`ag-theme-sky-default`]);
  #currentTheme: SkyThemeSettings | undefined = undefined;
  #adapterService: SkyAgGridAdapterService;
  #changeDetector: ChangeDetectorRef;
  #parentChangeDetector: ChangeDetectorRef | undefined;
  #elementRef: ElementRef;
  #document: Document;

  constructor(
    adapterService: SkyAgGridAdapterService,
    changeDetector: ChangeDetectorRef,
    elementRef: ElementRef,
    @Inject(DOCUMENT) document: Document,
    agGridService: SkyAgGridService,
    @Optional() themeSvc?: SkyThemeService,
    @Optional()
    @SkipSelf()
    @Inject(ChangeDetectorRef)
    parentChangeDetector?: ChangeDetectorRef
  ) {
    this.#adapterService = adapterService;
    this.#changeDetector = changeDetector;
    this.#parentChangeDetector = parentChangeDetector;
    this.#elementRef = elementRef;
    this.#document = document;

    idIndex++;
    this.afterAnchorId = 'sky-ag-grid-nav-anchor-after-' + idIndex;
    this.beforeAnchorId = 'sky-ag-grid-nav-anchor-before-' + idIndex;
    this.gridId = 'sky-ag-grid-' + idIndex;
    this.#agGridService = agGridService;
    this.#themeSvc = themeSvc;
    this.wrapperClasses$ = this.#wrapperClasses.asObservable();
  }

  public ngAfterContentInit(): void {
    if (this.agGrid) {
      const domLayout = this.agGrid.gridOptions?.domLayout;
      if (domLayout === 'autoHeight') {
        if (this.agGrid.gridOptions.context?.enableTopScroll) {
          this.viewkeeperClasses.push(
            '.ag-header',
            '.ag-body-horizontal-scroll'
          );
        } else {
          this.viewkeeperClasses.push('.ag-header');
        }
      } else if (domLayout === 'normal') {
        this.isNormalLayout = true;
        this.#parentChangeDetector?.detectChanges();
      }
      this.agGrid.gridReady
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe(() => {
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
      this.agGrid.cellEditingStarted
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((params: CellEditingStartedEvent) => {
          if (params.colDef.type) {
            const types = Array.isArray(params.colDef.type)
              ? params.colDef.type
              : [params.colDef.type];
            const addClasses = types.map(
              (t) => `sky-ag-grid-cell-editing-${t}`
            );
            this.#wrapperClasses.next([
              ...this.#wrapperClasses.getValue(),
              ...addClasses,
            ]);
          }
        });
      this.agGrid.cellEditingStopped
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe(() => {
          this.#wrapperClasses.next(
            this.#wrapperClasses
              .getValue()
              .filter((c) => c.startsWith('ag-theme-'))
          );
        });
    }
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public ngOnInit(): void {
    this.#themeSvc?.settingsChange
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((settings) => {
        let agThemeClass: string;
        if (settings.currentSettings.theme.name === 'modern') {
          agThemeClass = `ag-theme-sky-modern-${settings.currentSettings.mode.name}`;
        } else {
          agThemeClass = `ag-theme-sky-default`;
        }
        this.#wrapperClasses.next([
          ...this.#wrapperClasses
            .getValue()
            .filter((c) => !c.startsWith('ag-theme-')),
          agThemeClass,
        ]);
        if (!this.#currentTheme) {
          // Initial theme settings.
          this.#currentTheme = settings.currentSettings;
        } else if (this.agGrid?.api) {
          // On subsequent theme changes, we need to call the api to re-render the grid.
          this.#currentTheme = settings.currentSettings;
          this.agGrid.api.setHeaderHeight(
            this.#agGridService.getHeaderHeight()
          );
          this.agGrid.api.resetRowHeights();
          this.agGrid.api.refreshCells();
        }
      });
  }

  /**
   * Prevent closing a modal when focused in AG Grid.
   */
  public onKeyUpEscape($event: Event): void {
    $event.stopPropagation();
    this.agGrid?.api.stopEditing(true);
  }

  public onGridKeydown(event: KeyboardEvent): void {
    if (this.agGrid && !this.#isInEditMode && event.key === 'Tab') {
      const idToFocus = event.shiftKey
        ? this.beforeAnchorId
        : this.afterAnchorId;
      this.#adapterService.setFocusedElementById(
        this.#elementRef.nativeElement,
        idToFocus
      );
    }
  }

  public onAnchorFocus(event: FocusEvent): void {
    const relatedTarget = event.relatedTarget as HTMLElement | undefined;
    const previousWasGrid =
      relatedTarget && !!this.#elementRef.nativeElement.contains(relatedTarget);

    if (this.agGrid && !previousWasGrid) {
      const firstColumn = this.agGrid.columnApi.getAllDisplayedColumns()[0];

      if (firstColumn) {
        this.agGrid.api.ensureColumnVisible(firstColumn);
        this.#adapterService.focusOnColumnHeader(
          this.#elementRef.nativeElement,
          firstColumn.getColId()
        );
      }
    }
  }

  #moveHorizontalScroll(): void {
    if (this.agGrid && this.agGrid.api) {
      const toTop = !!this.agGrid.gridOptions.context?.enableTopScroll;
      const root: HTMLElement =
        this.#elementRef.nativeElement.querySelector('.ag-root');
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
          const fragment = this.#document.createDocumentFragment();
          fragment.appendChild(scrollbar);
          header.after(fragment);
        } else if (!toTop && isTop) {
          const fragment = this.#document.createDocumentFragment();
          fragment.appendChild(scrollbar);
          floatingBottom.after(fragment);
        }
      }
    }
  }
}
