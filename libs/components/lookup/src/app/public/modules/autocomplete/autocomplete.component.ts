import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';

import {
  SkyAffixAutoFitContext,
  SkyAffixer,
  SkyAffixService,
  SkyOverlayInstance,
  SkyOverlayService
} from '@skyux/core';

import {
  fromEvent as observableFromEvent,
  Subject
} from 'rxjs';

import {
  debounceTime,
  takeUntil
} from 'rxjs/operators';

import {
  SkyAutocompleteSearchFunction
} from './types/autocomplete-search-function';

import {
  SkyAutocompleteSearchFunctionFilter
} from './types/autocomplete-search-function-filter';

import {
  SkyAutocompleteSelectionChange
} from './types/autocomplete-selection-change';

import { SkyAutocompleteAdapterService } from './autocomplete-adapter.service';
import { SkyAutocompleteInputDirective } from './autocomplete-input.directive';
import { skyAutocompleteDefaultSearchFunction } from './autocomplete-default-search-function';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyAutocompleteComponent
  implements OnDestroy, AfterContentInit, AfterViewInit {

  //#region public_api

/**
 * Identifies the element that defines a label for the text input.
 */
  @Input()
  public ariaLabelledBy: string;

/**
 * Specifies a static data source for the autocomplete component to search
 * when users enter text. For a dynamic data source such as an array that
 * changes due to server calls, use the `search` property instead.
 */
  @Input()
  public set data(value: any[]) {
    this._data = value;
  }

  public get data(): any[] {
    return this._data || [];
  }

/**
 * Specifies how many milliseconds to wait before searching while users
 * enter text in the autocomplete field.
 * @default 0
 */
  @Input()
  public set debounceTime(value: number) {
    this._debounceTime = value;
  }

  public get debounceTime(): number {
    return this._debounceTime || 0;
  }

/**
 * Specifies an object property to display in the text input after users
 * select an item in the dropdown list.
 * @default name
 */
  @Input()
  public set descriptorProperty(value: string) {
    this._descriptorProperty = value;
  }

  public get descriptorProperty(): string {
    return this._descriptorProperty || 'name';
  }

/**
 * Specifies the object properties to search.
 * @default ['name']
 */
  @Input()
  public set propertiesToSearch(value: string[]) {
    this._propertiesToSearch = value;
  }

  public get propertiesToSearch(): string[] {
    return this._propertiesToSearch || ['name'];
  }

/**
 * Specifies a function to dynamically manage the data source when users
 * change the text in the autocomplete field. The search function must return
 * an array or a promise of an array. The `search` property is particularly
 * useful when the data source does not live in the source code.
 */
  @Input()
  public set search(value: SkyAutocompleteSearchFunction) {
    this._search = value;
  }

  public get search(): SkyAutocompleteSearchFunction {
    return this._search || skyAutocompleteDefaultSearchFunction({
      propertiesToSearch: this.propertiesToSearch,
      searchFilters: this.searchFilters,
      searchResultsLimit: this.searchResultsLimit
    });
  }

/**
 * Specifies a template to format each search result in the dropdown list.
 * The autocomplete component injects search result values into the template
 * as `item` variables that reference all of the object properties of the search results.
 */
  @Input()
  public set searchResultTemplate(value: TemplateRef<any>) {
    this._searchResultTemplate = value;
  }

  public get searchResultTemplate(): TemplateRef<any> {
    return this._searchResultTemplate || this.defaultSearchResultTemplate;
  }

/**
 * Specifies the minimum number of characters that users must enter before
 * the autocomplete component searches the data source and displays search
 * results in the dropdown list.
 * @default 1
 */
  @Input()
  public set searchTextMinimumCharacters(value: number) {
    this._searchTextMinimumCharacters = value;
  }

  public get searchTextMinimumCharacters(): number {
    return (this._searchTextMinimumCharacters > 0)
      ? this._searchTextMinimumCharacters : 1;
  }

/**
 * Specifies an array of functions to call against each search result in order
 * to filter the search results when using the default search function. When
 * using the `search` property to specify a custom search function, you must
 * manually apply filters inside that function. The function must return `true`
 * or `false` for each result to indicate whether to display it in the dropdown list.
 */
  @Input()
  public searchFilters: SkyAutocompleteSearchFunctionFilter[];

/**
 * Specifies the maximum number of search results to display in the dropdown list.
 * By default, the component displays all matching results.
 */
  @Input()
  public searchResultsLimit: number;

/**
 * Specifies the text to play when no search results are found.
 * @default No matching items found
 */
  @Input()
  public noResultsFoundText: string;

/**
 * Fires when users select items in the dropdown list.
 */
  @Output()
  public get selectionChange(): EventEmitter<SkyAutocompleteSelectionChange> {
    return this._selectionChange;
  }

  //#endregion

  //#region template_properties

  public get searchResults(): SkyAutocompleteSearchResult[] {
    return this._searchResults || [];
  }

  public get highlightText(): string {
    return this._highlightText || '';
  }

  public isOpen: boolean = false;

  public resultsListId: string;

  public resultsWrapperId: string;

  //#endregion

  @ViewChild('defaultSearchResultTemplate', {
    read: TemplateRef,
    static: false
  })
  private defaultSearchResultTemplate: TemplateRef<any>;

  @ContentChild(SkyAutocompleteInputDirective)
  private inputDirective: SkyAutocompleteInputDirective;

  @ViewChild('resultsTemplateRef', {
    read: TemplateRef
  })
  private resultsTemplateRef: TemplateRef<any>;

  @ViewChild('resultsRef', {
    read: ElementRef
  })
  private set resultsRef(value: ElementRef) {
    if (value) {
      this._resultsRef = value;
      this.destroyAffixer();
      this.createAffixer();
    }
  }

  private get resultsRef(): ElementRef {
    return this._resultsRef;
  }

  private affixer: SkyAffixer;

  private ngUnsubscribe = new Subject();

  private overlay: SkyOverlayInstance;

  private searchResultsIndex = 0;

  private searchText: string;

  private _data: any[];
  private _debounceTime: number;
  private _descriptorProperty: string;
  private _highlightText: string;
  private _propertiesToSearch: string[];
  private _resultsRef: ElementRef;
  private _search: SkyAutocompleteSearchFunction;
  private _searchResults: SkyAutocompleteSearchResult[];
  private _searchResultTemplate: TemplateRef<any>;
  private _searchTextMinimumCharacters: number;
  private _selectionChange = new EventEmitter<SkyAutocompleteSelectionChange>();

  constructor(
    private changeDetector: ChangeDetectorRef,
    private elementRef: ElementRef,
    private affixService: SkyAffixService,
    private adapterService: SkyAutocompleteAdapterService,
    private overlayService: SkyOverlayService
  ) {
    const id = ++uniqueId;
    this.resultsListId = `sky-autocomplete-list-${id}`;
    this.resultsWrapperId = `sky-autocomplete-wrapper-${id}`;
  }

  public ngAfterContentInit(): void {
    if (!this.inputDirective) {
      throw Error([
        'The SkyAutocompleteComponent requires a ContentChild input or',
        'textarea bound with the SkyAutocomplete directive. For example:',
        '`<input type="text" skyAutocomplete>`.'
      ].join(' '));
    }

    this.inputDirective.displayWith = this.descriptorProperty;

    this.inputDirective.textChanges
      .pipe(
        takeUntil(this.ngUnsubscribe),
        debounceTime(this.debounceTime)
      )
      .subscribe((change) => {
        this.searchTextChanged(change.value);
      });

    this.inputDirective.blur
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => {
        this.searchText = '';
        this.closeDropdown();
      });

  }

  public ngAfterViewInit(): void {
    this.addInputEventListeners();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.ngUnsubscribe = undefined;
    this.destroyAffixer();
    this.destroyOverlay();
  }

  public onResultMouseDown(index: number): void {
    this.searchResultsIndex = index;
    this.selectActiveSearchResult();
    this.closeDropdown();
  }

  public isResultFocused(index: number): boolean {
    return index === this.searchResultsIndex;
  }

  private searchTextChanged(searchText: string): void {
    const isEmpty = (!searchText || !searchText.trim() || searchText.match(/^\s+$/));

    if (isEmpty) {
      // Emit selectionChange if value has been cleared.
      if (this.inputDirective.value) {
        this.inputDirective.value = undefined;
        this.selectionChange.emit({
          selectedItem: undefined
        });
      }

      this.searchText = '';
      this.closeDropdown();
      return;
    }

    const isLongEnough = (searchText.length >= this.searchTextMinimumCharacters);
    const isDifferent = (searchText !== this.searchText);

    this.searchText = searchText.trim();

    if (isLongEnough && isDifferent) {
      this.performSearch().then((results: any[]) => {
        this._searchResults = results.map((r, i) => {
          const result: SkyAutocompleteSearchResult = {
            elementId: `${this.resultsListId}-item-${i}`,
            data: r
          };
          return result;
        });

        this._highlightText = this.searchText;

        if (this.isOpen) {
          // Let the results populate in the DOM before recalculating placement.
          setTimeout(() => {
            this.affixer.reaffix();
          });
        } else {
          this.openDropdown();
        }

        this.changeDetector.markForCheck();
      });
    }
  }

  private performSearch(): Promise<any> {
    const result = this.search(this.searchText, this.data);

    if (result instanceof Array) {
      return Promise.resolve(result);
    }

    return result;
  }

  private selectActiveSearchResult(): void {
    /* istanbul ignore else */
    if (this.hasSearchResults()) {
      const result = this.searchResults[this.searchResultsIndex].data;
      this.searchText = result[this.descriptorProperty];
      this.inputDirective.value = result;
      this.selectionChange.emit({
        selectedItem: result
      });
    }
  }

  private openDropdown(): void {
    const overlay = this.overlayService.create({
      enableClose: false,
      enablePointerEvents: true
    });

    overlay.attachTemplate(this.resultsTemplateRef);

    this.overlay = overlay;
    this.isOpen = true;
    this.setActiveDescendant();
    this.changeDetector.markForCheck();
  }

  private closeDropdown(): void {
    this._searchResults = [];
    this._highlightText = '';
    this.searchResultsIndex = 0;
    this.isOpen = false;
    this.destroyOverlay();
    this.setActiveDescendant();
    this.changeDetector.markForCheck();
  }

  private hasSearchResults(): boolean {
    return (this.searchResults && this.searchResults.length > 0);
  }

  private setActiveDescendant(): void {
    if (this.searchResults.length > 0) {
      this.inputDirective.setActiveDescendant(
        this.searchResults[this.searchResultsIndex].elementId
      );
    } else {
      /* tslint:disable-next-line:no-null-keyword */
      this.inputDirective.setActiveDescendant(null);
    }
  }

  private addInputEventListeners(): void {
    const element = this.elementRef.nativeElement;

    observableFromEvent(element, 'keydown')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((event: KeyboardEvent) => {
        if (event.key) {
          const key = event.key.toLowerCase();

          /* tslint:disable-next-line:switch-default */
          switch (key) {
            case 'enter':
              this.selectActiveSearchResult();
              this.closeDropdown();
              event.preventDefault();
              event.stopPropagation();
              break;

            case 'tab':
              this.selectActiveSearchResult();
              this.closeDropdown();
              break;

            case 'escape':
              this.closeDropdown();
              break;

            case 'arrowdown':
            case 'down':
              this.searchResultsIndex++;
              if (this.searchResultsIndex > this.searchResults.length - 1) {
                this.searchResultsIndex = 0;
              }
              this.setActiveDescendant();
              this.changeDetector.markForCheck();
              event.preventDefault();
              event.stopPropagation();
              break;

            case 'arrowup':
            case 'up':
              this.searchResultsIndex--;
              if (this.searchResultsIndex < 0) {
                this.searchResultsIndex = this.searchResults.length - 1;
              }
              this.setActiveDescendant();
              this.changeDetector.markForCheck();
              event.preventDefault();
              event.stopPropagation();
              break;
          }
        }
      });

    observableFromEvent(window, 'resize')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        /* istanbul ignore else */
        if (this.isOpen) {
          this.adapterService.setDropdownWidth(this.elementRef, this.resultsRef);
        }
      });
  }

  private destroyOverlay(): void {
    if (this.overlay) {
      this.overlayService.close(this.overlay);
      this.overlay = undefined;
    }
  }

  private createAffixer(): void {
    const affixer = this.affixService.createAffixer(this.resultsRef);

    this.adapterService.setDropdownWidth(this.elementRef, this.resultsRef);

    affixer.affixTo(this.elementRef.nativeElement, {
      autoFitContext: SkyAffixAutoFitContext.Viewport,
      enableAutoFit: true,
      isSticky: true,
      placement: 'below',
      horizontalAlignment: 'left'
    });

    this.affixer = affixer;
  }

  private destroyAffixer(): void {
    if (this.affixer) {
      this.affixer.destroy();
      this.affixer = undefined;
    }
  }

}
