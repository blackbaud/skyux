import { NgClass } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  booleanAttribute,
  computed,
  contentChild,
  effect,
  inject,
  input,
  linkedSignal,
  numberAttribute,
  signal,
  viewChild,
} from '@angular/core';
import {
  SkyIdModule,
  SkyMutationObserverService,
  SkyResizeObserverService,
  SkyViewkeeperModule,
} from '@skyux/core';
import { SkyThemeService } from '@skyux/theme';

import { AgGridAngular } from 'ag-grid-angular';
import {
  CellEditingStartedEvent,
  CellFocusedEvent,
  DomLayoutType,
  HeaderFocusedEvent,
} from 'ag-grid-community';
import {
  EMPTY,
  asapScheduler,
  combineLatestWith,
  delay,
  distinctUntilChanged,
  filter,
  map,
  merge,
  shareReplay,
  switchMap,
} from 'rxjs';

import {
  getSkyAgGridTheme,
  getSkyAgGridThemeClassName,
} from '../../styles/ag-grid-theme';

import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { SkyAgGridAdapterService } from './ag-grid-adapter.service';
import { SkyCellType } from './types/cell-type';

let idIndex = 0;

@Component({
  selector: 'sky-ag-grid-wrapper',
  templateUrl: './ag-grid-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, SkyIdModule, SkyViewkeeperModule],
  host: {
    '[class.sky-ag-grid-layout-normal]': 'isNormalLayout()',
  },
})
export class SkyAgGridWrapperComponent
  implements AfterContentInit, AfterViewInit
{
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

  readonly #idIndex = idIndex++;
  protected readonly afterAnchorId =
    'sky-ag-grid-nav-anchor-after-' + this.#idIndex;
  protected readonly beforeAnchorId =
    'sky-ag-grid-nav-anchor-before-' + this.#idIndex;
  protected readonly gridId = 'sky-ag-grid-' + this.#idIndex;

  /**
   * @internal
   */
  public readonly viewkeeperClasses = linkedSignal<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { domLayout: DomLayoutType | undefined; context: any },
    string[]
  >({
    source: () => ({
      domLayout: this.#agGridDomLayout(),
      context: this.agGridContext(),
    }),
    computation: (source) => {
      const enableTopScroll = !!source.context?.enableTopScroll;
      if (source.domLayout === 'autoHeight' && enableTopScroll) {
        return ['.ag-header', '.ag-body-horizontal-scroll'];
      }
      return ['.ag-header'];
    },
    equal: (a, b) => a.length === b.length && a.every((v, i) => v === b[i]),
  });

  get #isInEditMode(): boolean {
    const api = this.#agGridApi();
    if (api) {
      const primaryGridEditing = api.getEditingCells().length > 0;
      if (primaryGridEditing) {
        return true;
      } else if (api.getGridOption('masterDetail')) {
        let innerEditing = false;
        api.forEachDetailGridInfo((detailGrid) => {
          if (detailGrid?.api && detailGrid.api.getEditingCells().length > 0) {
            innerEditing = true;
          }
        });

        return innerEditing;
      }
    }
    return false;
  }

  protected readonly agGrid = contentChild(AgGridAngular);

  protected readonly skyAgGridDiv =
    viewChild<ElementRef<HTMLElement>>('skyAgGridDiv');

  protected readonly agGridContext = computed(
    () => this.agGrid()?.gridOptions?.context,
  );
  protected readonly isNormalLayout = computed(
    () => this.#agGridDomLayout() === 'normal',
  );

  readonly #agGrid = toObservable(this.agGrid);
  readonly #agGridApi = toSignal(
    this.#agGrid.pipe(
      filter((agGrid): agGrid is AgGridAngular => !!agGrid),
      // Pause for less than a tick to let the AG Grid API become available.
      delay(0, asapScheduler),
      map((agGrid) => agGrid.api),
    ),
  );
  readonly #agGridDomLayout = toSignal(
    toObservable(this.#agGridApi).pipe(
      filter(Boolean),
      map((gridApi) => gridApi.getGridOption('domLayout')),
    ),
  );
  readonly #destroyRef = inject(DestroyRef);
  readonly #themeSvc = inject(SkyThemeService, {
    optional: true,
  });
  readonly #themeSettings = toSignal(this.#themeSvc?.settingsChange ?? EMPTY);
  readonly #adapterService = inject(SkyAgGridAdapterService);
  readonly #elementRef = inject(ElementRef<HTMLElement>);
  readonly #mutationObserverService = inject(SkyMutationObserverService);
  readonly #resizeObserverSvc = inject(SkyResizeObserverService);
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
      this.#agGridApi()?.setGridOption('theme', skyAgGridTheme);
    });

    this.#destroyRef.onDestroy(() => {
      this.#agGridClassObserver?.disconnect();
    });
  }

  public ngAfterContentInit(): void {
    this.#watchHorizontalScrollPosition();

    this.#agGrid
      .pipe(
        filter(Boolean),
        switchMap((agGrid) => agGrid.cellEditingStarted),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe((params: CellEditingStartedEvent) => {
        if (params.colDef.type) {
          const types = Array.isArray(params.colDef.type)
            ? params.colDef.type
            : [params.colDef.type];
          const addClasses = types.map((t) => `sky-ag-grid-cell-editing-${t}`);
          this.#cellEditingClasses.update((prev) => [...prev, ...addClasses]);
          if (
            types.includes(SkyCellType.Template) &&
            params.rowIndex !== null
          ) {
            params.api.setFocusedCell(params.rowIndex, params.column);
          }
        }
      });
    this.#agGrid
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        filter(Boolean),
        switchMap((agGrid) => agGrid.cellEditingStopped),
      )
      .subscribe(() => {
        this.#cellEditingClasses.set([]);
      });
    this.#agGrid
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        filter(Boolean),
        switchMap((agGrid) => agGrid.cellFocused),
      )
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

    this.#agGrid
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        filter(Boolean),
        switchMap((agGrid) => agGrid.headerFocused),
      )
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

  public ngAfterViewInit(): void {
    const agGridElement: HTMLElement | undefined =
      this.#elementRef.nativeElement.querySelector('ag-grid-angular') ??
      undefined;
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
    this.#agGridApi()?.stopEditing(true);
  }

  public onGridKeydown(event: KeyboardEvent): void {
    if (this.agGrid() && !this.#isInEditMode && event.key === 'Tab') {
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

    if (this.agGrid() && !previousWasGrid) {
      this.#elementRef.nativeElement
        .querySelector('.ag-tab-guard.ag-tab-guard-top')
        ?.focus();
    }
  }

  #watchHorizontalScrollPosition(): void {
    const elements$ = this.#agGrid.pipe(
      filter(Boolean),
      switchMap((agGrid) =>
        merge(
          agGrid.gridReady,
          agGrid.firstDataRendered,
          agGrid.rowDataUpdated,
          // AG Grid recalculates its own horizontal scrollbar visibility/inline
          // styling in response to this event (independent of anything this
          // component does), which can clear the `top` set below - so this is
          // included to reapply positioning immediately afterward.
          agGrid.gridSizeChanged,
        ).pipe(
          // `context.enableTopScroll` may not be reflected on the grid's own
          // `gridOptions` yet by the time the earliest of these events fires
          // (e.g. while a data manager/async fixture is still hydrating), so
          // this is re-checked on each event rather than once up front.
          filter(() => !!this.agGridContext()?.enableTopScroll),
          map(() => this.#elementRef.nativeElement.querySelector('.ag-root')),
          filter((root): root is HTMLElement => !!root),
          map((root) => {
            const header = root.querySelector(
              '.ag-header',
            ) as HTMLElement | null;
            const scrollbar = root.querySelector(
              '.ag-body-horizontal-scroll',
            ) as HTMLElement | null;
            const pinnedTopRows = root.querySelector(
              '.ag-grid-pinned-top-rows',
            ) as HTMLElement | null;
            return { header, scrollbar, pinnedTopRows };
          }),
          filter(
            (
              els,
            ): els is {
              header: HTMLElement;
              scrollbar: HTMLElement;
              pinnedTopRows: HTMLElement;
            } => !!els.header && !!els.scrollbar && !!els.pinnedTopRows,
          ),
        ),
      ),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    const headerHeight$ = elements$.pipe(
      // Only re-subscribe the resize observer when AG Grid actually swaps in
      // a new header element, not on every tracked event above.
      distinctUntilChanged((a, b) => a.header === b.header),
      switchMap((els) =>
        this.#resizeObserverSvc.observe(new ElementRef(els.header)).pipe(
          map(() => els.header.offsetHeight),
          distinctUntilChanged(),
        ),
      ),
    );

    elements$
      .pipe(
        // Reapply on every tracked event (using the latest known header
        // height) even when the height itself hasn't changed, so AG Grid's
        // own resets of the scrollbar's inline style (e.g. on
        // `gridSizeChanged`) get corrected right away.
        combineLatestWith(headerHeight$),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe(([{ scrollbar, pinnedTopRows }, headerHeight]) => {
        scrollbar.style.removeProperty('bottom');
        scrollbar.style.top = `${headerHeight}px`;

        // Overlay/auto-hiding scrollbars float above content and need no
        // extra space. Classic/always-visible scrollbars need the pinned-top
        // section to reserve room below the header, or the now-absolutely
        // positioned scrollbar would overlap the scrolling row content.
        if (!scrollbar.classList.contains('ag-scrollbar-invisible')) {
          const scrollbarHeight = parseFloat(scrollbar.style.height) || 0;
          pinnedTopRows.style.setProperty(
            '--ag-header-rows-height',
            `${headerHeight + scrollbarHeight}px`,
          );
        }
      });
  }

  #getTextSelection(hasEditableClass: boolean): boolean {
    if (this.agGridContext()?.enableCellTextSelection) {
      return !hasEditableClass;
    } else {
      return false;
    }
  }
}
