import { DOCUMENT } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  HostBinding,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { SkyMutationObserverService } from '@skyux/core';
import {
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { AgGridAngular } from 'ag-grid-angular';
import { CellEditingStartedEvent, DetailGridInfo } from 'ag-grid-community';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  Subject,
  combineLatest,
  distinctUntilChanged,
  of,
} from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { SkyAgGridAdapterService } from './ag-grid-adapter.service';
import { SkyAgGridService } from './ag-grid.service';

let idIndex = 0;

@Component({
  selector: 'sky-ag-grid-wrapper',
  templateUrl: './ag-grid-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyAgGridWrapperComponent
  implements AfterContentInit, AfterViewInit, OnDestroy, OnInit
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

  #agGridService = inject(SkyAgGridService);
  #ngUnsubscribe = new Subject<void>();
  #themeSvc = inject(SkyThemeService, {
    optional: true,
  });
  #wrapperClasses = new BehaviorSubject<string[]>([
    `ag-theme-sky-data-grid-default`,
  ]);
  #adapterService = inject(SkyAgGridAdapterService);
  #changeDetector = inject(ChangeDetectorRef);
  #parentChangeDetector = inject(ChangeDetectorRef, {
    optional: true,
    skipSelf: true,
  });
  #elementRef = inject(ElementRef<HTMLElement>);
  #document = inject(DOCUMENT);
  #mutationObserverService = inject(SkyMutationObserverService);
  #hasEditableClass = new ReplaySubject<boolean>(1);

  constructor() {
    idIndex++;
    this.afterAnchorId = 'sky-ag-grid-nav-anchor-after-' + idIndex;
    this.beforeAnchorId = 'sky-ag-grid-nav-anchor-before-' + idIndex;
    this.gridId = 'sky-ag-grid-' + idIndex;
    this.wrapperClasses$ = this.#wrapperClasses.asObservable();
  }

  public ngAfterContentInit(): void {
    if (this.agGrid) {
      const domLayout = this.agGrid.gridOptions?.domLayout;
      if (domLayout === 'autoHeight') {
        if (this.agGrid.gridOptions?.context?.enableTopScroll) {
          this.viewkeeperClasses.push(
            '.ag-header',
            '.ag-body-horizontal-scroll',
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
              (t) => `sky-ag-grid-cell-editing-${t}`,
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
              .filter((c) => c.startsWith('ag-theme-')),
          );
        });
    }
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public ngOnInit(): void {
    combineLatest<[boolean, SkyThemeSettingsChange | undefined]>([
      this.#hasEditableClass.pipe(distinctUntilChanged()),
      this.#themeSvc?.settingsChange ?? of(undefined),
    ])
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(([hasEditableClass, settings]) => {
        this.#updateGridTheme(hasEditableClass, settings?.currentSettings);
      });
  }

  public ngAfterViewInit(): void {
    const agGridElement: HTMLElement | undefined =
      this.#elementRef.nativeElement.querySelector('ag-grid-angular');
    const callback = (): void => {
      this.#hasEditableClass.next(
        !!agGridElement?.classList.contains('sky-ag-grid-editable'),
      );
    };
    if (agGridElement) {
      const agGridClassObserver =
        this.#mutationObserverService.create(callback);
      agGridClassObserver.observe(agGridElement, {
        attributes: true,
        attributeFilter: ['class'],
      });
      this.#ngUnsubscribe.pipe(take(1)).subscribe(() => {
        agGridClassObserver.disconnect();
      });
    }
    callback();
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
        idToFocus,
      );
    }
  }

  public onAnchorFocus(event: FocusEvent): void {
    const relatedTarget = event.relatedTarget as HTMLElement | undefined;
    const previousWasGrid =
      relatedTarget && this.#elementRef.nativeElement.contains(relatedTarget);

    if (this.agGrid && !previousWasGrid) {
      const firstColumn = this.agGrid.api.getAllDisplayedColumns()[0];

      if (firstColumn) {
        this.agGrid.api.ensureColumnVisible(firstColumn);
        this.#adapterService.focusOnColumnHeader(
          this.#elementRef.nativeElement,
          firstColumn.getColId(),
        );
      }
    }
  }

  #isCompactLayout(themeSettings?: SkyThemeSettings): boolean {
    return (
      !!this.agGrid?.context?.compactLayout ||
      themeSettings?.spacing?.name === 'compact'
    );
  }

  #moveHorizontalScroll(): void {
    const toTop = !!this.agGrid?.gridOptions?.context?.enableTopScroll;
    const root = this.#elementRef.nativeElement.querySelector('.ag-root');
    const header = root?.querySelector('.ag-header');
    const floatingBottom = root?.querySelector('.ag-floating-bottom');
    const scrollbar = root?.querySelector('.ag-body-horizontal-scroll');
    if (root && header && floatingBottom && scrollbar) {
      if (
        scrollbar.style.height !==
        scrollbar.style.getPropertyValue(
          '--sky-ag-body-horizontal-scroll-width',
        )
      ) {
        scrollbar.style.setProperty(
          '--sky-ag-body-horizontal-scroll-width',
          scrollbar.style.height,
        );
      }
      const isTop = root.children[1].matches('.ag-body-horizontal-scroll');
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

  #updateGridTheme(
    hasEditableClass: boolean,
    themeSettings?: SkyThemeSettings,
  ): void {
    let agTheme:
      | 'default'
      | 'modern-light'
      | 'modern-dark'
      | 'modern-light-compact'
      | 'modern-dark-compact';
    if (themeSettings?.theme.name === 'modern') {
      if (this.#isCompactLayout(themeSettings)) {
        agTheme = `modern-${themeSettings.mode.name}-compact` as
          | 'modern-light-compact'
          | 'modern-dark-compact';
      } else {
        agTheme = `modern-${themeSettings.mode.name}` as
          | 'modern-light'
          | 'modern-dark';
      }
    } else {
      agTheme = `default`;
    }
    const variation = hasEditableClass ? 'data-entry-grid' : 'data-grid';
    const previousValue = this.#wrapperClasses.getValue();
    const previousTheme = previousValue.find((c) => c.startsWith('ag-theme-'));
    let value = [
      ...previousValue.filter((c) => !c.startsWith('ag-theme-')),
      `ag-theme-sky-${variation}-${agTheme}`,
    ];
    const textSelectionClass = 'sky-ag-grid-text-selection';
    if (this.#getTextSelection(hasEditableClass)) {
      value.push(textSelectionClass);
    } else {
      value = value.filter((c) => c !== textSelectionClass);
    }
    this.#wrapperClasses.next([...new Set(value)]);
    if (this.agGrid?.api && !this.agGrid.api.isDestroyed()) {
      this.agGrid?.api.updateGridOptions({
        enableCellTextSelection: this.#getTextSelection(hasEditableClass),
        headerHeight: this.#agGridService.getHeaderHeight(themeSettings, {
          compactLayout: this.#isCompactLayout(themeSettings),
        }),
      });
      if (this.agGrid?.api?.getGridOption('domLayout') !== 'autoHeight') {
        this.agGrid?.api?.resetRowHeights();
      }
      this.agGrid?.api?.refreshHeader();
      if (
        previousTheme?.endsWith('-compact') !==
        this.#isCompactLayout(themeSettings)
      ) {
        this.agGrid?.api?.redrawRows();
      }
    }
  }

  #getTextSelection(hasEditableClass: boolean): boolean {
    if (this.agGrid?.gridOptions?.context?.enableCellTextSelection) {
      return !hasEditableClass;
    } else {
      return false;
    }
  }
}
