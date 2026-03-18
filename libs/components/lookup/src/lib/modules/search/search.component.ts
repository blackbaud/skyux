import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  SkyBreakpoint,
  SkyContentInfo,
  SkyContentInfoProvider,
  SkyMediaQueryService,
} from '@skyux/core';

import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { SkySearchAdapterService } from './search-adapter.service';

const EXPAND_MODE_RESPONSIVE = 'responsive';
const EXPAND_MODE_FIT = 'fit';

@Component({
  selector: 'sky-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [SkySearchAdapterService],
  standalone: false,
})
export class SkySearchComponent implements OnDestroy, OnInit, OnChanges {
  /**
   * The ARIA label for the search input. This sets the search input's `aria-label` attribute to provide a text equivalent for screen readers
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * Use a context-sensitive label, such as "Search constituents." Context is especially important when multiple search inputs are in close proximity.
   * In toolbars, search inputs use the `listDescriptor` to provide context, and the ARIA label defaults to "Search <listDescriptor>."
   * If the box includes a visible label, use `ariaLabelledBy` instead.
   * For more information about the `aria-label` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-label).
   */
  @Input()
  public ariaLabel: string | undefined;

  /**
   * The HTML element ID of the element that labels
   * the search. This sets the search's `aria-labelledby` attribute to provide a text equivalent for screen readers
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If the box does not include a visible label, use `ariaLabel` instead.
   * For more information about the `aria-labelledby` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-labelledby).
   */
  @Input()
  public ariaLabelledBy: string | undefined;

  /**
   * Fires when the search text is applied.
   */
  @Output()
  public searchApply = new EventEmitter<string>();

  /**
   * Fires when the search text is changed.
   */
  @Output()
  public searchChange = new EventEmitter<string>();

  /**
   * Fires when the search text is cleared.
   */
  @Output()
  public searchClear = new EventEmitter<void>();

  /**
   * Default search criteria for the input.
   */
  @Input()
  public searchText: string | undefined;

  /**
   * The expand mode for the search input. The valid options
   * include `"responsive"` to collapse the search input into a button on
   * mobile devices, `"none"` to *not* collapse the search input on mobile
   * devices, and `"fit"` to extend the search input to fit the width of its container.
   * @default "responsive"
   */
  public readonly expandMode = input(EXPAND_MODE_RESPONSIVE, {
    transform: (value: string | undefined) => value ?? EXPAND_MODE_RESPONSIVE,
  });

  /**
   * How many milliseconds to wait before searching after users enter text in the search input.
   * @default 0
   */
  @Input()
  public set debounceTime(value: number | undefined) {
    this.#_debounceTime = value ?? 0;
    this.#setupSearchChangedEvent();
  }

  public get debounceTime(): number {
    return this.#_debounceTime;
  }

  /**
   * Whether to disable the search.
   * @default false
   */
  @Input()
  public set disabled(value: boolean | undefined) {
    this.#_disabled = value ?? false;
  }

  public get disabled(): boolean {
    return this.#_disabled;
  }

  /**
   * Placeholder text to display in the search input until users
   * enter search criteria.
   * @default "Find in this list"
   */
  @Input()
  public placeholderText: string | undefined;

  public clearButtonShown = false;

  protected contentInfoObs: Observable<SkyContentInfo> | undefined;

  protected readonly isCollapsible = computed(
    () => this.expandMode() === EXPAND_MODE_RESPONSIVE,
  );

  protected readonly isFullWidth = computed(
    () => this.expandMode() === EXPAND_MODE_FIT,
  );

  protected readonly inputShown = signal(true);
  protected readonly mobileSearchShown = signal(false);
  protected readonly searchButtonShown = signal(false);

  #changeRef: ChangeDetectorRef;

  #contentInfoProvider = inject(SkyContentInfoProvider, { optional: true });

  #elRef: ElementRef;

  #searchAdapter: SkySearchAdapterService;

  #searchUpdated = new Subject<string>();

  #searchUpdatedSub: Subscription | undefined;

  #_debounceTime = 0;

  #_disabled = false;

  readonly #destroyRef = inject(DestroyRef);
  readonly #injector = inject(Injector);
  readonly #mediaQuerySvc = inject(SkyMediaQueryService);
  readonly #breakpoint = toSignal(this.#mediaQuerySvc.breakpointChange);

  constructor(
    elRef: ElementRef,
    searchAdapter: SkySearchAdapterService,
    changeRef: ChangeDetectorRef,
  ) {
    this.#elRef = elRef;
    this.#searchAdapter = searchAdapter;
    this.#changeRef = changeRef;

    this.contentInfoObs = this.#contentInfoProvider?.getInfo();
  }

  public ngOnInit(): void {
    if (this.isCollapsible()) {
      this.#mediaQuerySvc.breakpointChange
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe((breakpoint) => {
          this.#mediaQueryCallback(breakpoint);
        });
    }

    this.#setupSearchChangedEvent();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.#searchBindingChanged(changes)) {
      this.#searchUpdated.next(this.searchText ?? '');
      this.clearButtonShown = !!(this.searchText && this.searchText !== '');
      if (this.#shouldOpenInput()) {
        this.inputShown.set(true);
        this.mobileSearchShown.set(true);
        this.searchButtonShown.set(false);
      }
    }
    this.#changeRef.detectChanges();
  }

  public clearSearchText(): void {
    this.searchText = '';
    this.clearButtonShown = false;

    this.#searchAdapter.focusInput(this.#elRef);
    this.#searchUpdated.next(this.searchText);

    this.searchApply.emit(this.searchText);

    this.searchClear.emit();
  }

  public enterPress(
    event: KeyboardEvent,
    searchText: string | undefined,
  ): void {
    if (event.code === 'Enter' || event.code === 'NumpadEnter') {
      this.applySearchText(searchText);
    }
  }

  public applySearchText(searchText: string | undefined): void {
    // Double check that search text is defined before attempting to trim off whitespace
    if (searchText) {
      searchText = searchText.trim();
    }

    if (searchText !== this.searchText) {
      this.searchText = searchText;
    }
    this.clearButtonShown = !!(searchText && searchText !== '');
    if (searchText && searchText !== '') {
      this.#searchAdapter.selectInput(this.#elRef);
    }

    this.searchApply.emit(searchText);
  }

  public searchTextChanged(searchText: string): void {
    this.searchText = searchText;
    this.#searchUpdated.next(searchText);
  }

  public toggleSearchInput(showInput: boolean): void {
    if (this.isCollapsible()) {
      this.inputShown.set(showInput);

      if (showInput && this.#breakpoint() === 'xs') {
        this.mobileSearchShown.set(true);
        this.searchButtonShown.set(false);
      }

      if (showInput) {
        afterNextRender(
          () => {
            this.#searchAdapter.focusInput(this.#elRef);
          },
          { injector: this.#injector },
        );
      }
    }
  }

  protected onInputTransitionEnd(): void {
    if (!this.inputShown()) {
      if (this.#breakpoint() === 'xs' && this.isCollapsible()) {
        this.searchButtonShown.set(true);
      }
      this.mobileSearchShown.set(false);
    }
  }

  public ngOnDestroy(): void {
    this.#searchUpdated.complete();
    this.#searchUpdatedSub?.unsubscribe();
  }

  #searchBindingChanged(changes: SimpleChanges): boolean {
    return (
      changes['searchText'] &&
      changes['searchText'].previousValue !== changes['searchText'].currentValue
    );
  }

  #shouldOpenInput(): boolean {
    return (
      this.searchText !== '' &&
      this.#breakpoint() === 'xs' &&
      this.isCollapsible()
    );
  }

  #mediaQueryCallback(breakpoint: SkyBreakpoint): void {
    if (this.isCollapsible()) {
      if (breakpoint === 'xs') {
        this.inputShown.set(false);
      } else if (!this.inputShown()) {
        this.inputShown.set(true);
        this.searchButtonShown.set(false);
        this.mobileSearchShown.set(false);
      } else {
        this.mobileSearchShown.set(false);
      }
    }
    this.#changeRef.markForCheck();
  }

  #setupSearchChangedEvent(): void {
    this.#searchUpdatedSub?.unsubscribe();

    this.#searchUpdatedSub = this.#searchUpdated
      .pipe(debounceTime(this.debounceTime), distinctUntilChanged())
      .subscribe((value) => {
        this.searchChange.emit(value);
      });
  }
}
