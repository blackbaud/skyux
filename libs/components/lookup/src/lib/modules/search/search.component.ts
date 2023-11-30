import {
  AnimationEvent,
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import {
  SkyContentInfo,
  SkyContentInfoProvider,
  SkyMediaBreakpoints,
  SkyMediaQueryService,
} from '@skyux/core';

import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { SkySearchAdapterService } from './search-adapter.service';

const INPUT_SHOWN_STATE = 'inputShown';
const INPUT_HIDDEN_STATE = 'inputHidden';
const EXPAND_MODE_RESPONSIVE = 'responsive';
const EXPAND_MODE_FIT = 'fit';
const EXPAND_MODE_NONE = 'none';

@Component({
  selector: 'sky-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('inputState', [
      state(
        INPUT_HIDDEN_STATE,
        style({
          opacity: 0,
          width: 0,
        }),
      ),
      state(
        INPUT_SHOWN_STATE,
        style({
          opacity: 1,
          width: '100%',
        }),
      ),
      transition('* <=> *', animate('150ms')),
    ]),
  ],
  providers: [SkySearchAdapterService],
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
  @Input()
  public set expandMode(value: string | undefined) {
    this.#_expandMode = value ?? EXPAND_MODE_RESPONSIVE;
  }

  public get expandMode(): string {
    return this.#_expandMode;
  }

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
   * Whether to disable the filter button.
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

  public breakpointSubscription: Subscription | undefined;

  public clearButtonShown = false;

  public dismissButtonShown = false;

  public inputAnimate: string = INPUT_SHOWN_STATE;

  public isCollapsible = true;

  public isFullWidth = false;

  public mobileSearchShown = false;

  public searchButtonShown = false;

  protected contentInfoObs: Observable<SkyContentInfo> | undefined;

  #changeRef: ChangeDetectorRef;

  #contentInfoProvider = inject(SkyContentInfoProvider, { optional: true });

  #elRef: ElementRef;

  #mediaQueryService: SkyMediaQueryService;

  #searchAdapter: SkySearchAdapterService;

  #searchUpdated = new Subject<string>();

  #searchUpdatedSub: Subscription | undefined;

  #_debounceTime = 0;

  #_disabled = false;

  #_expandMode = EXPAND_MODE_RESPONSIVE;

  constructor(
    mediaQueryService: SkyMediaQueryService,
    elRef: ElementRef,
    searchAdapter: SkySearchAdapterService,
    changeRef: ChangeDetectorRef,
  ) {
    this.#mediaQueryService = mediaQueryService;
    this.#elRef = elRef;
    this.#searchAdapter = searchAdapter;
    this.#changeRef = changeRef;

    this.contentInfoObs = this.#contentInfoProvider?.getInfo();
  }

  public ngOnInit() {
    if (this.#searchShouldCollapse()) {
      this.breakpointSubscription = this.#mediaQueryService.subscribe(
        (args: SkyMediaBreakpoints) => {
          this.#mediaQueryCallback(args);
          this.#changeRef.detectChanges();
        },
      );
    }

    this.#setupSearchChangedEvent();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (this.#expandModeBindingChanged(changes)) {
      switch (this.expandMode) {
        case EXPAND_MODE_NONE:
          this.isCollapsible = false;
          this.isFullWidth = false;
          break;
        case EXPAND_MODE_FIT:
          this.isCollapsible = false;
          this.isFullWidth = true;
          break;
        default:
          this.isCollapsible = true;
          this.isFullWidth = false;
          break;
      }
    }

    if (this.#searchBindingChanged(changes)) {
      this.clearButtonShown = !!(this.searchText && this.searchText !== '');
      if (this.#shouldOpenInput()) {
        this.inputAnimate = INPUT_SHOWN_STATE;
      }
    }
    this.#changeRef.detectChanges();
  }

  public clearSearchText() {
    this.searchText = '';
    this.clearButtonShown = false;

    this.#searchAdapter.focusInput(this.#elRef);
    this.searchChange.emit(this.searchText);

    this.searchApply.emit(this.searchText);

    this.searchClear.emit();
  }

  public enterPress(event: KeyboardEvent, searchText: string | undefined) {
    if (event.code === 'Enter' || event.code === 'NumpadEnter') {
      this.applySearchText(searchText);
    }
  }

  public applySearchText(searchText: string | undefined) {
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

  public searchTextChanged(searchText: string) {
    this.searchText = searchText;
    this.#searchUpdated.next(searchText);
  }

  public toggleSearchInput(showInput: boolean) {
    if (this.#searchShouldCollapse()) {
      if (showInput) {
        this.inputAnimate = INPUT_SHOWN_STATE;
      } else {
        this.inputAnimate = INPUT_HIDDEN_STATE;
      }
    }
  }

  public inputAnimationStart(event: AnimationEvent) {
    if (this.#searchShouldCollapse()) {
      this.#searchAdapter.startInputAnimation(this.#elRef);

      if (
        event.toState === INPUT_SHOWN_STATE &&
        this.#mediaQueryService.current === SkyMediaBreakpoints.xs
      ) {
        this.mobileSearchShown = true;
        this.searchButtonShown = false;
      }
    }
  }

  public inputAnimationEnd(event: AnimationEvent) {
    if (this.#searchShouldCollapse()) {
      this.#searchAdapter.endInputAnimation(this.#elRef);

      this.searchButtonShown =
        event.toState === INPUT_HIDDEN_STATE &&
        this.#mediaQueryService.current === SkyMediaBreakpoints.xs;

      if (
        (event.toState === INPUT_HIDDEN_STATE &&
          this.#mediaQueryService.current === SkyMediaBreakpoints.xs) ||
        this.#mediaQueryService.current !== SkyMediaBreakpoints.xs
      ) {
        this.mobileSearchShown = false;
      }
    }
  }

  public ngOnDestroy() {
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }

    this.#searchUpdated.complete();
    this.#searchUpdatedSub?.unsubscribe();
  }
  #searchBindingChanged(changes: SimpleChanges) {
    return (
      changes['searchText'] &&
      changes['searchText'].previousValue !== changes['searchText'].currentValue
    );
  }

  #expandModeBindingChanged(changes: SimpleChanges) {
    return (
      changes['expandMode'] &&
      changes['expandMode'].previousValue !== changes['expandMode'].currentValue
    );
  }

  #shouldOpenInput(): boolean {
    return (
      this.searchText !== '' &&
      this.#mediaQueryService.current === SkyMediaBreakpoints.xs &&
      this.#searchShouldCollapse()
    );
  }

  #mediaQueryCallback(args: SkyMediaBreakpoints): void {
    if (this.#searchShouldCollapse()) {
      if (args === SkyMediaBreakpoints.xs) {
        this.inputAnimate = INPUT_HIDDEN_STATE;
      } else if (this.inputAnimate !== INPUT_SHOWN_STATE) {
        this.inputAnimate = INPUT_SHOWN_STATE;
      } else {
        this.mobileSearchShown = false;
      }
    }
    this.#changeRef.markForCheck();
  }

  #searchShouldCollapse(): boolean {
    return (
      (this.isCollapsible || this.isCollapsible === undefined) &&
      this.isFullWidth !== true
    );
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
