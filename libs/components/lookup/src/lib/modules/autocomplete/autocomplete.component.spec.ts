import { ViewportRuler } from '@angular/cdk/overlay';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';
import { SKY_STACKING_CONTEXT, SkyLiveAnnouncerService } from '@skyux/core';

import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { SkyAutocompleteAdapterService } from './autocomplete-adapter.service';
import { SkyAutocompleteInputDirective } from './autocomplete-input.directive';
import { SkyAutocompleteComponent } from './autocomplete.component';
import { SkyAutocompleteFixturesModule } from './fixtures/autocomplete-fixtures.module';
import { SkyAutocompleteInputBoxFixtureComponent } from './fixtures/autocomplete-input-box.component.fixture';
import { SkyAutocompleteReactiveFixtureComponent } from './fixtures/autocomplete-reactive.component.fixture';
import { SkyAutocompleteFixtureComponent } from './fixtures/autocomplete.component.fixture';
import { SkyAutocompleteMessageType } from './types/autocomplete-message-type';
import { SkyAutocompleteSearchFunction } from './types/autocomplete-search-function';

/* spell-checker:ignore Åland */
describe('Autocomplete component', () => {
  //#region helpers

  function clickAddButton(): void {
    SkyAppTestUtility.fireDomEvent(getAddButton(), 'click');
  }

  function getAddButton(): HTMLElement {
    return document.querySelector(
      '.sky-autocomplete-action-add',
    ) as HTMLElement;
  }

  function getActionsContainer(): HTMLElement {
    return document.querySelector('.sky-autocomplete-actions') as HTMLElement;
  }

  function getAutocompleteElement(): HTMLElement {
    return document.querySelector('sky-autocomplete') as HTMLElement;
  }

  function getDisplayedHintText(): string {
    return (
      document
        .querySelector('.sky-autocomplete-dropdown-hint-text')
        ?.textContent.trim() || ''
    );
  }

  function getInputElement(async = false): HTMLInputElement {
    if (async) {
      return document.getElementById(
        'my-async-autocomplete-input',
      ) as HTMLInputElement;
    } else {
      return document.querySelector('input') as HTMLInputElement;
    }
  }

  function getSearchResultsContainer(): HTMLElement | null {
    return document.querySelector('.sky-autocomplete-results-container');
  }

  function getSearchResultsSection(): Element | null {
    return document.querySelector('.sky-autocomplete-results');
  }

  function getSearchResultItems(): NodeListOf<Element> {
    return document.querySelectorAll('.sky-autocomplete-result');
  }

  function clickShowMoreButton(): void {
    SkyAppTestUtility.fireDomEvent(getShowMoreButton(), 'click');
  }

  function getShowMoreButton(): HTMLElement {
    return document.querySelector(
      '.sky-autocomplete-action-more',
    ) as HTMLElement;
  }

  function getWaitWrapper(): HTMLElement | null {
    return document.querySelector<HTMLElement>(
      '.sky-autocomplete-results-waiting',
    );
  }

  function enterSearch(
    newValue: string,
    fixture: ComponentFixture<unknown>,
    async = false,
  ): void {
    const inputElement = getInputElement(async);
    inputElement.value = newValue;

    inputElement.focus();
    SkyAppTestUtility.fireDomEvent(inputElement, 'focus');
    SkyAppTestUtility.fireDomEvent(inputElement, 'input');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
  }

  function blurInput(
    element: HTMLInputElement,
    fixture: ComponentFixture<unknown>,
  ): void {
    (document.querySelector('#testButton') as HTMLElement).focus();
    fixture.detectChanges();
    tick();
    SkyAppTestUtility.fireDomEvent(element, 'blur');
    fixture.detectChanges();
    // Our blur listener has a delay of 25ms. This tick accounts for that.
    tick(25);
    fixture.detectChanges();
  }

  function searchAndSelect(
    newValue: string,
    index: number,
    fixture: ComponentFixture<unknown>,
  ): void {
    const inputElement = getInputElement();

    enterSearch(newValue, fixture);

    const searchResults = getSearchResultItems();

    // Note: the ordering of these events is important!
    SkyAppTestUtility.fireDomEvent(inputElement, 'change');
    SkyAppTestUtility.fireDomEvent(searchResults[index], 'click');
    blurInput(inputElement, fixture);
  }

  function sendArrowUp(
    element: HTMLElement,
    fixture: ComponentFixture<unknown>,
  ): void {
    SkyAppTestUtility.fireDomEvent(element, 'keydown', {
      keyboardEventInit: { key: 'ArrowUp' },
    });
    fixture.detectChanges();
    tick();
  }

  function sendArrowDown(
    element: HTMLElement,
    fixture: ComponentFixture<unknown>,
  ): void {
    SkyAppTestUtility.fireDomEvent(element, 'keydown', {
      keyboardEventInit: { key: 'ArrowDown' },
    });
    fixture.detectChanges();
    tick();
  }

  function sendEnter(
    element: HTMLElement,
    fixture: ComponentFixture<unknown>,
  ): void {
    SkyAppTestUtility.fireDomEvent(element, 'keydown', {
      keyboardEventInit: { key: 'Enter' },
    });
    fixture.detectChanges();
    tick();
  }

  function sendMouseMove(
    element: HTMLElement,
    fixture: ComponentFixture<unknown>,
  ): void {
    SkyAppTestUtility.fireDomEvent(element, 'mousemove');
    fixture.detectChanges();
    tick();
  }

  function sendTab(
    element: HTMLElement,
    fixture: ComponentFixture<unknown>,
    shiftKey?: boolean,
  ): void {
    SkyAppTestUtility.fireDomEvent(element, 'keydown', {
      keyboardEventInit: { key: 'Tab', shiftKey: shiftKey },
    });
    fixture.detectChanges();
    tick();
  }

  function sendEscape(
    element: HTMLElement,
    fixture: ComponentFixture<unknown>,
  ): void {
    SkyAppTestUtility.fireDomEvent(element, 'keydown', {
      keyboardEventInit: { key: 'Escape' },
    });
    fixture.detectChanges();
    tick();
  }

  function updateNgModel(
    fixture: ComponentFixture<SkyAutocompleteFixtureComponent>,
    selectedValue:
      | { objectid?: string; name?: string; text?: string }
      | undefined,
  ): void {
    fixture.componentInstance.model.favoriteColor = selectedValue;
    fixture.detectChanges();
    tick();
  }

  function getAdapterService(
    fixture: ComponentFixture<unknown>,
  ): SkyAutocompleteAdapterService {
    return fixture.debugElement
      .query(By.directive(SkyAutocompleteComponent))
      .injector.get(SkyAutocompleteAdapterService);
  }

  //#endregion

  describe('basic setup', () => {
    let fixture: ComponentFixture<SkyAutocompleteFixtureComponent>;
    let component: SkyAutocompleteFixtureComponent;
    let autocomplete: SkyAutocompleteComponent;
    let asyncAutocomplete: SkyAutocompleteComponent;
    let viewportRulerChange: Subject<Event>;

    beforeEach(() => {
      viewportRulerChange = new Subject();
      TestBed.configureTestingModule({
        imports: [SkyAutocompleteFixturesModule],
        providers: [
          {
            provide: SKY_STACKING_CONTEXT,
            useValue: { zIndex: new BehaviorSubject(10) },
          },
        ],
      });

      spyOn(ViewportRuler.prototype, 'change').and.returnValue(
        viewportRulerChange,
      );

      fixture = TestBed.createComponent(SkyAutocompleteFixtureComponent);
      component = fixture.componentInstance;
      autocomplete = component.autocomplete;
      asyncAutocomplete = component.asyncAutocomplete;
    });

    afterEach(() => {
      viewportRulerChange.complete();
      (
        TestBed.inject(SKY_STACKING_CONTEXT).zIndex as BehaviorSubject<number>
      ).complete();
      fixture.destroy();
    });

    it('should set defaults', () => {
      component.data = undefined;
      fixture.detectChanges();

      expect(autocomplete.data).toEqual([]);

      const inputElement: HTMLInputElement = getInputElement();

      expect(inputElement.getAttribute('autocomplete')).toEqual('off');
      expect(inputElement.getAttribute('autocapitalize')).toEqual('none');
      expect(inputElement.getAttribute('autocorrect')).toEqual('off');
      expect(inputElement.getAttribute('spellcheck')).toEqual('false');
      expect(inputElement).toHaveCssClass('sky-form-control');
      expect(autocomplete.debounceTime).toEqual(0);
      expect(autocomplete.descriptorProperty).toEqual('name');
      expect(autocomplete.highlightText).toEqual([]);
      expect(autocomplete.propertiesToSearch).toEqual(['name']);
      expect(autocomplete.searchOrDefault).toBeDefined();
      expect(autocomplete.searchFilters).toBeUndefined();
      expect(autocomplete.searchResults).toEqual([]);
      expect(autocomplete.searchResultsLimit).toBe(0);
      expect(autocomplete.searchResultTemplate).toBeUndefined();
      expect(autocomplete.searchTextMinimumCharacters).toEqual(1);
    });

    it('should be able to update autocomplete attribute', () => {
      component.autocompleteAttribute = 'new-custom-field';

      fixture.detectChanges();

      const inputElement: HTMLInputElement = getInputElement();

      expect(inputElement.getAttribute('autocomplete')).toEqual(
        'new-custom-field',
      );
    });

    it('should handle preselected values', fakeAsync(() => {
      const selectedValue = { name: 'Red' };
      component.model.favoriteColor = selectedValue;

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const input: SkyAutocompleteInputDirective = component.autocompleteInput;

      expect(component.myForm.value.favoriteColor).toEqual(selectedValue);
      expect(input.value).toEqual(selectedValue);
    }));

    it('should search', fakeAsync(() => {
      fixture.detectChanges();
      const spy = spyOn(autocomplete, 'searchOrDefault').and.callThrough();

      enterSearch('r', fixture);

      expect(spy.calls.argsFor(0)[0]).toEqual('r');
    }));

    it('should search async', fakeAsync(() => {
      fixture.detectChanges();
      const spy = spyOn(
        asyncAutocomplete.searchAsync,
        'emit',
      ).and.callThrough();

      enterSearch('r', fixture, true);

      expect(spy).toHaveBeenCalledWith({
        displayType: 'popover',
        offset: 0,
        searchText: 'r',
        result: jasmine.any(Observable),
      });

      tick(200);
      fixture.detectChanges();

      expect(asyncAutocomplete.searchResults.length).toEqual(6);
      expect(asyncAutocomplete.searchResults[0].data.name).toEqual('Red');
      expect(asyncAutocomplete.searchResults[1].data.name).toEqual('Green');
    }));

    it('should handle undefined result with async search', fakeAsync(() => {
      // Don't set the 'result' property.
      component.searchAsync = () => {};

      fixture.detectChanges();

      const spy = spyOn(
        asyncAutocomplete.searchAsync,
        'emit',
      ).and.callThrough();

      enterSearch('r', fixture, true);

      expect(spy).toHaveBeenCalledWith({
        displayType: 'popover',
        offset: 0,
        searchText: 'r',
      });

      tick(200);
      fixture.detectChanges();

      expect(asyncAutocomplete.searchResults.length).toEqual(0);
    }));

    it('should search against multiple properties', fakeAsync(() => {
      component.propertiesToSearch = ['name', 'objectid'];
      fixture.detectChanges();

      enterSearch('y', fixture);

      expect(autocomplete.searchResults.length).toEqual(2);
      expect(autocomplete.searchResults[0].data.name).toEqual('Yellow');
      // The letter 'y' is in the objectid of 'Turquoise':
      expect(autocomplete.searchResults[1].data.name).toEqual('Turquoise');
    }));

    it('should search with filters', fakeAsync(() => {
      fixture.detectChanges();

      enterSearch('r', fixture);

      // First, test that 'Red' is included in the results:
      let found = autocomplete.searchResults.find((result) => {
        return result.data.name === 'Red';
      });

      // The number of search results that contain the letter 'r':
      expect(autocomplete.searchResults.length).toEqual(6);
      expect(found).toBeDefined();

      fixture.destroy();

      // Now, setup a filter, removing 'Red' from the results.
      fixture = TestBed.createComponent(SkyAutocompleteFixtureComponent);
      component = fixture.componentInstance;
      autocomplete = fixture.componentInstance.autocomplete;

      fixture.componentInstance.searchFilters = [
        (
          searchText: string,
          item: { objectid: string; name?: string; text?: string },
        ): boolean => {
          return item.name !== 'Red';
        },
      ];

      fixture.detectChanges();

      enterSearch('r', fixture);

      found = autocomplete.searchResults.find((result) => {
        return result.data.name === 'Red';
      });

      expect(found).toBeUndefined();
      expect(autocomplete.searchResults.length).toEqual(5);
    }));

    it('should show a no results found message', fakeAsync(() => {
      const expectedMessage = 'No matches found';
      fixture.detectChanges();

      enterSearch('abcdefgh', fixture);

      const container = getSearchResultsSection();
      expect(container?.textContent?.trim()).toBe(expectedMessage);

      const actionsContainer = getActionsContainer();
      expect(actionsContainer).toBeNull();
    }));

    it('should show a dropdown hint message', fakeAsync(() => {
      const expectedMessage = 'Type to search for a person';
      component.dropdownHintText = expectedMessage;
      fixture.detectChanges();

      const inputElement = getInputElement();

      SkyAppTestUtility.fireDomEvent(inputElement, 'focus');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const hintText = getDisplayedHintText();
      expect(hintText).toBe(expectedMessage);

      const actionsContainer = getActionsContainer();
      expect(actionsContainer).toBeNull();
    }));

    it('should not show a dropdown hint message when no results are found', fakeAsync(() => {
      const expectedMessage = 'Type to search for a person';
      component.dropdownHintText = expectedMessage;
      fixture.detectChanges();

      const inputElement = getInputElement();

      SkyAppTestUtility.fireDomEvent(inputElement, 'focus');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      let hintText = getDisplayedHintText();
      expect(hintText).toBe(expectedMessage);

      let actionsContainer = getActionsContainer();
      expect(actionsContainer).toBeNull();

      enterSearch('abcdefgh', fixture);

      const container = getSearchResultsSection();
      expect(container?.textContent?.trim()).toBe('No matches found');

      actionsContainer = getActionsContainer();
      expect(actionsContainer).toBeNull();

      hintText = getDisplayedHintText();
      expect(hintText).toBe('');
    }));

    it('should not show a dropdown hint message when results are found', fakeAsync(() => {
      const expectedMessage = 'Type to search for a person';
      component.dropdownHintText = expectedMessage;
      fixture.detectChanges();

      const inputElement = getInputElement();

      SkyAppTestUtility.fireDomEvent(inputElement, 'focus');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      let hintText = getDisplayedHintText();
      expect(hintText).toBe(expectedMessage);

      const actionsContainer = getActionsContainer();
      expect(actionsContainer).toBeNull();

      const spy = spyOn(autocomplete, 'searchOrDefault').and.callThrough();

      enterSearch('r', fixture);

      expect(spy.calls.argsFor(0)[0]).toEqual('r');

      hintText = getDisplayedHintText();
      expect(hintText).toBe('');
    }));

    it('should show a no results found message in the actions area if the add button is shown', fakeAsync(() => {
      component.showAddButton = true;
      // NOTE: The "New" is from the "New" button
      const expectedMessage = 'No matches found  New';
      fixture.detectChanges();

      enterSearch('abcdefgh', fixture);

      const resultsContainer = getSearchResultsSection();
      expect(resultsContainer).toBeNull();

      const actionsContainer = getActionsContainer();
      expect(actionsContainer?.textContent?.trim()).toBe(expectedMessage);
    }));

    it('should show a no results found message in the actions area if the show more button is shown', fakeAsync(() => {
      component.enableShowMore = true;
      const expectedMessage = 'No matches found';
      fixture.detectChanges();

      enterSearch('abcdefgh', fixture);

      const resultsContainer = getSearchResultsSection();
      expect(resultsContainer).toBeNull();

      const actionsContainer = getActionsContainer();
      expect(actionsContainer?.textContent?.trim()).toBe(expectedMessage);
    }));

    it('should show a custom no results found message', fakeAsync(() => {
      const expectedMessage = 'Custom message';
      component.customNoResultsMessage = expectedMessage;
      fixture.detectChanges();

      enterSearch('abcdefgh', fixture);

      const container = getSearchResultsSection();
      expect(container?.textContent?.trim()).toBe(expectedMessage);
    }));

    it('should allow custom search result template', fakeAsync(() => {
      component.searchResultTemplate = component.customSearchResultTemplate;
      fixture.detectChanges();

      enterSearch('r', fixture);

      const customElement = getSearchResultsContainer()?.querySelector(
        '.custom-search-result-id',
      ) as HTMLElement;

      expect(customElement).not.toBeNull();
    }));

    it('should keep focus on the input element but show add focus class to the first search result after being opened', fakeAsync(() => {
      fixture.detectChanges();

      enterSearch('r', fixture);

      expect(getSearchResultItems().item(0)).toHaveCssClass(
        'sky-autocomplete-descendant-focus',
      );
      expect(document.activeElement).toEqual(getInputElement());
    }));

    it('should limit search results', fakeAsync(() => {
      component.searchResultsLimit = 1;
      fixture.detectChanges();

      // The letter 'r' should return multiple results.
      enterSearch('r', fixture);

      expect(getSearchResultItems().length).toEqual(1);
    }));

    it('should not search if search text empty', fakeAsync(() => {
      fixture.detectChanges();

      const spy = spyOn(autocomplete, 'searchOrDefault').and.callThrough();

      enterSearch('', fixture);

      expect(spy).not.toHaveBeenCalled();
    }));

    it('should not search if search text is not long enough', fakeAsync(() => {
      component.searchTextMinimumCharacters = 3;
      fixture.detectChanges();

      const spy = spyOn(autocomplete, 'searchOrDefault').and.callThrough();

      // First, verify that the search will run with 3 characters.
      enterSearch('123', fixture);

      expect(spy).toHaveBeenCalled();
      spy.calls.reset();

      // Finally, verify that it will not search with fewer characters.
      enterSearch('1', fixture);

      expect(spy).not.toHaveBeenCalled();
    }));

    it('should allow for custom search function', fakeAsync(() => {
      let customSearchCalled = false;
      let customSearchParameter: string | undefined;
      const customFunction: SkyAutocompleteSearchFunction = (
        searchText: string,
      ): Promise<[{ objectid?: string; name?: string; text?: string }]> => {
        return new Promise((resolve) => {
          customSearchParameter = searchText;
          customSearchCalled = true;
          resolve([{ name: 'Red' }]);
        });
      };

      component.search = customFunction;

      fixture.detectChanges();

      enterSearch('r', fixture);

      expect(customSearchParameter).toEqual('r');
      expect(customSearchCalled).toEqual(true);
    }));

    it('should handle items that do not have the descriptor property', fakeAsync(() => {
      component.data = [{ objectid: 'bar' }];

      fixture.detectChanges();

      const spy = spyOn(autocomplete, 'searchOrDefault').and.callThrough();

      enterSearch('r', fixture);

      expect(autocomplete.searchResults.length).toEqual(0);
      expect(spy.calls.argsFor(0)[0]).toEqual('r');
    }));

    it('should handle disabled input', fakeAsync(() => {
      component.disabled = true;

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const inputElement: HTMLInputElement = getInputElement();

      const spy = spyOn(autocomplete, 'searchOrDefault').and.callThrough();

      enterSearch('r', fixture);
      blurInput(inputElement, fixture);

      expect(inputElement.disabled).toBeTruthy();
      expect(spy).not.toHaveBeenCalled();

      component.disabled = undefined;

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      enterSearch('r', fixture);
      blurInput(inputElement, fixture);

      expect(inputElement.disabled).toBeFalsy();
      expect(spy).toHaveBeenCalled();
    }));

    it('should handle missing skyAutocomplete directive on load', fakeAsync(() => {
      component.hideInput = true;

      try {
        fixture.detectChanges();
      } catch (e) {
        if (!(e instanceof Error)) {
          fail('should have thrown an Error');
          return;
        }

        expect(
          e.message.indexOf(
            'The SkyAutocompleteComponent requires a ContentChild input',
          ) > -1,
        ).toEqual(true);
      }
    }));

    it('should handle missing skyAutocomplete directive on change', () => {
      fixture.detectChanges();

      component.hideInput = true;

      expect(() => {
        fixture.detectChanges();
      }).toThrowError(
        'The SkyAutocompleteComponent requires a ContentChild input or textarea bound with the SkyAutocomplete directive. ' +
          'For example: `<input type="text" skyAutocomplete>`.',
      );
    });

    it('should set the width of the dropdown when a search is performed', fakeAsync(() => {
      const adapterService = getAdapterService(fixture);

      const adapterSpy = spyOn(
        adapterService,
        'setDropdownWidth',
      ).and.callThrough();

      fixture.detectChanges();
      tick();

      enterSearch('r', fixture);

      expect(adapterSpy.calls.mostRecent().args[2]).toBeFalse();
      expect(adapterSpy.calls.count()).toEqual(1);

      const dropdownElement = getSearchResultsContainer();
      const autocompleteElement = getAutocompleteElement();
      const formattedWidth = `${+autocompleteElement
        .getBoundingClientRect()
        .width.toFixed(2)}px`;

      expect(dropdownElement?.style.width).toEqual(formattedWidth);
    }));

    it('should set the width of the dropdown on window resize', fakeAsync(() => {
      const adapterService = getAdapterService(fixture);

      fixture.detectChanges();
      tick();

      enterSearch('r', fixture);

      const adapterSpy = spyOn(
        adapterService,
        'setDropdownWidth',
      ).and.callThrough();

      SkyAppTestUtility.fireDomEvent(window, 'resize');
      viewportRulerChange.next(new Event('resize'));
      fixture.detectChanges();
      tick();

      expect(adapterSpy.calls.mostRecent().args[2]).toBeFalse();
      expect(adapterSpy.calls.count()).toEqual(1);

      const dropdownElement = getSearchResultsContainer();
      const autocompleteElement = getAutocompleteElement();
      const formattedWidth = `${+autocompleteElement
        .getBoundingClientRect()
        .width.toFixed(2)}px`;

      expect(dropdownElement?.style.width).toEqual(formattedWidth);
    }));

    it('should search after debounce time', fakeAsync(() => {
      component.debounceTime = 400;
      fixture.detectChanges();

      const inputElement: HTMLInputElement = getInputElement();

      const spy = spyOn(autocomplete, 'searchOrDefault').and.callThrough();

      inputElement.value = 'r';
      SkyAppTestUtility.fireDomEvent(inputElement, 'focus');
      SkyAppTestUtility.fireDomEvent(inputElement, 'input');

      // The search method should not execute at this time.
      tick(10);
      fixture.detectChanges();

      inputElement.value = 're';
      SkyAppTestUtility.fireDomEvent(inputElement, 'input');
      tick(10);
      fixture.detectChanges();

      inputElement.value = 'red';
      SkyAppTestUtility.fireDomEvent(inputElement, 'input');
      tick(10);
      fixture.detectChanges();

      expect(spy).not.toHaveBeenCalled();

      // Wait for the remaining debounce time.
      tick(400);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
      expect(spy.calls.count()).toEqual(1);
    }));

    it('should show dropdown if debounce time is met before blur', fakeAsync(() => {
      component.debounceTime = 400;
      fixture.detectChanges();

      // Type 'r' to activate the autocomplete dropdown.
      enterSearch('r', fixture);
      let dropdownElement = getSearchResultsContainer();

      expect(dropdownElement).toBeNull();

      tick(400);
      fixture.detectChanges();

      dropdownElement = getSearchResultsContainer();

      expect(dropdownElement).not.toBeNull();
      sendEscape(getInputElement(), fixture);
    }));

    it('should not show dropdown if debounce time is not met before blur', fakeAsync(() => {
      component.debounceTime = 400;
      fixture.detectChanges();

      // Type 'r' to activate the autocomplete dropdown.
      enterSearch('r', fixture);
      let dropdownElement = getSearchResultsContainer();

      expect(dropdownElement).toBeNull();

      blurInput(getInputElement(), fixture);

      tick(400);
      fixture.detectChanges();

      dropdownElement = getSearchResultsContainer();

      expect(dropdownElement).toBeNull();
    }));

    it('should show the dropdown when the form controls value changes', fakeAsync(() => {
      fixture.detectChanges();

      // Type 'r' to activate the autocomplete dropdown.
      enterSearch('r', fixture);
      const dropdownElement = getSearchResultsContainer();

      expect(dropdownElement).not.toBeNull();
    }));

    it('should show dropdown async search is running with no action area', fakeAsync(() => {
      fixture.detectChanges();
      const spy = spyOn(
        asyncAutocomplete.searchAsync,
        'emit',
      ).and.callThrough();

      enterSearch('r', fixture, true);

      expect(spy).toHaveBeenCalledWith({
        displayType: 'popover',
        offset: 0,
        searchText: 'r',
        result: jasmine.any(Observable),
      });

      let dropdownElement = getSearchResultsContainer();
      let waitWrapper = getWaitWrapper();

      expect(dropdownElement).not.toBeNull();
      expect(waitWrapper).not.toBeNull();

      tick(200);
      fixture.detectChanges();

      dropdownElement = getSearchResultsContainer();
      waitWrapper = getWaitWrapper();

      expect(dropdownElement).not.toBeNull();
      expect(waitWrapper).toBeNull();

      expect(asyncAutocomplete.searchResults.length).toEqual(6);
      expect(asyncAutocomplete.searchResults[0].data.name).toEqual('Red');
      expect(asyncAutocomplete.searchResults[1].data.name).toEqual('Green');
    }));

    it('should show dropdown async search is running with an action area', fakeAsync(() => {
      component.showAddButton = true;
      fixture.detectChanges();
      const spy = spyOn(
        asyncAutocomplete.searchAsync,
        'emit',
      ).and.callThrough();

      enterSearch('r', fixture, true);

      expect(spy).toHaveBeenCalledWith({
        displayType: 'popover',
        offset: 0,
        searchText: 'r',
        result: jasmine.any(Observable),
      });

      let dropdownElement = getSearchResultsContainer();
      let waitWrapper = getWaitWrapper();

      expect(dropdownElement).not.toBeNull();
      expect(waitWrapper).not.toBeNull();

      tick(200);
      fixture.detectChanges();

      dropdownElement = getSearchResultsContainer();
      waitWrapper = getWaitWrapper();

      expect(dropdownElement).not.toBeNull();
      expect(waitWrapper).toBeNull();

      expect(asyncAutocomplete.searchResults.length).toEqual(6);
      expect(asyncAutocomplete.searchResults[0].data.name).toEqual('Red');
      expect(asyncAutocomplete.searchResults[1].data.name).toEqual('Green');
    }));

    it('should emit an undefined value when text input is cleared', fakeAsync(() => {
      fixture.detectChanges();

      // No changes should have been emitted yet.
      expect(component.selectionFromChangeEvent).toBeUndefined();

      // Type 'r' to activate the autocomplete dropdown, then click the first result.
      enterSearch('r', fixture);
      const firstItem = getSearchResultItems().item(0);
      SkyAppTestUtility.fireDomEvent(firstItem, 'click');
      tick();

      // Expect new changes to have been emitted.
      expect(component.selectionFromChangeEvent).toEqual({
        selectedItem: { name: 'Red', objectid: 'abc' },
      });

      // Clear out the input.
      enterSearch('', fixture);

      // An undefined selectedItem should have been emitted.
      expect(component.selectionFromChangeEvent).toEqual({
        selectedItem: undefined,
      });
    }));

    it('should emit an event correctly when the add button is enabled and clicked', fakeAsync(() => {
      component.showAddButton = true;
      const addButtonSpy = spyOn(
        component,
        'addButtonClicked',
      ).and.callThrough();
      fixture.detectChanges();

      // Type 'r' to activate the autocomplete dropdown, then click the first result.
      enterSearch('r', fixture);

      const addButton = getAddButton();
      expect(addButton).not.toBeNull();
      expect(addButtonSpy).not.toHaveBeenCalled();

      clickAddButton();
      fixture.detectChanges();
      tick();

      expect(addButtonSpy).toHaveBeenCalled();
    }));

    it('should not show the add button unless the component input asks for it', fakeAsync(() => {
      component.showAddButton = false;
      const addButtonSpy = spyOn(
        component,
        'addButtonClicked',
      ).and.callThrough();
      fixture.detectChanges();

      // Type 'r' to activate the autocomplete dropdown, then click the first result.
      enterSearch('r', fixture);

      let addButton = getAddButton();
      expect(addButton).toBeNull();
      expect(addButtonSpy).not.toHaveBeenCalled();

      component.showAddButton = undefined;
      fixture.detectChanges();

      // Type 'r' to activate the autocomplete dropdown, then click the first result.
      enterSearch('r', fixture);

      addButton = getAddButton();
      expect(addButton).toBeNull();
      expect(addButtonSpy).not.toHaveBeenCalled();
    }));

    it('should open the dropdown when the input is focused if the add button is shown', fakeAsync(() => {
      component.showAddButton = true;
      fixture.detectChanges();

      const inputElement: HTMLInputElement = getInputElement();

      SkyAppTestUtility.fireDomEvent(inputElement, 'focus');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(getSearchResultsContainer()).not.toBeNull();
      expect(getAddButton()).not.toBeNull();
    }));

    it('should only open one dropdown when the input is focused multiple times if the add button is shown (sanity check)', fakeAsync(() => {
      component.showAddButton = true;
      fixture.detectChanges();

      const inputElement: HTMLInputElement = getInputElement();

      SkyAppTestUtility.fireDomEvent(inputElement, 'focus');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      SkyAppTestUtility.fireDomEvent(inputElement, 'focus');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(
        document.querySelectorAll('.sky-autocomplete-results-container').length,
      ).toBe(1);
      expect(getAddButton()).not.toBeNull();
    }));

    it('should not open the dropdown when the input is focused if the add button is shown but the input is disabled', fakeAsync(() => {
      component.disabled = true;
      component.showAddButton = true;
      fixture.detectChanges();

      const inputElement: HTMLInputElement = getInputElement();

      SkyAppTestUtility.fireDomEvent(inputElement, 'focus');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(getSearchResultsContainer()).toBeNull();
      expect(getAddButton()).toBeNull();
    }));

    it('should not open the dropdown when the input is focused if the add button is not shown', fakeAsync(() => {
      component.showAddButton = false;
      fixture.detectChanges();

      const inputElement: HTMLInputElement = getInputElement();

      SkyAppTestUtility.fireDomEvent(inputElement, 'focus');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(getSearchResultsContainer()).toBeNull();
      expect(getAddButton()).toBeNull();
    }));

    it('should emit an event correctly when the show more button is enabled and clicked', fakeAsync(() => {
      component.enableShowMore = true;
      const showMoreButtonSpy = spyOn(
        component,
        'onShowMoreClick',
      ).and.callThrough();
      fixture.detectChanges();

      // Type 'r' to activate the autocomplete dropdown, then click the first result.
      enterSearch('r', fixture);

      const showMoreButton = getShowMoreButton();
      expect(showMoreButton).not.toBeNull();
      expect(showMoreButtonSpy).not.toHaveBeenCalled();

      clickShowMoreButton();
      fixture.detectChanges();
      tick();

      expect(showMoreButtonSpy).toHaveBeenCalled();
    }));

    it('should not show the show more button unless the component input asks for it', fakeAsync(() => {
      component.enableShowMore = false;
      const showMoreButtonSpy = spyOn(
        component,
        'onShowMoreClick',
      ).and.callThrough();
      fixture.detectChanges();

      // Type 'r' to activate the autocomplete dropdown, then click the first result.
      enterSearch('r', fixture);

      let showMoreButton = getShowMoreButton();
      expect(showMoreButton).toBeNull();
      expect(showMoreButtonSpy).not.toHaveBeenCalled();

      component.enableShowMore = undefined;
      fixture.detectChanges();

      // Type 'r' to activate the autocomplete dropdown, then click the first result.
      enterSearch('r', fixture);

      showMoreButton = getShowMoreButton();
      expect(showMoreButton).toBeNull();
      expect(showMoreButtonSpy).not.toHaveBeenCalled();
    }));

    it('should open the dropdown when the input is focused if the show more button is shown', fakeAsync(() => {
      component.enableShowMore = true;
      fixture.detectChanges();

      const inputElement: HTMLInputElement = getInputElement();

      SkyAppTestUtility.fireDomEvent(inputElement, 'focus');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(getSearchResultsContainer()).not.toBeNull();
      expect(getShowMoreButton()).not.toBeNull();
    }));

    it('should not open the dropdown when the input is focused if the add button is not shown', fakeAsync(() => {
      component.enableShowMore = false;
      fixture.detectChanges();

      const inputElement: HTMLInputElement = getInputElement();

      SkyAppTestUtility.fireDomEvent(inputElement, 'focus');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(getSearchResultsContainer()).toBeNull();
      expect(getShowMoreButton()).toBeNull();
    }));

    it('should close the dropdown via the message stream', fakeAsync(() => {
      component.messageStream = new Subject();
      fixture.detectChanges();

      // Type 'r' to activate the autocomplete dropdown.
      enterSearch('r', fixture);
      let dropdownElement = getSearchResultsContainer();

      expect(dropdownElement).not.toBeNull();

      component.messageStream.next({
        type: SkyAutocompleteMessageType.CloseDropdown,
      });

      fixture.detectChanges();
      tick();

      dropdownElement = getSearchResultsContainer();

      expect(dropdownElement).toBeNull();
    }));

    it('should allow overwriting the message stream', fakeAsync(() => {
      fixture.detectChanges();

      // Type 'r' to activate the autocomplete dropdown.
      enterSearch('r', fixture);
      let searchResultsEl = getSearchResultsContainer();

      expect(searchResultsEl).not.toBeNull();

      component.messageStream = new Subject();
      fixture.detectChanges();
      tick();

      component.messageStream.next({
        type: SkyAutocompleteMessageType.CloseDropdown,
      });

      fixture.detectChanges();
      tick();

      searchResultsEl = getSearchResultsContainer();

      expect(searchResultsEl).toBeNull();
    }));

    it('should find matches when data contains diacritical characters', fakeAsync(() => {
      component.data = [
        { name: 'Åland Islands', objectid: '1' },
        { name: 'All the above', objectid: '2' },
        { name: 'Should not be found', objectid: '3' },
      ];
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      enterSearch('al', fixture);

      expect(autocomplete.searchResults.length).toEqual(2);
    }));

    it('should find matches when using a search term with diacritical characters', fakeAsync(() => {
      component.data = [
        { name: 'Åland Islands', objectid: '1' },
        { name: 'All the above', objectid: '2' },
        { name: 'Should not be found', objectid: '3' },
      ];
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      enterSearch('Ål', fixture);

      expect(autocomplete.searchResults.length).toEqual(2);
    }));

    it('should be accessible', async () => {
      const axeConfig = { rules: { region: { enabled: false } } };

      fixture.detectChanges();

      const inputElement: HTMLInputElement = getInputElement();

      await fixture.whenStable();
      await expectAsync(document.body).toBeAccessible(axeConfig);
      fixture.detectChanges();
      inputElement.focus();
      SkyAppTestUtility.fireDomEvent(inputElement, 'focus');
      inputElement.value = 'r';
      SkyAppTestUtility.fireDomEvent(inputElement, 'input');
      fixture.detectChanges();
      await fixture.whenStable();
      expect(getSearchResultsContainer()).toBeTruthy();
      await expectAsync(document.body).toBeAccessible(axeConfig);
    });

    it('should be accessible with enableShowMore', async () => {
      component.enableShowMore = true;

      const axeConfig = { rules: { region: { enabled: false } } };

      fixture.detectChanges();

      const inputElement: HTMLInputElement = getInputElement();

      await fixture.whenStable();
      SkyAppTestUtility.fireDomEvent(inputElement, 'focus');
      fixture.detectChanges();
      await fixture.whenStable();
      expect(getSearchResultsContainer()).toBeTruthy();
      await expectAsync(document.body).toBeAccessible(axeConfig);
    });

    it('should set `aria-controls` attribute', fakeAsync(() => {
      fixture.detectChanges();

      const wrapper = document.querySelector('.sky-autocomplete');
      expect(wrapper?.getAttribute('aria-controls')).toBeNull();

      enterSearch('r', fixture);

      const searchResultsContainer = getSearchResultsContainer();
      expect(wrapper?.getAttribute('aria-controls')).toEqual(
        searchResultsContainer?.id,
      );

      blurInput(getInputElement(), fixture);
      expect(wrapper?.getAttribute('aria-controls')).toBeNull();
    }));

    describe('status change screen reader announcements', () => {
      let liveAnnouncerSpy: jasmine.Spy;
      beforeEach(() => {
        liveAnnouncerSpy = spyOn(
          TestBed.inject(SkyLiveAnnouncerService),
          'announce',
        );
      });

      it('should announce number of results', fakeAsync(() => {
        fixture.detectChanges();
        enterSearch('r', fixture);

        expect(liveAnnouncerSpy).toHaveBeenCalledWith('6 results available.');
      }));

      it('should announce when no results found', fakeAsync(() => {
        fixture.detectChanges();

        enterSearch('abcdefgh', fixture);
        expect(liveAnnouncerSpy).toHaveBeenCalledWith('No matches found');
      }));

      it('should announce when only one result available', fakeAsync(() => {
        fixture.detectChanges();

        enterSearch('red', fixture);
        expect(liveAnnouncerSpy).toHaveBeenCalledWith('One result available.');
      }));
    });

    describe('with allowAnyValue enabled', () => {
      it('should display the current search text as the first option while searching', fakeAsync(() => {
        component.allowAnyValue = true;
        fixture.detectChanges();

        enterSearch('r', fixture, true);

        expect(asyncAutocomplete.searchResults.length).toEqual(1);
        expect(asyncAutocomplete.searchResults[0].data.name).toEqual('r');

        expect(getWaitWrapper()).toBeTruthy();

        tick(200);
        fixture.detectChanges();

        expect(getWaitWrapper()).toBeFalsy();

        expect(asyncAutocomplete.searchResults.length).toEqual(7);
        expect(asyncAutocomplete.searchResults[0].data.name).toEqual('r');
        expect(asyncAutocomplete.searchResults[1].data.name).toEqual('Red');
        expect(asyncAutocomplete.searchResults[2].data.name).toEqual('Green');
      }));

      it('should display the current search text as the only option when no matching options are found', fakeAsync(() => {
        component.allowAnyValue = true;
        fixture.detectChanges();

        enterSearch('not_in_datasource', fixture, true);

        expect(getWaitWrapper()).toBeTruthy();

        tick(200);
        fixture.detectChanges();

        expect(getWaitWrapper()).toBeFalsy();

        expect(asyncAutocomplete.searchResults.length).toEqual(1);
        expect(asyncAutocomplete.searchResults[0].data.name).toEqual(
          'not_in_datasource',
        );
      }));

      it('should set the current value to the search text when selected', fakeAsync(() => {
        component.allowAnyValue = true;
        fixture.detectChanges();

        enterSearch('not_in_datasource', fixture, true);

        tick(200);
        fixture.detectChanges();

        const notifySpy = spyOn(
          asyncAutocomplete.selectionChange,
          'emit',
        ).and.callThrough();

        const searchTextItem = getSearchResultItems().item(0);
        SkyAppTestUtility.fireDomEvent(searchTextItem, 'click');
        tick();

        expect(notifySpy).toHaveBeenCalledWith({
          selectedItem: { name: 'not_in_datasource' },
        });
      }));

      it('should not show the search text item when an exact match is loaded', fakeAsync(() => {
        component.allowAnyValue = true;
        fixture.detectChanges();

        enterSearch('Red', fixture, true);

        tick(200);
        fixture.detectChanges();

        expect(asyncAutocomplete.searchResults.length).toEqual(1);
        expect(asyncAutocomplete.searchResults[0].data).toEqual({
          name: 'Red',
          objectid: 'abc',
        });
      }));

      it('should handle undefined result with async search', fakeAsync(() => {
        component.allowAnyValue = true;
        fixture.detectChanges();

        // Don't set the 'result' property.
        component.searchAsync = (): void => {
          /* */
        };

        fixture.detectChanges();

        const spy = spyOn(
          asyncAutocomplete.searchAsync,
          'emit',
        ).and.callThrough();

        enterSearch('r', fixture, true);

        expect(spy).toHaveBeenCalledWith({
          displayType: 'popover',
          offset: 0,
          searchText: 'r',
        });

        tick(200);
        fixture.detectChanges();

        expect(asyncAutocomplete.searchResults.length).toEqual(1);
      }));
    });

    describe('highlighting', () => {
      it('should highlight when one letter is pressed', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        enterSearch('r', fixture);
        tick();
        fixture.detectChanges();

        expect(
          getSearchResultsContainer()
            ?.querySelector('mark')
            ?.innerHTML.trim()
            .toLowerCase(),
        ).toBe('r');
        expect(
          getSearchResultsContainer()?.querySelectorAll('mark').length,
        ).toBe(6);
      }));

      it('should remove highlight when input is cleared', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        enterSearch('r', fixture);
        tick();
        fixture.detectChanges();

        expect(
          getSearchResultsContainer()?.querySelectorAll('mark').length,
        ).toBe(6);

        enterSearch('\u0305', fixture);
        tick();
        fixture.detectChanges();

        expect(
          getSearchResultsContainer()?.querySelectorAll('mark').length,
        ).toBe(0);
      }));

      it('should highlight when returning from a no results search', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        enterSearch('red4', fixture);
        tick();
        fixture.detectChanges();

        expect(
          getSearchResultsContainer()?.querySelectorAll('mark').length,
        ).toBe(0);
        enterSearch('red', fixture);
        tick();
        fixture.detectChanges();

        expect(
          getSearchResultsContainer()
            ?.querySelector('mark')
            ?.innerHTML.trim()
            .toLowerCase(),
        ).toBe('red');
        expect(
          getSearchResultsContainer()?.querySelectorAll('mark').length,
        ).toBe(1);
      }));

      it('should highlight when returning from a more specific search to a less specific one', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        enterSearch('bla', fixture);
        tick();
        fixture.detectChanges();

        expect(
          getSearchResultsContainer()
            ?.querySelector('mark')
            ?.innerHTML.trim()
            .toLowerCase(),
        ).toBe('bla');
        expect(
          getSearchResultsContainer()?.querySelectorAll('mark').length,
        ).toBe(1);
        enterSearch('bl', fixture);
        tick();
        fixture.detectChanges();

        expect(
          getSearchResultsContainer()
            ?.querySelector('mark')
            ?.innerHTML.trim()
            .toLowerCase(),
        ).toBe('bl');
        expect(
          getSearchResultsContainer()?.querySelectorAll('mark').length,
        ).toBe(2);
      }));

      it('should highlight matches when data contains empty descriptor property', fakeAsync(() => {
        component.propertiesToSearch = ['text'];
        component.data = [
          { name: 'Misty Island', text: 'Misty Island', objectid: '1' },
          { name: 'Mississippi', text: 'Mississippi', objectid: '2' },
          { text: 'Missing the display field', objectid: '3' },
        ];
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        enterSearch('mis', fixture);

        expect(
          getSearchResultsContainer()?.querySelectorAll('mark').length,
        ).toBe(2);
      }));

      it('should highlight matches when data contains diacritical characters', fakeAsync(() => {
        component.data = [
          { name: 'Åland Islands', objectid: '1' },
          { name: 'All the above', objectid: '2' },
          { name: 'Should not be found', objectid: '3' },
        ];
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        enterSearch('al', fixture);

        expect(['al', 'ål']).toContain(
          getSearchResultsContainer()
            ?.querySelector('mark')
            ?.innerHTML.trim()
            .toLowerCase(),
        );
        expect(
          getSearchResultsContainer()?.querySelectorAll('mark').length,
        ).toBe(2);
      }));

      it('should highlight matches when search contains regular expression characters', fakeAsync(() => {
        component.data = [
          {
            name: 'United Arab Emirates (‫الإمارات العربية المتحدة‬‎)',
            objectid: '1',
          },
          { name: 'United States of America (USA)', objectid: '2' },
          { name: 'Should not be found', objectid: '3' },
        ];
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        enterSearch('united', fixture);

        expect(
          getSearchResultsContainer()
            ?.querySelector('mark')
            ?.innerHTML.trim()
            .toLowerCase(),
        ).toContain('united');
        expect(
          getSearchResultsContainer()?.querySelectorAll('mark').length,
        ).toBe(2);
      }));

      it('should not highlight when highlightSearchText is false', fakeAsync(() => {
        fixture.componentInstance.highlightSearchText = false;
        fixture.detectChanges();
        tick();

        enterSearch('r', fixture);
        tick();
        fixture.detectChanges();

        expect(
          getSearchResultsContainer()?.querySelectorAll('mark').length,
        ).toBe(0);
      }));
    });

    describe('keyboard interactions', () => {
      it('should not show the dropdown when user tabs through input', fakeAsync(() => {
        fixture.detectChanges();
        const inputElement: HTMLInputElement = getInputElement();

        sendTab(inputElement, fixture);

        const dropdownElement = getSearchResultsContainer();
        expect(dropdownElement).toBeNull();
      }));

      it('should not stop default behavior when tab is pressed', fakeAsync(() => {
        fixture.detectChanges();
        spyOn(KeyboardEvent.prototype, 'stopPropagation').and.callThrough();
        spyOn(KeyboardEvent.prototype, 'preventDefault').and.callThrough();
        const inputElement: HTMLInputElement = getInputElement();

        sendTab(inputElement, fixture);

        expect(KeyboardEvent.prototype.stopPropagation).not.toHaveBeenCalled();
        expect(KeyboardEvent.prototype.preventDefault).not.toHaveBeenCalled();
      }));

      it('should not stop default behavior when shift tab is pressed', fakeAsync(() => {
        fixture.detectChanges();
        spyOn(KeyboardEvent.prototype, 'stopPropagation').and.callThrough();
        spyOn(KeyboardEvent.prototype, 'preventDefault').and.callThrough();
        const inputElement: HTMLInputElement = getInputElement();

        sendTab(inputElement, fixture, true);

        expect(KeyboardEvent.prototype.stopPropagation).not.toHaveBeenCalled();
        expect(KeyboardEvent.prototype.preventDefault).not.toHaveBeenCalled();
      }));

      it('should change value and emit when search result is focused and tab is pressed', fakeAsync(() => {
        fixture.detectChanges();
        const input: SkyAutocompleteInputDirective =
          component.autocompleteInput;
        const inputElement: HTMLInputElement = getInputElement();
        const notifySpy = spyOn(
          autocomplete.selectionChange,
          'emit',
        ).and.callThrough();

        enterSearch('r', fixture);
        sendTab(inputElement, fixture);

        expect(inputElement.value).toEqual('Red');
        expect(input.value.name).toEqual('Red');
        expect(notifySpy).toHaveBeenCalledWith({ selectedItem: input.value });
      }));

      it('should reset the value when tab key is pressed while add button is focused', fakeAsync(() => {
        component.showAddButton = true;
        fixture.detectChanges();
        const input: SkyAutocompleteInputDirective =
          component.autocompleteInput;
        const inputElement: HTMLInputElement = getInputElement();
        const selectedValue = { name: 'Red' };

        updateNgModel(fixture, selectedValue);
        enterSearch('r', fixture);

        // Cycle up and around to the add button at bottom.
        sendArrowUp(inputElement, fixture);

        const addButton = getAddButton();
        expect(addButton).toHaveCssClass('sky-autocomplete-descendant-focus');

        sendTab(inputElement, fixture);
        blurInput(inputElement, fixture);

        expect(component.myForm.value.favoriteColor).toEqual(selectedValue);
        expect(input.value).toEqual(selectedValue);
        expect(inputElement.value).toEqual(selectedValue.name);
      }));

      it('should not stop default behavior when tab is pressed on the input when actions exist', fakeAsync(() => {
        component.showAddButton = true;
        fixture.detectChanges();
        const inputElement: HTMLInputElement = getInputElement();

        enterSearch('r', fixture);

        spyOn(KeyboardEvent.prototype, 'stopPropagation').and.callThrough();
        spyOn(KeyboardEvent.prototype, 'preventDefault').and.callThrough();

        sendTab(inputElement, fixture);

        expect(KeyboardEvent.prototype.stopPropagation).not.toHaveBeenCalled();
        expect(KeyboardEvent.prototype.preventDefault).not.toHaveBeenCalled();
      }));

      it('should not stop default behavior when shift tab is pressed on the input when actions exist', fakeAsync(() => {
        component.showAddButton = true;
        fixture.detectChanges();
        const inputElement: HTMLInputElement = getInputElement();

        enterSearch('r', fixture);

        spyOn(KeyboardEvent.prototype, 'stopPropagation').and.callThrough();
        spyOn(KeyboardEvent.prototype, 'preventDefault').and.callThrough();

        sendTab(inputElement, fixture, true);

        expect(KeyboardEvent.prototype.stopPropagation).not.toHaveBeenCalled();
        expect(KeyboardEvent.prototype.preventDefault).not.toHaveBeenCalled();
      }));

      it('should change value and emit when search result is focused and enter is pressed', fakeAsync(() => {
        fixture.detectChanges();
        const input: SkyAutocompleteInputDirective =
          component.autocompleteInput;
        const inputElement: HTMLInputElement = getInputElement();
        const notifySpy = spyOn(
          autocomplete.selectionChange,
          'emit',
        ).and.callThrough();

        enterSearch('r', fixture);
        expect(getSearchResultsContainer()).not.toBeNull();
        sendEnter(inputElement, fixture);

        expect(inputElement.value).toEqual('Red');
        expect(input.value.name).toEqual('Red');
        expect(notifySpy).toHaveBeenCalledWith({ selectedItem: input.value });
        expect(getSearchResultsContainer()).toBeNull();
      }));

      it('should not close the dropdown when enter is pressed on an item with the add button enabled', fakeAsync(() => {
        component.showAddButton = true;
        fixture.detectChanges();
        const inputElement: HTMLInputElement = getInputElement();

        enterSearch('r', fixture);
        expect(getSearchResultsContainer()).not.toBeNull();
        sendEnter(inputElement, fixture);

        expect(getSearchResultsContainer()).not.toBeNull();
      }));

      it('should not close the dropdown when enter is pressed on an item with show more enabled', fakeAsync(() => {
        component.enableShowMore = true;
        fixture.detectChanges();
        const inputElement: HTMLInputElement = getInputElement();

        enterSearch('r', fixture);
        expect(getSearchResultsContainer()).not.toBeNull();
        sendEnter(inputElement, fixture);

        expect(getSearchResultsContainer()).not.toBeNull();
      }));

      it('should navigate items with arrow keys', fakeAsync(() => {
        fixture.detectChanges();
        const inputElement: HTMLInputElement = getInputElement();

        enterSearch('r', fixture);

        expect(getSearchResultItems().item(0)).toHaveCssClass(
          'sky-autocomplete-descendant-focus',
        );

        sendArrowDown(inputElement, fixture);

        expect(getSearchResultItems().item(1)).toHaveCssClass(
          'sky-autocomplete-descendant-focus',
        );

        sendArrowUp(inputElement, fixture);

        expect(getSearchResultItems().item(0)).toHaveCssClass(
          'sky-autocomplete-descendant-focus',
        );

        // Move up again to loop back to the bottom of the list.
        sendArrowUp(inputElement, fixture);

        expect(getSearchResultItems().item(5)).toHaveCssClass(
          'sky-autocomplete-descendant-focus',
        );

        // Move down to loop back to the top.
        sendArrowDown(inputElement, fixture);

        expect(getSearchResultItems().item(0)).toHaveCssClass(
          'sky-autocomplete-descendant-focus',
        );
      }));

      it('should close the menu without changes when escape key pressed', fakeAsync(() => {
        fixture.detectChanges();
        const inputElement: HTMLInputElement = getInputElement();

        enterSearch('r', fixture);
        sendEscape(inputElement, fixture);

        expect(autocomplete.searchResults.length).toEqual(0);
        expect(getSearchResultsContainer()).toBeNull();
      }));

      it('should reset input text value when user blurs the input', fakeAsync(() => {
        fixture.detectChanges();
        const input: SkyAutocompleteInputDirective =
          component.autocompleteInput;
        const inputElement: HTMLInputElement = getInputElement();
        const selectedValue = { name: 'Red' };

        updateNgModel(fixture, selectedValue);
        enterSearch('re', fixture);

        expect(inputElement.value).toEqual('re');

        blurInput(inputElement, fixture);

        expect(component.myForm.value.favoriteColor).toEqual(selectedValue);
        expect(input.value).toEqual(selectedValue);
        expect(inputElement.value).toEqual(selectedValue.name);
        expect(getSearchResultsContainer()).toBeNull();
      }));

      it('should not reset input text value if unchanged', fakeAsync(() => {
        fixture.detectChanges();
        const input: SkyAutocompleteInputDirective =
          component.autocompleteInput;
        const inputElement: HTMLInputElement = getInputElement();
        const selectedValue = { name: 'Red' };
        const spy = spyOnProperty(
          input,
          'inputTextValue',
          'set',
        ).and.callThrough();

        updateNgModel(fixture, selectedValue);
        input.inputTextValue = 'Red';
        spy.calls.reset();

        expect(inputElement.value).toEqual('Red');

        blurInput(inputElement, fixture);

        expect(spy).not.toHaveBeenCalled();
      }));

      it('should clear the input selected value if text value empty on blur', fakeAsync(() => {
        fixture.detectChanges();
        const input: SkyAutocompleteInputDirective =
          component.autocompleteInput;
        const inputElement: HTMLInputElement = getInputElement();
        const selectedValue = { name: 'Red' };

        updateNgModel(fixture, selectedValue);
        enterSearch('', fixture);

        expect(inputElement.value).toEqual('');

        blurInput(inputElement, fixture);

        expect(component.myForm.value.favoriteColor).toBeUndefined();
        expect(input.value).toBeUndefined();
        expect(inputElement.value).toEqual('');
      }));

      it('should close the dropdown if text value becomes empty', fakeAsync(() => {
        fixture.detectChanges();
        const inputElement: HTMLInputElement = getInputElement();
        const selectedValue = { name: 'Red' };

        updateNgModel(fixture, selectedValue);

        enterSearch('re', fixture);

        expect(getSearchResultsContainer()).not.toBeNull();

        enterSearch('', fixture);

        expect(getSearchResultsContainer()).toBeNull();
        expect(inputElement.value).toEqual('');
      }));

      it('should not close the dropdown if text value becomes empty with the add button enabled', fakeAsync(() => {
        component.showAddButton = true;
        fixture.detectChanges();
        const inputElement: HTMLInputElement = getInputElement();
        const selectedValue = { name: 'Red' };

        updateNgModel(fixture, selectedValue);

        enterSearch('re', fixture);

        expect(getSearchResultsContainer()).not.toBeNull();

        enterSearch('', fixture);

        expect(getSearchResultsContainer()).not.toBeNull();
        expect(inputElement.value).toEqual('');
      }));

      it('should not close the dropdown if text value becomes empty with show more enabled', fakeAsync(() => {
        component.enableShowMore = true;
        fixture.detectChanges();
        const inputElement: HTMLInputElement = getInputElement();
        const selectedValue = { name: 'Red' };

        updateNgModel(fixture, selectedValue);

        enterSearch('re', fixture);

        expect(getSearchResultsContainer()).not.toBeNull();

        enterSearch('', fixture);

        expect(getSearchResultsContainer()).not.toBeNull();
        expect(inputElement.value).toEqual('');
      }));

      it('should clear the input selected value if the search field is empty', fakeAsync(() => {
        fixture.detectChanges();
        const input: SkyAutocompleteInputDirective =
          component.autocompleteInput;
        const inputElement: HTMLInputElement = getInputElement();
        const selectedValue: { name: string } | undefined = undefined;

        updateNgModel(fixture, selectedValue);
        blurInput(inputElement, fixture);

        expect(component.myForm.value.favoriteColor).toBeUndefined();
        expect(input.value).toBeUndefined();
        expect(inputElement.value).toEqual('');
      }));

      it('should reset the value and emit the add event if enter is pressed when the add button is focused', fakeAsync(() => {
        component.showAddButton = true;
        fixture.detectChanges();
        const input: SkyAutocompleteInputDirective =
          component.autocompleteInput;
        const inputElement: HTMLInputElement = getInputElement();
        const selectedValue = { name: 'Red' };
        const addButtonSpy = spyOn(
          component,
          'addButtonClicked',
        ).and.callThrough();

        updateNgModel(fixture, selectedValue);
        enterSearch('r', fixture);

        // Cycle up and around to the add button.
        sendArrowUp(inputElement, fixture);

        const addButton = getAddButton();
        expect(addButton).toHaveCssClass('sky-autocomplete-descendant-focus');
        expect(getSearchResultsContainer()).not.toBeNull();

        sendEnter(inputElement, fixture);

        expect(component.myForm.value.favoriteColor).toEqual(selectedValue);
        expect(input.value).toEqual(selectedValue);
        expect(inputElement.value).toEqual(selectedValue.name);
        expect(addButtonSpy).toHaveBeenCalled();
        expect(getSearchResultsContainer()).toBeNull();
      }));

      it('should reset reset focus for search result controls when new text entered in input', fakeAsync(() => {
        component.showAddButton = true;
        fixture.detectChanges();
        const input: SkyAutocompleteInputDirective =
          component.autocompleteInput;
        const inputElement: HTMLInputElement = getInputElement();
        const selectedValue = { name: 'Red' };
        const addButtonSpy = spyOn(
          component,
          'addButtonClicked',
        ).and.callThrough();

        updateNgModel(fixture, selectedValue);
        enterSearch('r', fixture);

        // Cycle up and around to the add button.
        sendArrowUp(inputElement, fixture);

        const addButton = getAddButton();
        expect(addButton).toHaveCssClass('sky-autocomplete-descendant-focus');
        expect(getSearchResultsContainer()).not.toBeNull();

        enterSearch(' ', fixture);

        expect(addButton).not.toHaveCssClass(
          'sky-autocomplete-descendant-focus',
        );

        sendEnter(inputElement, fixture);

        expect(component.myForm.value.favoriteColor).toBeUndefined();
        expect(input.value).toBeUndefined();
        expect(inputElement.value).toEqual('');
        expect(addButtonSpy).not.toHaveBeenCalled();
        expect(getSearchResultsContainer()).not.toBeNull();
      }));

      it('should navigate items with arrow keys with search results limits', fakeAsync(() => {
        component.searchResultsLimit = 4;
        fixture.detectChanges();
        const inputElement: HTMLInputElement = getInputElement();

        enterSearch('r', fixture);

        expect(getSearchResultItems().item(0)).toHaveCssClass(
          'sky-autocomplete-descendant-focus',
        );

        sendArrowDown(inputElement, fixture);

        expect(getSearchResultItems().item(1)).toHaveCssClass(
          'sky-autocomplete-descendant-focus',
        );

        sendArrowUp(inputElement, fixture);

        expect(getSearchResultItems().item(0)).toHaveCssClass(
          'sky-autocomplete-descendant-focus',
        );

        // Move up again to loop back to the bottom of the list.
        sendArrowUp(inputElement, fixture);

        expect(getSearchResultItems().item(3)).toHaveCssClass(
          'sky-autocomplete-descendant-focus',
        );

        // Move down to loop back to the top.
        sendArrowDown(inputElement, fixture);

        expect(getSearchResultItems().item(0)).toHaveCssClass(
          'sky-autocomplete-descendant-focus',
        );
      }));
    });

    describe('mouse interactions', () => {
      it('should notify selection change on item click', fakeAsync(() => {
        fixture.detectChanges();

        const input: SkyAutocompleteInputDirective =
          component.autocompleteInput;

        enterSearch('r', fixture);
        expect(getSearchResultsContainer()).not.toBeNull();

        const notifySpy = spyOn(
          autocomplete.selectionChange,
          'emit',
        ).and.callThrough();
        const firstItem = getSearchResultItems().item(0);

        SkyAppTestUtility.fireDomEvent(firstItem, 'click');
        tick();

        expect(getSearchResultsContainer()).toBeNull();
        expect(input.value.name).toEqual('Red');
        expect(notifySpy).toHaveBeenCalledWith({ selectedItem: input.value });
      }));

      it('should not close the dropdown on item click with the add button enabled', fakeAsync(() => {
        component.showAddButton = true;
        fixture.detectChanges();

        enterSearch('r', fixture);
        expect(getSearchResultsContainer()).not.toBeNull();
        const firstItem = getSearchResultItems().item(0);

        SkyAppTestUtility.fireDomEvent(firstItem, 'click');
        tick();

        expect(getSearchResultsContainer()).not.toBeNull();
      }));

      it('should not close the dropdown on item click with show more enabled', fakeAsync(() => {
        component.enableShowMore = true;
        fixture.detectChanges();

        enterSearch('r', fixture);
        expect(getSearchResultsContainer()).not.toBeNull();
        const firstItem = getSearchResultItems().item(0);

        SkyAppTestUtility.fireDomEvent(firstItem, 'click');
        tick();

        expect(getSearchResultsContainer()).not.toBeNull();
      }));

      it('should navigate items with mousemove event', fakeAsync(() => {
        fixture.detectChanges();

        enterSearch('r', fixture);

        const results: NodeListOf<Element> = getSearchResultItems();

        expect(results.item(0)).toHaveCssClass(
          'sky-autocomplete-descendant-focus',
        );

        sendMouseMove(results.item(1) as HTMLElement, fixture);

        expect(results.item(0)).not.toHaveCssClass(
          'sky-autocomplete-descendant-focus',
        );
        expect(results.item(1)).toHaveCssClass(
          'sky-autocomplete-descendant-focus',
        );
      }));

      it('should not navigate items with mousemove event on self (sanity check)', fakeAsync(() => {
        fixture.detectChanges();

        enterSearch('r', fixture);

        const results: NodeListOf<Element> = getSearchResultItems();

        expect(results.item(0)).toHaveCssClass(
          'sky-autocomplete-descendant-focus',
        );

        sendMouseMove(results.item(0) as HTMLElement, fixture);

        expect(results.item(0)).toHaveCssClass(
          'sky-autocomplete-descendant-focus',
        );

        for (let i = 1; i < results.length; i++) {
          expect(results.item(i)).not.toHaveCssClass(
            'sky-autocomplete-descendant-focus',
          );
        }
      }));

      it('should navigate items with both mousemove event and key events', fakeAsync(() => {
        fixture.detectChanges();
        const inputElement: HTMLInputElement = getInputElement();

        enterSearch('r', fixture);

        const results: NodeListOf<Element> = getSearchResultItems();

        expect(results.item(0)).toHaveCssClass(
          'sky-autocomplete-descendant-focus',
        );

        sendMouseMove(results.item(1) as HTMLElement, fixture);
        sendArrowDown(inputElement, fixture);

        expect(results.item(0)).not.toHaveCssClass(
          'sky-autocomplete-descendant-focus',
        );
        expect(results.item(1)).not.toHaveCssClass(
          'sky-autocomplete-descendant-focus',
        );
        expect(results.item(2)).toHaveCssClass(
          'sky-autocomplete-descendant-focus',
        );
      }));
    });

    describe('Angular form statuses (template-driven)', () => {
      it('should set form states properly', fakeAsync(function () {
        fixture.detectChanges();
        tick();

        // Expect untouched and pristine.
        expect(component.myForm.touched).toEqual(false);
        expect(component.myForm.untouched).toEqual(true);
        expect(component.myForm.dirty).toEqual(false);
        expect(component.myForm.pristine).toEqual(true);
      }));

      it('should set form states properly when initialized with a value', fakeAsync(function () {
        component.model.favoriteColor = { name: 'Red' };
        fixture.detectChanges();
        tick();

        // Expect untouched and pristine.
        expect(component.myForm.touched).toEqual(false);
        expect(component.myForm.untouched).toEqual(true);
        expect(component.myForm.dirty).toEqual(false);
        expect(component.myForm.pristine).toEqual(true);
      }));

      it('should mark the control as touched on blur', fakeAsync(function () {
        fixture.detectChanges();
        tick();

        const inputElement: HTMLInputElement = getInputElement();

        blurInput(inputElement, fixture);

        // Expect touched and pristine.
        expect(component.myForm.touched).toEqual(true);
        expect(component.myForm.untouched).toEqual(false);
        expect(component.myForm.dirty).toEqual(false);
        expect(component.myForm.pristine).toEqual(true);
      }));

      it('should mark the control as dirty when search value changes', fakeAsync(function () {
        fixture.detectChanges();
        tick();

        enterSearch('r', fixture);

        // Expect untouched and pristine, because we haven't selected a search result yet.
        expect(component.myForm.touched).toEqual(false);
        expect(component.myForm.untouched).toEqual(true);
        expect(component.myForm.dirty).toEqual(false);
        expect(component.myForm.pristine).toEqual(true);

        searchAndSelect('r', 0, fixture);

        // Expect touched and dirty.
        expect(component.myForm.touched).toEqual(true);
        expect(component.myForm.untouched).toEqual(false);
        expect(component.myForm.dirty).toEqual(true);
        expect(component.myForm.pristine).toEqual(false);

        // Expect model to be set.
        expect(component.myForm.value).toEqual({
          favoriteColor: { name: 'Red', objectid: 'abc' },
        });
      }));

      it('should mark the control as dirty when search value changes when initialized with a value', fakeAsync(function () {
        component.model.favoriteColor = { name: 'Purple' };
        fixture.detectChanges();
        tick();

        searchAndSelect('r', 0, fixture);

        // Expect touched and dirty.
        expect(component.myForm.touched).toEqual(true);
        expect(component.myForm.untouched).toEqual(false);
        expect(component.myForm.dirty).toEqual(true);
        expect(component.myForm.pristine).toEqual(false);

        // Expect model to be set.
        expect(component.myForm.value).toEqual({
          favoriteColor: { name: 'Red', objectid: 'abc' },
        });
      }));
    });
  });

  describe('Reactive form', () => {
    let fixture: ComponentFixture<SkyAutocompleteReactiveFixtureComponent>;
    let component: SkyAutocompleteReactiveFixtureComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SkyAutocompleteFixturesModule],
      });

      fixture = TestBed.createComponent(
        SkyAutocompleteReactiveFixtureComponent,
      );
      component = fixture.componentInstance;
    });

    afterEach(() => {
      fixture.destroy();
    });

    it('should set form states properly', fakeAsync(function () {
      fixture.detectChanges();
      tick();

      // Expect untouched and pristine.
      expect(component.reactiveForm?.touched).toEqual(false);
      expect(component.reactiveForm?.untouched).toEqual(true);
      expect(component.reactiveForm?.dirty).toEqual(false);
      expect(component.reactiveForm?.pristine).toEqual(true);
    }));

    it('should set form states properly when initialized with a value', fakeAsync(function () {
      fixture.detectChanges();
      tick();
      component.reactiveForm?.get('favoriteColor')?.patchValue({ name: 'Red' });

      // Expect untouched and pristine.
      expect(component.reactiveForm?.touched).toEqual(false);
      expect(component.reactiveForm?.untouched).toEqual(true);
      expect(component.reactiveForm?.dirty).toEqual(false);
      expect(component.reactiveForm?.pristine).toEqual(true);
    }));

    it('should mark the control as touched on blur', fakeAsync(function () {
      fixture.detectChanges();
      tick();

      const inputElement = getInputElement();

      blurInput(inputElement, fixture);

      // Expect touched and pristine.
      expect(component.reactiveForm?.touched).toEqual(true);
      expect(component.reactiveForm?.untouched).toEqual(false);
      expect(component.reactiveForm?.dirty).toEqual(false);
      expect(component.reactiveForm?.pristine).toEqual(true);
    }));

    it('should mark the control as dirty when search value changes', fakeAsync(function () {
      fixture.detectChanges();
      tick();

      enterSearch('r', fixture);

      // Expect untouched and pristine, because we haven't selected a search result yet.
      expect(component.reactiveForm?.touched).toEqual(false);
      expect(component.reactiveForm?.untouched).toEqual(true);
      expect(component.reactiveForm?.dirty).toEqual(false);
      expect(component.reactiveForm?.pristine).toEqual(true);

      searchAndSelect('r', 0, fixture);

      // Expect touched and dirty.
      expect(component.reactiveForm?.touched).toEqual(true);
      expect(component.reactiveForm?.untouched).toEqual(false);
      expect(component.reactiveForm?.dirty).toEqual(true);
      expect(component.reactiveForm?.pristine).toEqual(false);

      // Expect model to be set.
      expect(component.reactiveForm?.value).toEqual({
        favoriteColor: { name: 'Red' },
      });
    }));

    it('should mark the control as dirty when search value changes when initialized with a value', fakeAsync(function () {
      fixture.detectChanges();
      tick();
      component.reactiveForm
        ?.get('favoriteColor')
        ?.patchValue({ name: 'Purple' });

      searchAndSelect('r', 0, fixture);

      // Expect touched and dirty.
      expect(component.reactiveForm?.touched).toEqual(true);
      expect(component.reactiveForm?.untouched).toEqual(false);
      expect(component.reactiveForm?.dirty).toEqual(true);
      expect(component.reactiveForm?.pristine).toEqual(false);

      // Expect model to be set.
      expect(component.reactiveForm?.value).toEqual({
        favoriteColor: { name: 'Red' },
      });
    }));

    it('should be able to disable and enable the input through the form', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      component.disableForm();

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const spy = spyOn(
        component.autocomplete,
        'searchOrDefault',
      ).and.callThrough();

      const inputElement = getInputElement();

      enterSearch('r', fixture);
      blurInput(inputElement, fixture);

      expect(inputElement.disabled).toBeTruthy();
      expect(spy).not.toHaveBeenCalled();

      component.enableForm();

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      enterSearch('r', fixture);
      blurInput(inputElement, fixture);

      expect(inputElement.disabled).toBeFalsy();
      expect(spy).toHaveBeenCalled();
    }));

    it('should emit an event correctly when the add button is enabled and clicked', fakeAsync(() => {
      component.showAddButton = true;
      const addButtonSpy = spyOn(
        component,
        'addButtonClicked',
      ).and.callThrough();
      fixture.detectChanges();

      // Type 'r' to activate the autocomplete dropdown, then click the first result.
      enterSearch('r', fixture);

      const addButton = getAddButton();
      expect(addButton).not.toBeNull();
      expect(addButtonSpy).not.toHaveBeenCalled();

      clickAddButton();
      fixture.detectChanges();
      tick();

      expect(addButtonSpy).toHaveBeenCalled();
    }));

    it('should not show the add button unless the component input asks for it', fakeAsync(() => {
      component.showAddButton = false;
      const addButtonSpy = spyOn(
        component,
        'addButtonClicked',
      ).and.callThrough();
      fixture.detectChanges();

      // Type 'r' to activate the autocomplete dropdown, then click the first result.
      enterSearch('r', fixture);

      const addButton = getAddButton();
      expect(addButton).toBeNull();
      expect(addButtonSpy).not.toHaveBeenCalled();
    }));

    it('should open the dropdown when the input is focused if the add button is shown', fakeAsync(() => {
      component.showAddButton = true;
      fixture.detectChanges();

      const inputElement = getInputElement();

      SkyAppTestUtility.fireDomEvent(inputElement, 'focus');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(getSearchResultsContainer()).not.toBeNull();
      expect(getAddButton()).not.toBeNull();
    }));

    it('should not open the dropdown when the input is focused if the add button is not shown', fakeAsync(() => {
      component.showAddButton = false;
      fixture.detectChanges();

      const inputElement = getInputElement();

      SkyAppTestUtility.fireDomEvent(inputElement, 'focus');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(getSearchResultsContainer()).toBeNull();
      expect(getAddButton()).toBeNull();
    }));

    it('should emit an event correctly when the show more button is enabled and clicked', fakeAsync(() => {
      component.enableShowMore = true;
      const showMoreButtonSpy = spyOn(
        component,
        'onShowMoreClick',
      ).and.callThrough();
      fixture.detectChanges();

      // Type 'r' to activate the autocomplete dropdown, then click the first result.
      enterSearch('r', fixture);

      const showMoreButton = getShowMoreButton();
      expect(showMoreButton).not.toBeNull();
      expect(showMoreButtonSpy).not.toHaveBeenCalled();

      clickShowMoreButton();
      fixture.detectChanges();
      tick();

      expect(showMoreButtonSpy).toHaveBeenCalled();
    }));

    it('should not show the show more button unless the component input asks for it', fakeAsync(() => {
      component.enableShowMore = false;
      const showMoreButtonSpy = spyOn(
        component,
        'onShowMoreClick',
      ).and.callThrough();
      fixture.detectChanges();

      // Type 'r' to activate the autocomplete dropdown, then click the first result.
      enterSearch('r', fixture);

      const showMoreButton = getShowMoreButton();
      expect(showMoreButton).toBeNull();
      expect(showMoreButtonSpy).not.toHaveBeenCalled();
    }));

    it('should open the dropdown when the input is focused if the show more button is shown', fakeAsync(() => {
      component.enableShowMore = true;
      fixture.detectChanges();

      const inputElement = getInputElement();

      SkyAppTestUtility.fireDomEvent(inputElement, 'focus');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(getSearchResultsContainer()).not.toBeNull();
      expect(getShowMoreButton()).not.toBeNull();
    }));

    it('should not open the dropdown when the input is focused if the add button is not shown', fakeAsync(() => {
      component.enableShowMore = false;
      fixture.detectChanges();

      const inputElement = getInputElement();

      SkyAppTestUtility.fireDomEvent(inputElement, 'focus');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(getSearchResultsContainer()).toBeNull();
      expect(getShowMoreButton()).toBeNull();
    }));
  });

  describe('within an input box', () => {
    let fixture: ComponentFixture<SkyAutocompleteInputBoxFixtureComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SkyAutocompleteFixturesModule],
      });

      fixture = TestBed.createComponent(
        SkyAutocompleteInputBoxFixtureComponent,
      );
    });

    afterEach(() => {
      fixture.destroy();
    });

    it('should call the setDropdownWidth with the proper parameters', fakeAsync(() => {
      fixture.detectChanges();

      const adapterService = getAdapterService(fixture);

      const adapterSpy = spyOn(
        adapterService,
        'setDropdownWidth',
      ).and.callThrough();

      fixture.detectChanges();
      tick();

      enterSearch('r', fixture);

      expect(adapterSpy.calls.mostRecent().args[2]).toBeTrue();
      expect(adapterSpy.calls.count()).toEqual(1);
    }));
  });
});
