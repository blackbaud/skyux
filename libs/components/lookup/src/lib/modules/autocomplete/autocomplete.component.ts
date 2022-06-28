import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Optional,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  SkyAffixAutoFitContext,
  SkyAffixService,
  SkyAffixer,
  SkyOverlayInstance,
  SkyOverlayService,
} from '@skyux/core';
import { SkyInputBoxHostService } from '@skyux/forms';

import {
  Observable,
  Subject,
  Subscription,
  from,
  fromEvent as observableFromEvent,
  of,
} from 'rxjs';
import { debounceTime, map, switchMap, take, takeUntil } from 'rxjs/operators';

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
})
export class SkyAutocompleteComponent implements OnDestroy, AfterViewInit {
  //#region public_api

  /**
   * Specifies the HTML element ID (without the leading `#`) of the element that labels
   * the autocomplete text input. This sets the input's `aria-labelledby` attribute
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   */
  @Input()
  public ariaLabelledBy: string | undefined;

  /**
   * Specifies a static data source for the autocomplete component to search
   * when users enter text. For a dynamic data source such as an array that
   * changes due to server calls, use `search` or `searchAsync` instead.
   */
  @Input()
  public set data(value: any[]) {
    this.#_data = value;
  }

  public get data(): any[] {
    return this.#_data || [];
  }

  /**
   * Specifies how many milliseconds to wait before searching while users
   * enter text in the autocomplete field.
   * @default 0
   */
  @Input()
  public set debounceTime(value: number) {
    this.#_debounceTime = value;
  }

  public get debounceTime(): number {
    return this.#_debounceTime || 0;
  }

  /**
   * Specifies an object property to display in the text input after users
   * select an item in the dropdown list.
   * @default "name"
   */
  @Input()
  public set descriptorProperty(value: string) {
    this.#_descriptorProperty = value;
  }

  public get descriptorProperty(): string {
    return this.#_descriptorProperty || 'name';
  }

  /**
   * @internal
   * Indicates whether to display a button in the dropdown that opens a picker where users can view all options.
   */
  @Input()
  public enableShowMore = false;

  /**
   * Specifies an observable of `SkyAutocompleteMessage` that can close the dropdown.
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
  public wrapperClass?: string;

  /**
   * Specifies the object properties to search.
   * @default ["name"]
   */
  @Input()
  public set propertiesToSearch(value: string[]) {
    this.#_propertiesToSearch = value;
  }

  public get propertiesToSearch(): string[] {
    return this.#_propertiesToSearch || ['name'];
  }

  /**
   * Specifies a function to dynamically manage the data source when users
   * change the text in the autocomplete field. The search function must return
   * an array or a promise of an array. The `search` property is particularly
   * useful when the data source does not live in the source code. If the
   * search requires calling a remote data source, use `searchAsync` instead of
   * `search`.
   */
  @Input()
  public set search(value: SkyAutocompleteSearchFunction) {
    this.#_search = value;
  }

  public get search(): SkyAutocompleteSearchFunction {
    return (
      this.#_search ||
      skyAutocompleteDefaultSearchFunction({
        propertiesToSearch: this.propertiesToSearch,
        searchFilters: this.searchFilters,
      })
    );
  }

  /**
   * Specifies a template to format each search result in the dropdown list.
   * The autocomplete component injects search result values into the template
   * as `item` variables that reference all of the object properties of the search results.
   */
  @Input()
  public set searchResultTemplate(value: TemplateRef<unknown>) {
    this.#_searchResultTemplate = value;
  }

  public get searchResultTemplate(): TemplateRef<unknown> {
    return this.#_searchResultTemplate || this.defaultSearchResultTemplate;
  }

  /**
   * Specifies the minimum number of characters that users must enter before
   * the autocomplete component searches the data source and displays search
   * results in the dropdown list.
   * @default 1
   */
  @Input()
  public set searchTextMinimumCharacters(value: number | undefined) {
    this.#_searchTextMinimumCharacters = value;
  }

  public get searchTextMinimumCharacters(): number {
    return this.#_searchTextMinimumCharacters &&
      this.#_searchTextMinimumCharacters > 0
      ? this.#_searchTextMinimumCharacters
      : 1;
  }

  /**
   * Specifies an array of functions to call against each search result in order
   * to filter the search results when using the default search function. When
   * using the `search` property to specify a custom search function, you must
   * manually apply filters inside that function. The function must return `true`
   * or `false` for each result to indicate whether to display it in the dropdown list.
   */
  @Input()
  public searchFilters: SkyAutocompleteSearchFunctionFilter[] | undefined;

  /**
   * Specifies the maximum number of search results to display in the dropdown list.
   * By default, the component displays all matching results.
   */
  @Input()
  public set searchResultsLimit(value: number | undefined) {
    this.#_searchResultsLimit = value;
  }

  public get searchResultsLimit(): number | undefined {
    if (this.#_searchResultsLimit && this.#_searchResultsLimit > 0) {
      return this.#_searchResultsLimit;
    } else {
      return this.enableShowMore ? 5 : this.#_searchResultsLimit;
    }
  }

  /**
   * @internal
   * Indicates whether to display a button that lets users add options to the data source.
   */
  @Input()
  public showAddButton = false;

  /**
   * Specifies the text to display when no search results are found.
   * @default "No matches found"
   */
  @Input()
  public noResultsFoundText: string | undefined;

  /**
   * @internal
   * Allows async search to be disabled even when a listener is specified for
   * the `searchAsync` output.
   */
  @Input()
  public searchAsyncDisabled = false;

  /**
   * @internal
   * Fires when users select the button to add options to the data source.
   */
  @Output()
  public addClick: EventEmitter<void> = new EventEmitter();

  /**
   * @internal
   * Fires when users select the button to view all options.
   */
  @Output()
  public showMoreClick: EventEmitter<SkyAutocompleteShowMoreArgs> = new EventEmitter();

  /**
   * Fires when users select items in the dropdown list.
   */
  @Output()
  public get selectionChange(): EventEmitter<SkyAutocompleteSelectionChange> {
    return this.#_selectionChange;
  }

  /**
   * Fires when users enter new search information and allows results to be
   * returned via an observable.
   */
  @Output()
  public searchAsync = new EventEmitter<SkyAutocompleteSearchAsyncArgs>();

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

  public isOpen = false;

  public resultsListId: string;

  public resultsWrapperId: string;

  public searchText = '';

  public get showActionsArea(): boolean {
    return this.showAddButton || this.enableShowMore;
  }

  public isSearchingAsync = false;

  public searchResultsCount: number | undefined;

  //#endregion

  @ViewChild('defaultSearchResultTemplate', {
    read: TemplateRef,
    static: true,
  })
  private defaultSearchResultTemplate!: TemplateRef<unknown>;

  @ContentChild(SkyAutocompleteInputDirective)
  private set inputDirective(
    directive: SkyAutocompleteInputDirective | undefined
  ) {
    if (!directive) {
      throw Error(
        [
          'The SkyAutocompleteComponent requires a ContentChild input or',
          'textarea bound with the SkyAutocomplete directive. For example:',
          '`<input type="text" skyAutocomplete>`.',
        ].join(' ')
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
          })
        )
        .subscribe((change) => {
          this.#searchTextChanged(change.value);
        });

      this.#_inputDirective.blur
        .pipe(takeUntil(this.#inputDirectiveUnsubscribe))
        .subscribe(() => {
          directive.restoreInputTextValueToPreviousState();
          this.#closeDropdown();
          directive.onTouched();
        });

      this.#_inputDirective.focus
        .pipe(takeUntil(this.#inputDirectiveUnsubscribe))
        .subscribe(() => {
          if (this.showActionsArea) {
            this.#openDropdown();
          }
        });
    }
  }

  private get inputDirective(): SkyAutocompleteInputDirective {
    return this.#_inputDirective!;
  }

  @ViewChild('resultsTemplateRef', {
    read: TemplateRef,
  })
  private resultsTemplateRef!: TemplateRef<unknown>;

  @ViewChild('resultsRef', {
    read: ElementRef,
  })
  private set resultsRef(value: ElementRef | undefined) {
    if (value) {
      this.#_resultsRef = value;
      this.#destroyAffixer();
      this.#createAffixer();
    }
  }

  private get resultsRef(): ElementRef | undefined {
    return this.#_resultsRef;
  }

  /**
   * Index that indicates which descendant of the overlay currently has focus.
   */
  #activeElementIndex = -1;

  #affixer: SkyAffixer | undefined;

  #inputDirectiveUnsubscribe = new Subject<void>();

  #messageStreamSub: Subscription | undefined;

  #ngUnsubscribe = new Subject<void>();

  #overlay: SkyOverlayInstance | undefined;

  /**
   * Elements within the autocomplete dropdown that are focusable.
   * These are typically the search results and action buttons, but could also be
   * elements provided in the consumer's own template.
   */
  #overlayFocusableElements: HTMLElement[] = [];

  #currentSearchSub: Subscription | undefined;

  #_data: any[] | undefined;
  #_debounceTime: number | undefined;
  #_descriptorProperty: string | undefined;
  #_highlightText: string[] | undefined;
  #_inputDirective: SkyAutocompleteInputDirective | undefined;
  #_messageStream = new Subject<SkyAutocompleteMessage>();
  #_propertiesToSearch: string[] | undefined;
  #_resultsRef: ElementRef | undefined;
  #_search: SkyAutocompleteSearchFunction | undefined;
  #_searchResults: SkyAutocompleteSearchResult[] | undefined;
  #_searchResultTemplate: TemplateRef<unknown> | undefined;
  #_searchResultsLimit: number | undefined;
  #_searchTextMinimumCharacters: number | undefined;
  #_selectionChange = new EventEmitter<SkyAutocompleteSelectionChange>();

  constructor(
    private changeDetector: ChangeDetectorRef,
    private elementRef: ElementRef,
    private affixService: SkyAffixService,
    private adapterService: SkyAutocompleteAdapterService,
    private overlayService: SkyOverlayService,
    @Optional() private inputBoxHostSvc?: SkyInputBoxHostService
  ) {
    const id = ++uniqueId;
    this.resultsListId = `sky-autocomplete-list-${id}`;
    this.resultsWrapperId = `sky-autocomplete-wrapper-${id}`;
  }

  public ngAfterViewInit(): void {
    this.#addInputEventListeners();
  }

  public ngOnDestroy(): void {
    this.#cancelCurrentSearch();
    this.#inputDirectiveUnsubscribe.next();
    this.#inputDirectiveUnsubscribe.complete();
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
    this.#destroyAffixer();
    this.#destroyOverlay();
  }

  public addButtonClicked(): void {
    this.addClick.emit();
    this.inputDirective.restoreInputTextValueToPreviousState();
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
        (r) => r.elementId === activeElementId
      );

      switch (key) {
        case 'enter':
          if (targetIsSearchResult) {
            this.#selectSearchResultById(activeElementId);

            if (!this.showActionsArea) {
              this.#closeDropdown();
            } else {
              this.#resetSearch();
            }
          } else {
            if (activeElement) {
              activeElement.dispatchEvent(new MouseEvent('mousedown'));
            }
          }

          event.preventDefault();
          event.stopPropagation();
          break;

        case 'tab':
          if (targetIsSearchResult) {
            this.#selectSearchResultById(activeElementId);
          } else {
            this.inputDirective.restoreInputTextValueToPreviousState();
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
          this.changeDetector.markForCheck();
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
          this.changeDetector.markForCheck();
          event.preventDefault();
          event.stopPropagation();
          break;
      }
    }
  }

  public moreButtonClicked(): void {
    this.showMoreClick.emit({ inputValue: this.searchText });
    this.inputDirective.restoreInputTextValueToPreviousState();
    this.#closeDropdown();
  }

  public onResultMouseDown(id: string, event: MouseEvent): void {
    this.#selectSearchResultById(id);

    if (!this.showActionsArea) {
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
      this.changeDetector.markForCheck();
    }
  }

  public isElementFocused(ref: HTMLElement): boolean {
    return ref === this.#overlayFocusableElements[this.#activeElementIndex];
  }

  #searchTextChanged(searchText: string | undefined): void {
    const isEmpty =
      !searchText || !searchText.trim() || searchText.match(/^\s+$/);

    if (isEmpty) {
      // Emit selectionChange if value has been cleared.
      if (this.inputDirective.value) {
        this.inputDirective.value = undefined;
        this.selectionChange.emit({
          selectedItem: undefined,
        });
      }

      if (!this.showActionsArea) {
        this.#closeDropdown();
      } else {
        this.#resetSearch();
      }

      this.isSearchingAsync = false;
      this.changeDetector.markForCheck();

      return;
    }

    const isLongEnough = searchText.length >= this.searchTextMinimumCharacters;
    const isDifferent = searchText !== this.searchText;

    this.searchText = searchText.trim();

    if (isLongEnough && isDifferent) {
      this.#cancelCurrentSearch();

      this.#currentSearchSub = this.#performSearch()
        .pipe(take(1))
        .subscribe((result) => {
          const items = result.items.filter((item: any) => {
            return item && this.descriptorProperty in item;
          });

          this.isSearchingAsync = false;

          this.searchResults = items.map((r, i) => {
            const result: SkyAutocompleteSearchResult = {
              elementId: `${this.resultsListId}-item-${i}`,
              data: r,
            };
            return result;
          });

          this.searchResultsCount = result.totalCount;

          this.#_highlightText = this.#getHighlightText(this.searchText);
          this.#removeFocusedClass();
          this.#removeActiveDescendant();
          if (this.searchResults.length > 0) {
            this.#activeElementIndex = 0;
          } else {
            this.#activeElementIndex = -1;
          }

          this.changeDetector.markForCheck();

          if (this.isOpen) {
            // Let the results populate in the DOM before recalculating placement.
            setTimeout(() => {
              this.#affixer!.reaffix();
              this.changeDetector.detectChanges();
              this.#initOverlayFocusableElements();
            });
          } else {
            this.#openDropdown();
            this.changeDetector.markForCheck();
          }
        });
    } else {
      this.isSearchingAsync = false;
      this.changeDetector.markForCheck();
    }
  }

  #performSearch(): Observable<SkyAutocompleteSearchAsyncResult> {
    if (!this.searchAsyncDisabled && this.searchAsync.observers.length > 0) {
      const searchAsyncArgs: SkyAutocompleteSearchAsyncArgs = {
        displayType: 'popover',
        offset: 0,
        searchText: this.searchText,
      };

      this.searchAsync.emit(searchAsyncArgs);

      return searchAsyncArgs.result!;
    }

    const result = this.search(this.searchText, this.data);

    if (result instanceof Array) {
      return of({
        items: result,
        totalCount: result.length,
      });
    }

    return from(result).pipe(
      map((items) => {
        return {
          items,
          totalCount: items.length,
        };
      })
    );
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
        (index = normalizedDataValue.indexOf(normalizedSearchText, offset)) > -1
      ) {
        const matchedString = value.slice(index, index + searchText.length);
        offset = index + searchText.length;
        matchesToHighlight = matchesToHighlight.concat(matchedString);
      }
    }

    // Remove any duplicates from the array.
    return [...new Set(matchesToHighlight)];
  }

  #selectSearchResultById(id: string): void {
    const result = this.searchResults.find((r) => r.elementId === id);
    /* istanbul ignore else */
    if (result) {
      const data = result.data;
      this.searchText = data[this.descriptorProperty];
      this.inputDirective.value = data;
      this.selectionChange.emit({
        selectedItem: data,
      });
    }
  }

  #openDropdown(): void {
    if (!this.#overlay) {
      const overlay = this.overlayService.create({
        enableClose: false,
        enablePointerEvents: true,
        wrapperClass: this.wrapperClass,
      });

      overlay.attachTemplate(this.resultsTemplateRef);

      this.#overlay = overlay;
      this.isOpen = true;
      this.changeDetector.markForCheck();
      this.#initOverlayFocusableElements();
    }
  }

  #closeDropdown(): void {
    this.#resetSearch();
    this.isOpen = false;
    this.#destroyOverlay();
    this.#removeActiveDescendant();
    this.changeDetector.markForCheck();
  }

  #setActiveDescendant(): void {
    const activeElement =
      this.#overlayFocusableElements[this.#activeElementIndex];
    /* Sanity check */
    /* istanbul ignore else */
    if (activeElement) {
      this.inputDirective.setActiveDescendant(activeElement.id);
    }
  }

  #removeActiveDescendant(): void {
    this.inputDirective.setActiveDescendant(null);
  }

  #resetSearch(): void {
    this.searchResults = [];
    this.searchText = '';
    this.#_highlightText = [];
    this.#activeElementIndex = -1;
    this.searchResultsCount = undefined;
    this.#removeActiveDescendant();
    this.#initOverlayFocusableElements();
    this.changeDetector.markForCheck();
  }

  #addInputEventListeners(): void {
    const element = this.elementRef.nativeElement;

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
          this.adapterService.setDropdownWidth(
            this.elementRef,
            this.resultsRef,
            !!this.inputBoxHostSvc
          );
        }
      });
  }

  #destroyOverlay(): void {
    if (this.#overlay) {
      this.overlayService.close(this.#overlay);
      this.#overlay = undefined;
    }
  }

  #createAffixer(): void {
    /* Sanity check */
    /* istanbul ignore else */
    if (!this.#affixer && this.resultsRef) {
      const affixer = this.affixService.createAffixer(this.resultsRef);

      this.adapterService.setDropdownWidth(
        this.elementRef,
        this.resultsRef,
        !!this.inputBoxHostSvc
      );

      affixer.affixTo(this.elementRef.nativeElement, {
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

    this.#messageStreamSub = this.messageStream.subscribe((message) => {
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
          this.adapterService.getOverlayFocusableElements(this.#overlay);
        this.#overlayFocusableElements.forEach((el) => {
          this.adapterService.setTabIndex(el, -1);
        });
        this.#addFocusedClass();
      }
    });
  }

  #getActiveElement(): HTMLElement {
    return this.#overlayFocusableElements[this.#activeElementIndex];
  }

  #removeFocusedClass(): void {
    if (this.#activeElementIndex > -1) {
      this.adapterService.removeCSSClass(
        this.#overlayFocusableElements[this.#activeElementIndex],
        'sky-autocomplete-descendant-focus'
      );
    }
  }

  #addFocusedClass(): void {
    if (this.#activeElementIndex > -1) {
      this.adapterService.addCSSClass(
        this.#overlayFocusableElements[this.#activeElementIndex],
        'sky-autocomplete-descendant-focus'
      );
      this.#setActiveDescendant();
    }
  }
}
