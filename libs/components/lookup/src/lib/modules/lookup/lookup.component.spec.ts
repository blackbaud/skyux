import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { NgModel } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';
import { SkyLogService } from '@skyux/core';
import { SkyModalHostService, SkyModalService } from '@skyux/modals';

import { SkyAutocompleteMessageType } from '../autocomplete/types/autocomplete-message-type';
import { SkyAutocompleteSearchArgs } from '../autocomplete/types/autocomplete-search-args';
import { SkyAutocompleteSearchFunctionResponse } from '../autocomplete/types/autocomplete-search-function-response';

import { SkyLookupFixturesModule } from './fixtures/lookup-fixtures.module';
import { SkyLookupInputBoxTestComponent } from './fixtures/lookup-input-box.component.fixture';
import { SkyLookupTemplateTestComponent } from './fixtures/lookup-template.component.fixture';
import { SkyLookupTestComponent } from './fixtures/lookup.component.fixture';
import { SkyLookupComponent } from './lookup.component';
import { SkyLookupSelectModeType } from './types/lookup-select-mode-type';

describe('Lookup component', function () {
  //#region helpers

  function clickAddButton(): void {
    SkyAppTestUtility.fireDomEvent(getAddButton(), 'click');
  }

  function clearShowMoreSearch(fixture: ComponentFixture<any>): void {
    (
      document.querySelector(
        '.sky-lookup-show-more-modal-toolbar .sky-search-btn-clear',
      ) as HTMLElement
    ).click();

    fixture.detectChanges();
    tick(250);
    fixture.detectChanges();
  }

  function clickModalAddButton(fixture: ComponentFixture<any>): void {
    getModalAddButton().click();
    fixture.detectChanges();
  }

  function clickShowMoreBase(fixture: ComponentFixture<any>): void {
    SkyAppTestUtility.fireDomEvent(getShowMoreButton(), 'click');
    fixture.detectChanges();
  }

  function clickShowMore(fixture: ComponentFixture<any>): void {
    clickShowMoreBase(fixture);
    tick(200);
    fixture.detectChanges();
    tick();
  }

  async function clickShowMoreAsync(
    fixture: ComponentFixture<any>,
  ): Promise<void> {
    clickShowMoreBase(fixture);
    await fixture.whenStable();
  }

  function clickSearchButton(
    fixture: ComponentFixture<any>,
    async = false,
  ): void {
    getSearchButton(async).click();
    fixture.detectChanges();
    tick(200);
    fixture.detectChanges();
  }

  function clickShowMoreAddButton(fixture: ComponentFixture<any>): void {
    (
      document.querySelector('.sky-lookup-show-more-modal-add') as HTMLElement
    ).click();
    fixture.detectChanges();
  }

  function clickShowMoreClearAll(fixture: ComponentFixture<any>): void {
    getModalClearAllButton().click();
    fixture.detectChanges();
  }

  function clickShowMoreSelectAll(fixture: ComponentFixture<any>): void {
    getModalSelectAllButton().click();
    fixture.detectChanges();
  }

  function clickToken(
    index: number,
    fixture: ComponentFixture<any>,
    async = false,
  ): void {
    if (async) {
      (
        document.querySelectorAll(
          '#my-async-lookup .sky-lookup-tokens .sky-token-btn-action',
        )[index] as HTMLElement
      ).click();
    } else {
      (
        document.querySelectorAll(
          '#my-lookup .sky-lookup-tokens .sky-token-btn-action',
        )[index] as HTMLElement
      ).click();
    }
    fixture.detectChanges();
  }

  function clickInputAndVerifyFocused(
    fixture: ComponentFixture<
      SkyLookupTestComponent | SkyLookupTemplateTestComponent
    >,
    focused: boolean,
  ) {
    const hostElement = document.querySelector('sky-lookup');
    const input = getInputElement(fixture.componentInstance.lookupComponent);

    triggerClick(hostElement, fixture, false);

    if (focused) {
      expect(document.activeElement).toEqual(input);
    } else {
      expect(document.activeElement).not.toEqual(input);
    }
  }

  function closeModalBase(): void {
    (
      document.querySelector('.sky-lookup-show-more-modal-close') as HTMLElement
    )?.click();
  }

  function closeModal(fixture: ComponentFixture<any>): void {
    closeModalBase();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
  }

  function dismissSelectedItem(
    index: number,
    fixture: ComponentFixture<any>,
  ): void {
    const tokenElements = document.querySelectorAll('.sky-token');
    (
      tokenElements
        .item(index)
        .querySelector('.sky-token-btn-close') as HTMLElement
    ).click();
    tick();
    fixture.detectChanges();
    tick();
  }

  function getAddButton(): HTMLElement {
    return document.querySelector(
      '.sky-autocomplete-action-add',
    ) as HTMLElement;
  }

  /**
   * creates a Spy that mimics/delegates the behavior of an common example of a SkyAutocompleteSearchFunction, for tests that need real functionality to work
   */
  function getCustomSearchFunctionSpy(
    name: string,
    friends: any[],
  ): jasmine.Spy {
    return jasmine
      .createSpy(name)
      .and.callFake(
        (
          searchText: string,
          data: any[],
          args?: SkyAutocompleteSearchArgs,
        ): SkyAutocompleteSearchFunctionResponse => {
          return data.filter((anItem) => {
            if (args?.context === 'modal') {
              return true;
            }
            const found = friends.find((option) => option.name === anItem.name);
            return !found;
          });
        },
      );
  }

  function getDropdown(): HTMLElement | null {
    return document.querySelector('.sky-autocomplete-results-container');
  }

  function getInfiniteScrollWait(): HTMLElement | null {
    return document.querySelector(
      '.sky-infinite-scroll .sky-wait-mask-loading-blocking',
    );
  }

  function getInputElement(
    lookupComponent: SkyLookupComponent,
  ): HTMLInputElement {
    return lookupComponent['lookupWrapperRef']?.nativeElement.querySelector(
      '.sky-lookup-input',
    );
  }

  function getModalEl(): HTMLElement | null {
    return document.querySelector('.sky-lookup-show-more-modal');
  }

  function getModalAddButton(): HTMLElement {
    return document.querySelector(
      '.sky-lookup-show-more-modal-add',
    ) as HTMLElement;
  }

  function getModalClearAllButton(): HTMLButtonElement | null {
    return document.querySelector('.sky-lookup-show-more-modal-clear-all-btn');
  }

  function getModalContentScrollTop(): number | undefined {
    return getModalEl().querySelector('.sky-modal-content')?.scrollTop;
  }

  function getModalOnlyShowSelectedInput(): HTMLInputElement | null {
    return document.querySelector(
      'sky-toolbar-view-actions sky-checkbox input',
    );
  }

  function getModalSaveButton(): HTMLButtonElement | null {
    return document.querySelector('.sky-lookup-show-more-modal-save');
  }

  function getModalSearchButton(): HTMLButtonElement | null {
    return document.querySelector(
      '.sky-lookup-show-more-modal .sky-search-btn-apply',
    );
  }

  function getModalSearchInput(): HTMLInputElement | null {
    return document.querySelector(
      '.sky-search-input-container .sky-form-control',
    );
  }

  function getModalSearchInputValue(): string {
    const modalSearchInput = getModalSearchInput();
    return modalSearchInput?.value ?? '';
  }

  function getModalSelectAllButton(): HTMLButtonElement | null {
    return document.querySelector('.sky-lookup-show-more-modal-select-all-btn');
  }

  function getRepeaterItemCount(): number {
    return document.querySelectorAll('sky-modal sky-repeater-item').length;
  }

  function isModalOpen(): boolean {
    return document.querySelectorAll('sky-modal').length > 0;
  }

  function getSearchButton(async = false): HTMLElement {
    if (async) {
      return document.querySelector(
        '#my-async-lookup .sky-input-group-btn .sky-btn',
      ) as HTMLElement;
    } else {
      return document.querySelector(
        '#my-lookup .sky-input-group-btn .sky-btn',
      ) as HTMLElement;
    }
  }

  function getTestButton(): HTMLElement {
    return document.querySelector('#test-button');
  }

  /**
   * creates a Spy that mimics/delegates the behavior of an common example of a SkyAutocompleteSearchFunctionFilter
   */
  function getSearchFunctionFilterSpy(
    name: string,
    friends: any[],
  ): jasmine.Spy {
    return jasmine
      .createSpy(name)
      .and.callFake(
        (
          searchText: string,
          item: any,
          args?: SkyAutocompleteSearchArgs,
        ): boolean => {
          if (args?.context === 'modal') {
            return true;
          }
          const found = friends.find((option) => option.name === item.name);
          return !found;
        },
      );
  }

  function getShowMoreButton(): HTMLElement {
    return document.querySelector(
      '.sky-autocomplete-action-more',
    ) as HTMLElement;
  }

  function getShowMoreRepeaterItemContent(index: number): string {
    return (
      document
        .querySelectorAll('sky-modal sky-repeater-item-content')
        [index]?.textContent?.trim() ?? ''
    );
  }

  function getShowMoreModalTitle(): string {
    return (
      document.querySelector('sky-modal-header')?.textContent?.trim() ?? ''
    );
  }

  function getShowMoreNoResultsElement(): HTMLElement | null {
    return document.querySelector('.sky-lookup-show-more-no-results');
  }

  function getTokenElements(async = false): NodeListOf<Element> {
    if (async) {
      return document.querySelectorAll(
        '#my-async-lookup .sky-token-btn-action',
      );
    } else {
      return document.querySelectorAll('#my-lookup .sky-token-btn-action');
    }
  }

  function performSearch(
    searchText: string,
    fixture: ComponentFixture<any>,
    async = false,
  ): void {
    let inputElement: HTMLInputElement;
    if (async) {
      inputElement = getInputElement(
        fixture.componentInstance.asyncLookupComponent,
      );
    } else {
      inputElement = getInputElement(fixture.componentInstance.lookupComponent);
    }
    inputElement.focus();
    SkyAppTestUtility.fireDomEvent(inputElement, 'focusin', { bubbles: true });
    inputElement.value = searchText;
    SkyAppTestUtility.fireDomEvent(inputElement, 'input');
    tick();
    fixture.detectChanges();
    tick(200);
    fixture.detectChanges();
    tick();
  }

  async function performModalSearchAsync(
    searchText: string,
    fixture: ComponentFixture<any>,
  ): Promise<void> {
    const modalSearchInput = getModalSearchInput();
    modalSearchInput.value = searchText;
    SkyAppTestUtility.fireDomEvent(modalSearchInput, 'input');
    getModalSearchButton().click();

    fixture.detectChanges();
    await fixture.whenStable();
  }

  function saveShowMoreModal(fixture: ComponentFixture<any>): void {
    // Ensure the search async timer in the lookup fixture component is cleared
    // before saving the form.
    tick(200);
    getModalSaveButton().click();
    fixture.detectChanges();
  }

  function selectSearchResult(
    index: number,
    fixture: ComponentFixture<any>,
  ): void {
    const dropdownButtons = document.querySelectorAll(
      '.sky-autocomplete-result',
    );
    SkyAppTestUtility.fireDomEvent(dropdownButtons.item(index), 'click');
    tick();
    fixture.detectChanges();
    tick();
  }

  function selectShowOnlySelectedBase(fixture: ComponentFixture<any>): void {
    (
      document.querySelector(
        '.sky-lookup-show-more-modal-multiselect-toolbar .sky-toolbar-view-actions input',
      ) as HTMLElement
    ).click();
    fixture.detectChanges();
  }

  function selectShowOnlySelected(fixture: ComponentFixture<any>): void {
    selectShowOnlySelectedBase(fixture);
    tick(250);
    fixture.detectChanges();
  }

  async function selectShowOnlySelectedAsync(
    fixture: ComponentFixture<any>,
  ): Promise<void> {
    selectShowOnlySelectedBase(fixture);
    await fixture.whenStable();
  }

  function selectShowMoreItemMultiple(
    index: number,
    fixture: ComponentFixture<any>,
  ): void {
    (
      document.querySelectorAll(
        '.sky-lookup-show-more-repeater sky-repeater-item input',
      )[index] as HTMLElement
    ).click();
    fixture.detectChanges();
  }

  function selectShowMoreItemSingle(
    index: number,
    fixture: ComponentFixture<any>,
  ): void {
    (
      document.querySelectorAll(
        '.sky-lookup-show-more-repeater sky-repeater-item',
      )[index] as HTMLElement
    ).click();
    fixture.detectChanges();
  }

  function triggerClick(
    element: Element | null,
    fixture: ComponentFixture<any>,
    focusable = false,
  ): void {
    if (element) {
      SkyAppTestUtility.fireDomEvent(element, 'click');
      tick();
      fixture.detectChanges();
      tick();

      if (focusable) {
        (element as HTMLElement).focus();
        tick();
        fixture.detectChanges();
        tick();
      }

      SkyAppTestUtility.fireDomEvent(element, 'mouseup');
      tick();
      fixture.detectChanges();
      tick();
    }
  }

  function triggerInputFocus(
    fixture: ComponentFixture<any>,
    async = false,
  ): void {
    let inputElement: HTMLInputElement;
    if (async) {
      inputElement = getInputElement(
        fixture.componentInstance.asyncLookupComponent,
      );
    } else {
      inputElement = getInputElement(fixture.componentInstance.lookupComponent);
    }
    inputElement.focus();
    SkyAppTestUtility.fireDomEvent(inputElement, 'focusin', { bubbles: true });
  }

  function triggerKeyPress(
    element: Element,
    key: string,
    fixture: ComponentFixture<any>,
  ): void {
    SkyAppTestUtility.fireDomEvent(element, 'keydown', {
      keyboardEventInit: { key },
    });
    tick();
    fixture.detectChanges();
    tick();

    SkyAppTestUtility.fireDomEvent(element, 'keyup', {
      keyboardEventInit: { key },
    });
    tick();
    fixture.detectChanges();
    tick();
  }

  function verifyPickerId() {
    expect(getModalEl()?.id).toBeTruthy();
  }

  async function triggerModalScrollAsync(
    fixture: ComponentFixture<any>,
    newYPosition?: number,
  ): Promise<void> {
    const modalContent = document.querySelector('.sky-modal-content');
    if (modalContent) {
      modalContent.scrollTop = newYPosition ?? modalContent.scrollHeight;
      SkyAppTestUtility.fireDomEvent(modalContent, 'scroll');
      fixture.detectChanges();
      await fixture.whenStable();
    }
  }

  function validateShowMoreModalWrapperClass(
    fixture: ComponentFixture<SkyLookupTestComponent>,
    async?: boolean,
  ): void {
    const component = fixture.componentInstance;
    component.enableShowMore = true;
    component.wrapperClass = 'lookup-test-wrapper';

    fixture.detectChanges();

    clickSearchButton(fixture, async);

    expect(getModalEl()).toHaveCssClass('lookup-test-wrapper');

    closeModal(fixture);
  }

  //#endregion

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [SkyLookupFixturesModule],
    });

    // Confirm all modals are closed before another test is executed.
    expect(SkyModalHostService.openModalCount).toBe(0);
  });

  describe('reactive form', () => {
    let fixture: ComponentFixture<SkyLookupTestComponent>;
    let component: SkyLookupTestComponent;
    let asyncLookupComponent: SkyLookupComponent;
    let lookupComponent: SkyLookupComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(SkyLookupTestComponent);
      component = fixture.componentInstance;
      lookupComponent = component.lookupComponent;
      asyncLookupComponent = component.asyncLookupComponent;
    });

    afterEach(() => {
      fixture.destroy();
    });

    describe('basic setup', function () {
      function validateItems(names: string[]): void {
        const selectedItems = lookupComponent.value;

        expect(selectedItems.map((item) => item.name)).toEqual(names);
      }

      it('should set defaults', function () {
        expect(lookupComponent.ariaLabel).toEqual(undefined);
        expect(lookupComponent.ariaLabelledBy).toEqual(undefined);
        expect(lookupComponent.disabled).toEqual(false);
        expect(lookupComponent.placeholderText).toEqual(undefined);
        expect(lookupComponent.tokens).toEqual(undefined);
        expect(lookupComponent.value).toEqual([]);
      });

      it('should set autocomplete defaults', () => {
        fixture.detectChanges();

        const inputElement = getInputElement(lookupComponent);

        expect(inputElement.getAttribute('autocomplete')).toEqual('off');
      });

      it('should allow consumer to change autocomplete value', function () {
        component.autocompleteAttribute = 'new-custom-field';

        fixture.detectChanges();

        expect(lookupComponent.autocompleteAttribute).toEqual(
          'new-custom-field',
        );
      });

      it('should share the same inputs as autocomplete', function () {
        fixture.detectChanges();
        expect(typeof lookupComponent.data).not.toBeUndefined();
        expect(typeof lookupComponent.debounceTime).not.toBeUndefined();
        expect(typeof lookupComponent.descriptorProperty).not.toBeUndefined();
        expect(typeof lookupComponent.propertiesToSearch).not.toBeUndefined();
        expect(typeof lookupComponent.search).not.toBeUndefined();
        expect(typeof lookupComponent.searchResultTemplate).not.toBeUndefined();
        expect(
          typeof lookupComponent.searchTextMinimumCharacters,
        ).not.toBeUndefined();
        expect(typeof lookupComponent.searchFilters).not.toBeUndefined();
        expect(typeof lookupComponent.searchResultsLimit).not.toBeUndefined();
      });

      describe('multi-select', () => {
        beforeEach(() => {
          component.setMultiSelect();
        });

        it('should allow preselected tokens', fakeAsync(() => {
          const friends = [{ name: 'Rachel' }];
          component.friends = friends;
          expect(lookupComponent.value).toEqual([]);
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          tick();
          // Ensure that we get a copy of the original array back and that we aren't modifying the original
          expect(lookupComponent.value).not.toBe(friends);
          expect(lookupComponent.value).toEqual(friends);
        }));

        it('should add new tokens', fakeAsync(function () {
          fixture.detectChanges();
          expect(lookupComponent.value).toEqual([]);

          performSearch('s', fixture);
          selectSearchResult(0, fixture);

          const selectedItems = lookupComponent.value;
          expect(selectedItems.length).toEqual(1);
          expect(selectedItems[0].name).toEqual('Isaac');
        }));

        it('should not collapse tokens if more than 5 items are selected with `enableShowMore` disabled', fakeAsync(() => {
          component.friends = [
            { name: 'Fred', description: 'Mr. Fred' },
            { name: 'Isaac', description: 'Mr. Isaac' },
            { name: 'John', description: 'Mr. John' },
            { name: 'Joyce', description: 'Mrs. Joyce' },
            { name: 'Lindsey', description: 'Mrs. Lindsey' },
          ];
          fixture.detectChanges();

          expect(lookupComponent.tokens?.length).toBe(5);
          expect(lookupComponent.tokens![0].value).toEqual({
            name: 'Fred',
            description: 'Mr. Fred',
          });
          expect(lookupComponent.value).toEqual([
            { name: 'Fred', description: 'Mr. Fred' },
            { name: 'Isaac', description: 'Mr. Isaac' },
            { name: 'John', description: 'Mr. John' },
            { name: 'Joyce', description: 'Mrs. Joyce' },
            { name: 'Lindsey', description: 'Mrs. Lindsey' },
          ]);

          performSearch('Oli', fixture);
          selectSearchResult(0, fixture);

          expect(lookupComponent.tokens?.length).toBe(6);
          expect(lookupComponent.tokens![0].value).toEqual({
            name: 'Fred',
            description: 'Mr. Fred',
          });
          expect(lookupComponent.value).toEqual([
            { name: 'Fred', description: 'Mr. Fred' },
            { name: 'Isaac', description: 'Mr. Isaac' },
            { name: 'John', description: 'Mr. John' },
            { name: 'Joyce', description: 'Mrs. Joyce' },
            { name: 'Lindsey', description: 'Mrs. Lindsey' },
            { name: 'Oliver', description: 'Mr. Oliver' },
          ]);
        }));

        it('should NOT add new tokens if value is empty', fakeAsync(function () {
          fixture.detectChanges();
          tick();
          expect(lookupComponent.value).toEqual([]);

          performSearch('s', fixture);
          selectSearchResult(0, fixture);

          performSearch('', fixture);
          getInputElement(lookupComponent).blur();
          fixture.detectChanges();
          tick(25);

          const selectedItems = lookupComponent.value;
          expect(selectedItems.length).toEqual(1);
          expect(selectedItems[0].name).toEqual('Isaac');
        }));

        it('should change the value of the lookup if tokens change', fakeAsync(function () {
          fixture.detectChanges();
          expect(lookupComponent.value).toEqual([]);

          performSearch('s', fixture);
          selectSearchResult(0, fixture);

          performSearch('s', fixture);
          selectSearchResult(1, fixture);

          expect(lookupComponent.value.length).toEqual(2);

          dismissSelectedItem(0, fixture);

          expect(lookupComponent.value.length).toEqual(1);
        }));

        it('should not do anything on token click', fakeAsync(() => {
          const showMoreSpy = spyOn(
            component.lookupComponent,
            'openPicker',
          ).and.stub();

          component.friends = [
            { name: 'Fred', description: 'Mr. Fred' },
            { name: 'Isaac', description: 'Mr. Isaac' },
          ];
          fixture.detectChanges();
          tick();

          clickToken(0, fixture);

          expect(showMoreSpy).not.toHaveBeenCalled();
        }));

        it('should focus the input if all tokens are dismissed', fakeAsync(() => {
          component.friends = [{ name: 'Rachel' }];
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          dismissSelectedItem(0, fixture);

          const inputElement = getInputElement(lookupComponent);
          expect(lookupComponent.value.length).toEqual(0);
          expect(document.activeElement).toEqual(inputElement);
        }));

        it('should allow duplicate tokens if idProperty is not set', fakeAsync(function () {
          component.idProperty = undefined;
          fixture.detectChanges();
          validateItems([]);

          performSearch('s', fixture);
          selectSearchResult(0, fixture);

          performSearch('s', fixture);
          selectSearchResult(0, fixture);

          validateItems(['Isaac', 'Isaac']);
        }));

        it('should not allow duplicate tokens if idProperty is set', fakeAsync(function () {
          component.idProperty = 'id';
          fixture.detectChanges();

          validateItems([]);

          performSearch('s', fixture);
          selectSearchResult(0, fixture);

          performSearch('s', fixture);
          selectSearchResult(0, fixture);

          validateItems(['Isaac']);
        }));

        it('should NOT add new tokens if value is empty', fakeAsync(function () {
          fixture.detectChanges();
          tick();
          validateItems([]);

          performSearch('s', fixture);
          selectSearchResult(0, fixture);

          performSearch('', fixture);
          getInputElement(lookupComponent).blur();
          fixture.detectChanges();
          tick(25);

          validateItems(['Isaac']);
        }));
      });

      it('should mark the form as dirty when the form value changes', fakeAsync(() => {
        component.friends = [{ name: 'Rachel' }];
        fixture.detectChanges();
        expect(component.form.dirty).toEqual(false);

        dismissSelectedItem(0, fixture);

        expect(component.form.dirty).toEqual(true);
      }));

      it('should mark the form as touched when the form loses focus', fakeAsync(() => {
        fixture.detectChanges();
        const inputElement = getInputElement(lookupComponent);
        expect(component.form.touched).toEqual(false);

        SkyAppTestUtility.fireDomEvent(inputElement, 'blur');
        // Our blur listener has a delay of 25ms. This tick accounts for that.
        tick(25);
        fixture.detectChanges();

        expect(component.form.touched).toEqual(true);
      }));

      it('should remove all but the first value when the mode is changed to single select', fakeAsync(() => {
        component.friends = [
          { name: 'Rachel' },
          { name: 'Isaac', description: 'Mr. Isaac' },
        ];
        fixture.detectChanges();

        component.setSingleSelect();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(lookupComponent.value).toEqual([{ name: 'Rachel' }]);
      }));

      it('should call for the dropdown to be repositioned when tokens change', fakeAsync(() => {
        const spy = spyOn(
          lookupComponent.autocompleteController,
          'next',
        ).and.stub();
        fixture.detectChanges();

        // Add one token
        performSearch('r', fixture);
        selectSearchResult(0, fixture);

        // Activate search to show dropdown
        performSearch('r', fixture);

        // Remove a token with the dropdown still open
        const closeTokenButton = fixture.nativeElement.querySelector(
          '.sky-token-btn-close',
        );
        closeTokenButton.click();
        fixture.detectChanges();
        tick();

        // Should send message to dropdown to reposition.
        expect(spy).toHaveBeenCalledWith({
          type: SkyAutocompleteMessageType.RepositionDropdown,
        });
      }));

      it('should search for values correctly when using an async search function', fakeAsync(function () {
        fixture.detectChanges();
        expect(asyncLookupComponent.value).toEqual([]);

        performSearch('s', fixture, true);
        selectSearchResult(0, fixture);

        performSearch('s', fixture, true);
        selectSearchResult(1, fixture);

        expect(asyncLookupComponent.value.length).toEqual(2);
      }));

      describe('form control interactions', function () {
        it('should properly reset a form', fakeAsync(function () {
          fixture.detectChanges();

          performSearch('s', fixture);
          selectSearchResult(0, fixture);

          expect(lookupComponent.tokens?.length).toBe(1);
          expect(lookupComponent.value).toEqual([
            { name: 'Isaac', description: 'Mr. Isaac' },
          ]);

          component.resetForm();

          expect(lookupComponent.tokens?.length).toBe(0);
          expect(lookupComponent.value).toEqual([]);
        }));

        it('should properly set a value through the form control', fakeAsync(function () {
          fixture.detectChanges();

          performSearch('s', fixture);
          selectSearchResult(0, fixture);

          expect(lookupComponent.tokens?.length).toBe(1);
          expect(lookupComponent.tokens![0].value).toEqual({
            name: 'Isaac',
            description: 'Mr. Isaac',
          });
          expect(lookupComponent.value).toEqual([
            { name: 'Isaac', description: 'Mr. Isaac' },
          ]);

          component.setValue(0);

          expect(lookupComponent.tokens?.length).toBe(1);
          expect(lookupComponent.tokens![0].value).toEqual({
            name: 'Andy',
            description: 'Mr. Andy',
            birthDate: '1/1/1995',
          });
          expect(lookupComponent.value).toEqual([
            {
              name: 'Andy',
              description: 'Mr. Andy',
              birthDate: '1/1/1995',
            },
          ]);
        }));

        it('should allow api value changes when disabled ', fakeAsync(() => {
          fixture.detectChanges();
          performSearch('s', fixture);
          selectSearchResult(0, fixture);
          expect(lookupComponent.tokens?.length).toBe(1);
          expect(lookupComponent.tokens![0].value).toEqual({
            name: 'Isaac',
            description: 'Mr. Isaac',
          });
          expect(lookupComponent.value).toEqual([
            { name: 'Isaac', description: 'Mr. Isaac' },
          ]);

          component.disableLookup();
          component.setValue(0);

          expect(lookupComponent.tokens?.length).toBe(1);
          expect(lookupComponent.tokens![0].value).toEqual({
            name: 'Andy',
            description: 'Mr. Andy',
            birthDate: '1/1/1995',
          });
          expect(lookupComponent.value).toEqual([
            {
              name: 'Andy',
              description: 'Mr. Andy',
              birthDate: '1/1/1995',
            },
          ]);
        }));
      });
    });

    describe('single select', () => {
      beforeEach(() => {
        component.setSingleSelect();
      });

      it('should emit only once per value change', fakeAsync(() => {
        const bestFriend = { name: 'Rachel' };
        component.friends = [bestFriend];

        let counter = 0;

        const sub = component.form.valueChanges.subscribe(() => {
          counter++;
        });

        // Expect zero on init.
        fixture.detectChanges();
        expect(counter).toEqual(0);
        counter = 0;

        // Programmatic change:
        component.form.setValue({
          friends: [{ name: 'Xavier' }],
        });
        fixture.detectChanges();
        expect(counter).toEqual(1);
        counter = 0;

        // User interaction:
        performSearch('s', fixture);
        selectSearchResult(0, fixture);
        expect(counter).toEqual(1);
        counter = 0;

        // Programmatic, set to null:
        component.form.setValue({
          friends: null,
        });
        fixture.detectChanges();
        expect(counter).toEqual(1);
        counter = 0;

        // Programmatic, but do not notify:
        component.form.setValue(
          {
            friends: [{ name: 'Isaac' }],
          },
          { emitEvent: false },
        );
        fixture.detectChanges();
        expect(counter).toEqual(0);
        counter = 0;

        sub.unsubscribe();
      }));

      it('should allow a preselected value', fakeAsync(() => {
        const bestFriend = { name: 'Rachel' };
        expect(lookupComponent.value).toEqual([]);

        component.friends = [bestFriend];
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(lookupComponent.value).toEqual([bestFriend]);
      }));

      it('should select the value on focus', fakeAsync(() => {
        component.friends = [{ name: 'Rachel' }];
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(lookupComponent.value).toEqual([{ name: 'Rachel' }]);

        triggerInputFocus(fixture);
        expect(window.getSelection().toString()).toBe('Rachel');
      }));

      it('should select a new value when none is selected', fakeAsync(function () {
        const bestFriend = { name: 'Rachel' };
        component.friends = [bestFriend];
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(lookupComponent.value).toEqual([bestFriend]);

        performSearch('s', fixture);
        selectSearchResult(0, fixture);

        expect(lookupComponent.value).toEqual([
          { name: 'Isaac', description: 'Mr. Isaac' },
        ]);
      }));

      it('should select a new value when a different value is selected', fakeAsync(function () {
        fixture.detectChanges();
        expect(lookupComponent.value).toEqual([]);

        performSearch('s', fixture);
        selectSearchResult(0, fixture);

        expect(lookupComponent.value).toEqual([
          { name: 'Isaac', description: 'Mr. Isaac' },
        ]);
      }));

      it('should clear the value when the search text is cleared', fakeAsync(function () {
        fixture.detectChanges();
        expect(lookupComponent.value).toEqual([]);

        performSearch('s', fixture);
        selectSearchResult(0, fixture);

        expect(lookupComponent.value).toEqual([
          { name: 'Isaac', description: 'Mr. Isaac' },
        ]);

        performSearch('', fixture);

        expect(lookupComponent.value).toEqual([]);
      }));

      it('should NOT set a new value when no search options are returned', fakeAsync(function () {
        fixture.detectChanges();
        expect(lookupComponent.value).toEqual([]);

        performSearch('no results for this search', fixture);
        getInputElement(lookupComponent).blur();
        fixture.detectChanges();
        tick(25);

        expect(lookupComponent.value).toEqual([]);
      }));

      it('should search for values correctly when using an async search function', fakeAsync(function () {
        fixture.detectChanges();
        expect(asyncLookupComponent.value).toEqual([]);

        performSearch('s', fixture, true);
        selectSearchResult(0, fixture);

        expect(asyncLookupComponent.value).toEqual([
          { name: 'Isaac', description: 'Mr. Isaac' },
        ]);

        performSearch('', fixture, true);

        expect(asyncLookupComponent.value).toEqual([]);
      }));

      describe('form control interactions', function () {
        it('should properly reset a form', fakeAsync(function () {
          fixture.detectChanges();

          performSearch('s', fixture);
          selectSearchResult(0, fixture);

          expect(getInputElement(lookupComponent).value).toBe('Isaac');
          expect(lookupComponent.value).toEqual([
            { name: 'Isaac', description: 'Mr. Isaac' },
          ]);

          component.resetForm();

          expect(getInputElement(lookupComponent).value).toBe('');
          expect(lookupComponent.value).toEqual([]);
        }));

        it('should properly set a value through the form control', fakeAsync(function () {
          fixture.detectChanges();

          performSearch('s', fixture);
          selectSearchResult(0, fixture);

          expect(getInputElement(lookupComponent).value).toBe('Isaac');
          expect(lookupComponent.value).toEqual([
            { name: 'Isaac', description: 'Mr. Isaac' },
          ]);

          component.setValue(0);

          expect(getInputElement(lookupComponent).value).toBe('Andy');
          expect(lookupComponent.value).toEqual([
            {
              name: 'Andy',
              description: 'Mr. Andy',
              birthDate: '1/1/1995',
            },
          ]);
        }));
      });
    });

    describe('actions', () => {
      describe('add button', () => {
        beforeEach(fakeAsync(() => {
          fixture.detectChanges();
          tick();
        }));

        afterEach(() => {
          fixture.destroy();
        });

        describe('non-async', () => {
          it('should emit an event correctly when the add button is enabled and clicked', fakeAsync(() => {
            component.showAddButton = true;
            const addButtonSpy = spyOn(
              component,
              'addButtonClicked',
            ).and.callThrough();
            fixture.detectChanges();

            // Type 'r' to activate the autocomplete dropdown, then click the first result.
            performSearch('r', fixture);

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
            performSearch('r', fixture);

            let addButton = getAddButton();
            expect(addButton).toBeNull();
            expect(addButtonSpy).not.toHaveBeenCalled();

            component.showAddButton = undefined;
            fixture.detectChanges();

            // Type 'r' to activate the autocomplete dropdown, then click the first result.
            performSearch('r', fixture);

            addButton = getAddButton();
            expect(addButton).toBeNull();
            expect(addButtonSpy).not.toHaveBeenCalled();
          }));

          it('should emit an event correctly when the add button is clicked from the modal', fakeAsync(() => {
            component.showAddButton = true;
            component.enableShowMore = true;
            const addButtonSpy = spyOn(
              component,
              'addButtonClicked',
            ).and.callThrough();
            fixture.detectChanges();

            performSearch('s', fixture);
            selectSearchResult(0, fixture);

            expect(lookupComponent.value).toEqual([
              { name: 'Isaac', description: 'Mr. Isaac' },
            ]);

            clickShowMore(fixture);
            fixture.detectChanges();
            tick();

            clickShowMoreAddButton(fixture);
            fixture.detectChanges();
            tick();

            closeModal(fixture);

            expect(addButtonSpy).toHaveBeenCalled();
          }));
        });

        it('should add the expected wrapperClass to the modal', fakeAsync(() => {
          validateShowMoreModalWrapperClass(fixture);
        }));

        describe('async', () => {
          it('should emit an event correctly when the add button is enabled and clicked', fakeAsync(() => {
            component.showAddButton = true;
            const addButtonSpy = spyOn(
              component,
              'addButtonClicked',
            ).and.callThrough();
            fixture.detectChanges();

            // Type 'r' to activate the autocomplete dropdown, then click the first result.
            performSearch('r', fixture, true);

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
            performSearch('r', fixture, true);

            const addButton = getAddButton();
            expect(addButton).toBeNull();
            expect(addButtonSpy).not.toHaveBeenCalled();
          }));

          it('should emit an event correctly when the add button is clicked from the modal', fakeAsync(() => {
            component.showAddButton = true;
            component.enableShowMore = true;
            const addButtonSpy = spyOn(
              component,
              'addButtonClicked',
            ).and.callThrough();
            fixture.detectChanges();

            performSearch('s', fixture, true);
            selectSearchResult(0, fixture);

            expect(asyncLookupComponent.value).toEqual([
              { name: 'Isaac', description: 'Mr. Isaac' },
            ]);

            clickShowMore(fixture);
            fixture.detectChanges();
            tick();

            clickShowMoreAddButton(fixture);
            fixture.detectChanges();
            tick();

            closeModal(fixture);

            expect(addButtonSpy).toHaveBeenCalled();
          }));

          it('should add the expected wrapperClass to the modal', fakeAsync(() => {
            validateShowMoreModalWrapperClass(fixture, true);
          }));
        });

        describe('multi select', () => {
          describe('non-async', () => {
            it('should add the item to the selected items when there is not a show more picker open', fakeAsync(() => {
              component.setMultiSelect();
              component.showAddButton = true;
              fixture.detectChanges();

              performSearch('s', fixture);
              selectSearchResult(0, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              clickAddButton();
              fixture.detectChanges();
              tick();

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
                { name: 'New item' },
              ]);
              expect(lookupComponent.data[0]).toEqual({
                name: 'New item',
              });
            }));

            it(`should add the item to the modal's selected items when a show more picker is open`, fakeAsync(() => {
              component.setMultiSelect();
              component.showAddButton = true;
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('s', fixture);
              selectSearchResult(0, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              clickShowMore(fixture);
              fixture.detectChanges();
              tick();

              clickShowMoreAddButton(fixture);
              fixture.detectChanges();
              tick();
              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              saveShowMoreModal(fixture);
              fixture.detectChanges();
              tick();

              expect(lookupComponent.value).toEqual([
                { name: 'New item' },
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);
              expect(lookupComponent.data[0]).toEqual({
                name: 'New item',
              });
            }));

            it(`should add the item to the modal's selected items when a show more picker is open but should cancel back to the original selection`, fakeAsync(() => {
              component.setMultiSelect();
              component.showAddButton = true;
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('s', fixture);
              selectSearchResult(0, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              clickShowMore(fixture);
              fixture.detectChanges();
              tick();

              clickShowMoreAddButton(fixture);
              fixture.detectChanges();
              tick();
              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              closeModal(fixture);
              fixture.detectChanges();
              tick();

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);
              expect(lookupComponent.data[0]).toEqual({
                name: 'New item',
              });
            }));

            it(`should not add the item to the modal's selected items when a show more picker is open but the underlying data is not updated`, fakeAsync(() => {
              component.setMultiSelect();
              component.ignoreAddDataUpdate = true;
              component.showAddButton = true;
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('s', fixture);
              selectSearchResult(0, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              clickShowMore(fixture);
              fixture.detectChanges();
              tick();

              clickShowMoreAddButton(fixture);
              fixture.detectChanges();
              tick();
              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              saveShowMoreModal(fixture);
              fixture.detectChanges();
              tick();

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);
            }));
          });

          describe('async', () => {
            it('should add the item to the selected items when there is not a show more picker open', fakeAsync(() => {
              component.setMultiSelect();
              component.showAddButton = true;
              fixture.detectChanges();

              performSearch('s', fixture, true);
              selectSearchResult(0, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              clickAddButton();
              fixture.detectChanges();
              tick();

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
                { name: 'New item' },
              ]);
            }));

            it(`should add the item to the modal's selected items when a show more picker is open`, fakeAsync(() => {
              component.setMultiSelect();
              component.showAddButton = true;
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('s', fixture, true);
              selectSearchResult(0, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              clickShowMore(fixture);
              fixture.detectChanges();
              tick();

              clickShowMoreAddButton(fixture);
              fixture.detectChanges();
              tick();
              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              saveShowMoreModal(fixture);
              fixture.detectChanges();
              tick();

              expect(asyncLookupComponent.value).toEqual([
                { name: 'New item' },
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);
            }));

            it(`should add the item to the modal's selected items when a show more picker is open but should cancel back to the original selection`, fakeAsync(() => {
              component.setMultiSelect();
              component.showAddButton = true;
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('s', fixture, true);
              selectSearchResult(0, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              clickShowMore(fixture);
              fixture.detectChanges();
              tick();

              clickShowMoreAddButton(fixture);
              fixture.detectChanges();
              tick();
              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              closeModal(fixture);
              fixture.detectChanges();
              tick();

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);
            }));
          });
        });

        describe('single select', () => {
          describe('non-async', () => {
            it('should add the item to the selected items when there is not a show more picker open', fakeAsync(() => {
              component.setSingleSelect();
              component.showAddButton = true;
              fixture.detectChanges();

              performSearch('s', fixture);
              selectSearchResult(0, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              clickAddButton();
              fixture.detectChanges();
              tick();

              expect(lookupComponent.value).toEqual([{ name: 'New item' }]);
              expect(lookupComponent.data[0]).toEqual({
                name: 'New item',
              });
            }));

            it(`should add the item to the modal's selected items when a show more picker is open`, fakeAsync(() => {
              component.setSingleSelect();
              component.showAddButton = true;
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('s', fixture);
              selectSearchResult(0, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              clickShowMore(fixture);
              fixture.detectChanges();
              tick();

              clickShowMoreAddButton(fixture);
              fixture.detectChanges();
              tick();
              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              saveShowMoreModal(fixture);
              fixture.detectChanges();
              tick();

              expect(lookupComponent.value).toEqual([{ name: 'New item' }]);
              expect(lookupComponent.data[0]).toEqual({
                name: 'New item',
              });
            }));

            it(`should add the item to the modal's selected items when a show more picker is open but should cancel back to the original selection`, fakeAsync(() => {
              component.setSingleSelect();
              component.showAddButton = true;
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('s', fixture);
              selectSearchResult(0, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              clickShowMore(fixture);
              fixture.detectChanges();
              tick();

              clickShowMoreAddButton(fixture);
              fixture.detectChanges();
              tick();
              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              closeModal(fixture);
              fixture.detectChanges();
              tick();

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);
              expect(lookupComponent.data[0]).toEqual({
                name: 'New item',
              });
            }));

            it(`should not add the item to the modal's selected items when a show more picker is open but the underlying data is not updated`, fakeAsync(() => {
              component.setSingleSelect();
              component.ignoreAddDataUpdate = true;
              component.showAddButton = true;
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('s', fixture);
              selectSearchResult(0, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              clickShowMore(fixture);
              fixture.detectChanges();
              tick();

              clickShowMoreAddButton(fixture);
              fixture.detectChanges();
              tick();
              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              saveShowMoreModal(fixture);
              fixture.detectChanges();
              tick();

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);
            }));
          });

          describe('async', () => {
            it('should add the item to the selected items when there is not a show more picker open', fakeAsync(() => {
              component.setSingleSelect();
              component.showAddButton = true;
              fixture.detectChanges();

              performSearch('s', fixture, true);
              selectSearchResult(0, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              clickAddButton();
              fixture.detectChanges();
              tick();

              expect(asyncLookupComponent.value).toEqual([
                { name: 'New item' },
              ]);
            }));

            it(`should add the item to the modal's selected items when a show more picker is saved`, fakeAsync(() => {
              component.setSingleSelect();
              component.showAddButton = true;
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('s', fixture, true);
              selectSearchResult(0, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              clickShowMore(fixture);
              fixture.detectChanges();
              tick();

              clickShowMoreAddButton(fixture);
              fixture.detectChanges();
              tick();
              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              saveShowMoreModal(fixture);
              fixture.detectChanges();
              tick();

              expect(asyncLookupComponent.value).toEqual([
                { name: 'New item' },
              ]);
            }));

            it(`should add the item to the modal's selected items when a show more picker is open but should cancel back to the original selection`, fakeAsync(() => {
              component.setSingleSelect();
              component.showAddButton = true;
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('s', fixture, true);
              selectSearchResult(0, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              clickShowMore(fixture);
              fixture.detectChanges();
              tick();

              clickShowMoreAddButton(fixture);
              fixture.detectChanges();
              tick();
              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              closeModal(fixture);
              fixture.detectChanges();
              tick();

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);
            }));
          });
        });
      });

      describe('show more button', () => {
        let modalService: SkyModalService;

        beforeEach(fakeAsync(() => {
          modalService = TestBed.inject(SkyModalService);

          fixture.detectChanges();
          tick();
        }));

        afterEach(() => {
          fixture.destroy();
        });

        describe('non-async', () => {
          it('should open the modal when the show more button is clicked', fakeAsync(() => {
            component.enableShowMore = true;
            fixture.detectChanges();

            spyOn(modalService, 'open').and.callThrough();

            performSearch('r', fixture);
            clickShowMore(fixture);

            expect(modalService.open).toHaveBeenCalled();

            verifyPickerId();

            closeModal(fixture);
          }));

          it('should open the modal when the show more button is clicked with no config', fakeAsync(() => {
            component.enableShowMore = true;
            component.showMoreConfig = undefined;
            fixture.detectChanges();

            spyOn(modalService, 'open').and.callThrough();

            performSearch('r', fixture);
            clickShowMore(fixture);

            expect(modalService.open).toHaveBeenCalled();

            closeModal(fixture);
          }));

          it('should open the modal when the search button is clicked', fakeAsync(() => {
            component.enableShowMore = true;
            fixture.detectChanges();

            spyOn(modalService, 'open').and.callThrough();

            clickSearchButton(fixture);

            expect(modalService.open).toHaveBeenCalled();

            closeModal(fixture);
          }));

          it('should close the dropdown when the search button is clicked', fakeAsync(() => {
            component.enableShowMore = true;
            fixture.detectChanges();

            performSearch('r', fixture);
            expect(getDropdown()).not.toBeNull();

            clickSearchButton(fixture);

            expect(getDropdown()).toBeNull();

            closeModal(fixture);
          }));

          it('should populate search bar with current input value when the search button is clicked', fakeAsync(() => {
            component.enableShowMore = true;
            fixture.detectChanges();

            performSearch('foo', fixture);
            SkyAppTestUtility.fireDomEvent(
              getInputElement(lookupComponent),
              'blur',
            );
            fixture.detectChanges();

            clickSearchButton(fixture);

            expect(getModalSearchInputValue()).toEqual('foo');

            closeModal(fixture);
          }));

          it('should scroll to the top of the modal and not show the infinite scroll wait when searching', async () => {
            component.enableShowMore = true;
            component.enableSearchResultTemplate();
            component.customSearch = (_: string, data: any[]) => {
              return data.slice(0, 14);
            };
            fixture.detectChanges();
            await fixture.whenStable();

            triggerInputFocus(fixture);
            fixture.detectChanges();
            await fixture.whenStable();

            await clickShowMoreAsync(fixture);

            expect(getRepeaterItemCount()).toBe(10);

            await triggerModalScrollAsync(fixture);

            expect(getRepeaterItemCount()).toBe(20);

            await triggerModalScrollAsync(fixture);

            expect(getRepeaterItemCount()).toBe(21);

            expect(getModalContentScrollTop()).not.toBe(0);

            await performModalSearchAsync('foo', fixture);

            expect(getRepeaterItemCount()).toBe(10);

            expect(getModalContentScrollTop()).toBe(0);

            expect(getInfiniteScrollWait()).toBeNull();

            closeModalBase();
          });

          it('should respect the `propertiesToSearch` input in the show more modal', fakeAsync(() => {
            component.enableShowMore = true;
            component.propertiesToSearch = ['description'];
            fixture.detectChanges();

            performSearch('Mrs.', fixture);

            clickSearchButton(fixture);

            expect(getRepeaterItemCount()).toBe(4);

            closeModal(fixture);
          }));

          it('should respect the `search` input in the show more modal', fakeAsync(() => {
            component.enableShowMore = true;
            component.customSearch = (_: string, data: any[]) => {
              return [data[0]];
            };
            fixture.detectChanges();

            performSearch('Mr', fixture);

            clickSearchButton(fixture);

            expect(getRepeaterItemCount()).toBe(1);

            closeModal(fixture);
          }));

          it('should respect the `search` input in the show more modal when the function returns a promise', fakeAsync(() => {
            component.enableShowMore = true;
            component.customSearch = (_: string, data: any[]) => {
              return Promise.resolve([data[0]]);
            };
            fixture.detectChanges();

            performSearch('Mr', fixture);

            clickSearchButton(fixture);

            expect(getRepeaterItemCount()).toBe(1);

            closeModal(fixture);
          }));

          it('should handle not results being shown', fakeAsync(() => {
            component.enableShowMore = true;
            component.data = undefined;
            fixture.detectChanges();

            performSearch('Mr', fixture);

            clickSearchButton(fixture);

            expect(getRepeaterItemCount()).toBe(0);
            expect(getShowMoreNoResultsElement()).not.toBeNull();

            closeModal(fixture);
          }));
        });

        describe('async', () => {
          it('should open the modal when the show more button is clicked', fakeAsync(() => {
            component.enableShowMore = true;
            fixture.detectChanges();

            spyOn(modalService, 'open').and.callThrough();

            performSearch('r', fixture, true);
            clickShowMore(fixture);

            expect(modalService.open).toHaveBeenCalled();

            verifyPickerId();

            closeModal(fixture);
          }));

          it('should open the modal when the show more button is clicked with no config', fakeAsync(() => {
            component.enableShowMore = true;
            component.showMoreConfig = undefined;
            fixture.detectChanges();

            spyOn(modalService, 'open').and.callThrough();

            performSearch('r', fixture, true);
            clickShowMore(fixture);

            expect(modalService.open).toHaveBeenCalled();

            closeModal(fixture);
          }));

          it('should open the modal when the search button is clicked', fakeAsync(() => {
            component.enableShowMore = true;
            fixture.detectChanges();

            spyOn(modalService, 'open').and.callThrough();

            clickSearchButton(fixture, true);

            expect(modalService.open).toHaveBeenCalled();

            closeModal(fixture);
          }));

          it('should close the dropdown when the search button is clicked', fakeAsync(() => {
            component.enableShowMore = true;
            fixture.detectChanges();

            performSearch('r', fixture, true);
            expect(getDropdown()).not.toBeNull();

            clickSearchButton(fixture, true);

            expect(getDropdown()).toBeNull();

            closeModal(fixture);
          }));

          it('should populate search bar with current input value when the search button is clicked', fakeAsync(() => {
            component.enableShowMore = true;
            fixture.detectChanges();

            performSearch('foo', fixture, true);
            SkyAppTestUtility.fireDomEvent(
              getInputElement(asyncLookupComponent),
              'blur',
            );
            fixture.detectChanges();

            clickSearchButton(fixture, true);

            expect(getModalSearchInputValue()).toEqual('foo');

            closeModal(fixture);
          }));

          it('should scroll to the top of the modal and not show the infinite scroll wait when searching', async () => {
            component.enableShowMore = true;
            component.enableSearchResultTemplate();
            component.customSearch = (_: string, data: any[]) => {
              return data.slice(0, 14);
            };
            fixture.detectChanges();
            await fixture.whenStable();

            triggerInputFocus(fixture);
            fixture.detectChanges();
            await fixture.whenStable();

            await clickShowMoreAsync(fixture);

            expect(getRepeaterItemCount()).toBe(10);

            await triggerModalScrollAsync(fixture);

            expect(getRepeaterItemCount()).toBe(20);

            await triggerModalScrollAsync(fixture);

            expect(getRepeaterItemCount()).toBe(21);

            expect(getModalContentScrollTop()).not.toBe(0);

            await performModalSearchAsync('foo', fixture);

            expect(getRepeaterItemCount()).toBe(10);

            expect(getModalContentScrollTop()).toBe(0);

            expect(getInfiniteScrollWait()).toBeNull();

            closeModalBase();
          });

          it('should handle not results being shown', fakeAsync(() => {
            component.enableShowMore = true;
            component.data = undefined;
            fixture.detectChanges();

            performSearch('Mr', fixture, true);

            clickSearchButton(fixture, true);

            expect(getRepeaterItemCount()).toBe(0);
            expect(getShowMoreNoResultsElement()).not.toBeNull();

            closeModal(fixture);
          }));

          it('should log an error when an async search function is used without the idProperty set and the show more modal is enabled', fakeAsync(function () {
            component.enableShowMore = true;
            component.idProperty = undefined;
            const logService = TestBed.inject(SkyLogService);
            const errorLogSpy = spyOn(logService, 'error').and.stub();

            fixture.detectChanges();
            expect(asyncLookupComponent.value).toEqual([]);

            performSearch('s', fixture, true);
            clickShowMore(fixture);
            fixture.detectChanges();
            tick();

            expect(errorLogSpy).toHaveBeenCalledWith(
              "The lookup component's 'idProperty' input is required when `enableShowMore` and 'searchAsync' are used together.",
            );
            closeModal(fixture);
          }));
        });

        describe('multi-select', () => {
          describe('non-async', () => {
            it('should populate the correct selected item and save that when no changes are made', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(0, fixture);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              closeModal(fixture);
            }));

            it('should select the correct items when multiple are selected from the show all modal', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              selectShowMoreItemMultiple(0, fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              closeModal(fixture);
            }));

            it('should not make any changes when the show all modal is cancelled', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              selectShowMoreItemMultiple(0, fixture);

              closeModal(fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);
            }));

            it('should select the correct items when items are deselected from the show all modal', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              selectShowMoreItemMultiple(0, fixture);
              selectShowMoreItemMultiple(1, fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              closeModal(fixture);
            }));

            it('should select the correct items after existing search text is cleared', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              clearShowMoreSearch(fixture);

              selectShowMoreItemMultiple(0, fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([
                {
                  name: 'Andy',
                  description: 'Mr. Andy',
                  birthDate: '1/1/1995',
                },
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              closeModal(fixture);
            }));

            it('should handle "Clear all" correct in the show more modal', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('Pa', fixture);
              selectSearchResult(0, fixture);

              expect(lookupComponent.value).toEqual([
                {
                  name: 'Patty',
                  description: 'Ms. Patty',
                  birthDate: '1/1/1996',
                },
              ]);

              performSearch('Pa', fixture);
              clickShowMore(fixture);

              clickShowMoreClearAll(fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([]);

              closeModal(fixture);
            }));

            it('should handle "Select all" correct in the show more modal', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('Pa', fixture);
              selectSearchResult(0, fixture);

              expect(lookupComponent.value).toEqual([
                {
                  name: 'Patty',
                  description: 'Ms. Patty',
                  birthDate: '1/1/1996',
                },
              ]);

              performSearch('Pa', fixture);
              clickShowMore(fixture);

              clickShowMoreSelectAll(fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([
                {
                  name: 'Patty',
                  description: 'Ms. Patty',
                  birthDate: '1/1/1996',
                },
                {
                  name: 'Paul',
                  description: 'Mr. Paul',
                  birthDate: '11/1997',
                },
              ]);

              closeModal(fixture);
            }));

            it('should handle "Only show selected correctly in the show more modal', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              selectShowOnlySelected(fixture);

              selectShowMoreItemMultiple(0, fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([]);

              closeModal(fixture);
            }));

            it('should add items when scrolling ends with "Only show selected" active', async () => {
              component.enableShowMore = true;
              component.friends = [
                ...(component.data?.filter((item) => !item.birthDate) ?? []),
              ];

              fixture.detectChanges();
              await fixture.whenStable();

              triggerInputFocus(fixture);
              fixture.detectChanges();
              await fixture.whenStable();

              await clickShowMoreAsync(fixture);

              await selectShowOnlySelectedAsync(fixture);

              expect(getRepeaterItemCount()).toBe(10);

              await triggerModalScrollAsync(fixture);

              expect(getRepeaterItemCount()).toBe(18);

              closeModalBase();
            });

            it('should respect a custom modal title', fakeAsync(() => {
              component.enableShowMore = true;
              component.setShowMoreNativePickerConfig({
                title: 'Custom title',
              });
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              expect(getShowMoreModalTitle()).toBe('Custom title');

              closeModal(fixture);
            }));

            it('should set default title and aria labels without a selection descriptor', fakeAsync(() => {
              component.enableShowMore = true;
              component.showAddButton = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              const selectButton = getModalSaveButton();

              expect(getShowMoreModalTitle()).toBe('Select items');

              expect(getModalSearchInput()?.getAttribute('aria-label')).toBe(
                'Search items',
              );
              // Test that button text isn't contextual and only the `aria-label`
              expect(selectButton?.textContent.trim()).toBe('Select');
              expect(selectButton?.getAttribute('aria-label')).toBe(
                'Select items',
              );

              // Test that button text isn't contextual and only the `aria-label`
              expect(getModalClearAllButton()?.textContent.trim()).toBe(
                'Clear all',
              );
              expect(getModalClearAllButton().getAttribute('aria-label')).toBe(
                'Clear all selected items',
              );

              // Test that button text isn't contextual and only the `aria-label`
              expect(getModalSelectAllButton()?.textContent.trim()).toBe(
                'Select all',
              );
              expect(getModalSelectAllButton().getAttribute('aria-label')).toBe(
                'Select all items',
              );

              expect(getModalAddButton().getAttribute('aria-label')).toBe(
                'Add items',
              );

              expect(
                getModalOnlyShowSelectedInput().getAttribute('aria-label'),
              ).toBe('Show only selected items');

              closeModal(fixture);
            }));

            it('should respect a selection descriptor', fakeAsync(() => {
              component.enableShowMore = true;
              component.showAddButton = true;
              component.setShowMoreNativePickerConfig({
                selectionDescriptor: 'people',
              });
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              const selectButton = getModalSaveButton();

              expect(getShowMoreModalTitle()).toBe('Select people');

              expect(getModalSearchInput()?.getAttribute('aria-label')).toBe(
                'Search people',
              );
              // Test that button text isn't contextual and only the `aria-label`
              expect(selectButton?.textContent.trim()).toBe('Select');
              expect(selectButton?.getAttribute('aria-label')).toBe(
                'Select people',
              );

              // Test that button text isn't contextual and only the `aria-label`
              expect(getModalClearAllButton()?.textContent.trim()).toBe(
                'Clear all',
              );
              expect(getModalClearAllButton().getAttribute('aria-label')).toBe(
                'Clear all selected people',
              );

              // Test that button text isn't contextual and only the `aria-label`
              expect(getModalSelectAllButton()?.textContent.trim()).toBe(
                'Select all',
              );
              expect(getModalSelectAllButton().getAttribute('aria-label')).toBe(
                'Select all people',
              );

              expect(getModalAddButton().getAttribute('aria-label')).toBe(
                'Add people',
              );

              expect(
                getModalOnlyShowSelectedInput().getAttribute('aria-label'),
              ).toBe('Show only selected people');

              closeModal(fixture);
            }));

            it('should collapse tokens if more than 5 items are selected', fakeAsync(() => {
              component.enableShowMore = true;
              component.friends = [
                { name: 'Fred', description: 'Mr. Fred' },
                { name: 'Isaac', description: 'Mr. Isaac' },
                { name: 'John', description: 'Mr. John' },
                { name: 'Joyce', description: 'Mrs. Joyce' },
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ];
              fixture.detectChanges();

              expect(lookupComponent.tokens?.length).toBe(5);
              expect(lookupComponent.tokens![0].value).toEqual({
                name: 'Fred',
                description: 'Mr. Fred',
              });
              expect(lookupComponent.value).toEqual([
                { name: 'Fred', description: 'Mr. Fred' },
                { name: 'Isaac', description: 'Mr. Isaac' },
                { name: 'John', description: 'Mr. John' },
                { name: 'Joyce', description: 'Mrs. Joyce' },
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('Oli', fixture);
              selectSearchResult(0, fixture);

              expect(lookupComponent.tokens?.length).toBe(1);
              expect(lookupComponent.tokens![0].value).toEqual({
                name: '6 items selected',
              });
              expect(lookupComponent.value).toEqual([
                { name: 'Fred', description: 'Mr. Fred' },
                { name: 'Isaac', description: 'Mr. Isaac' },
                { name: 'John', description: 'Mr. John' },
                { name: 'Joyce', description: 'Mrs. Joyce' },
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
                { name: 'Oliver', description: 'Mr. Oliver' },
              ]);
            }));

            it('should open the show more modal on token click', fakeAsync(() => {
              const showMoreSpy = spyOn(
                component.lookupComponent,
                'openPicker',
              ).and.stub();

              component.enableShowMore = true;
              component.friends = [
                { name: 'Fred', description: 'Mr. Fred' },
                { name: 'Isaac', description: 'Mr. Isaac' },
              ];
              fixture.detectChanges();
              tick();

              clickToken(0, fixture);

              expect(showMoreSpy).toHaveBeenCalled();
            }));

            it('should open the show more modal on collapsed token click', fakeAsync(() => {
              const showMoreSpy = spyOn(
                component.lookupComponent,
                'openPicker',
              ).and.stub();

              component.enableShowMore = true;
              component.friends = [
                { name: 'Fred', description: 'Mr. Fred' },
                { name: 'Isaac', description: 'Mr. Isaac' },
                { name: 'John', description: 'Mr. John' },
                { name: 'Joyce', description: 'Mrs. Joyce' },
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
                { name: 'Oliver', description: 'Mr. Oliver' },
              ];
              fixture.detectChanges();
              tick();

              clickToken(0, fixture);

              expect(showMoreSpy).toHaveBeenCalled();
            }));

            it(`should not change the tokens when the form control is updated while a show more picker is open`, fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('s', fixture);
              selectSearchResult(0, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              clickShowMore(fixture);
              fixture.detectChanges();
              tick();

              component.setValue(1);
              fixture.detectChanges();
              tick();
              expect(lookupComponent.value).toEqual([
                { name: 'Beth', description: 'Mrs. Beth' },
              ]);

              let tokenElements = getTokenElements();
              expect(tokenElements.length).toBe(1);
              expect(tokenElements.item(0).textContent?.trim()).toBe('Isaac');

              saveShowMoreModal(fixture);
              fixture.detectChanges();
              tick();

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              tokenElements = getTokenElements();
              expect(tokenElements.length).toBe(1);
              expect(tokenElements.item(0).textContent?.trim()).toBe('Isaac');
            }));

            it('should not open the show more modal when disabled', fakeAsync(() => {
              const showMoreSpy = spyOn(
                component.lookupComponent,
                'openPicker',
              ).and.stub();

              component.enableShowMore = true;
              component.lookupComponent.disabled = true;
              fixture.detectChanges();

              fixture.nativeElement
                .querySelector('button[aria-label="Show all search results"]')
                .click();

              expect(showMoreSpy).not.toHaveBeenCalled();
            }));
          });

          describe('async', () => {
            beforeEach(() => {
              component.idProperty = 'name';
            });

            it('should populate the correct selected item and save that when no changes are made', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(asyncLookupComponent.value).toEqual([]);

              performSearch('s', fixture, true);
              selectSearchResult(0, fixture);

              performSearch('s', fixture, true);
              selectSearchResult(1, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture, true);
              clickShowMore(fixture);

              saveShowMoreModal(fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              closeModal(fixture);
            }));

            it('should select the correct items when multiple are selected from the show all modal', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(asyncLookupComponent.value).toEqual([]);

              performSearch('s', fixture, true);
              selectSearchResult(1, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture, true);
              clickShowMore(fixture);

              selectShowMoreItemMultiple(0, fixture);

              saveShowMoreModal(fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              closeModal(fixture);
            }));

            it('should not make any changes when the show all modal is cancelled', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(asyncLookupComponent.value).toEqual([]);

              performSearch('s', fixture, true);
              selectSearchResult(1, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture, true);
              clickShowMore(fixture);

              selectShowMoreItemMultiple(0, fixture);

              closeModal(fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);
            }));

            it('should select the correct items when items are deselected from the show all modal', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(asyncLookupComponent.value).toEqual([]);

              performSearch('s', fixture, true);
              selectSearchResult(1, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture, true);
              clickShowMore(fixture);

              selectShowMoreItemMultiple(0, fixture);
              selectShowMoreItemMultiple(1, fixture);

              saveShowMoreModal(fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              closeModal(fixture);
            }));

            it('should select the correct items after existing search text is cleared', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(asyncLookupComponent.value).toEqual([]);

              performSearch('s', fixture, true);
              selectSearchResult(1, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture, true);
              clickShowMore(fixture);

              clearShowMoreSearch(fixture);

              selectShowMoreItemMultiple(0, fixture);

              saveShowMoreModal(fixture);

              expect(asyncLookupComponent.value).toEqual([
                {
                  name: 'Andy',
                  description: 'Mr. Andy',
                  birthDate: '1/1/1995',
                },
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              closeModal(fixture);
            }));

            it('should handle "Clear all" correct in the show more modal', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(asyncLookupComponent.value).toEqual([]);

              performSearch('Pa', fixture, true);
              selectSearchResult(0, fixture);

              expect(asyncLookupComponent.value).toEqual([
                {
                  name: 'Patty',
                  description: 'Ms. Patty',
                  birthDate: '1/1/1996',
                },
              ]);

              performSearch('Pa', fixture, true);
              clickShowMore(fixture);

              clickShowMoreClearAll(fixture);

              saveShowMoreModal(fixture);

              expect(asyncLookupComponent.value).toEqual([]);

              closeModal(fixture);
            }));

            it('should handle "Select all" correct in the show more modal', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(asyncLookupComponent.value).toEqual([]);

              performSearch('Pa', fixture, true);
              selectSearchResult(0, fixture);

              expect(asyncLookupComponent.value).toEqual([
                {
                  name: 'Patty',
                  description: 'Ms. Patty',
                  birthDate: '1/1/1996',
                },
              ]);

              performSearch('Pa', fixture, true);
              clickShowMore(fixture);

              clickShowMoreSelectAll(fixture);

              saveShowMoreModal(fixture);

              expect(asyncLookupComponent.value).toEqual([
                {
                  name: 'Patty',
                  description: 'Ms. Patty',
                  birthDate: '1/1/1996',
                },
                {
                  name: 'Paul',
                  description: 'Mr. Paul',
                  birthDate: '11/1997',
                },
              ]);

              closeModal(fixture);
            }));

            it('should handle "Only show selected correctly in the show more modal', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(asyncLookupComponent.value).toEqual([]);

              performSearch('s', fixture, true);
              selectSearchResult(1, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture, true);
              clickShowMore(fixture);

              selectShowOnlySelected(fixture);

              selectShowMoreItemMultiple(0, fixture);

              saveShowMoreModal(fixture);

              expect(asyncLookupComponent.value).toEqual([]);

              closeModal(fixture);
            }));

            it('should respect a custom modal title', fakeAsync(() => {
              component.enableShowMore = true;
              component.setShowMoreNativePickerConfig({
                title: 'Custom title',
              });
              fixture.detectChanges();
              expect(asyncLookupComponent.value).toEqual([]);

              performSearch('s', fixture, true);
              clickShowMore(fixture);

              expect(getShowMoreModalTitle()).toBe('Custom title');

              closeModal(fixture);
            }));

            it('should set default title and aria labels without a selection descriptor', fakeAsync(() => {
              component.enableShowMore = true;
              component.showAddButton = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              const selectButton = getModalSaveButton();

              expect(getShowMoreModalTitle()).toBe('Select items');

              expect(getModalSearchInput()?.getAttribute('aria-label')).toBe(
                'Search items',
              );
              // Test that button text isn't contextual and only the `aria-label`
              expect(selectButton?.textContent.trim()).toBe('Select');
              expect(selectButton?.getAttribute('aria-label')).toBe(
                'Select items',
              );

              // Test that button text isn't contextual and only the `aria-label`
              expect(getModalClearAllButton()?.textContent.trim()).toBe(
                'Clear all',
              );
              expect(getModalClearAllButton().getAttribute('aria-label')).toBe(
                'Clear all selected items',
              );

              // Test that button text isn't contextual and only the `aria-label`
              expect(getModalSelectAllButton()?.textContent.trim()).toBe(
                'Select all',
              );
              expect(getModalSelectAllButton().getAttribute('aria-label')).toBe(
                'Select all items',
              );

              expect(getModalAddButton().getAttribute('aria-label')).toBe(
                'Add items',
              );

              expect(
                getModalOnlyShowSelectedInput().getAttribute('aria-label'),
              ).toBe('Show only selected items');

              closeModal(fixture);
            }));

            it('should respect a selection descriptor', fakeAsync(() => {
              component.enableShowMore = true;
              component.showAddButton = true;
              component.setShowMoreNativePickerConfig({
                selectionDescriptor: 'people',
              });
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              const selectButton = getModalSaveButton();

              expect(getShowMoreModalTitle()).toBe('Select people');

              expect(getModalSearchInput()?.getAttribute('aria-label')).toBe(
                'Search people',
              );
              // Test that button text isn't contextual and only the `aria-label`
              expect(selectButton?.textContent.trim()).toBe('Select');
              expect(selectButton?.getAttribute('aria-label')).toBe(
                'Select people',
              );

              // Test that button text isn't contextual and only the `aria-label`
              expect(getModalClearAllButton()?.textContent.trim()).toBe(
                'Clear all',
              );
              expect(getModalClearAllButton().getAttribute('aria-label')).toBe(
                'Clear all selected people',
              );

              // Test that button text isn't contextual and only the `aria-label`
              expect(getModalSelectAllButton()?.textContent.trim()).toBe(
                'Select all',
              );
              expect(getModalSelectAllButton().getAttribute('aria-label')).toBe(
                'Select all people',
              );

              expect(getModalAddButton().getAttribute('aria-label')).toBe(
                'Add people',
              );

              expect(
                getModalOnlyShowSelectedInput().getAttribute('aria-label'),
              ).toBe('Show only selected people');

              closeModal(fixture);
            }));

            it('should collapse tokens if more than 5 items are selected', fakeAsync(() => {
              component.enableShowMore = true;
              component.friends = [
                { name: 'Fred', description: 'Mr. Fred' },
                { name: 'Isaac', description: 'Mr. Isaac' },
                { name: 'John', description: 'Mr. John' },
                { name: 'Joyce', description: 'Mrs. Joyce' },
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ];
              fixture.detectChanges();

              expect(asyncLookupComponent.tokens?.length).toBe(5);
              expect(asyncLookupComponent.tokens![0].value).toEqual({
                name: 'Fred',
                description: 'Mr. Fred',
              });
              expect(asyncLookupComponent.value).toEqual([
                { name: 'Fred', description: 'Mr. Fred' },
                { name: 'Isaac', description: 'Mr. Isaac' },
                { name: 'John', description: 'Mr. John' },
                { name: 'Joyce', description: 'Mrs. Joyce' },
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('Oli', fixture, true);
              selectSearchResult(0, fixture);

              expect(asyncLookupComponent.tokens?.length).toBe(1);
              expect(asyncLookupComponent.tokens![0].value).toEqual({
                name: '6 items selected',
              });
              expect(asyncLookupComponent.value).toEqual([
                { name: 'Fred', description: 'Mr. Fred' },
                { name: 'Isaac', description: 'Mr. Isaac' },
                { name: 'John', description: 'Mr. John' },
                { name: 'Joyce', description: 'Mrs. Joyce' },
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
                { name: 'Oliver', description: 'Mr. Oliver' },
              ]);
            }));

            it('should open the show more modal on token click', fakeAsync(() => {
              const showMoreSpy = spyOn(
                component.asyncLookupComponent,
                'openPicker',
              ).and.stub();

              component.enableShowMore = true;
              component.friends = [
                { name: 'Fred', description: 'Mr. Fred' },
                { name: 'Isaac', description: 'Mr. Isaac' },
              ];
              fixture.detectChanges();
              tick();

              clickToken(0, fixture, true);

              expect(showMoreSpy).toHaveBeenCalled();
            }));

            it('should open the show more modal on collapsed token click', fakeAsync(() => {
              const showMoreSpy = spyOn(
                component.asyncLookupComponent,
                'openPicker',
              ).and.stub();

              component.enableShowMore = true;
              component.friends = [
                { name: 'Fred', description: 'Mr. Fred' },
                { name: 'Isaac', description: 'Mr. Isaac' },
                { name: 'John', description: 'Mr. John' },
                { name: 'Joyce', description: 'Mrs. Joyce' },
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
                { name: 'Oliver', description: 'Mr. Oliver' },
              ];
              fixture.detectChanges();
              tick();

              clickToken(0, fixture, true);

              expect(showMoreSpy).toHaveBeenCalled();
            }));

            it(`should not change the tokens when the form control is updated while a show more picker is open`, fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('s', fixture, true);
              selectSearchResult(0, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              clickShowMore(fixture);
              fixture.detectChanges();
              tick();

              component.setValue(1);
              fixture.detectChanges();
              tick();
              expect(asyncLookupComponent.value).toEqual([
                { name: 'Beth', description: 'Mrs. Beth' },
              ]);

              let tokenElements = getTokenElements(true);
              expect(tokenElements.length).toBe(1);
              expect(tokenElements.item(0).textContent?.trim()).toBe('Isaac');

              saveShowMoreModal(fixture);
              fixture.detectChanges();
              tick();

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              tokenElements = getTokenElements(true);
              expect(tokenElements.length).toBe(1);
              expect(tokenElements.item(0).textContent?.trim()).toBe('Isaac');
            }));

            it('should not open the show more modal when disabled', fakeAsync(() => {
              const showMoreSpy = spyOn(
                component.asyncLookupComponent,
                'openPicker',
              ).and.stub();

              component.enableShowMore = true;
              component.asyncLookupComponent.disabled = true;
              fixture.detectChanges();

              fixture.nativeElement
                .querySelector(
                  '#my-async-lookup button[aria-label="Show all search results"]',
                )
                .click();

              expect(showMoreSpy).not.toHaveBeenCalled();
            }));
          });
        });

        describe('single-select', () => {
          beforeEach(() => {
            component.selectMode = 'single';
          });

          describe('non-async', () => {
            it('should populate the correct selected item and save that when no changes are made', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(0, fixture);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              closeModal(fixture);
            }));

            it('should select the correct item when changed from the show all modal', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              selectShowMoreItemSingle(0, fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              closeModal(fixture);
            }));

            it('should not make any changes when the show all modal is cancelled', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              selectShowMoreItemSingle(0, fixture);

              closeModal(fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              closeModal(fixture);
            }));

            it('should respect a custom modal title', fakeAsync(() => {
              component.enableShowMore = true;
              component.setShowMoreNativePickerConfig({
                title: 'Custom title',
              });
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              expect(getShowMoreModalTitle()).toBe('Custom title');

              closeModal(fixture);
            }));

            it('should set default title and aria labels without a selection descriptor', fakeAsync(() => {
              component.enableShowMore = true;
              component.showAddButton = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              const selectButton = getModalSaveButton();

              expect(getShowMoreModalTitle()).toBe('Select item');

              expect(getModalSearchInput()?.getAttribute('aria-label')).toBe(
                'Search item',
              );
              // Test that button text isn't contextual and only the `aria-label`
              expect(selectButton?.textContent.trim()).toBe('Select');
              expect(selectButton?.getAttribute('aria-label')).toBe(
                'Select item',
              );

              expect(getModalAddButton().getAttribute('aria-label')).toBe(
                'Add item',
              );

              closeModal(fixture);
            }));

            it('should respect a selection descriptor', fakeAsync(() => {
              component.enableShowMore = true;
              component.showAddButton = true;
              component.setShowMoreNativePickerConfig({
                selectionDescriptor: 'person',
              });
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              const selectButton = getModalSaveButton();

              expect(getShowMoreModalTitle()).toBe('Select person');

              expect(getModalSearchInput()?.getAttribute('aria-label')).toBe(
                'Search person',
              );
              // Test that button text isn't contextual and only the `aria-label`
              expect(selectButton?.textContent.trim()).toBe('Select');
              expect(selectButton?.getAttribute('aria-label')).toBe(
                'Select person',
              );

              expect(getModalAddButton().getAttribute('aria-label')).toBe(
                'Add person',
              );

              closeModal(fixture);
            }));

            it('should show only searched items when search is enabled', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('Pa', fixture);
              clickShowMore(fixture);

              expect(getRepeaterItemCount()).toBe(2);

              closeModal(fixture);
            }));

            it('should 10 items by default', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();

              triggerInputFocus(fixture);
              fixture.detectChanges();
              tick();
              clickShowMore(fixture);

              expect(getRepeaterItemCount()).toBe(10);

              closeModal(fixture);
            }));

            it('should add items when scrolling ends', async () => {
              component.enableShowMore = true;
              fixture.detectChanges();

              triggerInputFocus(fixture);
              fixture.detectChanges();
              await fixture.whenStable();

              await clickShowMoreAsync(fixture);

              expect(getRepeaterItemCount()).toBe(10);

              await triggerModalScrollAsync(fixture);

              expect(getRepeaterItemCount()).toBe(20);

              await triggerModalScrollAsync(fixture);

              expect(getRepeaterItemCount()).toBe(21);

              closeModalBase();
            });

            it('should not populate search bar with current input value when the search button is clicked but the input value is the current selected value', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              clickSearchButton(fixture);

              expect(getModalSearchInputValue()).toEqual('');

              closeModal(fixture);
            }));

            it('should open the show more modal correctly when the input box is empty', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('', fixture);

              clickSearchButton(fixture);

              expect(getModalSearchInputValue()).toEqual('');

              closeModal(fixture);
            }));
          });

          describe('async', () => {
            beforeEach(() => {
              component.idProperty = 'name';
            });

            it('should populate the correct selected item and save that when no changes are made', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(asyncLookupComponent.value).toEqual([]);

              performSearch('s', fixture, true);
              selectSearchResult(0, fixture);

              performSearch('s', fixture, true);
              selectSearchResult(1, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture, true);
              clickShowMore(fixture);

              saveShowMoreModal(fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              closeModal(fixture);
            }));

            it('should select the correct item when changed from the show all modal', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(asyncLookupComponent.value).toEqual([]);

              performSearch('s', fixture, true);
              selectSearchResult(1, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture, true);
              clickShowMore(fixture);

              selectShowMoreItemSingle(0, fixture);

              saveShowMoreModal(fixture);
              tick();
              fixture.detectChanges();

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              closeModal(fixture);
            }));

            it('should not make any changes when the show all modal is cancelled', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(asyncLookupComponent.value).toEqual([]);

              performSearch('s', fixture, true);
              selectSearchResult(1, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture, true);
              clickShowMore(fixture);

              selectShowMoreItemSingle(0, fixture);

              closeModal(fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              closeModal(fixture);
            }));

            it('should respect a custom modal title', fakeAsync(() => {
              component.enableShowMore = true;
              component.setShowMoreNativePickerConfig({
                title: 'Custom title',
              });
              fixture.detectChanges();
              expect(asyncLookupComponent.value).toEqual([]);

              performSearch('s', fixture, true);
              clickShowMore(fixture);

              expect(getShowMoreModalTitle()).toBe('Custom title');

              closeModal(fixture);
            }));

            it('should set default title and aria labels without a selection descriptor', fakeAsync(() => {
              component.enableShowMore = true;
              component.showAddButton = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              const selectButton = getModalSaveButton();

              expect(getShowMoreModalTitle()).toBe('Select item');

              expect(getModalSearchInput()?.getAttribute('aria-label')).toBe(
                'Search item',
              );
              // Test that button text isn't contextual and only the `aria-label`
              expect(selectButton?.textContent.trim()).toBe('Select');
              expect(selectButton?.getAttribute('aria-label')).toBe(
                'Select item',
              );

              expect(getModalAddButton().getAttribute('aria-label')).toBe(
                'Add item',
              );

              closeModal(fixture);
            }));

            it('should respect a selection descriptor', fakeAsync(() => {
              component.enableShowMore = true;
              component.showAddButton = true;
              component.setShowMoreNativePickerConfig({
                selectionDescriptor: 'person',
              });
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              const selectButton = getModalSaveButton();

              expect(getShowMoreModalTitle()).toBe('Select person');

              expect(getModalSearchInput()?.getAttribute('aria-label')).toBe(
                'Search person',
              );
              // Test that button text isn't contextual and only the `aria-label`
              expect(selectButton?.textContent.trim()).toBe('Select');
              expect(selectButton?.getAttribute('aria-label')).toBe(
                'Select person',
              );

              expect(getModalAddButton().getAttribute('aria-label')).toBe(
                'Add person',
              );

              closeModal(fixture);
            }));

            it('should show only searched items when search is enabled', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('Pa', fixture, true);
              clickShowMore(fixture);

              expect(getRepeaterItemCount()).toBe(2);

              closeModal(fixture);
            }));

            it('should show all returned items from an async call', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();

              triggerInputFocus(fixture, true);
              fixture.detectChanges();
              tick();
              clickShowMore(fixture);

              expect(getRepeaterItemCount()).toBe(10);

              closeModal(fixture);
            }));

            it('should add items when scrolling ends', async () => {
              component.enableShowMore = true;
              fixture.detectChanges();

              triggerInputFocus(fixture, true);
              fixture.detectChanges();
              await fixture.whenStable();

              await clickShowMoreAsync(fixture);

              expect(getRepeaterItemCount()).toBe(10);

              await triggerModalScrollAsync(fixture);

              expect(getRepeaterItemCount()).toBe(20);

              await triggerModalScrollAsync(fixture);

              expect(getRepeaterItemCount()).toBe(21);

              closeModalBase();
            });

            it('should not populate search bar with current input value when the search button is clicked but the input value is the current selected value', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('s', fixture, true);
              selectSearchResult(1, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              clickSearchButton(fixture, true);

              expect(getModalSearchInputValue()).toEqual('');

              closeModal(fixture);
            }));

            it('should open the show more modal correctly when the input box is empty', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('', fixture);

              clickSearchButton(fixture);

              expect(getModalSearchInputValue()).toEqual('');

              closeModal(fixture);
            }));
          });
        });

        it('should trickle down the add button click event when triggered from the show all modal', fakeAsync(() => {
          component.showAddButton = true;
          component.enableShowMore = true;
          const addButtonSpy = spyOn(
            component,
            'addButtonClicked',
          ).and.callThrough();
          fixture.detectChanges();

          performSearch('r', fixture);
          clickShowMore(fixture);

          clickModalAddButton(fixture);

          expect(addButtonSpy).toHaveBeenCalled();

          closeModal(fixture);
        }));

        it('should not show the show more button unless the component input asks for it', fakeAsync(() => {
          component.enableShowMore = false;
          fixture.detectChanges();

          // Type 'r' to activate the autocomplete dropdown, then click the first result.
          performSearch('r', fixture);

          let showMoreButton = getShowMoreButton();
          expect(showMoreButton).toBeNull();

          component.enableShowMore = undefined;
          fixture.detectChanges();

          // Type 'r' to activate the autocomplete dropdown, then click the first result.
          performSearch('r', fixture);

          showMoreButton = getShowMoreButton();
          expect(showMoreButton).toBeNull();
        }));

        it('should show the "name" property in the modal items by default', fakeAsync(() => {
          component.enableShowMore = true;
          fixture.detectChanges();

          performSearch('p', fixture);
          clickShowMore(fixture);

          expect(getShowMoreRepeaterItemContent(0)).toBe('Patty');

          closeModal(fixture);
        }));

        it('should respect a descriptor property being sent into the show more modal', fakeAsync(() => {
          component.enableShowMore = true;
          component.descriptorProperty = 'birthDate';
          fixture.detectChanges();

          performSearch('p', fixture);
          clickShowMore(fixture);

          expect(getShowMoreRepeaterItemContent(0)).toBe('1/1/1996');

          closeModal(fixture);
        }));

        it('should send the search result template into the show more modal', fakeAsync(() => {
          component.enableShowMore = true;
          component.descriptorProperty = 'birthDate';
          component.enableSearchResultTemplate();
          fixture.detectChanges();

          performSearch('p', fixture);
          clickShowMore(fixture);

          expect(getShowMoreRepeaterItemContent(0)).toBe('Ms. Patty');

          closeModal(fixture);
        }));

        it('should respect a custom modal template', fakeAsync(() => {
          component.enableShowMore = true;
          component.descriptorProperty = 'birthDate';
          component.enableSearchResultTemplate();
          component.setShowMoreNativePickerConfig({
            itemTemplate: component.showMoreTemplate,
          });
          fixture.detectChanges();

          performSearch('p', fixture);
          clickShowMore(fixture);

          expect(getShowMoreRepeaterItemContent(0)).toBe('Patty - 1/1/1996');

          closeModal(fixture);
        }));

        it('should open a custom picker when enabled with no value', fakeAsync(() => {
          component.enableShowMore = true;
          component.enableCustomPicker();
          fixture.detectChanges();

          const customPickerSpy = spyOn(
            component.showMoreConfig!.customPicker!,
            'open',
          ).and.callThrough();

          performSearch('p', fixture);
          clickShowMore(fixture);

          expect(customPickerSpy).toHaveBeenCalledWith({
            items: component.data,
            initialSearch: 'p',
            initialValue: [],
          });

          closeModal(fixture);
        }));

        it('should open a custom picker when enabled with a value', fakeAsync(() => {
          component.enableShowMore = true;
          component.enableCustomPicker();
          fixture.detectChanges();

          const customPickerSpy = spyOn(
            component.showMoreConfig!.customPicker!,
            'open',
          ).and.callThrough();

          performSearch('p', fixture);
          selectSearchResult(0, fixture);
          performSearch('p', fixture);
          clickShowMore(fixture);

          expect(customPickerSpy).toHaveBeenCalledWith({
            items: component.data,
            initialSearch: 'p',
            initialValue: [
              component.data?.find((item) => item.name === 'Patty'),
            ],
          });
        }));

        it(`should not change the tokens when the form control is updated while a show more picker is open`, fakeAsync(() => {
          component.enableShowMore = true;
          fixture.detectChanges();

          performSearch('s', fixture);
          selectSearchResult(0, fixture);

          expect(lookupComponent.value).toEqual([
            { name: 'Isaac', description: 'Mr. Isaac' },
          ]);

          clickShowMore(fixture);
          fixture.detectChanges();
          tick();

          component.setValue(1);
          fixture.detectChanges();
          tick();
          expect(lookupComponent.value).toEqual([
            { name: 'Beth', description: 'Mrs. Beth' },
          ]);

          let tokenElements = getTokenElements();
          expect(tokenElements.length).toBe(1);
          expect(tokenElements.item(0).textContent?.trim()).toBe('Isaac');

          saveShowMoreModal(fixture);
          fixture.detectChanges();
          tick();

          expect(lookupComponent.value).toEqual([
            { name: 'Isaac', description: 'Mr. Isaac' },
          ]);

          tokenElements = getTokenElements();
          expect(tokenElements.length).toBe(1);
          expect(tokenElements.item(0).textContent?.trim()).toBe('Isaac');
        }));
      });
    });

    describe('validation', () => {
      it('should mark the form as invalid when it is required but is then emptied', fakeAsync(() => {
        component.friends = [{ name: 'Rachel' }];
        fixture.detectChanges();
        component.setRequired();
        fixture.detectChanges();
        expect(component.form.invalid).toEqual(false);
        dismissSelectedItem(0, fixture);
        expect(component.form.invalid).toEqual(true);
      }));

      it('should mark the required field as valid when a value is chosen from the selection modal', fakeAsync(() => {
        component.friends = [{ name: 'Rachel' }];
        component.enableShowMore = true;

        fixture.detectChanges();
        component.setRequired();
        fixture.detectChanges();

        expect(component.form.invalid).toEqual(false);
        dismissSelectedItem(0, fixture);
        expect(component.form.invalid).toEqual(true);

        performSearch('s', fixture);
        clickShowMore(fixture);
        selectShowMoreItemMultiple(0, fixture);
        saveShowMoreModal(fixture);

        tick();

        expect(component.form.invalid).toEqual(false);
      }));
    });

    describe('events', function () {
      it('should not add event listeners if disabled', fakeAsync(() => {
        fixture.detectChanges();

        component.disableLookup();

        clickInputAndVerifyFocused(fixture, false);
      }));

      it('should allow setting `disabled` after initialization', fakeAsync(() => {
        fixture.detectChanges();

        component.enableLookup();
        fixture.detectChanges();
        tick();

        component.disableLookup();
        fixture.detectChanges();
        tick();

        clickInputAndVerifyFocused(fixture, false);
      }));
    });

    describe('keyboard interactions', function () {
      describe('multi-select', () => {
        beforeEach(() => {
          component.setMultiSelect();
        });

        it('should focus the input if arrowright key is pressed on the last token', fakeAsync(function () {
          component.friends = [{ name: 'Rachel' }];
          fixture.detectChanges();

          const tokenHostElements = document.querySelectorAll('sky-token');
          SkyAppTestUtility.fireDomEvent(tokenHostElements.item(0), 'keydown', {
            keyboardEventInit: { key: 'ArrowRight' },
          });
          tick();
          fixture.detectChanges();
          tick();

          const inputElement = getInputElement(lookupComponent);
          expect(document.activeElement).toEqual(inputElement);
        }));

        it('should focus the last token if arrowleft or backspace pressed', fakeAsync(function () {
          function validateFocusedToken(key: string): void {
            triggerKeyPress(inputElement, key, fixture);
            expect(document.activeElement).toEqual(
              tokenElements.item(tokenElements.length - 1),
            );

            inputElement.focus();
            // Our blur listener has a delay of 25ms. This tick accounts for that.
            tick(25);
            fixture.detectChanges();
          }

          component.friends = [{ name: 'Rachel' }];
          fixture.detectChanges();

          const tokenElements = getTokenElements();
          const inputElement = getInputElement(lookupComponent);

          validateFocusedToken('ArrowLeft');
          validateFocusedToken('Backspace');
          validateFocusedToken('Left');

          triggerKeyPress(inputElement, 'Space', fixture);
          expect(document.activeElement).toEqual(inputElement);
        }));

        it('should not focus the last token if search text is present', fakeAsync(function () {
          component.friends = [{ name: 'Rachel' }];
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          const inputElement = getInputElement(lookupComponent);

          performSearch('s', fixture);
          inputElement.focus();

          expect(inputElement.value).toEqual('s');

          triggerKeyPress(inputElement, 'ArrowLeft', fixture);
          expect(document.activeElement).toEqual(inputElement);
        }));

        it('should remove tokens when backspace or delete is pressed', fakeAsync(function () {
          function validate(key: string, expectedCount: number): void {
            const tokensHostElement = document.querySelector(
              '#my-lookup sky-tokens',
            );
            SkyAppTestUtility.fireDomEvent(tokensHostElement, 'keyup', {
              keyboardEventInit: { key },
            });
            tick();
            fixture.detectChanges();
            tick();

            tokenHostElements = document.querySelectorAll(
              '#my-lookup sky-token',
            );
            expect(tokenHostElements.length).toEqual(expectedCount);
            expect(
              tokenHostElements.item(0).contains(document.activeElement),
            ).toEqual(true);
          }

          component.friends = [
            { name: 'John', description: 'Mr. John' },
            { name: 'Jane' },
            { name: 'Jim' },
            { name: 'Doe' },
          ];

          fixture.detectChanges();

          let tokenHostElements = document.querySelectorAll(
            '#my-lookup sky-token',
          );
          expect(tokenHostElements.length).toEqual(4);

          validate('Backspace', 3);
          validate('Del', 2);
          validate('Delete', 1);
        }));

        it('should clear the search text if escape key is pressed', fakeAsync(function () {
          function validate(key: string): void {
            fixture.detectChanges();
            tick();

            const inputElement = getInputElement(lookupComponent);

            fixture.detectChanges();
            performSearch('s', fixture);

            expect(inputElement.value).toEqual('s');

            SkyAppTestUtility.fireDomEvent(inputElement, 'keyup', {
              keyboardEventInit: { key },
            });
            tick();
            fixture.detectChanges();
            tick();

            expect(inputElement.value).toEqual('');
          }

          validate('Esc');
          validate('Escape');
        }));

        it('should prevent default if Enter is pressed on the input element', fakeAsync(function () {
          fixture.detectChanges();

          const inputElement = getInputElement(lookupComponent);

          const event = Object.assign(document.createEvent('CustomEvent'), {
            key: 'Enter',
          });

          spyOn(event, 'preventDefault');

          event.initEvent('keydown', true, true);
          inputElement.dispatchEvent(event);

          tick();
          fixture.detectChanges();
          tick();

          expect(event.preventDefault).toHaveBeenCalled();
        }));

        it('should unfocus the component if it loses focus', async function () {
          fixture.detectChanges();

          const inputElement = getInputElement(lookupComponent);
          inputElement.focus();
          SkyAppTestUtility.fireDomEvent(inputElement, 'focusin');
          fixture.detectChanges();
          await fixture.whenStable();
          fixture.detectChanges();
          await fixture.whenStable();

          expect(lookupComponent.isInputFocused).toEqual(true);

          getTestButton().focus();
          SkyAppTestUtility.fireDomEvent(document, 'focusin');
          fixture.detectChanges();
          await fixture.whenStable();
          fixture.detectChanges();
          await fixture.whenStable();

          expect(lookupComponent.isInputFocused).toEqual(false);
        });
      });

      describe('single-select', () => {
        beforeEach(() => {
          component.setSingleSelect();
        });

        it('should prevent default if Enter is pressed on the input element', fakeAsync(function () {
          fixture.detectChanges();

          const inputElement = getInputElement(lookupComponent);

          const event = Object.assign(document.createEvent('CustomEvent'), {
            key: 'Enter',
          });

          spyOn(event, 'preventDefault');

          event.initEvent('keydown', true, true);
          inputElement.dispatchEvent(event);

          tick();
          fixture.detectChanges();
          tick();

          expect(event.preventDefault).toHaveBeenCalled();
        }));

        it('should unfocus the component if it loses focus', async function () {
          fixture.detectChanges();

          const inputElement = getInputElement(lookupComponent);
          inputElement.focus();
          SkyAppTestUtility.fireDomEvent(inputElement, 'focusin');
          fixture.detectChanges();
          await fixture.whenStable();
          fixture.detectChanges();
          await fixture.whenStable();

          expect(lookupComponent.isInputFocused).toEqual(true);

          getTestButton().focus();
          SkyAppTestUtility.fireDomEvent(document, 'focusin');
          fixture.detectChanges();
          await fixture.whenStable();
          fixture.detectChanges();
          await fixture.whenStable();

          expect(lookupComponent.isInputFocused).toEqual(false);
        });
      });
    });

    describe('mouse interactions', function () {
      it('should focus the input if the host is clicked', fakeAsync(function () {
        fixture.detectChanges();

        const hostElement = document.querySelector('sky-lookup');
        const input = getInputElement(lookupComponent);

        triggerClick(hostElement, fixture);

        expect(document.activeElement).toEqual(input);
      }));

      it('should not focus the input if a token is clicked', fakeAsync(function () {
        fixture.detectChanges();

        performSearch('s', fixture);
        selectSearchResult(0, fixture);

        const input = getInputElement(lookupComponent);
        getInputElement(lookupComponent).blur();
        fixture.detectChanges();
        tick(25);

        clickToken(0, fixture, false);

        expect(document.activeElement).not.toEqual(input);
      }));
    });

    // for testing non-async search args being passed around correctly
    describe('search args (non-async)', () => {
      // to test the passing of the 'context' arg
      describe('context', () => {
        let friends: any[];
        beforeEach(fakeAsync(() => {
          // making the component multi-select is not required to test this, but it is the most straightforward case to demonstrate the 'context' arg
          component.setMultiSelect();
          // getting the list of selected friends from the SkyLookupComponent
          fixture.detectChanges();
          tick();
          friends = component.form.controls['friends'].value;
        }));
        describe('search function filters', () => {
          let searchFilterFunctionSpy: jasmine.Spy;

          it('should return popover context', fakeAsync(() => {
            searchFilterFunctionSpy = getSearchFunctionFilterSpy(
              'searchFunctionFilterPopover',
              friends,
            );

            // setting the SkyLookupComponent's "searchFilters" @Input() via the fixture's 'customSearchFilters' property
            component.customSearchFilters = [searchFilterFunctionSpy];
            fixture.detectChanges();
            tick();

            // searching in the popover context, to call the searchFilterFunctionSpy
            performSearch('s', fixture);

            // performing a search in the popover view should provide the search filter function with a 'popover' context
            expect(searchFilterFunctionSpy).toHaveBeenCalledWith(
              's',
              jasmine.objectContaining({
                name: jasmine.any(String),
              }),
              jasmine.objectContaining({
                context: 'popover',
              }),
            );
          }));

          describe('show more modal', () => {
            it('should return modal context', fakeAsync(() => {
              searchFilterFunctionSpy = getSearchFunctionFilterSpy(
                'searchFunctionFilterModal',
                friends,
              );

              // setting the SkyLookupComponent's "searchFilters" @Input() via the fixture's 'customSearchFilters' property
              component.customSearchFilters = [searchFilterFunctionSpy];
              fixture.detectChanges();
              tick();

              // enabling the "Show more" button in the SkyLookupComponent via the fixture's 'enableShowMore' property
              component.enableShowMore = true;
              fixture.detectChanges();
              tick();

              // searching in the popover context, so that the "Show more" button appears
              performSearch('s', fixture);

              // opening the "Show more" modal
              clickShowMore(fixture);

              // searching in the modal context, to call the searchFilterFunctionSpy
              performSearch('s', fixture);

              // performing a search in the modal view should provide the search filter function with a 'modal' context
              expect(searchFilterFunctionSpy).toHaveBeenCalledWith(
                's',
                jasmine.objectContaining({
                  name: jasmine.any(String),
                }),
                jasmine.objectContaining({
                  context: 'modal',
                }),
              );
            }));
          });
        });
        describe('custom search function', () => {
          let customSearchFunctionSpy: jasmine.Spy;

          it('should return popover context', fakeAsync(() => {
            customSearchFunctionSpy = getCustomSearchFunctionSpy(
              'customSearchFunctionPopover',
              friends,
            );

            // setting the SkyLookupComponent's "search" @Input() via the fixture's 'customSearch' property
            component.customSearch = customSearchFunctionSpy;
            fixture.detectChanges();
            tick();

            // searching in the popover context, to call the customSearchFunctionSpy
            performSearch('s', fixture);

            // performing a search in the popover view should provide the custom search function with a 'popover' context
            expect(customSearchFunctionSpy).toHaveBeenCalledWith(
              's',
              jasmine.arrayWithExactContents(component.data ?? []),
              jasmine.objectContaining({
                context: 'popover',
              }),
            );
          }));

          describe('show more modal', () => {
            it('should return modal context', fakeAsync(() => {
              customSearchFunctionSpy = getCustomSearchFunctionSpy(
                'customSearchFunctionModal',
                friends,
              );

              // setting the SkyLookupComponent's "search" @Input() via the fixture's 'customSearch' property
              component.customSearch = customSearchFunctionSpy;
              fixture.detectChanges();
              tick();

              // enabling the "Show more" button in the SkyLookupComponent via the fixture's 'enableShowMore' property
              component.enableShowMore = true;
              fixture.detectChanges();
              tick();

              // searching in the modal context, so that the "Show more" button appears
              performSearch('s', fixture);

              // opening the "Show more" modal
              clickShowMore(fixture);

              // searching in the modal context, to call the customSearchFunctionSpy
              performSearch('s', fixture);

              // performing a search in the modal view should call the custom search function with a 'modal' context
              expect(customSearchFunctionSpy).toHaveBeenCalledWith(
                's',
                jasmine.arrayWithExactContents(component.data ?? []),
                jasmine.objectContaining({
                  context: 'modal',
                }),
              );
            }));
          });
        });
      });
    });
  });

  describe('template form', () => {
    let fixture: ComponentFixture<SkyLookupTemplateTestComponent>;
    let component: SkyLookupTemplateTestComponent;
    let asyncLookupComponent: SkyLookupComponent;
    let lookupComponent: SkyLookupComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(SkyLookupTemplateTestComponent);
      component = fixture.componentInstance;
      asyncLookupComponent = component.asyncLookupComponent;
      lookupComponent = component.lookupComponent;
    });

    describe('basic setup', function () {
      it('should set defaults', function () {
        expect(lookupComponent.ariaLabel).toEqual(undefined);
        expect(lookupComponent.ariaLabelledBy).toEqual(undefined);
        expect(lookupComponent.disabled).toEqual(false);
        expect(lookupComponent.placeholderText).toEqual(undefined);
        expect(lookupComponent.tokens).toEqual(undefined);
        expect(lookupComponent.value).toEqual([]);
      });

      it('should share the same inputs as autocomplete', function () {
        fixture.detectChanges();
        expect(typeof lookupComponent.data).not.toBeUndefined();
        expect(typeof lookupComponent.debounceTime).not.toBeUndefined();
        expect(typeof lookupComponent.descriptorProperty).not.toBeUndefined();
        expect(typeof lookupComponent.propertiesToSearch).not.toBeUndefined();
        expect(typeof lookupComponent.search).not.toBeUndefined();
        expect(typeof lookupComponent.searchResultTemplate).not.toBeUndefined();
        expect(
          typeof lookupComponent.searchTextMinimumCharacters,
        ).not.toBeUndefined();
        expect(typeof lookupComponent.searchFilters).not.toBeUndefined();
        expect(typeof lookupComponent.searchResultsLimit).not.toBeUndefined();
      });

      it('should handle disabled', () => {
        fixture.detectChanges();

        const inputElement = getInputElement(lookupComponent);
        expect(inputElement.disabled).toBeFalse();
        component.disableLookup();
        fixture.detectChanges();
        expect(inputElement.disabled).toBeTrue();
        component.disabled = undefined;
        fixture.detectChanges();
        expect(inputElement.disabled).toBeFalse();
      });

      describe('multi-select', () => {
        beforeEach(() => {
          component.setMultiSelect();
        });

        it('should allow preselected tokens', fakeAsync(() => {
          fixture.detectChanges();
          const friends = [{ name: 'Rachel' }];
          component.selectedFriends = friends;
          expect(lookupComponent.value).toEqual([]);
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          tick();
          // Ensure that we get a copy of the original array back and that we aren't modifying the original
          expect(lookupComponent.value).not.toBe(friends);
          expect(lookupComponent.value).toEqual(friends);
        }));

        it('should add new tokens', fakeAsync(function () {
          fixture.detectChanges();
          expect(lookupComponent.value).toEqual([]);

          performSearch('s', fixture);
          selectSearchResult(0, fixture);

          const selectedItems = lookupComponent.value;
          expect(selectedItems.length).toEqual(1);
          expect(selectedItems[0].name).toEqual('Isaac');
        }));

        it('should not collapse tokens if more than 5 items are selected with `enableShowMore` disabled', fakeAsync(() => {
          fixture.detectChanges();
          component.selectedFriends = [
            { name: 'Fred', description: 'Mr. Fred' },
            { name: 'Isaac', description: 'Mr. Isaac' },
            { name: 'John', description: 'Mr. John' },
            { name: 'Joyce', description: 'Mrs. Joyce' },
            { name: 'Lindsey', description: 'Mrs. Lindsey' },
          ];
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(lookupComponent.tokens?.length).toBe(5);
          expect(lookupComponent.tokens![0].value).toEqual({
            name: 'Fred',
            description: 'Mr. Fred',
          });
          expect(lookupComponent.value).toEqual([
            { name: 'Fred', description: 'Mr. Fred' },
            { name: 'Isaac', description: 'Mr. Isaac' },
            { name: 'John', description: 'Mr. John' },
            { name: 'Joyce', description: 'Mrs. Joyce' },
            { name: 'Lindsey', description: 'Mrs. Lindsey' },
          ]);

          performSearch('Oli', fixture);
          selectSearchResult(0, fixture);

          expect(lookupComponent.tokens?.length).toBe(6);
          expect(lookupComponent.tokens![0].value).toEqual({
            name: 'Fred',
            description: 'Mr. Fred',
          });
          expect(lookupComponent.value).toEqual([
            { name: 'Fred', description: 'Mr. Fred' },
            { name: 'Isaac', description: 'Mr. Isaac' },
            { name: 'John', description: 'Mr. John' },
            { name: 'Joyce', description: 'Mrs. Joyce' },
            { name: 'Lindsey', description: 'Mrs. Lindsey' },
            { name: 'Oliver', description: 'Mr. Oliver' },
          ]);
        }));

        it('should NOT add new tokens if value is empty', fakeAsync(function () {
          fixture.detectChanges();
          tick();
          expect(lookupComponent.value).toEqual([]);

          performSearch('s', fixture);
          selectSearchResult(0, fixture);

          performSearch('', fixture);
          getInputElement(lookupComponent).blur();
          fixture.detectChanges();
          tick(25);

          const selectedItems = lookupComponent.value;
          expect(selectedItems.length).toEqual(1);
          expect(selectedItems[0].name).toEqual('Isaac');
        }));

        it('should change the value of the lookup if tokens change', fakeAsync(function () {
          fixture.detectChanges();
          expect(lookupComponent.value).toEqual([]);

          performSearch('s', fixture);
          selectSearchResult(0, fixture);

          performSearch('s', fixture);
          selectSearchResult(1, fixture);

          expect(lookupComponent.value.length).toEqual(2);

          dismissSelectedItem(0, fixture);

          expect(lookupComponent.value.length).toEqual(1);
        }));

        it('should not do anything on token click', fakeAsync(() => {
          const showMoreSpy = spyOn(
            component.lookupComponent,
            'openPicker',
          ).and.stub();

          component.selectedFriends = [
            { name: 'Fred', description: 'Mr. Fred' },
            { name: 'Isaac', description: 'Mr. Isaac' },
          ];
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          tick();

          clickToken(0, fixture);

          expect(showMoreSpy).not.toHaveBeenCalled();
        }));

        it('should focus the input if all tokens are dismissed', fakeAsync(() => {
          component.selectedFriends = [{ name: 'Rachel' }];
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          dismissSelectedItem(0, fixture);

          const inputElement = getInputElement(lookupComponent);
          expect(lookupComponent.value.length).toEqual(0);
          expect(document.activeElement).toEqual(inputElement);
        }));

        it('should remove all but the first value when the mode is changed to single select', fakeAsync(() => {
          component.selectedFriends = [
            { name: 'Rachel' },
            { name: 'Isaac', description: 'Mr. Isaac' },
          ];
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          component.setSingleSelect();
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(lookupComponent.value).toEqual([{ name: 'Rachel' }]);
        }));

        it('should search for values correctly when using an async search function', fakeAsync(function () {
          fixture.detectChanges();
          expect(asyncLookupComponent.value).toEqual([]);

          performSearch('s', fixture, true);
          selectSearchResult(0, fixture);

          performSearch('s', fixture, true);
          selectSearchResult(1, fixture);

          expect(asyncLookupComponent.value.length).toEqual(2);
        }));
      });

      describe('single select', () => {
        beforeEach(() => {
          component.setSingleSelect();
        });

        it('should allow a preselected value', fakeAsync(() => {
          const bestFriend = { name: 'Rachel' };

          fixture.detectChanges();
          expect(lookupComponent.value).toEqual([]);

          component.selectedFriends = [bestFriend];
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          expect(lookupComponent.value).toEqual([bestFriend]);
        }));

        it('should select the value on focus', fakeAsync(() => {
          component.selectedFriends = [{ name: 'Rachel' }];
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          expect(lookupComponent.value).toEqual([{ name: 'Rachel' }]);

          triggerInputFocus(fixture);
          expect(window.getSelection().toString()).toBe('Rachel');
        }));

        it('should select a new value when none is selected', fakeAsync(function () {
          const bestFriend = { name: 'Rachel' };

          fixture.detectChanges();
          component.selectedFriends = [bestFriend];
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          expect(lookupComponent.value).toEqual([bestFriend]);

          performSearch('s', fixture);
          selectSearchResult(0, fixture);

          expect(lookupComponent.value).toEqual([
            { name: 'Isaac', description: 'Mr. Isaac' },
          ]);
        }));

        it('should select a new value when a different value is selected', fakeAsync(function () {
          fixture.detectChanges();
          expect(lookupComponent.value).toEqual([]);

          performSearch('s', fixture);
          selectSearchResult(0, fixture);

          expect(lookupComponent.value).toEqual([
            { name: 'Isaac', description: 'Mr. Isaac' },
          ]);
        }));

        it('should clear the value when the search text is cleared', fakeAsync(function () {
          fixture.detectChanges();
          expect(lookupComponent.value).toEqual([]);

          performSearch('s', fixture);
          selectSearchResult(0, fixture);

          expect(lookupComponent.value).toEqual([
            { name: 'Isaac', description: 'Mr. Isaac' },
          ]);

          performSearch('', fixture);

          expect(lookupComponent.value).toEqual([]);
        }));

        it('should NOT set a new value when no search options are returned', fakeAsync(function () {
          fixture.detectChanges();
          expect(lookupComponent.value).toEqual([]);

          performSearch('no results for this search', fixture);
          getInputElement(lookupComponent).blur();
          fixture.detectChanges();
          tick(25);

          expect(lookupComponent.value).toEqual([]);
        }));

        it('should search for values correctly when using an async search function', fakeAsync(function () {
          fixture.detectChanges();
          expect(asyncLookupComponent.value).toEqual([]);

          performSearch('s', fixture, true);
          selectSearchResult(0, fixture);

          expect(asyncLookupComponent.value).toEqual([
            { name: 'Isaac', description: 'Mr. Isaac' },
          ]);

          performSearch('', fixture, true);

          expect(asyncLookupComponent.value).toEqual([]);
        }));
      });
    });

    describe('actions', () => {
      describe('add button', () => {
        beforeEach(fakeAsync(() => {
          fixture.detectChanges();
          tick();
        }));

        afterEach(() => {
          fixture.destroy();
        });

        describe('non-async', () => {
          it('should emit an event correctly when the add button is enabled and clicked', fakeAsync(() => {
            component.showAddButton = true;
            const addButtonSpy = spyOn(
              component,
              'addButtonClicked',
            ).and.callThrough();
            fixture.detectChanges();

            // Type 'r' to activate the autocomplete dropdown, then click the first result.
            performSearch('r', fixture);

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
            performSearch('r', fixture);

            const addButton = getAddButton();
            expect(addButton).toBeNull();
            expect(addButtonSpy).not.toHaveBeenCalled();
          }));

          it('should emit an event correctly when the add button is clicked from the modal', fakeAsync(() => {
            component.showAddButton = true;
            component.enableShowMore = true;
            const addButtonSpy = spyOn(
              component,
              'addButtonClicked',
            ).and.callThrough();
            fixture.detectChanges();

            performSearch('s', fixture);
            selectSearchResult(0, fixture);

            expect(lookupComponent.value).toEqual([
              { name: 'Isaac', description: 'Mr. Isaac' },
            ]);

            clickShowMore(fixture);
            fixture.detectChanges();
            tick();

            clickShowMoreAddButton(fixture);
            fixture.detectChanges();
            tick();

            closeModal(fixture);

            expect(addButtonSpy).toHaveBeenCalled();
          }));
        });

        describe('async', () => {
          it('should emit an event correctly when the add button is enabled and clicked', fakeAsync(() => {
            component.showAddButton = true;
            const addButtonSpy = spyOn(
              component,
              'addButtonClicked',
            ).and.callThrough();
            fixture.detectChanges();

            // Type 'r' to activate the autocomplete dropdown, then click the first result.
            performSearch('r', fixture, true);

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
            performSearch('r', fixture, true);

            const addButton = getAddButton();
            expect(addButton).toBeNull();
            expect(addButtonSpy).not.toHaveBeenCalled();
          }));

          it('should emit an event correctly when the add button is clicked from the modal', fakeAsync(() => {
            component.showAddButton = true;
            component.enableShowMore = true;
            const addButtonSpy = spyOn(
              component,
              'addButtonClicked',
            ).and.callThrough();
            fixture.detectChanges();

            performSearch('s', fixture, true);
            selectSearchResult(0, fixture);

            expect(asyncLookupComponent.value).toEqual([
              { name: 'Isaac', description: 'Mr. Isaac' },
            ]);

            clickShowMore(fixture);
            fixture.detectChanges();
            tick();

            clickShowMoreAddButton(fixture);
            fixture.detectChanges();
            tick();

            closeModal(fixture);

            expect(addButtonSpy).toHaveBeenCalled();
          }));
        });

        describe('multi select', () => {
          describe('non-async', () => {
            it('should add the item to the selected items when there is not a show more picker open', fakeAsync(() => {
              component.setMultiSelect();
              component.showAddButton = true;
              fixture.detectChanges();

              performSearch('s', fixture);
              selectSearchResult(0, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              clickAddButton();
              fixture.detectChanges();
              tick();

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
                { name: 'New item' },
              ]);
              expect(lookupComponent.data[0]).toEqual({
                name: 'New item',
              });
            }));

            it(`should add the item to the modal's selected items when a show more picker is open`, fakeAsync(() => {
              component.setMultiSelect();
              component.showAddButton = true;
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('s', fixture);
              selectSearchResult(0, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              clickShowMore(fixture);
              fixture.detectChanges();
              tick();

              clickShowMoreAddButton(fixture);
              fixture.detectChanges();
              tick();
              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              saveShowMoreModal(fixture);
              fixture.detectChanges();
              tick();

              expect(lookupComponent.value).toEqual([
                { name: 'New item' },
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);
              expect(lookupComponent.data[0]).toEqual({
                name: 'New item',
              });
            }));

            it(`should add the item to the modal's selected items when a show more picker is open but should cancel back to the original selection`, fakeAsync(() => {
              component.setMultiSelect();
              component.showAddButton = true;
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('s', fixture);
              selectSearchResult(0, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              clickShowMore(fixture);
              fixture.detectChanges();
              tick();

              clickShowMoreAddButton(fixture);
              fixture.detectChanges();
              tick();
              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              closeModal(fixture);
              fixture.detectChanges();
              tick();

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);
              expect(lookupComponent.data[0]).toEqual({
                name: 'New item',
              });
            }));

            it(`should not add the item to the modal's selected items when a show more picker is open but the underlying data is not updated`, fakeAsync(() => {
              component.setMultiSelect();
              component.ignoreAddDataUpdate = true;
              component.showAddButton = true;
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('s', fixture);
              selectSearchResult(0, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              clickShowMore(fixture);
              fixture.detectChanges();
              tick();

              clickShowMoreAddButton(fixture);
              fixture.detectChanges();
              tick();
              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              saveShowMoreModal(fixture);
              fixture.detectChanges();
              tick();

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);
              expect(lookupComponent.data[0]).not.toEqual({
                name: 'New item',
              });
            }));
          });

          describe('async', () => {
            it('should add the item to the selected items when there is not a show more picker open', fakeAsync(() => {
              component.setMultiSelect();
              component.showAddButton = true;
              fixture.detectChanges();

              performSearch('s', fixture, true);
              selectSearchResult(0, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              clickAddButton();
              fixture.detectChanges();
              tick();

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
                { name: 'New item' },
              ]);
            }));

            it(`should add the item to the modal's selected items when a show more picker is saved`, fakeAsync(() => {
              component.setMultiSelect();
              component.showAddButton = true;
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('s', fixture, true);
              selectSearchResult(0, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              clickShowMore(fixture);
              fixture.detectChanges();
              tick();

              clickShowMoreAddButton(fixture);
              fixture.detectChanges();
              tick();
              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              saveShowMoreModal(fixture);
              fixture.detectChanges();
              tick();

              expect(asyncLookupComponent.value).toEqual([
                { name: 'New item' },
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);
            }));

            it(`should add the item to the modal's selected items when a show more picker is open but should cancel back to the original selection`, fakeAsync(() => {
              component.setMultiSelect();
              component.showAddButton = true;
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('s', fixture, true);
              selectSearchResult(0, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              clickShowMore(fixture);
              fixture.detectChanges();
              tick();

              clickShowMoreAddButton(fixture);
              fixture.detectChanges();
              tick();
              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              closeModal(fixture);
              fixture.detectChanges();
              tick();

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);
            }));
          });
        });

        describe('single select', () => {
          describe('non-async', () => {
            it('should add the item to the selected items when there is not a show more picker open', fakeAsync(() => {
              component.setSingleSelect();
              component.showAddButton = true;
              fixture.detectChanges();

              performSearch('s', fixture);
              selectSearchResult(0, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              clickAddButton();
              fixture.detectChanges();
              tick();

              expect(lookupComponent.value).toEqual([{ name: 'New item' }]);
              expect(lookupComponent.data[0]).toEqual({
                name: 'New item',
              });
            }));

            it(`should add the item to the modal's selected items when a show more picker is open`, fakeAsync(() => {
              component.setSingleSelect();
              component.showAddButton = true;
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('s', fixture);
              selectSearchResult(0, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              clickShowMore(fixture);
              fixture.detectChanges();
              tick();

              clickShowMoreAddButton(fixture);
              fixture.detectChanges();
              tick();
              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              saveShowMoreModal(fixture);
              fixture.detectChanges();
              tick();

              expect(lookupComponent.value).toEqual([{ name: 'New item' }]);
              expect(lookupComponent.data[0]).toEqual({
                name: 'New item',
              });
            }));

            it(`should add the item to the modal's selected items when a show more picker is open but should cancel back to the original selection`, fakeAsync(() => {
              component.setSingleSelect();
              component.showAddButton = true;
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('s', fixture);
              selectSearchResult(0, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              clickShowMore(fixture);
              fixture.detectChanges();
              tick();

              clickShowMoreAddButton(fixture);
              fixture.detectChanges();
              tick();
              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              closeModal(fixture);
              fixture.detectChanges();
              tick();

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);
              expect(lookupComponent.data[0]).toEqual({
                name: 'New item',
              });
            }));

            it(`should not add the item to the modal's selected items when a show more picker is open but the underlying data is not updated`, fakeAsync(() => {
              component.setSingleSelect();
              component.ignoreAddDataUpdate = true;
              component.showAddButton = true;
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('s', fixture);
              selectSearchResult(0, fixture);

              const originalDataLength = component.data?.length ?? 0;

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              clickShowMore(fixture);
              fixture.detectChanges();
              tick();

              clickShowMoreAddButton(fixture);
              fixture.detectChanges();
              tick();
              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              saveShowMoreModal(fixture);
              fixture.detectChanges();
              tick();

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);
              expect(lookupComponent.data[0]).not.toEqual({
                name: 'New item',
              });
              expect(lookupComponent.data.length).toBe(originalDataLength);
            }));
          });

          describe('async', () => {
            it('should add the item to the selected items when there is not a show more picker open', fakeAsync(() => {
              component.setSingleSelect();
              component.showAddButton = true;
              fixture.detectChanges();

              performSearch('s', fixture, true);
              selectSearchResult(0, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              clickAddButton();
              fixture.detectChanges();
              tick();

              expect(asyncLookupComponent.value).toEqual([
                { name: 'New item' },
              ]);
            }));

            it(`should add the item to the modal's selected items when a show more picker is saved`, fakeAsync(() => {
              component.setSingleSelect();
              component.showAddButton = true;
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('s', fixture, true);
              selectSearchResult(0, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              clickShowMore(fixture);
              fixture.detectChanges();
              tick();

              clickShowMoreAddButton(fixture);
              fixture.detectChanges();
              tick();
              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              saveShowMoreModal(fixture);
              fixture.detectChanges();
              tick();

              expect(asyncLookupComponent.value).toEqual([
                { name: 'New item' },
              ]);
            }));

            it(`should add the item to the modal's selected items when a show more picker is open but should cancel back to the original selection`, fakeAsync(() => {
              component.setSingleSelect();
              component.showAddButton = true;
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('s', fixture, true);
              selectSearchResult(0, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              clickShowMore(fixture);
              fixture.detectChanges();
              tick();

              clickShowMoreAddButton(fixture);
              fixture.detectChanges();
              tick();
              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              closeModal(fixture);
              fixture.detectChanges();
              tick();

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);
            }));
          });
        });
      });

      describe('show more button', () => {
        let modalService: SkyModalService;

        beforeEach(fakeAsync(() => {
          modalService = TestBed.inject(SkyModalService);

          fixture.detectChanges();
          tick();
        }));

        afterEach(() => {
          fixture.destroy();
        });

        describe('non-async', () => {
          it('should open the modal when the show more button is clicked', fakeAsync(() => {
            component.enableShowMore = true;
            fixture.detectChanges();

            spyOn(modalService, 'open').and.callThrough();

            performSearch('r', fixture);
            clickShowMore(fixture);
            expect(modalService.open).toHaveBeenCalled();

            closeModal(fixture);
          }));

          it('should open the modal when the show more button is clicked with no config', fakeAsync(() => {
            component.enableShowMore = true;
            component.showMoreConfig = undefined;
            fixture.detectChanges();

            spyOn(modalService, 'open').and.callThrough();

            performSearch('r', fixture);
            clickShowMore(fixture);

            expect(modalService.open).toHaveBeenCalled();

            closeModal(fixture);
          }));

          it('should open the modal when the search button is clicked', fakeAsync(() => {
            component.enableShowMore = true;
            fixture.detectChanges();

            spyOn(modalService, 'open').and.callThrough();

            clickSearchButton(fixture);

            expect(modalService.open).toHaveBeenCalled();

            closeModal(fixture);
          }));

          it('should close the dropdown when the search button is clicked', fakeAsync(() => {
            component.enableShowMore = true;
            fixture.detectChanges();

            performSearch('r', fixture);
            expect(getDropdown()).not.toBeNull();

            clickSearchButton(fixture);

            expect(getDropdown()).toBeNull();

            closeModal(fixture);
          }));

          it('should populate search bar with current input value when the search button is clicked', fakeAsync(() => {
            component.enableShowMore = true;
            fixture.detectChanges();

            performSearch('foo', fixture);
            SkyAppTestUtility.fireDomEvent(
              getInputElement(lookupComponent),
              'blur',
            );
            fixture.detectChanges();

            clickSearchButton(fixture);

            expect(getModalSearchInputValue()).toEqual('foo');

            closeModal(fixture);
          }));

          it('should scroll to the top of the modal and not show the infinite scroll wait when searching', async () => {
            component.enableShowMore = true;
            component.enableSearchResultTemplate();
            component.customSearch = (_: string, data: any[]) => {
              return data.slice(0, 14);
            };
            fixture.detectChanges();
            await fixture.whenStable();

            triggerInputFocus(fixture);
            fixture.detectChanges();
            await fixture.whenStable();

            await clickShowMoreAsync(fixture);

            expect(getRepeaterItemCount()).toBe(10);

            await triggerModalScrollAsync(fixture);

            expect(getRepeaterItemCount()).toBe(20);

            await triggerModalScrollAsync(fixture);

            expect(getRepeaterItemCount()).toBe(21);

            expect(getModalContentScrollTop()).not.toBe(0);

            await performModalSearchAsync('foo', fixture);

            expect(getRepeaterItemCount()).toBe(10);

            expect(getModalContentScrollTop()).toBe(0);

            expect(getInfiniteScrollWait()).toBeNull();

            closeModalBase();
          });

          it('should respect the `propertiesToSearch` input in the show more modal', fakeAsync(() => {
            component.enableShowMore = true;
            component.propertiesToSearch = ['description'];
            fixture.detectChanges();

            performSearch('Ms.', fixture);

            clickSearchButton(fixture);

            expect(getRepeaterItemCount()).toBe(4);

            closeModal(fixture);
          }));

          it('should respect the `search` input in the show more modal when the function returns an array', fakeAsync(() => {
            component.enableShowMore = true;
            component.customSearch = (_: string, data: any[]) => {
              return [data[0]];
            };
            fixture.detectChanges();

            performSearch('Mr', fixture);

            clickSearchButton(fixture);

            expect(getRepeaterItemCount()).toBe(1);

            closeModal(fixture);
          }));

          it('should respect the `search` input in the show more modal when the function returns a promise', fakeAsync(() => {
            component.enableShowMore = true;
            component.customSearch = (_: string, data: any[]) => {
              return Promise.resolve([data[0]]);
            };
            fixture.detectChanges();

            performSearch('Mr', fixture);

            clickSearchButton(fixture);

            expect(getRepeaterItemCount()).toBe(1);

            closeModal(fixture);
          }));

          it('should handle not results being shown', fakeAsync(() => {
            component.enableShowMore = true;
            component.data = undefined;
            fixture.detectChanges();

            performSearch('Mr', fixture);

            clickSearchButton(fixture);

            expect(getRepeaterItemCount()).toBe(0);
            expect(getShowMoreNoResultsElement()).not.toBeNull();

            closeModal(fixture);
          }));

          it('should handle disabled', fakeAsync(() => {
            component.enableShowMore = true;
            component.disabled = true;
            component.customSearch = (_: string, data: any[]) => {
              return Promise.resolve([data[0]]);
            };
            fixture.detectChanges();

            performSearch('Mr', fixture);

            clickSearchButton(fixture);

            expect(isModalOpen()).toBe(false);
          }));
        });

        describe('async', () => {
          it('should open the modal when the show more button is clicked', fakeAsync(() => {
            component.enableShowMore = true;
            fixture.detectChanges();

            spyOn(modalService, 'open').and.callThrough();

            performSearch('r', fixture, true);
            clickShowMore(fixture);

            expect(modalService.open).toHaveBeenCalled();

            closeModal(fixture);
          }));

          it('should open the modal when the show more button is clicked with no config', fakeAsync(() => {
            component.enableShowMore = true;
            component.showMoreConfig = undefined;
            fixture.detectChanges();

            spyOn(modalService, 'open').and.callThrough();

            performSearch('r', fixture, true);
            clickShowMore(fixture);

            expect(modalService.open).toHaveBeenCalled();

            closeModal(fixture);
          }));

          it('should open the modal when the search button is clicked', fakeAsync(() => {
            component.enableShowMore = true;
            fixture.detectChanges();

            spyOn(modalService, 'open').and.callThrough();

            clickSearchButton(fixture, true);

            expect(modalService.open).toHaveBeenCalled();

            closeModal(fixture);
          }));

          it('should close the dropdown when the search button is clicked', fakeAsync(() => {
            component.enableShowMore = true;
            fixture.detectChanges();

            performSearch('r', fixture, true);
            expect(getDropdown()).not.toBeNull();

            clickSearchButton(fixture, true);

            expect(getDropdown()).toBeNull();

            closeModal(fixture);
          }));

          it('should populate search bar with current input value when the search button is clicked', fakeAsync(() => {
            component.enableShowMore = true;
            fixture.detectChanges();

            performSearch('foo', fixture, true);
            SkyAppTestUtility.fireDomEvent(
              getInputElement(asyncLookupComponent),
              'blur',
            );
            fixture.detectChanges();

            clickSearchButton(fixture, true);

            expect(getModalSearchInputValue()).toEqual('foo');

            closeModal(fixture);
          }));

          it('should scroll to the top of the modal and not show the infinite scroll wait when searching', async () => {
            component.enableShowMore = true;
            component.enableSearchResultTemplate();
            component.customSearch = (_: string, data: any[]) => {
              return data.slice(0, 14);
            };
            fixture.detectChanges();
            await fixture.whenStable();

            triggerInputFocus(fixture);
            fixture.detectChanges();
            await fixture.whenStable();

            await clickShowMoreAsync(fixture);

            expect(getRepeaterItemCount()).toBe(10);

            await triggerModalScrollAsync(fixture);

            expect(getRepeaterItemCount()).toBe(20);

            await triggerModalScrollAsync(fixture);

            expect(getRepeaterItemCount()).toBe(21);

            expect(getModalContentScrollTop()).not.toBe(0);

            await performModalSearchAsync('foo', fixture);

            expect(getRepeaterItemCount()).toBe(10);

            expect(getModalContentScrollTop()).toBe(0);

            expect(getInfiniteScrollWait()).toBeNull();

            closeModalBase();
          });

          it('should handle not results being shown', fakeAsync(() => {
            component.enableShowMore = true;
            component.data = undefined;
            fixture.detectChanges();

            performSearch('Mr', fixture, true);

            clickSearchButton(fixture, true);

            expect(getRepeaterItemCount()).toBe(0);
            expect(getShowMoreNoResultsElement()).not.toBeNull();

            closeModal(fixture);
          }));

          it('should log an error when an async search function is used without the idProperty set', fakeAsync(function () {
            component.enableShowMore = true;
            component.idProperty = undefined;
            const logService = TestBed.inject(SkyLogService);
            const errorLogSpy = spyOn(logService, 'error').and.stub();

            fixture.detectChanges();
            expect(asyncLookupComponent.value).toEqual([]);

            performSearch('s', fixture, true);
            clickShowMore(fixture);
            fixture.detectChanges();
            tick();

            expect(errorLogSpy).toHaveBeenCalledWith(
              "The lookup component's 'idProperty' input is required when `enableShowMore` and 'searchAsync' are used together.",
            );
            closeModal(fixture);
          }));
        });

        describe('multi-select', () => {
          describe('non-async', () => {
            it('should populate the correct selected item and save that when no changes are made', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(0, fixture);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              closeModal(fixture);
            }));

            it('should select the correct items when multiple are selected from the show all modal', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              selectShowMoreItemMultiple(0, fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              closeModal(fixture);
            }));

            it('should not make any changes when the show all modal is cancelled', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              selectShowMoreItemMultiple(0, fixture);

              closeModal(fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);
            }));

            it('should select the correct items when items are deselected from the show all modal', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              selectShowMoreItemMultiple(0, fixture);
              selectShowMoreItemMultiple(1, fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              closeModal(fixture);
            }));

            it('should select the correct items after existing search text is cleared', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              clearShowMoreSearch(fixture);

              selectShowMoreItemMultiple(0, fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([
                {
                  name: 'Andy',
                  description: 'Mr. Andy',
                  birthDate: '1/1/1995',
                },
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              closeModal(fixture);
            }));

            it('should handle "Clear all" correct in the show more modal', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('Pa', fixture);
              selectSearchResult(0, fixture);

              expect(lookupComponent.value).toEqual([
                {
                  name: 'Patty',
                  description: 'Ms. Patty',
                  birthDate: '1/1/1996',
                },
              ]);

              performSearch('Pa', fixture);
              clickShowMore(fixture);

              clickShowMoreClearAll(fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([]);

              closeModal(fixture);
            }));

            it('should handle "Select all" correct in the show more modal', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('Pa', fixture);
              selectSearchResult(0, fixture);

              expect(lookupComponent.value).toEqual([
                {
                  name: 'Patty',
                  description: 'Ms. Patty',
                  birthDate: '1/1/1996',
                },
              ]);

              performSearch('Pa', fixture);
              clickShowMore(fixture);

              clickShowMoreSelectAll(fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([
                {
                  name: 'Patty',
                  description: 'Ms. Patty',
                  birthDate: '1/1/1996',
                },
                {
                  name: 'Paul',
                  description: 'Mr. Paul',
                  birthDate: '11/1997',
                },
              ]);

              closeModal(fixture);
            }));

            it('should handle "Only show selected correctly in the show more modal', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              selectShowOnlySelected(fixture);

              selectShowMoreItemMultiple(0, fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([]);

              closeModal(fixture);
            }));

            it('should add items when scrolling ends with "Only show selected" active', async () => {
              component.enableShowMore = true;
              component.selectedFriends = [
                ...(component.data?.filter((item) => !item.birthDate) ?? []),
              ];

              fixture.detectChanges();
              await fixture.whenStable();

              triggerInputFocus(fixture);
              fixture.detectChanges();
              await fixture.whenStable();

              await clickShowMoreAsync(fixture);

              await selectShowOnlySelectedAsync(fixture);

              expect(getRepeaterItemCount()).toBe(10);

              await triggerModalScrollAsync(fixture);

              expect(getRepeaterItemCount()).toBe(18);

              closeModalBase();
            });

            it('should respect a custom modal title', fakeAsync(() => {
              component.enableShowMore = true;
              component.setShowMoreNativePickerConfig({
                title: 'Custom title',
              });
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              expect(getShowMoreModalTitle()).toBe('Custom title');

              closeModal(fixture);
            }));

            it('should set default title and aria labels without a selection descriptor', fakeAsync(() => {
              component.enableShowMore = true;
              component.showAddButton = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              const selectButton = getModalSaveButton();

              expect(getShowMoreModalTitle()).toBe('Select items');

              expect(getModalSearchInput()?.getAttribute('aria-label')).toBe(
                'Search items',
              );
              // Test that button text isn't contextual and only the `aria-label`
              expect(selectButton?.textContent.trim()).toBe('Select');
              expect(selectButton?.getAttribute('aria-label')).toBe(
                'Select items',
              );

              // Test that button text isn't contextual and only the `aria-label`
              expect(getModalClearAllButton()?.textContent.trim()).toBe(
                'Clear all',
              );
              expect(getModalClearAllButton().getAttribute('aria-label')).toBe(
                'Clear all selected items',
              );

              // Test that button text isn't contextual and only the `aria-label`
              expect(getModalSelectAllButton()?.textContent.trim()).toBe(
                'Select all',
              );
              expect(getModalSelectAllButton().getAttribute('aria-label')).toBe(
                'Select all items',
              );

              expect(getModalAddButton().getAttribute('aria-label')).toBe(
                'Add items',
              );

              expect(
                getModalOnlyShowSelectedInput().getAttribute('aria-label'),
              ).toBe('Show only selected items');

              closeModal(fixture);
            }));

            it('should respect a selection descriptor', fakeAsync(() => {
              component.enableShowMore = true;
              component.showAddButton = true;
              component.setShowMoreNativePickerConfig({
                selectionDescriptor: 'people',
              });
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              const selectButton = getModalSaveButton();

              expect(getShowMoreModalTitle()).toBe('Select people');

              expect(getModalSearchInput()?.getAttribute('aria-label')).toBe(
                'Search people',
              );
              // Test that button text isn't contextual and only the `aria-label`
              expect(selectButton?.textContent.trim()).toBe('Select');
              expect(selectButton?.getAttribute('aria-label')).toBe(
                'Select people',
              );

              // Test that button text isn't contextual and only the `aria-label`
              expect(getModalClearAllButton()?.textContent.trim()).toBe(
                'Clear all',
              );
              expect(getModalClearAllButton().getAttribute('aria-label')).toBe(
                'Clear all selected people',
              );

              // Test that button text isn't contextual and only the `aria-label`
              expect(getModalSelectAllButton()?.textContent.trim()).toBe(
                'Select all',
              );
              expect(getModalSelectAllButton().getAttribute('aria-label')).toBe(
                'Select all people',
              );

              expect(getModalAddButton().getAttribute('aria-label')).toBe(
                'Add people',
              );

              expect(
                getModalOnlyShowSelectedInput().getAttribute('aria-label'),
              ).toBe('Show only selected people');

              closeModal(fixture);
            }));

            it('should collapse tokens if more than 5 items are selected', fakeAsync(() => {
              component.enableShowMore = true;
              component.selectedFriends = [
                { name: 'Fred', description: 'Mr. Fred' },
                { name: 'Isaac', description: 'Mr. Isaac' },
                { name: 'John', description: 'Mr. John' },
                { name: 'Joyce', description: 'Mrs. Joyce' },
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ];
              fixture.detectChanges();
              tick();
              fixture.detectChanges();

              expect(lookupComponent.tokens?.length).toBe(5);
              expect(lookupComponent.tokens![0].value).toEqual({
                name: 'Fred',
                description: 'Mr. Fred',
              });
              expect(lookupComponent.value).toEqual([
                { name: 'Fred', description: 'Mr. Fred' },
                { name: 'Isaac', description: 'Mr. Isaac' },
                { name: 'John', description: 'Mr. John' },
                { name: 'Joyce', description: 'Mrs. Joyce' },
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('Oli', fixture);
              selectSearchResult(0, fixture);

              expect(lookupComponent.tokens?.length).toBe(1);
              expect(lookupComponent.tokens![0].value).toEqual({
                name: '6 items selected',
              });
              expect(lookupComponent.value).toEqual([
                { name: 'Fred', description: 'Mr. Fred' },
                { name: 'Isaac', description: 'Mr. Isaac' },
                { name: 'John', description: 'Mr. John' },
                { name: 'Joyce', description: 'Mrs. Joyce' },
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
                { name: 'Oliver', description: 'Mr. Oliver' },
              ]);
            }));

            it('should open the show more modal on token click', fakeAsync(() => {
              const showMoreSpy = spyOn(
                component.lookupComponent,
                'openPicker',
              ).and.stub();

              component.enableShowMore = true;
              component.selectedFriends = [
                { name: 'Fred', description: 'Mr. Fred' },
                { name: 'Isaac', description: 'Mr. Isaac' },
              ];
              fixture.detectChanges();
              tick();
              fixture.detectChanges();
              tick();

              clickToken(0, fixture);

              expect(showMoreSpy).toHaveBeenCalled();
            }));

            it('should open the show more modal on collapsed token click', fakeAsync(() => {
              const showMoreSpy = spyOn(
                component.lookupComponent,
                'openPicker',
              ).and.stub();

              component.enableShowMore = true;
              component.selectedFriends = [
                { name: 'Fred', description: 'Mr. Fred' },
                { name: 'Isaac', description: 'Mr. Isaac' },
                { name: 'John', description: 'Mr. John' },
                { name: 'Joyce', description: 'Mrs. Joyce' },
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
                { name: 'Oliver', description: 'Mr. Oliver' },
              ];
              fixture.detectChanges();
              tick();
              fixture.detectChanges();
              tick();

              clickToken(0, fixture);

              expect(showMoreSpy).toHaveBeenCalled();
            }));

            it(`should not change the tokens when the form control is updated while a show more picker is open`, fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('s', fixture);
              selectSearchResult(0, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              clickShowMore(fixture);
              fixture.detectChanges();
              tick();

              component.selectedFriends = [component.data![1]];
              fixture.detectChanges();
              tick();
              expect(lookupComponent.value).toEqual([
                { name: 'Beth', description: 'Mrs. Beth' },
              ]);

              let tokenElements = getTokenElements();
              expect(tokenElements.length).toBe(1);
              expect(tokenElements.item(0).textContent?.trim()).toBe('Isaac');

              saveShowMoreModal(fixture);
              fixture.detectChanges();
              tick();

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              tokenElements = getTokenElements();
              expect(tokenElements.length).toBe(1);
              expect(tokenElements.item(0).textContent?.trim()).toBe('Isaac');
            }));
          });
          describe('async', () => {
            beforeEach(() => {
              component.idProperty = 'name';
            });

            it('should populate the correct selected item and save that when no changes are made', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(asyncLookupComponent.value).toEqual([]);

              performSearch('s', fixture, true);
              selectSearchResult(0, fixture);

              performSearch('s', fixture, true);
              selectSearchResult(1, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture, true);
              clickShowMore(fixture);

              saveShowMoreModal(fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              closeModal(fixture);
            }));

            it('should select the correct items when multiple are selected from the show all modal', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(asyncLookupComponent.value).toEqual([]);

              performSearch('s', fixture, true);
              selectSearchResult(1, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture, true);
              clickShowMore(fixture);

              selectShowMoreItemMultiple(0, fixture);

              saveShowMoreModal(fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              closeModal(fixture);
            }));

            it('should not make any changes when the show all modal is cancelled', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(asyncLookupComponent.value).toEqual([]);

              performSearch('s', fixture, true);
              selectSearchResult(1, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture, true);
              clickShowMore(fixture);

              selectShowMoreItemMultiple(0, fixture);

              closeModal(fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);
            }));

            it('should select the correct items when items are deselected from the show all modal', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(asyncLookupComponent.value).toEqual([]);

              performSearch('s', fixture, true);
              selectSearchResult(1, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture, true);
              clickShowMore(fixture);

              selectShowMoreItemMultiple(0, fixture);
              selectShowMoreItemMultiple(1, fixture);

              saveShowMoreModal(fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              closeModal(fixture);
            }));

            it('should select the correct items after existing search text is cleared', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(asyncLookupComponent.value).toEqual([]);

              performSearch('s', fixture, true);
              selectSearchResult(1, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture, true);
              clickShowMore(fixture);

              clearShowMoreSearch(fixture);

              selectShowMoreItemMultiple(0, fixture);

              saveShowMoreModal(fixture);

              expect(asyncLookupComponent.value).toEqual([
                {
                  name: 'Andy',
                  description: 'Mr. Andy',
                  birthDate: '1/1/1995',
                },
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              closeModal(fixture);
            }));

            it('should handle "Clear all" correct in the show more modal', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(asyncLookupComponent.value).toEqual([]);

              performSearch('Pa', fixture, true);
              selectSearchResult(0, fixture);

              expect(asyncLookupComponent.value).toEqual([
                {
                  name: 'Patty',
                  description: 'Ms. Patty',
                  birthDate: '1/1/1996',
                },
              ]);

              performSearch('Pa', fixture, true);
              clickShowMore(fixture);

              clickShowMoreClearAll(fixture);

              saveShowMoreModal(fixture);

              expect(asyncLookupComponent.value).toEqual([]);

              closeModal(fixture);
            }));

            it('should handle "Select all" correct in the show more modal', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(asyncLookupComponent.value).toEqual([]);

              performSearch('Pa', fixture, true);
              selectSearchResult(0, fixture);

              expect(asyncLookupComponent.value).toEqual([
                {
                  name: 'Patty',
                  description: 'Ms. Patty',
                  birthDate: '1/1/1996',
                },
              ]);

              performSearch('Pa', fixture, true);
              clickShowMore(fixture);

              clickShowMoreSelectAll(fixture);

              saveShowMoreModal(fixture);

              expect(asyncLookupComponent.value).toEqual([
                {
                  name: 'Patty',
                  description: 'Ms. Patty',
                  birthDate: '1/1/1996',
                },
                {
                  name: 'Paul',
                  description: 'Mr. Paul',
                  birthDate: '11/1997',
                },
              ]);

              closeModal(fixture);
            }));

            it('should handle "Only show selected correctly in the show more modal', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(asyncLookupComponent.value).toEqual([]);

              performSearch('s', fixture, true);
              selectSearchResult(1, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture, true);
              clickShowMore(fixture);

              selectShowOnlySelected(fixture);

              selectShowMoreItemMultiple(0, fixture);

              saveShowMoreModal(fixture);

              expect(asyncLookupComponent.value).toEqual([]);

              closeModal(fixture);
            }));

            it('should respect a custom modal title', fakeAsync(() => {
              component.enableShowMore = true;
              component.setShowMoreNativePickerConfig({
                title: 'Custom title',
              });
              fixture.detectChanges();
              expect(asyncLookupComponent.value).toEqual([]);

              performSearch('s', fixture, true);
              clickShowMore(fixture);

              expect(getShowMoreModalTitle()).toBe('Custom title');

              closeModal(fixture);
            }));

            it('should set default title and aria labels without a selection descriptor', fakeAsync(() => {
              component.enableShowMore = true;
              component.showAddButton = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              const selectButton = getModalSaveButton();

              expect(getShowMoreModalTitle()).toBe('Select items');

              expect(getModalSearchInput()?.getAttribute('aria-label')).toBe(
                'Search items',
              );
              // Test that button text isn't contextual and only the `aria-label`
              expect(selectButton?.textContent.trim()).toBe('Select');
              expect(selectButton?.getAttribute('aria-label')).toBe(
                'Select items',
              );

              // Test that button text isn't contextual and only the `aria-label`
              expect(getModalClearAllButton()?.textContent.trim()).toBe(
                'Clear all',
              );
              expect(getModalClearAllButton().getAttribute('aria-label')).toBe(
                'Clear all selected items',
              );

              // Test that button text isn't contextual and only the `aria-label`
              expect(getModalSelectAllButton()?.textContent.trim()).toBe(
                'Select all',
              );
              expect(getModalSelectAllButton().getAttribute('aria-label')).toBe(
                'Select all items',
              );

              expect(getModalAddButton().getAttribute('aria-label')).toBe(
                'Add items',
              );

              expect(
                getModalOnlyShowSelectedInput().getAttribute('aria-label'),
              ).toBe('Show only selected items');

              closeModal(fixture);
            }));

            it('should respect a selection descriptor', fakeAsync(() => {
              component.enableShowMore = true;
              component.showAddButton = true;
              component.setShowMoreNativePickerConfig({
                selectionDescriptor: 'people',
              });
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              const selectButton = getModalSaveButton();

              expect(getShowMoreModalTitle()).toBe('Select people');

              expect(getModalSearchInput()?.getAttribute('aria-label')).toBe(
                'Search people',
              );
              // Test that button text isn't contextual and only the `aria-label`
              expect(selectButton?.textContent.trim()).toBe('Select');
              expect(selectButton?.getAttribute('aria-label')).toBe(
                'Select people',
              );

              // Test that button text isn't contextual and only the `aria-label`
              expect(getModalClearAllButton()?.textContent.trim()).toBe(
                'Clear all',
              );
              expect(getModalClearAllButton().getAttribute('aria-label')).toBe(
                'Clear all selected people',
              );

              // Test that button text isn't contextual and only the `aria-label`
              expect(getModalSelectAllButton()?.textContent.trim()).toBe(
                'Select all',
              );
              expect(getModalSelectAllButton().getAttribute('aria-label')).toBe(
                'Select all people',
              );

              expect(getModalAddButton().getAttribute('aria-label')).toBe(
                'Add people',
              );

              expect(
                getModalOnlyShowSelectedInput().getAttribute('aria-label'),
              ).toBe('Show only selected people');

              closeModal(fixture);
            }));

            it('should collapse tokens if more than 5 items are selected', fakeAsync(() => {
              component.enableShowMore = true;
              component.selectedFriendsAsync = [
                { name: 'Fred', description: 'Mr. Fred' },
                { name: 'Isaac', description: 'Mr. Isaac' },
                { name: 'John', description: 'Mr. John' },
                { name: 'Joyce', description: 'Mrs. Joyce' },
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ];
              fixture.detectChanges();
              tick();
              fixture.detectChanges();

              expect(asyncLookupComponent.tokens?.length).toBe(5);
              expect(asyncLookupComponent.tokens![0].value).toEqual({
                name: 'Fred',
                description: 'Mr. Fred',
              });
              expect(asyncLookupComponent.value).toEqual([
                { name: 'Fred', description: 'Mr. Fred' },
                { name: 'Isaac', description: 'Mr. Isaac' },
                { name: 'John', description: 'Mr. John' },
                { name: 'Joyce', description: 'Mrs. Joyce' },
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('Oli', fixture, true);
              selectSearchResult(0, fixture);

              expect(asyncLookupComponent.tokens?.length).toBe(1);
              expect(asyncLookupComponent.tokens![0].value).toEqual({
                name: '6 items selected',
              });
              expect(asyncLookupComponent.value).toEqual([
                { name: 'Fred', description: 'Mr. Fred' },
                { name: 'Isaac', description: 'Mr. Isaac' },
                { name: 'John', description: 'Mr. John' },
                { name: 'Joyce', description: 'Mrs. Joyce' },
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
                { name: 'Oliver', description: 'Mr. Oliver' },
              ]);
            }));

            it('should open the show more modal on token click', fakeAsync(() => {
              const showMoreSpy = spyOn(
                component.asyncLookupComponent,
                'openPicker',
              ).and.stub();

              component.enableShowMore = true;
              component.selectedFriendsAsync = [
                { name: 'Fred', description: 'Mr. Fred' },
                { name: 'Isaac', description: 'Mr. Isaac' },
              ];
              fixture.detectChanges();
              tick();
              fixture.detectChanges();
              tick();

              clickToken(0, fixture, true);

              expect(showMoreSpy).toHaveBeenCalled();
            }));

            it('should open the show more modal on collapsed token click', fakeAsync(() => {
              const showMoreSpy = spyOn(
                component.asyncLookupComponent,
                'openPicker',
              ).and.stub();

              component.enableShowMore = true;
              component.selectedFriendsAsync = [
                { name: 'Fred', description: 'Mr. Fred' },
                { name: 'Isaac', description: 'Mr. Isaac' },
                { name: 'John', description: 'Mr. John' },
                { name: 'Joyce', description: 'Mrs. Joyce' },
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
                { name: 'Oliver', description: 'Mr. Oliver' },
              ];
              fixture.detectChanges();
              tick();
              fixture.detectChanges();
              tick();

              clickToken(0, fixture, true);

              expect(showMoreSpy).toHaveBeenCalled();
            }));

            it(`should not change the tokens when the form control is updated while a show more picker is open`, fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('s', fixture, true);
              selectSearchResult(0, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              clickShowMore(fixture);
              fixture.detectChanges();
              tick();

              component.selectedFriendsAsync = [component.data![1]];
              fixture.detectChanges();
              tick();
              expect(asyncLookupComponent.value).toEqual([
                { name: 'Beth', description: 'Mrs. Beth' },
              ]);

              let tokenElements = getTokenElements(true);
              expect(tokenElements.length).toBe(1);
              expect(tokenElements.item(0).textContent?.trim()).toBe('Isaac');

              saveShowMoreModal(fixture);
              fixture.detectChanges();
              tick();

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              tokenElements = getTokenElements(true);
              expect(tokenElements.length).toBe(1);
              expect(tokenElements.item(0).textContent?.trim()).toBe('Isaac');
            }));

            it('should not open the show more modal when disabled', fakeAsync(() => {
              const showMoreSpy = spyOn(
                component.asyncLookupComponent,
                'openPicker',
              ).and.stub();

              component.enableShowMore = true;
              component.asyncLookupComponent.disabled = true;
              fixture.detectChanges();

              fixture.nativeElement
                .querySelector(
                  '#my-async-lookup button[aria-label="Show all search results"]',
                )
                .click();

              expect(showMoreSpy).not.toHaveBeenCalled();
            }));
          });
        });

        describe('single-select', () => {
          beforeEach(() => {
            component.selectMode = 'single';
          });

          describe('non-async', () => {
            it('should populate the correct selected item and save that when no changes are made', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(0, fixture);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              closeModal(fixture);
            }));

            it('should select the correct item when changed from the show all modal', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              selectShowMoreItemSingle(0, fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              closeModal(fixture);
            }));

            it('should not make any changes when the show all modal is cancelled', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              selectShowMoreItemSingle(0, fixture);

              closeModal(fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              closeModal(fixture);
            }));

            it('should respect a custom modal title', fakeAsync(() => {
              component.enableShowMore = true;
              component.setShowMoreNativePickerConfig({
                title: 'Custom title',
              });
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              expect(getShowMoreModalTitle()).toBe('Custom title');

              closeModal(fixture);
            }));

            it('should set default title and aria labels without a selection descriptor', fakeAsync(() => {
              component.enableShowMore = true;
              component.showAddButton = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              const selectButton = getModalSaveButton();

              expect(getShowMoreModalTitle()).toBe('Select item');

              expect(getModalSearchInput()?.getAttribute('aria-label')).toBe(
                'Search item',
              );
              // Test that button text isn't contextual and only the `aria-label`
              expect(selectButton?.textContent.trim()).toBe('Select');
              expect(selectButton?.getAttribute('aria-label')).toBe(
                'Select item',
              );

              expect(getModalAddButton().getAttribute('aria-label')).toBe(
                'Add item',
              );

              closeModal(fixture);
            }));

            it('should respect a selection descriptor', fakeAsync(() => {
              component.enableShowMore = true;
              component.showAddButton = true;
              component.setShowMoreNativePickerConfig({
                selectionDescriptor: 'person',
              });
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              const selectButton = getModalSaveButton();

              expect(getShowMoreModalTitle()).toBe('Select person');

              expect(getModalSearchInput()?.getAttribute('aria-label')).toBe(
                'Search person',
              );
              // Test that button text isn't contextual and only the `aria-label`
              expect(selectButton?.textContent.trim()).toBe('Select');
              expect(selectButton?.getAttribute('aria-label')).toBe(
                'Select person',
              );

              expect(getModalAddButton().getAttribute('aria-label')).toBe(
                'Add person',
              );

              closeModal(fixture);
            }));

            it('should show only searched items when search is enabled', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('Pa', fixture);
              clickShowMore(fixture);

              expect(getRepeaterItemCount()).toBe(2);

              closeModal(fixture);
            }));

            it('should 10 items by default', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();

              triggerInputFocus(fixture);
              fixture.detectChanges();
              tick();
              clickShowMore(fixture);

              expect(getRepeaterItemCount()).toBe(10);

              closeModal(fixture);
            }));

            it('should not populate search bar with current input value when the search button is clicked but the input value is the current selected value', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              clickSearchButton(fixture);

              expect(getModalSearchInputValue()).toEqual('');

              closeModal(fixture);
            }));

            it('should open the show more modal correctly when the input box is empty', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('', fixture);

              clickSearchButton(fixture);

              expect(getModalSearchInputValue()).toEqual('');

              closeModal(fixture);
            }));
          });

          describe('async', () => {
            beforeEach(() => {
              component.idProperty = 'name';
            });

            it('should populate the correct selected item and save that when no changes are made', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(asyncLookupComponent.value).toEqual([]);

              performSearch('s', fixture, true);
              selectSearchResult(0, fixture);

              performSearch('s', fixture, true);
              selectSearchResult(1, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture, true);
              clickShowMore(fixture);

              saveShowMoreModal(fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              closeModal(fixture);
            }));

            it('should select the correct item when changed from the show all modal', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(asyncLookupComponent.value).toEqual([]);

              performSearch('s', fixture, true);
              selectSearchResult(1, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture, true);
              clickShowMore(fixture);

              selectShowMoreItemSingle(0, fixture);

              saveShowMoreModal(fixture);
              tick();
              fixture.detectChanges();

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Isaac', description: 'Mr. Isaac' },
              ]);

              closeModal(fixture);
            }));

            it('should not make any changes when the show all modal is cancelled', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(asyncLookupComponent.value).toEqual([]);

              performSearch('s', fixture, true);
              selectSearchResult(1, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              performSearch('s', fixture, true);
              clickShowMore(fixture);

              selectShowMoreItemSingle(0, fixture);

              closeModal(fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              closeModal(fixture);
            }));

            it('should respect a custom modal title', fakeAsync(() => {
              component.enableShowMore = true;
              component.setShowMoreNativePickerConfig({
                title: 'Custom title',
              });
              fixture.detectChanges();
              expect(asyncLookupComponent.value).toEqual([]);

              performSearch('s', fixture, true);
              clickShowMore(fixture);

              expect(getShowMoreModalTitle()).toBe('Custom title');

              closeModal(fixture);
            }));

            it('should set default title and aria labels without a selection descriptor', fakeAsync(() => {
              component.enableShowMore = true;
              component.showAddButton = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              const selectButton = getModalSaveButton();

              expect(getShowMoreModalTitle()).toBe('Select item');

              expect(getModalSearchInput()?.getAttribute('aria-label')).toBe(
                'Search item',
              );
              // Test that button text isn't contextual and only the `aria-label`
              expect(selectButton?.textContent.trim()).toBe('Select');
              expect(selectButton?.getAttribute('aria-label')).toBe(
                'Select item',
              );

              expect(getModalAddButton().getAttribute('aria-label')).toBe(
                'Add item',
              );

              closeModal(fixture);
            }));

            it('should respect a selection descriptor', fakeAsync(() => {
              component.enableShowMore = true;
              component.showAddButton = true;
              component.setShowMoreNativePickerConfig({
                selectionDescriptor: 'person',
              });
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              const selectButton = getModalSaveButton();

              expect(getShowMoreModalTitle()).toBe('Select person');

              expect(getModalSearchInput()?.getAttribute('aria-label')).toBe(
                'Search person',
              );
              // Test that button text isn't contextual and only the `aria-label`
              expect(selectButton?.textContent.trim()).toBe('Select');
              expect(selectButton?.getAttribute('aria-label')).toBe(
                'Select person',
              );

              expect(getModalAddButton().getAttribute('aria-label')).toBe(
                'Add person',
              );

              closeModal(fixture);
            }));

            it('should show only searched items when search is enabled', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('Pa', fixture, true);
              clickShowMore(fixture);

              expect(getRepeaterItemCount()).toBe(2);

              closeModal(fixture);
            }));

            it('should show all returned items from an async call', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();

              triggerInputFocus(fixture, true);
              fixture.detectChanges();
              tick();
              clickShowMore(fixture);

              expect(getRepeaterItemCount()).toBe(10);

              closeModal(fixture);
            }));

            it('should add items when scrolling ends', async () => {
              component.enableShowMore = true;
              fixture.detectChanges();

              triggerInputFocus(fixture, true);
              fixture.detectChanges();
              await fixture.whenStable();

              await clickShowMoreAsync(fixture);

              expect(getRepeaterItemCount()).toBe(10);

              await triggerModalScrollAsync(fixture);

              expect(getRepeaterItemCount()).toBe(20);

              await triggerModalScrollAsync(fixture);

              expect(getRepeaterItemCount()).toBe(21);

              closeModalBase();
            });

            it('should not populate search bar with current input value when the search button is clicked but the input value is the current selected value', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('s', fixture, true);
              selectSearchResult(1, fixture);

              expect(asyncLookupComponent.value).toEqual([
                { name: 'Lindsey', description: 'Mrs. Lindsey' },
              ]);

              clickSearchButton(fixture, true);

              expect(getModalSearchInputValue()).toEqual('');

              closeModal(fixture);
            }));

            it('should open the show more modal correctly when the input box is empty', fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('', fixture);

              clickSearchButton(fixture);

              expect(getModalSearchInputValue()).toEqual('');

              closeModal(fixture);
            }));
          });
        });

        it('should trickle down the add button click event when triggered from the show all modal', fakeAsync(() => {
          component.showAddButton = true;
          component.enableShowMore = true;
          const addButtonSpy = spyOn(
            component,
            'addButtonClicked',
          ).and.callThrough();
          fixture.detectChanges();

          performSearch('r', fixture);
          clickShowMore(fixture);

          clickModalAddButton(fixture);

          expect(addButtonSpy).toHaveBeenCalled();

          closeModal(fixture);
        }));

        it('should not show the show more button unless the component input asks for it', fakeAsync(() => {
          component.enableShowMore = false;
          fixture.detectChanges();

          // Type 'r' to activate the autocomplete dropdown, then click the first result.
          performSearch('r', fixture);

          const showMoreButton = getShowMoreButton();
          expect(showMoreButton).toBeNull();
        }));

        it('should show the "name" property in the modal items by default', fakeAsync(() => {
          component.enableShowMore = true;
          fixture.detectChanges();

          performSearch('p', fixture);
          clickShowMore(fixture);

          expect(getShowMoreRepeaterItemContent(0)).toBe('Patty');

          closeModal(fixture);
        }));

        it('should respect a descriptor property being sent into the show more modal', fakeAsync(() => {
          component.enableShowMore = true;
          component.descriptorProperty = 'birthDate';
          fixture.detectChanges();

          performSearch('p', fixture);
          clickShowMore(fixture);

          expect(getShowMoreRepeaterItemContent(0)).toBe('1/1/1996');

          closeModal(fixture);
        }));

        it('should send the search result template into the show more modal', fakeAsync(() => {
          component.enableShowMore = true;
          component.descriptorProperty = 'birthDate';
          component.enableSearchResultTemplate();
          fixture.detectChanges();

          performSearch('p', fixture);
          clickShowMore(fixture);

          expect(getShowMoreRepeaterItemContent(0)).toBe('Ms. Patty Patty');

          closeModal(fixture);
        }));

        it('should respect a custom modal template', fakeAsync(() => {
          component.enableShowMore = true;
          component.descriptorProperty = 'birthDate';
          component.enableSearchResultTemplate();
          component.setShowMoreNativePickerConfig({
            itemTemplate: component.showMoreTemplate,
          });
          fixture.detectChanges();

          performSearch('p', fixture);
          clickShowMore(fixture);

          expect(getShowMoreRepeaterItemContent(0)).toBe('Patty - 1/1/1996');

          closeModal(fixture);
        }));

        it('should open a custom picker when enabled with no value', fakeAsync(() => {
          component.enableShowMore = true;
          component.enableCustomPicker();
          fixture.detectChanges();

          const customPickerSpy = spyOn(
            component.showMoreConfig!.customPicker!,
            'open',
          ).and.callThrough();

          performSearch('p', fixture);
          clickShowMore(fixture);

          expect(customPickerSpy).toHaveBeenCalledWith({
            items: component.data,
            initialSearch: 'p',
            initialValue: [],
          });
        }));

        it('should open a custom picker when enabled with a value', fakeAsync(() => {
          component.enableShowMore = true;
          component.enableCustomPicker();
          fixture.detectChanges();

          const customPickerSpy = spyOn(
            component.showMoreConfig!.customPicker!,
            'open',
          ).and.callThrough();

          performSearch('p', fixture);
          selectSearchResult(0, fixture);
          performSearch('p', fixture);
          clickShowMore(fixture);

          expect(customPickerSpy).toHaveBeenCalledWith({
            items: component.data,
            initialSearch: 'p',
            initialValue: [
              component.data?.find((item) => item.name === 'Patty'),
            ],
          });
        }));

        it(`should not change the tokens when the form control is updated while a show more picker is open`, fakeAsync(() => {
          component.enableShowMore = true;
          fixture.detectChanges();

          performSearch('s', fixture);
          selectSearchResult(0, fixture);

          expect(lookupComponent.value).toEqual([
            { name: 'Isaac', description: 'Mr. Isaac' },
          ]);

          clickShowMore(fixture);
          fixture.detectChanges();
          tick();

          component.selectedFriends = [component.data![1]];
          fixture.detectChanges();
          tick();
          expect(lookupComponent.value).toEqual([
            { name: 'Beth', description: 'Mrs. Beth' },
          ]);

          let tokenElements = getTokenElements();
          expect(tokenElements.length).toBe(1);
          expect(tokenElements.item(0).textContent?.trim()).toBe('Isaac');

          saveShowMoreModal(fixture);
          fixture.detectChanges();
          tick();

          expect(lookupComponent.value).toEqual([
            { name: 'Isaac', description: 'Mr. Isaac' },
          ]);

          tokenElements = getTokenElements();
          expect(tokenElements.length).toBe(1);
          expect(tokenElements.item(0).textContent?.trim()).toBe('Isaac');
        }));
      });
    });

    describe('validation', () => {
      it('should mark the form as invalid when it is required but is then emptied', fakeAsync(() => {
        component.selectedFriends = [{ name: 'Rachel' }];
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        component.setRequired();
        fixture.detectChanges();

        let model = fixture.debugElement
          .query(By.css('sky-autocomplete'))
          .injector.get(NgModel);
        expect(model.invalid).toEqual(false);

        dismissSelectedItem(0, fixture);
        fixture.detectChanges();

        model = fixture.debugElement
          .query(By.css('sky-autocomplete'))
          .injector.get(NgModel);
        expect(model.invalid).toEqual(true);
      }));
    });

    describe('events', function () {
      it('should not add event listeners if disabled', fakeAsync(() => {
        fixture.detectChanges();

        component.disableLookup();

        clickInputAndVerifyFocused(fixture, false);
      }));

      it('should allow setting `disabled` after initialization', fakeAsync(() => {
        fixture.detectChanges();
        tick();

        component.disableLookup();
        fixture.detectChanges();
        tick();

        clickInputAndVerifyFocused(fixture, false);
      }));
    });

    describe('keyboard interactions', function () {
      describe('multi-select', () => {
        beforeEach(() => {
          component.setMultiSelect();
        });

        it('should focus the input if arrowright key is pressed on the last token', fakeAsync(function () {
          component.selectedFriends = [{ name: 'Rachel' }];
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          const tokenHostElements = document.querySelectorAll('sky-token');
          SkyAppTestUtility.fireDomEvent(tokenHostElements.item(0), 'keydown', {
            keyboardEventInit: { key: 'ArrowRight' },
          });
          tick();
          fixture.detectChanges();
          tick();

          const inputElement = getInputElement(lookupComponent);
          expect(document.activeElement).toEqual(inputElement);
        }));

        it('should focus the last token if arrowleft or backspace pressed', fakeAsync(function () {
          function validateFocusedToken(key: string): void {
            triggerKeyPress(inputElement, key, fixture);
            expect(document.activeElement).toEqual(
              tokenElements.item(tokenElements.length - 1),
            );

            inputElement.focus();
            // Our blur listener has a delay of 25ms. This tick accounts for that.
            tick(25);
            fixture.detectChanges();
          }

          component.selectedFriends = [{ name: 'Rachel' }];
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          const tokenElements = getTokenElements();
          const inputElement = getInputElement(lookupComponent);

          validateFocusedToken('ArrowLeft');
          validateFocusedToken('Backspace');
          validateFocusedToken('Left');

          triggerKeyPress(inputElement, 'Space', fixture);
          expect(document.activeElement).toEqual(inputElement);
        }));

        it('should not focus the last token if search text is present', fakeAsync(function () {
          component.selectedFriends = [{ name: 'Rachel' }];
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          const inputElement = getInputElement(lookupComponent);

          performSearch('s', fixture);
          inputElement.focus();

          expect(inputElement.value).toEqual('s');

          triggerKeyPress(inputElement, 'ArrowLeft', fixture);
          expect(document.activeElement).toEqual(inputElement);
        }));

        it('should clear the search text if escape key is pressed', fakeAsync(function () {
          fixture.detectChanges();
          tick();

          const inputElement = getInputElement(lookupComponent);

          fixture.detectChanges();
          performSearch('s', fixture);

          expect(inputElement.value).toEqual('s');

          SkyAppTestUtility.fireDomEvent(inputElement, 'keyup', {
            keyboardEventInit: { key: 'Escape' },
          });
          tick();
          fixture.detectChanges();
          tick();

          expect(inputElement.value).toEqual('');
        }));

        it('should remove tokens when backspace or delete is pressed', fakeAsync(function () {
          component.selectedFriends = [
            { name: 'John', description: 'Mr. John' },
            { name: 'Jane' },
            { name: 'Doe' },
          ];
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          let tokenHostElements = document.querySelectorAll('sky-token');
          expect(tokenHostElements.length).toEqual(3);

          const tokensHostElement = document.querySelector('sky-tokens');
          SkyAppTestUtility.fireDomEvent(tokensHostElement, 'keyup', {
            keyboardEventInit: { key: 'Backspace' },
          });
          tick();
          fixture.detectChanges();
          tick();

          tokenHostElements = document.querySelectorAll('sky-token');
          expect(tokenHostElements.length).toEqual(2);
          expect(
            tokenHostElements.item(0).contains(document.activeElement),
          ).toEqual(true);

          SkyAppTestUtility.fireDomEvent(tokensHostElement, 'keyup', {
            keyboardEventInit: { key: 'Delete' },
          });
          tick();
          fixture.detectChanges();
          tick();

          tokenHostElements = document.querySelectorAll('sky-token');
          expect(tokenHostElements.length).toEqual(1);
          expect(
            tokenHostElements.item(0).contains(document.activeElement),
          ).toEqual(true);
        }));

        it('should prevent default if Enter is pressed on the input element', fakeAsync(function () {
          fixture.detectChanges();

          const inputElement = getInputElement(lookupComponent);

          const event = Object.assign(document.createEvent('CustomEvent'), {
            key: 'Enter',
          });

          spyOn(event, 'preventDefault');

          event.initEvent('keydown', true, true);
          inputElement.dispatchEvent(event);

          tick();
          fixture.detectChanges();
          tick();

          expect(event.preventDefault).toHaveBeenCalled();
        }));

        it('should unfocus the component if it loses focus', async function () {
          fixture.detectChanges();

          const inputElement = getInputElement(lookupComponent);
          inputElement.focus();
          SkyAppTestUtility.fireDomEvent(inputElement, 'focusin');
          fixture.detectChanges();
          await fixture.whenStable();
          fixture.detectChanges();
          await fixture.whenStable();

          expect(lookupComponent.isInputFocused).toEqual(true);

          getTestButton().focus();
          SkyAppTestUtility.fireDomEvent(document, 'focusin');
          fixture.detectChanges();
          await fixture.whenStable();
          fixture.detectChanges();
          await fixture.whenStable();

          expect(lookupComponent.isInputFocused).toEqual(false);
        });
      });

      describe('single-select', () => {
        beforeEach(() => {
          component.setSingleSelect();
        });

        it('should prevent default if Enter is pressed on the input element', fakeAsync(function () {
          fixture.detectChanges();

          const inputElement = getInputElement(lookupComponent);

          const event = Object.assign(document.createEvent('CustomEvent'), {
            key: 'Enter',
          });

          spyOn(event, 'preventDefault');

          event.initEvent('keydown', true, true);
          inputElement.dispatchEvent(event);

          tick();
          fixture.detectChanges();
          tick();

          expect(event.preventDefault).toHaveBeenCalled();
        }));

        it('should unfocus the component if it loses focus', async function () {
          fixture.detectChanges();

          const inputElement = getInputElement(lookupComponent);
          inputElement.focus();
          SkyAppTestUtility.fireDomEvent(inputElement, 'focusin');
          fixture.detectChanges();
          await fixture.whenStable();
          fixture.detectChanges();
          await fixture.whenStable();

          expect(lookupComponent.isInputFocused).toEqual(true);

          getTestButton().focus();
          SkyAppTestUtility.fireDomEvent(document, 'focusin');
          fixture.detectChanges();
          await fixture.whenStable();
          fixture.detectChanges();
          await fixture.whenStable();

          expect(lookupComponent.isInputFocused).toEqual(false);
        });
      });
    });

    describe('mouse interactions', function () {
      it('should focus the input if the host is clicked', fakeAsync(function () {
        fixture.detectChanges();

        const hostElement = document.querySelector('sky-lookup');
        const input = getInputElement(lookupComponent);

        triggerClick(hostElement, fixture);

        expect(document.activeElement).toEqual(input);
      }));

      it('should not focus the input if a token is clicked', fakeAsync(function () {
        fixture.detectChanges();

        performSearch('s', fixture);
        selectSearchResult(0, fixture);

        const input = getInputElement(lookupComponent);
        getInputElement(lookupComponent).blur();
        fixture.detectChanges();
        tick(25);

        clickToken(0, fixture, false);

        expect(document.activeElement).not.toEqual(input);
      }));
    });
  });

  describe('inside input box', () => {
    let fixture: ComponentFixture<SkyLookupInputBoxTestComponent>;
    let nativeElement: HTMLElement;
    let component: SkyLookupInputBoxTestComponent;
    let lookupComponent: SkyLookupComponent;

    function validateDescribedBy(selectMode: SkyLookupSelectModeType): void {
      fixture.componentInstance.selectMode = selectMode;
      fixture.detectChanges();

      const hintTextEl = nativeElement.querySelector(
        'sky-input-box .sky-input-box-hint-text',
      );

      const textareaEl = nativeElement.querySelector('textarea');

      expect(textareaEl.getAttribute('aria-describedby')).toBe(hintTextEl.id);
    }

    beforeEach(() => {
      fixture = TestBed.createComponent(SkyLookupInputBoxTestComponent);
      component = fixture.componentInstance;
      lookupComponent = component.lookupComponent;
      nativeElement = fixture.nativeElement as HTMLElement;
    });

    afterEach(() => {
      fixture.destroy();
    });

    it('should render in the expected input box containers', fakeAsync(() => {
      fixture.detectChanges();

      const inputBoxEl = nativeElement.querySelector('sky-input-box');

      const inputGroupEl = inputBoxEl?.querySelector(
        '.sky-input-box-input-group-inner',
      );
      const containerEl = inputGroupEl?.children.item(1);

      expect(containerEl).toHaveCssClass('sky-lookup');
    }));

    it('should render in the expected input box containers (show more)', fakeAsync(() => {
      component.enableShowMore = true;
      fixture.detectChanges();

      const inputBoxEl = nativeElement.querySelector('sky-input-box');

      const inputGroupEl = inputBoxEl?.querySelector(
        '.sky-input-box-input-group-inner',
      );
      const containerEl = inputGroupEl?.children.item(1);

      expect(containerEl).toHaveCssClass('sky-lookup');
    }));

    it('should unfocus the component if it loses focus', async function () {
      fixture.detectChanges();

      const inputElement = getInputElement(lookupComponent);
      inputElement.focus();
      SkyAppTestUtility.fireDomEvent(inputElement, 'focusin', {
        bubbles: true,
      });
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(lookupComponent.isInputFocused).toEqual(true);

      getTestButton().focus();
      SkyAppTestUtility.fireDomEvent(inputElement, 'focusout', {
        bubbles: true,
      });
      SkyAppTestUtility.fireDomEvent(document, 'focusin', { bubbles: true });
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(lookupComponent.isInputFocused).toEqual(false);
    });

    it('should add or remove the required label class if `required` is set on lookup element', () => {
      component.required = true;
      fixture.detectChanges();

      let requiredLabel = fixture.nativeElement.querySelector(
        '.sky-control-label-required',
      );
      expect(requiredLabel).toExist();

      component.required = false;
      fixture.detectChanges();
      requiredLabel = fixture.nativeElement.querySelector(
        '.sky-control-label-required',
      );
      expect(requiredLabel).not.toExist();
    });

    describe('aria-describedby attribute', () => {
      it('should be set when hint text is specified and select mode is single', () => {
        validateDescribedBy('single');
      });

      it('should be set when hint text is specified and select mode is multiple', () => {
        validateDescribedBy('multiple');
      });
    });

    describe('mouse interactions', function () {
      it('should focus the input if the host is clicked', fakeAsync(function () {
        fixture.detectChanges();

        const hostElement = document.querySelector('.sky-lookup');
        const input = getInputElement(lookupComponent);

        triggerClick(hostElement, fixture);

        expect(document.activeElement).toEqual(input);
      }));

      it('should not focus the input if a token is clicked', fakeAsync(function () {
        fixture.detectChanges();

        performSearch('s', fixture);
        selectSearchResult(0, fixture);

        const input = getInputElement(lookupComponent);
        getInputElement(lookupComponent).blur();
        fixture.detectChanges();
        tick(25);

        clickToken(0, fixture, false);

        expect(document.activeElement).not.toEqual(input);
      }));
    });

    describe('a11y', function () {
      const axeConfig = {
        rules: {
          region: {
            enabled: false,
          },
        },
      };

      beforeEach(() => {
        fixture.detectChanges();
      });

      it('should be accessible [mode: single, value: set, ariaLabel: undefined, ariaLabelledBy: set]', async () => {
        fixture.componentInstance.ariaLabelledBy = 'my-lookup-label';
        fixture.componentInstance.setSingleSelect();
        fixture.componentInstance.setValue(2);

        fixture.detectChanges();
        await fixture.whenStable();
        await expectAsync(document.body).toBeAccessible(axeConfig);
      });

      it('should be accessible [mode: single, value: set, ariaLabel: set, ariaLabelledBy: undefined]', async () => {
        fixture.componentInstance.setSingleSelect();
        fixture.componentInstance.setValue(2);
        fixture.componentInstance.ariaLabel = 'My lookup label';

        fixture.detectChanges();
        await fixture.whenStable();
        await expectAsync(document.body).toBeAccessible(axeConfig);
      });

      it('should be accessible [mode: single, value: set, ariaLabel: undefined, ariaLabelledBy: undefined]', async () => {
        fixture.componentInstance.setSingleSelect();
        fixture.componentInstance.setValue(2);

        fixture.detectChanges();
        await fixture.whenStable();
        await expectAsync(document.body).toBeAccessible(axeConfig);
      });

      it('should be accessible [mode: single, value: undefined, ariaLabel: undefined, ariaLabelledBy: set]', async () => {
        fixture.componentInstance.ariaLabelledBy = 'my-lookup-label';
        fixture.componentInstance.setSingleSelect();
        fixture.componentInstance.setValue(undefined);

        fixture.detectChanges();
        await fixture.whenStable();
        await expectAsync(document.body).toBeAccessible(axeConfig);
      });

      it('should be accessible [mode: single, value: undefined, ariaLabel: set, ariaLabelledBy: undefined]', async () => {
        fixture.componentInstance.setSingleSelect();
        fixture.componentInstance.setValue(undefined);
        fixture.componentInstance.ariaLabel = 'My lookup label';

        fixture.detectChanges();
        await fixture.whenStable();
        await expectAsync(document.body).toBeAccessible(axeConfig);
      });

      it('should be accessible [mode: single, value: undefined, ariaLabel: undefined, ariaLabelledBy: undefined]', async () => {
        fixture.componentInstance.setSingleSelect();
        fixture.componentInstance.setValue(undefined);

        fixture.detectChanges();
        await fixture.whenStable();
        await expectAsync(document.body).toBeAccessible(axeConfig);
      });

      it('should be accessible [mode: multiple, value: set, ariaLabel: undefined, ariaLabelledBy: set]', async () => {
        fixture.componentInstance.ariaLabelledBy = 'my-lookup-label';
        fixture.componentInstance.setMultiSelect();
        fixture.componentInstance.setValue(2);

        fixture.detectChanges();
        await fixture.whenStable();
        await expectAsync(document.body).toBeAccessible(axeConfig);
      });

      it('should be accessible [mode: multiple, value: set, ariaLabel: set, ariaLabelledBy: undefined]', async () => {
        fixture.componentInstance.setMultiSelect();
        fixture.componentInstance.setValue(2);
        fixture.componentInstance.ariaLabel = 'My lookup label';

        fixture.detectChanges();
        await fixture.whenStable();
        await expectAsync(document.body).toBeAccessible(axeConfig);
      });

      it('should be accessible [mode: multiple, value: set, ariaLabel: undefined, ariaLabelledBy: undefined]', async () => {
        fixture.componentInstance.setMultiSelect();
        fixture.componentInstance.setValue(2);

        fixture.detectChanges();
        await fixture.whenStable();
        await expectAsync(document.body).toBeAccessible(axeConfig);
      });

      it('should be accessible [mode: multiple, value: undefined, ariaLabel: undefined, ariaLabelledBy: set]', async () => {
        fixture.componentInstance.ariaLabelledBy = 'my-lookup-label';
        fixture.componentInstance.setMultiSelect();
        fixture.componentInstance.setValue(undefined);

        fixture.detectChanges();
        await fixture.whenStable();
        await expectAsync(document.body).toBeAccessible(axeConfig);
      });

      it('should be accessible [mode: multiple, value: undefined, ariaLabel: set, ariaLabelledBy: undefined]', async () => {
        fixture.componentInstance.setMultiSelect();
        fixture.componentInstance.setValue(undefined);
        fixture.componentInstance.ariaLabel = 'My lookup label';

        fixture.detectChanges();
        await fixture.whenStable();
        await expectAsync(document.body).toBeAccessible(axeConfig);
      });

      it('should be accessible [mode: multiple, value: undefined, ariaLabel: undefined, ariaLabelledBy: undefined]', async () => {
        fixture.componentInstance.setMultiSelect();
        fixture.componentInstance.setValue(undefined);

        fixture.detectChanges();
        await fixture.whenStable();
        await expectAsync(document.body).toBeAccessible(axeConfig);
      });

      it('should be accessible [mode: single, value: input typed, ariaLabel: undefined, ariaLabelledBy: undefined]', async () => {
        fixture.componentInstance.setSingleSelect();
        const inputElement = getInputElement(
          fixture.componentInstance.lookupComponent,
        );
        inputElement.value = 'r';
        inputElement.focus();
        SkyAppTestUtility.fireDomEvent(inputElement, 'keyup', {
          keyboardEventInit: { key: '' },
        });

        fixture.detectChanges();
        await fixture.whenStable();
        await expectAsync(document.body).toBeAccessible(axeConfig);
      });

      it('should be accessible [mode: multiple, value: input typed, ariaLabel: undefined, ariaLabelledBy: undefined]', async () => {
        fixture.componentInstance.setMultiSelect();
        const inputElement = getInputElement(
          fixture.componentInstance.lookupComponent,
        );
        inputElement.value = 'r';
        inputElement.focus();
        SkyAppTestUtility.fireDomEvent(inputElement, 'keyup', {
          keyboardEventInit: { key: '' },
        });

        fixture.detectChanges();
        await fixture.whenStable();
        await expectAsync(document.body).toBeAccessible(axeConfig);
      });
    });
  });
});
