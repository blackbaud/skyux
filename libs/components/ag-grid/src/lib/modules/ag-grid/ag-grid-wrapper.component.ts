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
import { SkyThemeService, SkyThemeSettings } from '@skyux/theme';

import { AgGridAngular } from 'ag-grid-angular';
import { CellEditingStartedEvent, DetailGridInfo } from 'ag-grid-community';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
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
    `ag-theme-sky-default-readonly`,
  ]);
  #currentTheme: SkyThemeSettings | undefined = undefined;
  #adapterService = inject(SkyAgGridAdapterService);
  #changeDetector = inject(ChangeDetectorRef);
  #parentChangeDetector = inject(ChangeDetectorRef, {
    optional: true,
    skipSelf: true,
  });
  #elementRef = inject(ElementRef);
  #document = inject(DOCUMENT);
  #mutationObserverService = inject(SkyMutationObserverService);
  #hasEditableClass = false;

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
        this.#updateGridTheme(settings.currentSettings);
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

  public ngAfterViewInit(): void {
    const agGridElement: HTMLElement | undefined =
      this.#elementRef.nativeElement.querySelector('ag-grid-angular');
    const callback = (): void => {
      this.#hasEditableClass = !!agGridElement?.classList.contains(
        'sky-ag-grid-editable'
      );
      this.#updateGridTheme(this.#currentTheme);
    };
    if (agGridElement) {
      const agGridClassObserver =
        this.#mutationObserverService.create(callback);
      agGridClassObserver.observe(agGridElement, {
        attributes: true,
      });
      this.#ngUnsubscribe.pipe(take(1)).subscribe(() => {
        agGridClassObserver.disconnect();
      });
    }
    setTimeout(callback);
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
    const gridId = this.gridId;
    const relatedTarget = event.relatedTarget as HTMLElement;
    const previousFocusedId = relatedTarget && relatedTarget.id;
    const previousWasCell =
      relatedTarget &&
      !!this.#adapterService.getElementOrParentWithClass(
        relatedTarget,
        'ag-cell'
      );

    if (previousFocusedId !== gridId && !previousWasCell) {
      const columns = this.agGrid?.columnApi.getAllDisplayedColumns();
      const firstColumn = columns?.[0];
      const rowIndex = this.agGrid?.api.getFirstDisplayedRow();

      if (firstColumn && rowIndex !== undefined && rowIndex >= 0) {
        this.agGrid?.api.setFocusedCell(rowIndex, firstColumn);
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

  #updateGridTheme(themeSettings?: SkyThemeSettings): void {
    let agTheme: 'default' | 'modern-light' | 'modern-dark';
    if (themeSettings?.theme.name === 'modern') {
      agTheme = `modern-${themeSettings.mode.name}` as
        | 'modern-light'
        | 'modern-dark';
    } else {
      agTheme = `default`;
    }
    this.#wrapperClasses.next([
      ...this.#wrapperClasses
        .getValue()
        .filter((c) => !c.startsWith('ag-theme-')),
      `ag-theme-sky-${agTheme}-${
        this.#hasEditableClass ? 'editable' : 'readonly'
      }`,
    ]);
  }
}
