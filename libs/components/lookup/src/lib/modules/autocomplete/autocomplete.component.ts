/* eslint-disable complexity */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EnvironmentInjector,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Optional,
  Output,
  TemplateRef,
  ViewChild,
  booleanAttribute,
  inject,
  input,
} from '@angular/core';
import {
  SKY_STACKING_CONTEXT,
  SkyAffixAutoFitContext,
  SkyAffixService,
  SkyAffixer,
  SkyLiveAnnouncerService,
  SkyOverlayInstance,
  SkyOverlayService,
  SkyStackingContext,
} from '@skyux/core';
import { SkyInputBoxHostService } from '@skyux/forms';
import { SkyLibResourcesService } from '@skyux/i18n';

import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
  from,
  fromEvent as observableFromEvent,
  of,
} from 'rxjs';
import {
  debounceTime,
  delay,
  map,
  startWith,
  switchMap,
  take,
  takeUntil,
} from 'rxjs/operators';

import { normalizeDiacritics } from '../shared/sky-lookup-string-utils';

import { SkyAutocompleteAdapterService } from './autocomplete-adapter.service';
import { skyAutocompleteDefaultSearchFunction } from './autocomplete-default-search-function';
import { SkyAutocompleteInputDirective } from './autocomplete-input.directive';
import { SkyAutocompleteMessage } from './types/autocomplete-message';
import { SkyAutocompleteMessageType } from './types/autocomplete-message-type';
import { SkyAutocompleteSearchAsyncArgs } from './types/autocomplete-search-async-args';
import { SkyAutocompleteSearchAsyncResult } from './types/autocomplete-search-async-result';
import { SkyAutocompleteSearchFunction } from './types/autocomplete-search-function';
import { SkyAutocompleteSearchFunctionFilter } from './types/autocomplete-search-function-filter';
import { SkyAutocompleteSelectionChange } from './types/autocomplete-selection-change';
import { SkyAutocompleteShowMoreArgs } from './types/autocomplete-show-more-args';

/**
 * @internal
 */
interface SkyAutocompleteSearchResult {
  elementId: string;
  data: any;
}

let uniqueId = 0;

@Component({
  selector: 'sky-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  providers: [SkyAutocompleteAdapterService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyAutocompleteComponent implements OnDestroy, AfterViewInit {
  //#region public_api

  /**
   * The HTML element ID of the element that labels
   * the autocomplete text input. This sets the input's `aria-labelledby` attribute to provide a text equivalent for screen readers
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * For more information about the `aria-labelledby` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-labelledby).
   */
  @Input()
  public ariaLabelledBy: string | undefined;
  /**
   * The static data source for the autocomplete component to search
   * when users enter text. For a dynamic data source, such as an array that
   * changes due to server calls, use `search` or `searchAsync` instead.
   * You can specify static data, such as an array of objects,
   * or you can pull data from a database.
   */
  @Input()
  public set data(value: any[] | undefined) {
    this.#_data = value ?? [];
  }

  public get data(): any[] {
    return this.#_data;
  }

  /**
   * How many milliseconds to wait before searching while users
   * enter text in the autocomplete field.
   * @default 0
   */
  @Input()
  public set debounceTime(value: number | undefined) {
    this.#_debounceTime = value ?? 0;
  }

  public get debounceTime(): number {
    return this.#_debounceTime;
  }

  /**
   * The object property to display in the text input after users
   * select an item in the dropdown list.
   * @default "name"
   */
  @Input()
  public set descriptorProperty(value: string | undefined) {
    this.#_descriptorProperty = value || 'name';
  }

  public get descriptorProperty(): string {
    return this.#_descriptorProperty;
  }

  /**
   * Hint text to show in the dropdown
   * @internal
   */
  @Input()
  public dropdownHintText: string | undefined;

  /**
   * @internal
   * Whether to display a button in the dropdown that opens a picker where users can view all options.
   */
  @Input()
  public set enableShowMore(value: boolean | undefined) {
    this.#_enableShowMore = !!value;
    this.#updateIsResultsVisible();
  }
  public get enableShowMore(): boolean {
    return this.#_enableShowMore;
  }

  /**
   * The observable of `SkyAutocompleteMessage` that can close the dropdown.
   * @internal
   */
  @Input()
  public set messageStream(value: Subject<SkyAutocompleteMessage> | undefined) {
    this.#_messageStream = value ?? new Subject<SkyAutocompleteMessage>();
    this.#initMessageStream();
  }

  public get messageStream(): Subject<SkyAutocompleteMessage> {
    return this.#_messageStream;
  }

  /**
   * @internal
   */
  @Input()
  public wrapperClass: string | undefined;

  /**
   * The object properties to search.
   * @default ["name"]
   * @deprecated We recommend against using this property. To search specific properties, use the `searchAsync` event instead.
   */
  @Input()
  public set propertiesToSearch(value: string[] | undefined) {
    this.#_propertiesToSearch = value ?? ['name'];

    this.#updateDefaultSearchOptions();
  }

  public get propertiesToSearch(): string[] {
    return this.#_propertiesToSearch;
  }

  /**
   * The function that dynamically manages the data to display in search results when users
   * change the text in the autocomplete field. The search function must return
   * an array or a promise of an array. The `search` property is particularly
   * useful when the data source does not live in the source code.
   * @deprecated We recommend against using this property. To call a remote data source, use the `searchAsync` event instead.
   */
  @Input()
  public set search(value: SkyAutocompleteSearchFunction | undefined) {
    this.#_search = value;
    this.searchOrDefault =
      value ||
      skyAutocompleteDefaultSearchFunction({
        propertiesToSearch: this.propertiesToSearch,
        searchFilters: this.searchFilters,
      });
  }

  public get search(): SkyAutocompleteSearchFunction | undefined {
    return this.#_search;
  }

  /**
   * The template that formats each search result in the dropdown list.
   * The autocomplete component injects search result values into the template
   * as `item` variables that reference all of the object properties of the search results.
   */
  @Input()
  public searchResultTemplate: TemplateRef<unknown> | undefined;

  /**
   * The minimum number of characters that users must enter before
   * the autocomplete component searches the data source and displays search
   * results in the dropdown list. Can be set to `0` to search on focus.
   * @default 1
   */
  @Input()
  public set searchTextMinimumCharacters(value: number | undefined) {
    if (value !== undefined && value >= 0) {
      this.#_searchTextMinimumCharacters = value;
    } else {
      this.#_searchTextMinimumCharacters = 1;
    }
  }

  public get searchTextMinimumCharacters(): number {
    return this.#_searchTextMinimumCharacters;
  }

  /**
   * The array of functions to call against each search result. This filters
   * the search results when using the `data` input and the default search function.
   *  When the `search` property specifies a custom search function, you must
   * manually apply filters inside that function. The function must return `true`
   * or `false` for each result to indicate whether to display it in the dropdown list.
   *
   * @deprecated We recommend against using this property. To filter results, use the `searchAsync` event instead.
   */
  @Input()
  public set searchFilters(
    value: SkyAutocompleteSearchFunctionFilter[] | undefined,
  ) {
    this.#_searchFilters = value;

    this.#updateDefaultSearchOptions();
  }

  public get searchFilters():
    | SkyAutocompleteSearchFunctionFilter[]
    | undefined {
    return this.#_searchFilters;
  }

  /**
   * The maximum number of search results to display in the dropdown list.
   * By default, the component displays all matching results.
   */
  @Input()
  public set searchResultsLimit(value: number | undefined) {
    this.#_searchResultsLimit = value || 0;
  }

  public get searchResultsLimit(): number {
    return this.#_searchResultsLimit;
  }

  /**
   * @internal
   * Whether to display a button that lets users add options to the data source.
   * @default false
   */
  @Input()
  public set showAddButton(value: boolean | undefined) {
    this.#_showAddButton = !!value;
    this.#updateIsResultsVisible();
  }
  public get showAddButton(): boolean {
    return this.#_showAddButton;
  }

  /**
   * The text to display when no search results are found.
   * @default "No matches found"
   */
  @Input()
  public noResultsFoundText: string | undefined;

  /**
   * @internal
   * Allows async search to be disabled even when a listener is specified for
   * the `searchAsync` output.
   * @default false
   */
  @Input()
  public searchAsyncDisabled: boolean | undefined = false;

  /**
   * When using `searchAsync`, allows the user to specify arbitrary
   * values not in the search results. This only works in combination
   * with `searchAsync`.
   * @default false
   */
  public allowAnyValue = input(false, { transform: booleanAttribute });

  /**
   * Highlights the search text in each search result. Set this to `false`
   * when your search returns results that aren't exact text matches, such as
   * returning "Bob" for "Robert."
   * @default true
   */
  public highlightSearchText = input(true, { transform: booleanAttribute });

  /**
   * @internal
   * Fires when users select the button to add options to the data source.
   */
  @Output()
  public addClick = new EventEmitter<void>();

  /**
   * @internal
   * Fires when users select the button to view all options.
   */
  @Output()
  public showMoreClick = new EventEmitter<SkyAutocompleteShowMoreArgs>();

  /**
   * Fires when users select items in the dropdown list.
   */
  @Output()
  public selectionChange = new EventEmitter<SkyAutocompleteSelectionChange>();

  /**
   * Fires when users enter new search information and allows results to be
   * returned via an observable.
   */
  @Output()
  public searchAsync = new EventEmitter<SkyAutocompleteSearchAsyncArgs>();

  /**
   * @internal
   */
  @Output()
  public openChange = new EventEmitter<boolean>();

  //#endregion

  //#region template_properties

  public get searchResults(): SkyAutocompleteSearchResult[] {
    return this.#_searchResults || [];
  }

  public set searchResults(value: SkyAutocompleteSearchResult[]) {
    this.#_searchResults = value;
  }

  public get highlightText(): string[] {
    return this.#_highlightText || [];
  }

  public set highlightText(value: string[]) {
    this.#_highlightText = value;
  }

  public isOpen = false;

  public resultsListId: string;

  public resultsWrapperId: string;

  public searchText = '';

  public get showActionsArea(): boolean {
    return !!this.showAddButton || !!this.enableShowMore;
  }

  public isSearchingAsync = false;

  public searchResultsCount: number | undefined;

  //#endregion

  @ContentChild(SkyAutocompleteInputDirective)
  public set inputDirective(
    directive: SkyAutocompleteInputDirective | undefined,
  ) {
    if (!directive) {
      throw Error(
        [
          'The SkyAutocompleteComponent requires a ContentChild input or',
          'textarea bound with the SkyAutocomplete directive. For example:',
          '`<input type="text" skyAutocomplete>`.',
        ].join(' '),
      );
    }

    if (this.#_inputDirective !== directive) {
      // Unsubscribe from old subscriptions on any previous input directive
      this.#inputDirectiveUnsubscribe.next();

      this.#_inputDirective = directive;

      this.#_inputDirective.displayWith = this.descriptorProperty;

      this.#_inputDirective.textChanges
        .pipe(
          takeUntil(this.#inputDirectiveUnsubscribe),
          debounceTime(this.debounceTime),
          switchMap((change) => {
            this.isSearchingAsync = true;
            return of(change);
          }),
        )
        .subscribe((change) => {
          this.#searchTextChanged(change.value);
        });

      // We delay this listener by 25ms to give things watching the value time to respond (such as the search button).
      this.#_inputDirective.blur
        .pipe(delay(25), takeUntil(this.#inputDirectiveUnsubscribe))
        .subscribe(() => {
          directive.restoreInputTextValueToPreviousState();
          this.#closeDropdown();
          this.#cancelCurrentSearch();
          directive.onTouched();
          this.#hasFocus = false;
          this.#liveAnnounceService.clear();
        });

      this.#_inputDirective.focus
        .pipe(takeUntil(this.#inputDirectiveUnsubscribe))
        .subscribe(() => {
          this.#hasFocus = true;
          if (this.showActionsArea || this.dropdownHintText) {
            this.#openDropdown();
          }
          if (this.searchTextMinimumCharacters === 0) {
            this.#searchTextChanged('');
          }
        });
    }
  }

  public get inputDirective(): SkyAutocompleteInputDirective | undefined {
    return this.#_inputDirective;
  }

  @ViewChild('resultsTemplateRef', { read: TemplateRef })
  public resultsTemplateRef: TemplateRef<unknown> | undefined;

  @ViewChild('resultsRef', { read: ElementRef })
  public set resultsRef(value: ElementRef | undefined) {
    if (value) {
      this.#_resultsRef = value;
      this.#destroyAffixer();
      this.#createAffixer();
    }
  }

  public get resultsRef(): ElementRef | undefined {
    return this.#_resultsRef;
  }

  public searchOrDefault: SkyAutocompleteSearchFunction;

  protected isResultsVisible: Observable<boolean>;

  /**
   * Index that indicates which descendant of the overlay currently has focus.
   */
  #activeElementIndex = -1;

  #adapterService: SkyAutocompleteAdapterService;

  #affixer: SkyAffixer | undefined;

  #affixService: SkyAffixService;

  #changeDetector: ChangeDetectorRef;

  #elementRef: ElementRef;

  readonly #environmentInjector = inject(EnvironmentInjector);

  readonly #liveAnnounceService = inject(SkyLiveAnnouncerService);

  readonly #libResourceService = inject(SkyLibResourcesService);

  #hasFocus = false;

  #inputBoxHostSvc: SkyInputBoxHostService | undefined;

  #inputDirectiveUnsubscribe = new Subject<void>();

  #messageStreamSub: Subscription | undefined;

  #ngUnsubscribe = new Subject<void>();

  #overlay: SkyOverlayInstance | undefined;

  #overlayService: SkyOverlayService;

  /**
   * Elements within the autocomplete dropdown that are focusable.
   * These are typically the search results and action buttons, but could also be
   * elements provided in the consumer's own template.
   */
  #overlayFocusableElements: HTMLElement[] = [];

  #currentSearchSub: Subscription | undefined;

  #isResultsVisible = new BehaviorSubject<boolean>(false);

  #zIndex: Observable<number> | undefined;

  #_data: any[] = [];

  #_debounceTime = 0;

  #_descriptorProperty = 'name';

  #_enableShowMore = false;

  #_highlightText: string[] | undefined;

  #_inputDirective: SkyAutocompleteInputDirective | undefined;

  #_messageStream = new Subject<SkyAutocompleteMessage>();

  #_propertiesToSearch = ['name'];

  #_resultsRef: ElementRef | undefined;

  #_search: SkyAutocompleteSearchFunction | undefined;

  #_searchFilters: SkyAutocompleteSearchFunctionFilter[] | undefined;

  #_searchResults: SkyAutocompleteSearchResult[] | undefined;

  #_searchResultsLimit = 0;

  #_searchTextMinimumCharacters = 1;

  #_showAddButton = false;

  constructor(
    changeDetector: ChangeDetectorRef,
    elementRef: ElementRef,
    affixService: SkyAffixService,
    adapterService: SkyAutocompleteAdapterService,
    overlayService: SkyOverlayService,
    @Optional() inputBoxHostSvc?: SkyInputBoxHostService,
    @Optional()
    @Inject(SKY_STACKING_CONTEXT)
    stackingContext?: SkyStackingContext,
  ) {
    this.#changeDetector = changeDetector;
    this.#elementRef = elementRef;
    this.#affixService = affixService;
    this.#adapterService = adapterService;
    this.#overlayService = overlayService;
    this.#inputBoxHostSvc = inputBoxHostSvc;
    this.#zIndex = stackingContext?.zIndex;

    this.searchOrDefault = skyAutocompleteDefaultSearchFunction({
      propertiesToSearch: ['name'],
      searchFilters: undefined,
    });

    const id = ++uniqueId;
    this.resultsListId = `sky-autocomplete-list-${id}`;
    this.resultsWrapperId = `sky-autocomplete-wrapper-${id}`;
    this.isResultsVisible = this.#isResultsVisible.asObservable();
  }

  public ngAfterViewInit(): void {
    this.#addInputEventListeners();
  }

  public ngOnDestroy(): void {
    this.#cancelCurrentSearch();
    this.#inputDirectiveUnsubscribe.next();
    this.#inputDirectiveUnsubscribe.complete();
    this.#isResultsVisible.complete();
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
    this.#destroyAffixer();
    this.#destroyOverlay();
    this.openChange.complete();
  }

  public addButtonClicked(): void {
    this.addClick.emit();
    if (this.inputDirective) {
      this.inputDirective.restoreInputTextValueToPreviousState();
    }
    this.#closeDropdown();
  }

  public handleKeydown(event: KeyboardEvent): void {
    /* Sanity check */
    /* istanbul ignore else */
    if (event.key) {
      const key = event.key.toLowerCase();
      const activeElement = this.#getActiveElement();
      const activeElementId = activeElement?.id;
      const targetIsSearchResult = this.searchResults.find(
        (r) => r.elementId === activeElementId,
      );

      switch (key) {
        case 'enter':
          if (targetIsSearchResult) {
            this.#selectSearchResultById(activeElementId);

            if (!this.showActionsArea && !this.dropdownHintText) {
              this.#closeDropdown();
            } else {
              this.#resetSearch();
            }
          } else {
            if (activeElement) {
              activeElement.dispatchEvent(new MouseEvent('click'));
            }
          }

          event.preventDefault();
          event.stopPropagation();
          break;

        case 'tab':
          if (targetIsSearchResult) {
            this.#selectSearchResultById(activeElementId);
          } else {
            if (this.inputDirective) {
              this.inputDirective.restoreInputTextValueToPreviousState();
            }
          }

          this.#closeDropdown();
          break;

        case 'escape':
          this.#closeDropdown();
          break;

        case 'arrowdown':
        case 'down':
          this.#removeFocusedClass();
          if (
            this.#activeElementIndex ===
              this.#overlayFocusableElements.length - 1 ||
            this.#activeElementIndex === -1
          ) {
            this.#activeElementIndex = 0;
          } else {
            this.#activeElementIndex = this.#activeElementIndex + 1;
          }
          this.#addFocusedClass();
          this.#changeDetector.markForCheck();
          event.preventDefault();
          event.stopPropagation();
          break;

        case 'arrowup':
        case 'up':
          this.#removeFocusedClass();
          if (this.#activeElementIndex <= 0) {
            this.#activeElementIndex =
              this.#overlayFocusableElements.length - 1;
          } else {
            this.#activeElementIndex = this.#activeElementIndex - 1;
          }
          this.#addFocusedClass();
          this.#changeDetector.markForCheck();
          event.preventDefault();
          event.stopPropagation();
          break;
      }
    }
  }

  #announceResults(): void {
    this.#libResourceService
      .getStrings({
        noResults: 'skyux_autocomplete_no_results',
        singleCountResult: 'skyux_autocomplete_one_result',
        multipleCountResults: [
          'skyux_autocomplete_multiple_results',
          this.searchResultsCount,
        ],
      })
      .pipe(take(1))
      .subscribe((localizedStrings) => {
        let announcementString = '';
        if (this.searchResultsCount && this.searchResultsCount > 0) {
          announcementString =
            this.searchResultsCount === 1
              ? localizedStrings.singleCountResult
              : localizedStrings.multipleCountResults;
          this.#liveAnnounceService.announce(announcementString);
        } else if (this.searchResultsCount === 0) {
          this.#liveAnnounceService.announce(localizedStrings.noResults);
        }
      });
  }

  public moreButtonClicked(): void {
    this.showMoreClick.emit({ inputValue: this.searchText });
    if (this.inputDirective) {
      this.inputDirective.restoreInputTextValueToPreviousState();
    }
    this.#closeDropdown();
  }

  public onResultClick(id: string, event: MouseEvent): void {
    this.#selectSearchResultById(id);

    if (!this.showActionsArea && !this.dropdownHintText) {
      this.#closeDropdown();
    } else {
      this.#resetSearch();
    }

    event.preventDefault();
    event.stopPropagation();
  }

  public onResultMouseMove(id: number): void {
    if (id !== this.#activeElementIndex) {
      this.#removeFocusedClass();
      this.#activeElementIndex = id;
      this.#addFocusedClass();
      this.#changeDetector.markForCheck();
    }
  }

  public isElementFocused(ref: HTMLElement): boolean {
    return ref === this.#overlayFocusableElements[this.#activeElementIndex];
  }

  #searchTextChanged(searchText: string | undefined): void {
    if (this.#hasFocus) {
      this.#openDropdown();
      if (!searchText?.trim() && this.searchTextMinimumCharacters !== 0) {
        this.#handleEmptySearchText();
        return;
      }

      const trimmedSearchText = searchText?.trim() || '';
      const isLongEnough =
        trimmedSearchText.length >= this.searchTextMinimumCharacters;
      const isDifferent =
        searchText !== this.searchText ||
        (this.searchText === '' && this.searchTextMinimumCharacters === 0);

      this.searchText = trimmedSearchText.trim();
      this.#updateIsResultsVisible();

      if (isLongEnough && isDifferent) {
        this.#performSearchAndUpdateResults();
      } else {
        this.isSearchingAsync = false;
        this.#changeDetector.markForCheck();
      }
    } else {
      this.isSearchingAsync = false;
    }
  }

  #handleEmptySearchText(): void {
    // Emit selectionChange if value has been cleared.
    if (this.inputDirective && this.inputDirective.value) {
      this.inputDirective.value = undefined;
      this.selectionChange.emit({ selectedItem: undefined });
    }

    if (!this.showActionsArea && !this.dropdownHintText) {
      this.#closeDropdown();
    } else {
      this.#resetSearch();
    }

    this.isSearchingAsync = false;
    this.#changeDetector.markForCheck();
  }

  // anchor
  #performSearchAndUpdateResults(): void {
    this.#cancelCurrentSearch();

    this.#currentSearchSub = this.#performSearch().subscribe({
      next: (result) => {
        const items = (
          result?.items as Record<string, unknown>[] | undefined
        )?.filter((item) => {
          return item && this.descriptorProperty in item;
        });

        this.searchResults =
          items?.map((r, i) => {
            const result: SkyAutocompleteSearchResult = {
              elementId: `${this.resultsListId}-item-${i}`,
              data: r,
            };
            return result;
          }) || [];

        this.searchResultsCount = result?.totalCount || 0;

        this.#displayResultsDropdown();
      },
      complete: () => {
        this.isSearchingAsync = false;
        this.#changeDetector.markForCheck();
      },
    });
  }

  #displayResultsDropdown(): void {
    this.highlightText = this.#getHighlightText(this.searchText);
    this.#removeFocusedClass();
    this.#removeActiveDescendant();
    if (this.searchResults.length > 0) {
      this.#activeElementIndex = 0;
    } else {
      this.#activeElementIndex = -1;
    }

    this.#updateIsResultsVisible();
    this.#changeDetector.markForCheck();

    // Safety check
    /* istanbul ignore else */
    if (this.isOpen) {
      // Let the results populate in the DOM before recalculating placement.
      setTimeout(() => {
        if (this.#affixer) {
          this.#affixer.reaffix();
          this.#changeDetector.detectChanges();
          this.#initOverlayFocusableElements();
        }
      });
    } else {
      this.#openDropdown();
      this.#changeDetector.markForCheck();
    }
  }

  #performSearch(): Observable<SkyAutocompleteSearchAsyncResult | undefined> {
    if (!this.searchAsyncDisabled && this.searchAsync.observers.length > 0) {
      const searchAsyncArgs: SkyAutocompleteSearchAsyncArgs = {
        displayType: 'popover',
        offset: 0,
        searchText: this.searchText,
      };

      this.searchAsync.emit(searchAsyncArgs);

      return this.allowAnyValue()
        ? this.#combineSearchTextWithResult(searchAsyncArgs)
        : searchAsyncArgs.result?.pipe(take(1)) || of(undefined);
    }

    const result = this.searchOrDefault(this.searchText, this.data, {
      context: 'popover',
    });

    if (result instanceof Array) {
      return of({ items: result, totalCount: result.length });
    }

    return from(result).pipe(
      map((items) => {
        return { items, totalCount: items.length };
      }),
    );
  }

  #combineSearchTextWithResult(
    searchAsyncArgs: SkyAutocompleteSearchAsyncArgs,
  ): Observable<SkyAutocompleteSearchAsyncResult> {
    const searchTextItem = { [this.descriptorProperty]: this.searchText };
    const searchTextResult = { items: [searchTextItem], totalCount: 1 };

    if (searchAsyncArgs.result) {
      return searchAsyncArgs.result.pipe(
        take(1),
        map((result) => {
          if (
            (result.items as Record<string, string>[]).some(
              (item) => item[this.descriptorProperty] === this.searchText,
            )
          ) {
            return result;
          }

          // Include a result for the current search text as the first option
          // if no exact match is found in the results.
          return { ...result, items: [searchTextItem, ...result.items] };
        }),
        // Display the current search text immediately while async results load.
        startWith<SkyAutocompleteSearchAsyncResult>(searchTextResult),
      );
    }

    return of(searchTextResult);
  }

  #cancelCurrentSearch(): void {
    if (this.#currentSearchSub) {
      this.#currentSearchSub.unsubscribe();
      this.#currentSearchSub = undefined;
    }
  }

  /**
   * Returns the text to highlight based on exact matches, case-insensitive matches, and matches for corresponding diacritical characters (a will match à).
   */
  #getHighlightText(searchText: string): string[] {
    if (this.highlightSearchText()) {
      const normalizedSearchText = normalizeDiacritics(searchText)
        .toLocaleUpperCase()
        .trim();
      if (!normalizedSearchText) {
        return [];
      }

      let matchesToHighlight: string[] = [];
      for (let i = 0, n = this.searchResults.length; i < n; i++) {
        const value = this.searchResults[i].data[this.descriptorProperty]
          .toString()
          .toLocaleUpperCase() as string;
        const normalizedDataValue = normalizeDiacritics(value);

        let offset = 0;
        let index: number;
        while (
          (index = normalizedDataValue.indexOf(normalizedSearchText, offset)) >
          -1
        ) {
          const matchedString = value.slice(index, index + searchText.length);
          offset = index + searchText.length;
          matchesToHighlight = matchesToHighlight.concat(matchedString);
        }
      }

      // Remove any duplicates from the array.
      return [...new Set(matchesToHighlight)];
    }

    return [];
  }

  #selectSearchResultById(id: string): void {
    const result = this.searchResults.find((r) => r.elementId === id);
    /* istanbul ignore else */
    if (result) {
      const data = result.data;
      this.searchText = data[this.descriptorProperty];
      if (this.inputDirective) {
        this.inputDirective.value = data;
      }
      this.selectionChange.emit({ selectedItem: data });
    }
  }

  #openDropdown(): void {
    if (!this.#overlay && this.resultsTemplateRef) {
      const overlay = this.#overlayService.create({
        enableClose: false,
        enablePointerEvents: true,
        environmentInjector: this.#environmentInjector,
        wrapperClass: this.wrapperClass,
      });

      if (this.#zIndex) {
        this.#zIndex.pipe(takeUntil(overlay.closed)).subscribe((zIndex) => {
          overlay.componentRef.instance.zIndex = zIndex.toString(10);
        });
      }

      overlay.attachTemplate(this.resultsTemplateRef);

      this.#overlay = overlay;
      this.isOpen = true;
      this.#updateIsResultsVisible();
      this.#changeDetector.markForCheck();
      this.#updateAriaControls();
      this.#initOverlayFocusableElements();
      this.#announceResults();
      this.openChange.emit(true);
    }
  }

  #closeDropdown(): void {
    this.#resetSearch();
    this.isOpen = false;
    this.#destroyOverlay();
    this.#removeActiveDescendant();
    this.#updateAriaControls();
    this.#changeDetector.markForCheck();
    this.openChange.emit(false);
  }

  #setActiveDescendant(): void {
    const activeElement =
      this.#overlayFocusableElements[this.#activeElementIndex];
    /* Sanity check */
    /* istanbul ignore else */
    if (activeElement && this.inputDirective) {
      this.inputDirective.setActiveDescendant(activeElement.id);
    }
  }

  #removeActiveDescendant(): void {
    if (this.inputDirective) {
      this.inputDirective.setActiveDescendant(null);
    }
  }

  #updateAriaControls(): void {
    if (this.inputDirective) {
      this.inputDirective.setAriaControls(this.#overlay?.id || null);
    }
  }

  #resetSearch(): void {
    this.searchResults = [];
    this.searchText = '';
    this.highlightText = [];
    this.#removeFocusedClass();
    this.#activeElementIndex = -1;
    this.searchResultsCount = undefined;
    this.#removeActiveDescendant();
    this.#initOverlayFocusableElements();
    this.#updateIsResultsVisible();
    this.#changeDetector.markForCheck();
  }

  #addInputEventListeners(): void {
    const element = this.#elementRef.nativeElement;

    observableFromEvent<KeyboardEvent>(element, 'keydown')
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((event) => {
        this.handleKeydown(event);
      });

    observableFromEvent(window, 'resize')
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        /* istanbul ignore else */
        if (this.isOpen && this.resultsRef) {
          this.#adapterService.setDropdownWidth(
            this.#elementRef,
            this.resultsRef,
            !!this.#inputBoxHostSvc,
          );
        }
      });
  }

  #destroyOverlay(): void {
    if (this.#overlay) {
      this.#overlayService.close(this.#overlay);
      this.#overlay = undefined;
    }
  }

  #createAffixer(): void {
    /* Sanity check */
    /* istanbul ignore else */
    if (!this.#affixer && this.resultsRef) {
      const affixer = this.#affixService.createAffixer(this.resultsRef);

      this.#adapterService.setDropdownWidth(
        this.#elementRef,
        this.resultsRef,
        !!this.#inputBoxHostSvc,
      );

      affixer.affixTo(this.#elementRef.nativeElement, {
        autoFitContext: SkyAffixAutoFitContext.Viewport,
        enableAutoFit: true,
        isSticky: true,
        placement: 'below',
        horizontalAlignment: 'left',
      });

      this.#affixer = affixer;
    }
  }

  #destroyAffixer(): void {
    if (this.#affixer) {
      this.#affixer.destroy();
      this.#affixer = undefined;
    }
  }

  #initMessageStream(): void {
    if (this.#messageStreamSub) {
      this.#messageStreamSub.unsubscribe();
      this.#messageStreamSub = undefined;
    }

    this.#messageStreamSub = this.messageStream
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((message) => {
        switch (message.type) {
          case SkyAutocompleteMessageType.CloseDropdown:
            this.#closeDropdown();
            break;
          case SkyAutocompleteMessageType.RepositionDropdown:
            // Settimeout waits for changes in DOM (e.g., tokens being removed)
            setTimeout(() => {
              /* istanbul ignore else */
              if (this.#affixer) {
                this.#affixer.reaffix();
              }
            });
            break;
        }
      });
  }

  #initOverlayFocusableElements(): void {
    // Wait for dropdown elements to render.
    setTimeout(() => {
      if (this.#overlay) {
        this.#overlayFocusableElements =
          this.#adapterService.getOverlayFocusableElements(this.#overlay);
        this.#overlayFocusableElements.forEach((el) => {
          this.#adapterService.setTabIndex(el, -1);
        });
        this.#addFocusedClass();
        this.#announceResults();
      }
    });
  }

  #getActiveElement(): HTMLElement {
    return this.#overlayFocusableElements[this.#activeElementIndex];
  }

  #removeFocusedClass(): void {
    if (this.#activeElementIndex > -1) {
      this.#adapterService.removeCSSClass(
        this.#overlayFocusableElements[this.#activeElementIndex],
        'sky-autocomplete-descendant-focus',
      );
    }
  }

  #addFocusedClass(): void {
    if (this.#activeElementIndex > -1) {
      this.#adapterService.addCSSClass(
        this.#overlayFocusableElements[this.#activeElementIndex],
        'sky-autocomplete-descendant-focus',
      );
      this.#setActiveDescendant();
    }
  }

  #updateDefaultSearchOptions(): void {
    // Reset default search if it is what is being used.
    if (this.search !== this.searchOrDefault) {
      this.searchOrDefault = skyAutocompleteDefaultSearchFunction({
        propertiesToSearch: this.propertiesToSearch,
        searchFilters: this.searchFilters,
      });
    }
  }

  #updateIsResultsVisible(): void {
    const isResultsVisible =
      (!!this.searchText || this.searchTextMinimumCharacters === 0) &&
      (!this.showActionsArea || this.searchResults.length > 0);
    if (isResultsVisible !== this.#isResultsVisible.getValue()) {
      this.#isResultsVisible.next(isResultsVisible);
    }
  }
}
