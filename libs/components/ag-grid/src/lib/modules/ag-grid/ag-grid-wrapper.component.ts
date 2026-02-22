import { NgClass } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SkyIdModule, SkyMutationObserverService } from '@skyux/core';
import { SkyViewkeeperModule } from '@skyux/core';
import { SkyThemeService } from '@skyux/theme';

import { AgGridAngular } from 'ag-grid-angular';
import {
  CellEditingStartedEvent,
  CellFocusedEvent,
  HeaderFocusedEvent,
} from 'ag-grid-community';
import { EMPTY, merge } from 'rxjs';

import {
  getSkyAgGridTheme,
  getSkyAgGridThemeClassName,
} from '../../styles/ag-grid-theme';

import { SkyAgGridAdapterService } from './ag-grid-adapter.service';
import { SkyCellType } from './types/cell-type';

let idIndex = 0;

@Component({
  selector: 'sky-ag-grid-wrapper',
  templateUrl: './ag-grid-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, SkyIdModule, SkyViewkeeperModule],
  host: {
    '[class.sky-ag-grid-layout-normal]': 'isNormalLayout',
  },
})
export class SkyAgGridWrapperComponent
  implements AfterContentInit, AfterViewInit
{
  @ContentChild(AgGridAngular, {
    static: true,
  })
  public agGrid: AgGridAngular | undefined;

  public isNormalLayout = false;

  /**
   * Enable a compact layout for the grid when using modern theme. Compact layout uses
   * a smaller font size and row height to display more data in a smaller space.
   */
  public readonly compact = input(false, { transform: booleanAttribute });

  /**
   * The minimum height of the grid in pixels. The default value is `50`.
   */
  public readonly minHeight = input<number, unknown>(50, {
    transform: numberAttribute,
  });

  public afterAnchorId: string;
  public beforeAnchorId: string;
  public gridId: string;

  public readonly viewkeeperClasses = signal<string[]>([]);

  get #isInEditMode(): boolean {
    if (this.agGrid && this.agGrid.api) {
      const primaryGridEditing = this.agGrid.api.getEditingCells().length > 0;
      if (primaryGridEditing) {
        return true;
      } else if (this.agGrid.api.getGridOption('masterDetail')) {
        let innerEditing = false;
        this.agGrid.api.forEachDetailGridInfo((detailGrid) => {
          if (detailGrid?.api && detailGrid.api.getEditingCells().length > 0) {
            innerEditing = true;
          }
        });

        return innerEditing;
      }
    }
    return false;
  }

  protected readonly skyAgGridDiv =
    viewChild<ElementRef<HTMLElement>>('skyAgGridDiv');

  readonly #destroyRef = inject(DestroyRef);
  readonly #themeSvc = inject(SkyThemeService, {
    optional: true,
  });
  readonly #themeSettings = toSignal(this.#themeSvc?.settingsChange ?? EMPTY);
  readonly #adapterService = inject(SkyAgGridAdapterService);
  readonly #elementRef = inject(ElementRef<HTMLElement>);
  readonly #document = inject(DOCUMENT);
  readonly #mutationObserverService = inject(SkyMutationObserverService);
  readonly #hasEditableClass = signal(false);
  readonly #cellEditingClasses = signal<string[]>([]);

  public readonly wrapperClasses = computed(() => {
    const hasEditableClass = this.#hasEditableClass();
    const isCompact = this.compact();
    const themeSettings = this.#themeSettings()?.currentSettings;
    const cellEditingClasses = this.#cellEditingClasses();

    const skyAgGridThemeClassName = getSkyAgGridThemeClassName(
      hasEditableClass,
      themeSettings,
      isCompact,
    );

    const classes = [skyAgGridThemeClassName, ...cellEditingClasses];

    if (this.#getTextSelection(hasEditableClass)) {
      classes.push('sky-ag-grid-text-selection');
    }

    return [...new Set(classes)];
  });

  #agGridClassObserver: MutationObserver | undefined;

  constructor() {
    idIndex++;
    this.afterAnchorId = 'sky-ag-grid-nav-anchor-after-' + idIndex;
    this.beforeAnchorId = 'sky-ag-grid-nav-anchor-before-' + idIndex;
    this.gridId = 'sky-ag-grid-' + idIndex;

    effect(() => {
      const minHeight = this.minHeight();
      const skyAgGridDiv = this.skyAgGridDiv()?.nativeElement;
      skyAgGridDiv?.style.setProperty(
        '--sky-ag-grid-min-height',
        `${minHeight}px`,
      );
    });

    effect(() => {
      const hasEditableClass = this.#hasEditableClass();
      const skyAgGridTheme = getSkyAgGridTheme(
        hasEditableClass ? 'data-entry-grid' : 'data-grid',
      );
      this.agGrid?.api?.setGridOption('theme', skyAgGridTheme);
    });

    this.#destroyRef.onDestroy(() => {
      this.#agGridClassObserver?.disconnect();
    });
  }

  public ngAfterContentInit(): void {
    if (this.agGrid) {
      const domLayout = this.agGrid.gridOptions?.domLayout;
      if (domLayout === 'autoHeight') {
        if (this.agGrid.gridOptions?.context?.enableTopScroll) {
          this.viewkeeperClasses.update((prev) => [
            ...prev,
            '.ag-header',
            '.ag-body-horizontal-scroll',
          ]);
        } else {
          this.viewkeeperClasses.update((prev) => [...prev, '.ag-header']);
        }
      } else if (domLayout === 'normal') {
        this.isNormalLayout = true;
      }

      merge(
        this.agGrid.gridReady,
        this.agGrid.firstDataRendered,
        this.agGrid.rowDataUpdated,
      )
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe(() => this.#moveHorizontalScroll());

      this.agGrid.cellEditingStarted
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe((params: CellEditingStartedEvent) => {
          if (params.colDef.type) {
            const types = Array.isArray(params.colDef.type)
              ? params.colDef.type
              : [params.colDef.type];
            const addClasses = types.map(
              (t) => `sky-ag-grid-cell-editing-${t}`,
            );
            this.#cellEditingClasses.update((prev) => [...prev, ...addClasses]);
            if (
              types.includes(SkyCellType.Template) &&
              params.rowIndex !== null
            ) {
              this.agGrid?.api.setFocusedCell(params.rowIndex, params.column);
            }
          }
        });
      this.agGrid.cellEditingStopped
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe(() => {
          this.#cellEditingClasses.set([]);
        });
      this.agGrid.cellFocused
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe((event: CellFocusedEvent) => {
          const context = event.context || {};

          context['lastFocusedCell'] = {
            rowIndex: event.rowIndex,
            column:
              typeof event.column === 'object'
                ? event.column?.getColId()
                : `${event.column}`,
          };

          event.api?.setGridOption('context', context);
        });

      this.agGrid.headerFocused
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe((event: HeaderFocusedEvent) => {
          const context = event.context || {};

          context['lastFocusedCell'] = {
            rowIndex: null,
            column: event.column?.getUniqueId
              ? event.column.getUniqueId()
              : `${event.column}`,
          };

          event.api?.setGridOption('context', context);
        });
    }
  }

  public ngAfterViewInit(): void {
    const agGridElement: HTMLElement | undefined =
      this.#elementRef.nativeElement.querySelector('ag-grid-angular');
    const callback = (): void => {
      this.#hasEditableClass.set(
        !!agGridElement?.classList.contains('sky-ag-grid-editable'),
      );
    };
    if (agGridElement) {
      this.#agGridClassObserver =
        this.#mutationObserverService.create(callback);
      this.#agGridClassObserver.observe(agGridElement, {
        attributes: true,
        attributeFilter: ['class'],
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
      this.#elementRef.nativeElement
        .querySelector('.ag-tab-guard.ag-tab-guard-top')
        ?.focus();
    }
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

  #getTextSelection(hasEditableClass: boolean): boolean {
    if (this.agGrid?.gridOptions?.context?.enableCellTextSelection) {
      return !hasEditableClass;
    } else {
      return false;
    }
  }
}
