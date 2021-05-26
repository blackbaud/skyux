import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  NgModel
} from '@angular/forms';

import {
  By
} from '@angular/platform-browser';

import {
  SkyModalService
} from '@skyux/modals';

import {
  expect,
  expectAsync,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  SkyLookupComponent
} from './lookup.component';

import {
  SkyLookupFixturesModule
} from './fixtures/lookup-fixtures.module';

import {
  SkyLookupTestComponent
} from './fixtures/lookup.component.fixture';

import {
  SkyLookupTemplateTestComponent
} from './fixtures/lookup-template.component.fixture';

import {
  SkyLookupInputBoxTestComponent
} from './fixtures/lookup-input-box.component.fixture';

import {
  SkyLookupSelectMode
} from './types/lookup-select-mode';

describe('Lookup component', function () {

  //#region helpers

  function clearShowMoreSearch(fixture: ComponentFixture<any>): void {
    (<HTMLElement>document.querySelector('.sky-lookup-show-more-modal-toolbar .sky-search-btn-clear')).click();

    fixture.detectChanges();
    tick(250);
    fixture.detectChanges();
  }

  function clickModalAddButton(fixture: ComponentFixture<any>): void {
    getModalAddButton().click();
    fixture.detectChanges();
  }

  function clickShowMore(fixture: ComponentFixture<any>): void {
    getShowMoreButton().click();
    fixture.detectChanges();
    tick();
  }

  function clickShowMoreClearAll(fixture: ComponentFixture<any>): void {
    (<HTMLElement>document.querySelector('.sky-lookup-show-more-modal-clear-all-btn')).click();
    fixture.detectChanges();
  }

  function clickShowMoreSelectAll(fixture: ComponentFixture<any>): void {
    (<HTMLElement>document.querySelector('.sky-lookup-show-more-modal-select-all-btn')).click();
    fixture.detectChanges();
  }

  function clickToken(index: number, fixture: ComponentFixture<any>): void {
    (<HTMLElement>document.querySelectorAll('.sky-lookup-tokens .sky-token')[index]).click();
    fixture.detectChanges();
  }

  function closeModal(fixture: ComponentFixture<any>): void {
    (<HTMLElement>document.querySelector('.sky-lookup-show-more-modal-close'))?.click();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
  }

  function dismissSelectedItem(index: number, fixture: ComponentFixture<any>): void {
    const tokenElements = document.querySelectorAll('.sky-token');
    (tokenElements.item(index).querySelector('.sky-token-btn-close') as HTMLElement).click();
    tick();
    fixture.detectChanges();
    tick();
  }

  function getAddButton(): HTMLElement {
    return document.querySelector('.sky-autocomplete-add') as HTMLElement;
  }

  function getInputElement(lookupComponent: SkyLookupComponent): HTMLInputElement {
    return lookupComponent['elementRef'].nativeElement.querySelector('.sky-lookup-input');
  }

  function getModalAddButton(): HTMLElement {
    return document.querySelector('.sky-lookup-show-more-modal-add') as HTMLElement;
  }

  function getRepeaterItemCount(): number {
    return document.querySelectorAll('sky-modal sky-repeater-item').length;
  }

  function getShowMoreButton(): HTMLElement {
    return document.querySelector('.sky-autocomplete-more') as HTMLElement;
  }

  function getShowMoreRepeaterItemContent(index: number): string {
    return (<HTMLElement>document
      .querySelectorAll('sky-modal sky-repeater-item-content')[index]).textContent.trim();
  }

  function getShowMoreModalTitle(): string {
    return document.querySelector('sky-modal-header').textContent.trim();
  }
  function getTokenElements(): NodeListOf<Element> {
    return document.querySelectorAll('.sky-token');
  }

  function performSearch(searchText: string, fixture: ComponentFixture<any>): void {
    const inputElement = getInputElement(fixture.componentInstance.lookupComponent);
    inputElement.value = searchText;
    SkyAppTestUtility.fireDomEvent(inputElement, 'input');
    tick();
    fixture.detectChanges();
    tick();
  }

  function saveShowMoreModal(fixture: ComponentFixture<any>): void {
    (<HTMLElement>document.querySelector('.sky-lookup-show-more-modal-save')).click();
    fixture.detectChanges();
  }

  function selectSearchResult(index: number, fixture: ComponentFixture<any>): void {
    const dropdownButtons = document.querySelectorAll('.sky-autocomplete-result');
    SkyAppTestUtility.fireDomEvent(dropdownButtons.item(index), 'mousedown');
    tick();
    fixture.detectChanges();
    tick();
  }

  function selectShowOnlySelected(fixture: ComponentFixture<any>): void {
    (<HTMLElement>document.querySelector('.sky-lookup-show-more-modal-muiltiselect-toolbar .sky-toolbar-view-actions input')).click();
    fixture.detectChanges();
    tick(250);
    fixture.detectChanges();
  }

  function selectShowMoreItemMultiple(index: number, fixture: ComponentFixture<any>): void {
    (<HTMLElement>document.querySelectorAll('.sky-lookup-show-more-repeater sky-repeater-item input')[index]).click();
    fixture.detectChanges();
  }

  function selectShowMoreItemSingle(index: number, fixture: ComponentFixture<any>): void {
    (<HTMLElement>document.querySelectorAll('.sky-lookup-show-more-repeater sky-repeater-item')[index]).click();
    fixture.detectChanges();
  }

  function triggerClick(element: Element, fixture: ComponentFixture<any>, focusable = false): void {
    SkyAppTestUtility.fireDomEvent(element, 'mousedown');
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

  function triggerInputFocus(fixture: ComponentFixture<any>): void {
    const inputElement = getInputElement(fixture.componentInstance.lookupComponent);
    SkyAppTestUtility.fireDomEvent(inputElement, 'focus');
  }

  function triggerKeyPress(element: Element, key: string, fixture: ComponentFixture<any>): void {
    SkyAppTestUtility.fireDomEvent(element, 'keydown', {
      keyboardEventInit: { key }
    });
    tick();
    fixture.detectChanges();
    tick();

    SkyAppTestUtility.fireDomEvent(element, 'keyup', {
      keyboardEventInit: { key }
    });
    tick();
    fixture.detectChanges();
    tick();
  }

  //#endregion

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        SkyLookupFixturesModule
      ]
    });
  });

  describe('reactive form', () => {
    let fixture: ComponentFixture<SkyLookupTestComponent>;
    let component: SkyLookupTestComponent;
    let lookupComponent: SkyLookupComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(SkyLookupTestComponent);
      component = fixture.componentInstance;
      lookupComponent = component.lookupComponent;
    });

    describe('basic setup', function () {
      function validateItems(names: string[]): void {
        const selectedItems = lookupComponent.value;

        expect(selectedItems.map(item => item.name)).toEqual(names);
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

        expect(lookupComponent.autocompleteAttribute).toEqual('new-custom-field');
      });

      it('should share the same inputs as autocomplete', function () {
        fixture.detectChanges();
        expect(typeof lookupComponent.data).not.toBeUndefined();
        expect(typeof lookupComponent.debounceTime).not.toBeUndefined();
        expect(typeof lookupComponent.descriptorProperty).not.toBeUndefined();
        expect(typeof lookupComponent.propertiesToSearch).not.toBeUndefined();
        expect(typeof lookupComponent.search).not.toBeUndefined();
        expect(typeof lookupComponent.searchResultTemplate).not.toBeUndefined();
        expect(typeof lookupComponent.searchTextMinimumCharacters).not.toBeUndefined();
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
            { name: 'Fred' },
            { name: 'Isaac' },
            { name: 'John' },
            { name: 'Joyce' },
            { name: 'Lindsey' }
          ];
          fixture.detectChanges();

          expect(lookupComponent.tokens.length).toBe(5);
          expect(lookupComponent.tokens[0].value).toEqual({ name: 'Fred' });
          expect(lookupComponent.value).toEqual([
            { name: 'Fred' },
            { name: 'Isaac' },
            { name: 'John' },
            { name: 'Joyce' },
            { name: 'Lindsey' }
          ]);

          performSearch('Oli', fixture);
          selectSearchResult(0, fixture);

          expect(lookupComponent.tokens.length).toBe(6);
          expect(lookupComponent.tokens[0].value).toEqual({ name: 'Fred' });
          expect(lookupComponent.value).toEqual([
            { name: 'Fred' },
            { name: 'Isaac' },
            { name: 'John' },
            { name: 'Joyce' },
            { name: 'Lindsey' },
            { name: 'Oliver' }
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
          tick();

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
          const showMoreSpy = spyOn(component.lookupComponent, 'showMoreButtonClicked').and.stub();

          component.friends = [
            { name: 'Fred' },
            { name: 'Isaac' }
          ];
          fixture.detectChanges();

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
          tick();

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
        tick();
        fixture.detectChanges();

        expect(component.form.touched).toEqual(true);
      }));

      it('should remove all but the first value when the mode is changed to single select', fakeAsync(() => {
        component.friends = [{ name: 'Rachel' }, { name: 'Isaac' }];
        fixture.detectChanges();

        component.setSingleSelect();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(lookupComponent.value).toEqual([{ name: 'Rachel' }]);
      }));

      describe('form control interactions', function () {
        it('should properly reset a form', fakeAsync(function () {
          fixture.detectChanges();

          performSearch('s', fixture);
          selectSearchResult(0, fixture);

          expect(lookupComponent.tokens.length).toBe(1);
          expect(lookupComponent.value).toEqual([{ name: 'Isaac' }]);

          component.resetForm();

          expect(lookupComponent.tokens.length).toBe(0);
          expect(lookupComponent.value).toEqual([]);
        }));

        it('should properly set a value through the form control', fakeAsync(function () {
          fixture.detectChanges();

          performSearch('s', fixture);
          selectSearchResult(0, fixture);

          expect(lookupComponent.tokens.length).toBe(1);
          expect(lookupComponent.tokens[0].value).toEqual({ name: 'Isaac' });
          expect(lookupComponent.value).toEqual([{ name: 'Isaac' }]);

          component.setValue(0);

          expect(lookupComponent.tokens.length).toBe(1);
          expect(lookupComponent.tokens[0].value).toEqual({
            name: 'Andy',
            description: 'Mr. Andy',
            birthDate: '1/1/1995'
          });
          expect(lookupComponent.value).toEqual([{
            name: 'Andy',
            description: 'Mr. Andy',
            birthDate: '1/1/1995'
          }]);
        }));
      });
    });

    describe('single select', () => {
      beforeEach(() => {
        component.setSingleSelect();
      });

      it('should allow a preselected value', fakeAsync(() => {
        const bestFriend = { name: 'Rachel' };
        expect(lookupComponent.value).toEqual([]);

        component.friends = [bestFriend];
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(lookupComponent.value).toEqual([bestFriend]);
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

        expect(lookupComponent.value).toEqual([{ name: 'Isaac' }]);
      }));

      it('should select a new value when a different value is selected', fakeAsync(function () {
        fixture.detectChanges();
        expect(lookupComponent.value).toEqual([]);

        performSearch('s', fixture);
        selectSearchResult(0, fixture);

        expect(lookupComponent.value).toEqual([{ name: 'Isaac' }]);
      }));

      it('should clear the value when the search text is clared', fakeAsync(function () {
        fixture.detectChanges();
        expect(lookupComponent.value).toEqual([]);

        performSearch('s', fixture);
        selectSearchResult(0, fixture);

        expect(lookupComponent.value).toEqual([{ name: 'Isaac' }]);

        performSearch('', fixture);

        expect(lookupComponent.value).toEqual([]);
      }));

      it('should NOT set a new value when no search options are returned', fakeAsync(function () {
        fixture.detectChanges();
        expect(lookupComponent.value).toEqual([]);

        performSearch('no results for this search', fixture);
        getInputElement(lookupComponent).blur();

        expect(lookupComponent.value).toEqual([]);
      }));

      describe('form control interactions', function () {
        it('should properly reset a form', fakeAsync(function () {
          fixture.detectChanges();

          performSearch('s', fixture);
          selectSearchResult(0, fixture);

          expect(getInputElement(lookupComponent).value).toBe('Isaac');
          expect(lookupComponent.value).toEqual([{ name: 'Isaac' }]);

          component.resetForm();

          expect(getInputElement(lookupComponent).value).toBe('');
          expect(lookupComponent.value).toEqual([]);
        }));

        it('should properly set a value through the form control', fakeAsync(function () {
          fixture.detectChanges();

          performSearch('s', fixture);
          selectSearchResult(0, fixture);

          expect(getInputElement(lookupComponent).value).toBe('Isaac');
          expect(lookupComponent.value).toEqual([{ name: 'Isaac' }]);

          component.setValue(0);

          expect(getInputElement(lookupComponent).value).toBe('Andy');
          expect(lookupComponent.value).toEqual([{
            name: 'Andy',
            description: 'Mr. Andy',
            birthDate: '1/1/1995'
          }]);
        }));
      });
    });

    describe('actions', () => {

      describe('add button', () => {

        it('should emit an event correctly when the add button is enabled and clicked',
          fakeAsync(() => {
            component.showAddButton = true;
            const addButtonSpy = spyOn(component, 'addButtonClicked').and.callThrough();
            fixture.detectChanges();

            // Type 'r' to activate the autocomplete dropdown, then click the first result.
            performSearch('r', fixture);

            const addButton = getAddButton();
            expect(addButton).not.toBeNull();
            expect(addButtonSpy).not.toHaveBeenCalled();

            addButton.click();
            fixture.detectChanges();

            expect(addButtonSpy).toHaveBeenCalled();
          })
        );

        it('should not show the add button unless the component input asks for it',
          fakeAsync(() => {
            component.showAddButton = false;
            const addButtonSpy = spyOn(component, 'addButtonClicked').and.callThrough();
            fixture.detectChanges();

            // Type 'r' to activate the autocomplete dropdown, then click the first result.
            performSearch('r', fixture);

            const addButton = getAddButton();
            expect(addButton).toBeNull();
            expect(addButtonSpy).not.toHaveBeenCalled();
          })
        );

      });

      describe('show more button', () => {

        let modalService: SkyModalService;

        beforeEach(fakeAsync(() => {
          modalService = TestBed.inject(SkyModalService);

          fixture.detectChanges();
          tick();
        }));

        // This is necessary as due to modals being launched outside of the test bed they will not
        // automatically be disposed between tests.
        afterEach(fakeAsync(() => {
          // NOTE: This is important as it ensures that the modal host component is fully disposed of
          // between tests. This is important as the modal host might need a different set of component
          // injectors than the previous test.
          modalService.dispose();
          fixture.detectChanges();
        }));

        it('should open the modal when the show more button is clicked',
          fakeAsync(() => {
            component.enableShowMore = true;
            fixture.detectChanges();

            spyOn(modalService, 'open').and.callThrough();

            performSearch('r', fixture);
            clickShowMore(fixture);

            expect(modalService.open).toHaveBeenCalled();

            closeModal(fixture);
          })
        );

        describe('multi-select', () => {

          it('should populate the correct selected item and save that when no changes are made',
            fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(0, fixture);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([{ name: 'Isaac' }, { name: 'Lindsey' }]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([{ name: 'Isaac' }, { name: 'Lindsey' }]);

              closeModal(fixture);
            })
          );

          it('should select the correct items when multiple are selected from the show all modal',
            fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([{ name: 'Lindsey' }]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              selectShowMoreItemMultiple(0, fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([{ name: 'Isaac' }, { name: 'Lindsey' }]);

              closeModal(fixture);
            })
          );

          it('should not make any changes when the show all modal is cancelled',
            fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([{ name: 'Lindsey' }]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              selectShowMoreItemMultiple(0, fixture);

              closeModal(fixture);

              expect(lookupComponent.value).toEqual([{ name: 'Lindsey' }]);
            })
          );

          it('should select the correct items when items are deselected from the show all modal',
            fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([{ name: 'Lindsey' }]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              selectShowMoreItemMultiple(0, fixture);
              selectShowMoreItemMultiple(1, fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([{ name: 'Isaac' }]);

              closeModal(fixture);
            })
          );

          it('should select the correct items after existing search text is cleared',
            fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([{ name: 'Lindsey' }]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              clearShowMoreSearch(fixture);

              selectShowMoreItemMultiple(0, fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([
                {
                  name: 'Andy',
                  description: 'Mr. Andy',
                  birthDate: '1/1/1995'
                },
                { name: 'Lindsey' }
              ]);

              closeModal(fixture);
            })
          );

          it('should handle "Clear all" correct in the show more modal',
            fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('Pa', fixture);
              selectSearchResult(0, fixture);

              expect(lookupComponent.value).toEqual([{
                name: 'Patty',
                description: 'Ms. Patty',
                birthDate: '1/1/1996'
              }]);

              performSearch('Pa', fixture);
              clickShowMore(fixture);

              clickShowMoreClearAll(fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([]);

              closeModal(fixture);
            })
          );

          it('should handle "Select all" correct in the show more modal',
            fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('Pa', fixture);
              selectSearchResult(0, fixture);

              expect(lookupComponent.value).toEqual([{
                name: 'Patty',
                description: 'Ms. Patty',
                birthDate: '1/1/1996'
              }]);

              performSearch('Pa', fixture);
              clickShowMore(fixture);

              clickShowMoreSelectAll(fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([
                {
                  name: 'Patty',
                  description: 'Ms. Patty',
                  birthDate: '1/1/1996'
                },
                {
                  name: 'Paul',
                  description: 'Mr. Paul',
                  birthDate: '11/1997'
                }
              ]);

              closeModal(fixture);
            })
          );

          it('should handle "Only show selected correctly in the show more modal',
            fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([{ name: 'Lindsey' }]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              selectShowOnlySelected(fixture);

              selectShowMoreItemMultiple(0, fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([]);

              closeModal(fixture);
            })
          );

          it('the default modal title should be correct',
            fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              expect(getShowMoreModalTitle()).toBe('Select options');

              closeModal(fixture);
            })
          );

          it('should respect a custom modal title',
            fakeAsync(() => {
              component.enableShowMore = true;
              component.setShowMoreNativePickerConfig({
                title: 'Custom title'
              });
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              expect(getShowMoreModalTitle()).toBe('Custom title');

              closeModal(fixture);
            })
          );

          it('should collapse tokens if more than 5 items are selected', fakeAsync(() => {
            component.enableShowMore = true;
            component.friends = [
              { name: 'Fred' },
              { name: 'Isaac' },
              { name: 'John' },
              { name: 'Joyce' },
              { name: 'Lindsey' }
            ];
            fixture.detectChanges();

            expect(lookupComponent.tokens.length).toBe(5);
            expect(lookupComponent.tokens[0].value).toEqual({ name: 'Fred' });
            expect(lookupComponent.value).toEqual([
              { name: 'Fred' },
              { name: 'Isaac' },
              { name: 'John' },
              { name: 'Joyce' },
              { name: 'Lindsey' }
            ]);

            performSearch('Oli', fixture);
            selectSearchResult(0, fixture);

            expect(lookupComponent.tokens.length).toBe(1);
            expect(lookupComponent.tokens[0].value).toEqual({ name: '6 items selected' });
            expect(lookupComponent.value).toEqual([
              { name: 'Fred' },
              { name: 'Isaac' },
              { name: 'John' },
              { name: 'Joyce' },
              { name: 'Lindsey' },
              { name: 'Oliver' }
            ]);
          }));

          it('should open the show more modal on token click', fakeAsync(() => {
            const showMoreSpy = spyOn(component.lookupComponent, 'showMoreButtonClicked').and.stub();

            component.enableShowMore = true;
            component.friends = [
              { name: 'Fred' },
              { name: 'Isaac' }
            ];
            fixture.detectChanges();

            clickToken(0, fixture);

            expect(showMoreSpy).toHaveBeenCalled();
          }));

          it('should open the show more modal on collapsed token click', fakeAsync(() => {
            const showMoreSpy = spyOn(component.lookupComponent, 'showMoreButtonClicked').and.stub();

            component.enableShowMore = true;
            component.friends = [
              { name: 'Fred' },
              { name: 'Isaac' },
              { name: 'John' },
              { name: 'Joyce' },
              { name: 'Lindsey' },
              { name: 'Oliver' }
            ];
            fixture.detectChanges();

            clickToken(0, fixture);

            expect(showMoreSpy).toHaveBeenCalled();
          }));

        });

        describe('single-select', () => {

          it('should populate the correct selected item and save that when no changes are made',
            fakeAsync(() => {
              component.selectMode = SkyLookupSelectMode.single;
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(0, fixture);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([{ name: 'Lindsey' }]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([{ name: 'Lindsey' }]);

              closeModal(fixture);
            })
          );

          it('should select the correct item when changed from the show all modal',
            fakeAsync(() => {
              component.selectMode = SkyLookupSelectMode.single;
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([{ name: 'Lindsey' }]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              selectShowMoreItemSingle(0, fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([{ name: 'Isaac' }]);

              closeModal(fixture);
            })
          );

          it('should not make any changes when the show all modal is cancelled',
            fakeAsync(() => {
              component.selectMode = SkyLookupSelectMode.single;
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([{ name: 'Lindsey' }]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              selectShowMoreItemSingle(0, fixture);

              closeModal(fixture);

              expect(lookupComponent.value).toEqual([{ name: 'Lindsey' }]);

              closeModal(fixture);
            })
          );

          it('the default modal title should be correct',
            fakeAsync(() => {
              component.selectMode = SkyLookupSelectMode.single;
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              expect(getShowMoreModalTitle()).toBe('Select an option');

              closeModal(fixture);
            })
          );

          it('should respect a custom modal title',
            fakeAsync(() => {
              component.selectMode = SkyLookupSelectMode.single;
              component.enableShowMore = true;
              component.setShowMoreNativePickerConfig({
                title: 'Custom title'
              });
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              expect(getShowMoreModalTitle()).toBe('Custom title');

              closeModal(fixture);
            })
          );

          it('should show only searched items when search is enabled',
            fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('Pa', fixture);
              clickShowMore(fixture);

              expect(getRepeaterItemCount()).toBe(2);

              closeModal(fixture);
            })
          );

          it('should 10 items by default',
            fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();

              triggerInputFocus(fixture);
              fixture.detectChanges();
              tick();
              clickShowMore(fixture);

              expect(getRepeaterItemCount()).toBe(10);

              closeModal(fixture);
            })
          );

          it('should add items when scrolling ends',
            async () => {
              component.enableShowMore = true;
              fixture.detectChanges();

              triggerInputFocus(fixture);
              fixture.detectChanges();
              await fixture.whenStable();
              // Not using `clickShowMore` due to it being for `fakeAsync`
              getShowMoreButton().click();
              fixture.detectChanges();
              await fixture.whenStable();

              expect(getRepeaterItemCount()).toBe(10);

              let modalContent = document.querySelector('.sky-modal-content');
              modalContent.scrollTop = modalContent.scrollHeight;
              SkyAppTestUtility.fireDomEvent(modalContent, 'scroll');
              fixture.detectChanges();
              await fixture.whenStable();
              fixture.detectChanges();

              expect(getRepeaterItemCount()).toBe(20);

              modalContent = document.querySelector('.sky-modal-content');
              modalContent.scrollTop = modalContent.scrollHeight;
              SkyAppTestUtility.fireDomEvent(modalContent, 'scroll');
              fixture.detectChanges();
              await fixture.whenStable();
              fixture.detectChanges();

              expect(getRepeaterItemCount()).toBe(21);

              (<HTMLElement>document.querySelector('.sky-lookup-show-more-modal-close'))?.click();
            }
          );

        });

        it('should trickle down the add button click event when triggered from the show all modal',
          fakeAsync(() => {
            component.showAddButton = true;
            component.enableShowMore = true;
            const addButtonSpy = spyOn(component, 'addButtonClicked').and.callThrough();
            fixture.detectChanges();

            performSearch('r', fixture);
            clickShowMore(fixture);

            clickModalAddButton(fixture);

            expect(addButtonSpy).toHaveBeenCalled();

            closeModal(fixture);
          })
        );

        it('should not show the show more button unless the component input asks for it',
          fakeAsync(() => {
            component.enableShowMore = false;
            fixture.detectChanges();

            // Type 'r' to activate the autocomplete dropdown, then click the first result.
            performSearch('r', fixture);

            const showMoreButton = getShowMoreButton();
            expect(showMoreButton).toBeNull();
          })
        );

        it('should show the "name" property in the modal items by default',
          fakeAsync(() => {
            component.enableShowMore = true;
            fixture.detectChanges();

            performSearch('p', fixture);
            clickShowMore(fixture);

            expect(getShowMoreRepeaterItemContent(0)).toBe('Patty');

            closeModal(fixture);
          })
        );

        it('should respect a descriptor property being sent into the show more modal',
          fakeAsync(() => {
            component.enableShowMore = true;
            component.descriptorProperty = 'birthDate';
            fixture.detectChanges();

            performSearch('p', fixture);
            clickShowMore(fixture);

            expect(getShowMoreRepeaterItemContent(0)).toBe('1/1/1996');

            closeModal(fixture);
          })
        );

        it('should send the search result template into the show more modal',
          fakeAsync(() => {
            component.enableShowMore = true;
            component.descriptorProperty = 'birthDate';
            component.enableSearchResultTemplate();
            fixture.detectChanges();

            performSearch('p', fixture);
            clickShowMore(fixture);

            expect(getShowMoreRepeaterItemContent(0)).toBe('Ms. Patty');

            closeModal(fixture);
          })
        );

        it('should respect a custom modal template',
          fakeAsync(() => {
            component.enableShowMore = true;
            component.descriptorProperty = 'birthDate';
            component.enableSearchResultTemplate();
            component.setShowMoreNativePickerConfig({ itemTemplate: component.showMoreTemplate });
            fixture.detectChanges();

            performSearch('p', fixture);
            clickShowMore(fixture);

            expect(getShowMoreRepeaterItemContent(0)).toBe('Patty - 1/1/1996');

            closeModal(fixture);
          })
        );

        it('should open a custom picker when enabled with no value',
          fakeAsync(() => {
            component.enableShowMore = true;
            component.enableCustomPicker();
            fixture.detectChanges();

            const customPickerSpy = spyOn(component.showMoreConfig.customPicker, 'open').and.callThrough();

            performSearch('p', fixture);
            clickShowMore(fixture);

            expect(customPickerSpy).toHaveBeenCalledWith({
              items: component.data,
              initialSearch: 'p',
              initialValue: []
            });

            closeModal(fixture);
          })
        );

        it('should open a custom picker when enabled with a value',
          fakeAsync(() => {
            component.enableShowMore = true;
            component.enableCustomPicker();
            fixture.detectChanges();

            const customPickerSpy = spyOn(component.showMoreConfig.customPicker, 'open').and.callThrough();

            performSearch('p', fixture);
            selectSearchResult(0, fixture);
            performSearch('p', fixture);
            clickShowMore(fixture);

            expect(customPickerSpy).toHaveBeenCalledWith({
              items: component.data,
              initialSearch: 'p',
              initialValue: [component.data.find(item => item.name === 'Patty')]
            });
          })
        );
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
    });

    describe('events', function () {
      it('should not add event listeners if disabled', function () {
        lookupComponent.disabled = true;
        const spy = spyOn(lookupComponent as any, 'addEventListeners').and.callThrough();
        fixture.detectChanges();
        expect(spy).not.toHaveBeenCalled();
      });

      it('should allow setting `disabled` after initialization', function () {
        const addSpy = spyOn(lookupComponent as any, 'addEventListeners').and.callThrough();
        const removeSpy = spyOn(lookupComponent as any, 'removeEventListeners').and.callThrough();

        lookupComponent.disabled = false;
        fixture.detectChanges();

        expect(addSpy).toHaveBeenCalled();
        expect(removeSpy).not.toHaveBeenCalled();

        addSpy.calls.reset();
        removeSpy.calls.reset();

        component.disableLookup();
        fixture.detectChanges();

        expect(addSpy).not.toHaveBeenCalled();
        expect(removeSpy).toHaveBeenCalled();

        addSpy.calls.reset();
        removeSpy.calls.reset();

        component.enableLookup();
        fixture.detectChanges();

        expect(addSpy).toHaveBeenCalled();
        expect(removeSpy).toHaveBeenCalled();
      });
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
            keyboardEventInit: { key: 'ArrowRight' }
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
            expect(document.activeElement).toEqual(tokenElements.item(tokenElements.length - 1));

            inputElement.focus();
            tick();
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

        it('should remove tokens when backpsace or delete is pressed', fakeAsync(function () {
          function validate(key: string, expectedCount: number): void {
            const tokensHostElement = document.querySelector('sky-tokens');
            SkyAppTestUtility.fireDomEvent(tokensHostElement, 'keyup', {
              keyboardEventInit: { key }
            });
            tick();
            fixture.detectChanges();
            tick();

            tokenHostElements = document.querySelectorAll('sky-token');
            expect(tokenHostElements.length).toEqual(expectedCount);
            expect(tokenHostElements.item(0).contains(document.activeElement))
              .toEqual(true);
          }

          component.friends = [
            { name: 'John' },
            { name: 'Jane' },
            { name: 'Jim' },
            { name: 'Doe' }
          ];

          fixture.detectChanges();

          let tokenHostElements = document.querySelectorAll('sky-token');
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
              keyboardEventInit: { key }
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

          const event = Object.assign(
            document.createEvent('CustomEvent'),
            {
              key: 'Enter'
            }
          );

          spyOn(event, 'preventDefault');

          event.initEvent('keydown', true, true);
          inputElement.dispatchEvent(event);

          tick();
          fixture.detectChanges();
          tick();

          expect(event.preventDefault).toHaveBeenCalled();
        }));

        it('should unfocus the component if it loses focus', fakeAsync(function () {
          fixture.detectChanges();

          const inputElement = getInputElement(lookupComponent);
          SkyAppTestUtility.fireDomEvent(inputElement, 'focusin');
          tick();
          fixture.detectChanges();
          tick();

          expect(lookupComponent.isInputFocused).toEqual(true);

          SkyAppTestUtility.fireDomEvent(document, 'focusin');
          tick();
          fixture.detectChanges();
          tick();

          expect(lookupComponent.isInputFocused).toEqual(false);
        }));
      });

      describe('single-select', () => {
        beforeEach(() => {
          component.setSingleSelect();
        });

        it('should prevent default if Enter is pressed on the input element', fakeAsync(function () {
          fixture.detectChanges();

          const inputElement = getInputElement(lookupComponent);

          const event = Object.assign(
            document.createEvent('CustomEvent'),
            {
              key: 'Enter'
            }
          );

          spyOn(event, 'preventDefault');

          event.initEvent('keydown', true, true);
          inputElement.dispatchEvent(event);

          tick();
          fixture.detectChanges();
          tick();

          expect(event.preventDefault).toHaveBeenCalled();
        }));

        it('should unfocus the component if it loses focus', fakeAsync(function () {
          fixture.detectChanges();

          const inputElement = getInputElement(lookupComponent);
          SkyAppTestUtility.fireDomEvent(inputElement, 'focusin');
          tick();
          fixture.detectChanges();
          tick();

          expect(lookupComponent.isInputFocused).toEqual(true);

          SkyAppTestUtility.fireDomEvent(document, 'focusin');
          tick();
          fixture.detectChanges();
          tick();

          expect(lookupComponent.isInputFocused).toEqual(false);
        }));
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

        const tokenElements = getTokenElements();
        const input = getInputElement(lookupComponent);

        triggerClick(tokenElements.item(0), fixture, true);

        expect(document.activeElement).not.toEqual(input);
      }));
    });

    describe('a11y', function () {
      const axeConfig = {
        rules: {
          'region': {
            enabled: false
          }
        }
      };

      it('should be accessible', async(() => {
        fixture.componentInstance.ariaLabelledBy = 'my-lookup-label';

        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expectAsync(document.body).toBeAccessible(axeConfig).then(() => {
            fixture.detectChanges();

            const inputElement = getInputElement(fixture.componentInstance.lookupComponent);
            inputElement.value = 'r';
            inputElement.focus();
            SkyAppTestUtility.fireDomEvent(inputElement, 'keyup', {
              keyboardEventInit: { key: '' }
            });

            fixture.detectChanges();
            fixture.whenStable().then(() => {
              expectAsync(document.body).toBeAccessible(axeConfig);
            });
          });
        });
      }));
    });
  });

  describe('template form', () => {

    let fixture: ComponentFixture<SkyLookupTemplateTestComponent>;
    let component: SkyLookupTemplateTestComponent;
    let lookupComponent: SkyLookupComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(SkyLookupTemplateTestComponent);
      component = fixture.componentInstance;
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
        expect(typeof lookupComponent.searchTextMinimumCharacters).not.toBeUndefined();
        expect(typeof lookupComponent.searchFilters).not.toBeUndefined();
        expect(typeof lookupComponent.searchResultsLimit).not.toBeUndefined();
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
            { name: 'Fred' },
            { name: 'Isaac' },
            { name: 'John' },
            { name: 'Joyce' },
            { name: 'Lindsey' }
          ];
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(lookupComponent.tokens.length).toBe(5);
          expect(lookupComponent.tokens[0].value).toEqual({ name: 'Fred' });
          expect(lookupComponent.value).toEqual([
            { name: 'Fred' },
            { name: 'Isaac' },
            { name: 'John' },
            { name: 'Joyce' },
            { name: 'Lindsey' }
          ]);

          performSearch('Oli', fixture);
          selectSearchResult(0, fixture);

          expect(lookupComponent.tokens.length).toBe(6);
          expect(lookupComponent.tokens[0].value).toEqual({ name: 'Fred' });
          expect(lookupComponent.value).toEqual([
            { name: 'Fred' },
            { name: 'Isaac' },
            { name: 'John' },
            { name: 'Joyce' },
            { name: 'Lindsey' },
            { name: 'Oliver' }
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
          tick();

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
          const showMoreSpy = spyOn(component.lookupComponent, 'showMoreButtonClicked').and.stub();

          component.selectedFriends = [
            { name: 'Fred' },
            { name: 'Isaac' }
          ];
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

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
          component.selectedFriends = [{ name: 'Rachel' }, { name: 'Isaac' }];
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          component.setSingleSelect();
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          expect(lookupComponent.value).toEqual([{ name: 'Rachel' }]);
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

          expect(lookupComponent.value).toEqual([{ name: 'Isaac' }]);
        }));

        it('should select a new value when a different value is selected', fakeAsync(function () {
          fixture.detectChanges();
          expect(lookupComponent.value).toEqual([]);

          performSearch('s', fixture);
          selectSearchResult(0, fixture);

          expect(lookupComponent.value).toEqual([{ name: 'Isaac' }]);
        }));

        it('should clear the value when the search text is clared', fakeAsync(function () {
          fixture.detectChanges();
          expect(lookupComponent.value).toEqual([]);

          performSearch('s', fixture);
          selectSearchResult(0, fixture);

          expect(lookupComponent.value).toEqual([{ name: 'Isaac' }]);

          performSearch('', fixture);

          expect(lookupComponent.value).toEqual([]);
        }));

        it('should NOT set a new value when no search options are returned', fakeAsync(function () {
          fixture.detectChanges();
          expect(lookupComponent.value).toEqual([]);

          performSearch('no results for this search', fixture);
          getInputElement(lookupComponent).blur();

          expect(lookupComponent.value).toEqual([]);
        }));
      });
    });

    describe('actions', () => {

      describe('add button', () => {

        it('should emit an event correctly when the add button is enabled and clicked',
          fakeAsync(() => {
            component.showAddButton = true;
            const addButtonSpy = spyOn(component, 'addButtonClicked').and.callThrough();
            fixture.detectChanges();

            // Type 'r' to activate the autocomplete dropdown, then click the first result.
            performSearch('r', fixture);

            const addButton = getAddButton();
            expect(addButton).not.toBeNull();
            expect(addButtonSpy).not.toHaveBeenCalled();

            addButton.click();
            fixture.detectChanges();

            expect(addButtonSpy).toHaveBeenCalled();
          })
        );

        it('should not show the add button unless the component input asks for it',
          fakeAsync(() => {
            component.showAddButton = false;
            const addButtonSpy = spyOn(component, 'addButtonClicked').and.callThrough();
            fixture.detectChanges();

            // Type 'r' to activate the autocomplete dropdown, then click the first result.
            performSearch('r', fixture);

            const addButton = getAddButton();
            expect(addButton).toBeNull();
            expect(addButtonSpy).not.toHaveBeenCalled();
          })
        );

      });

      describe('show more button', () => {

        let modalService: SkyModalService;

        beforeEach(fakeAsync(() => {
          modalService = TestBed.inject(SkyModalService);

          fixture.detectChanges();
          tick();
        }));

        // This is necessary as due to modals being launched outside of the test bed they will not
        // automatically be disposed between tests.
        afterEach(fakeAsync(() => {
          // NOTE: This is important as it ensures that the modal host component is fully disposed of
          // between tests. This is important as the modal host might need a different set of component
          // injectors than the previous test.
          modalService.dispose();
          fixture.detectChanges();
        }));

        it('should open the modal when the show more button is clicked',
          fakeAsync(() => {
            component.enableShowMore = true;
            fixture.detectChanges();

            spyOn(modalService, 'open').and.callThrough();

            performSearch('r', fixture);
            clickShowMore(fixture);
            expect(modalService.open).toHaveBeenCalled();

            closeModal(fixture);
          })
        );

        describe('multi-select', () => {

          it('should populate the correct selected item and save that when no changes are made',
            fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(0, fixture);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([{ name: 'Isaac' }, { name: 'Lindsey' }]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([{ name: 'Isaac' }, { name: 'Lindsey' }]);

              closeModal(fixture);
            })
          );

          it('should select the correct items when multiple are selected from the show all modal',
            fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([{ name: 'Lindsey' }]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              selectShowMoreItemMultiple(0, fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([{ name: 'Isaac' }, { name: 'Lindsey' }]);

              closeModal(fixture);
            })
          );

          it('should not make any changes when the show all modal is cancelled',
            fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([{ name: 'Lindsey' }]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              selectShowMoreItemMultiple(0, fixture);

              closeModal(fixture);

              expect(lookupComponent.value).toEqual([{ name: 'Lindsey' }]);
            })
          );

          it('should select the correct items when items are deselected from the show all modal',
            fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([{ name: 'Lindsey' }]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              selectShowMoreItemMultiple(0, fixture);
              selectShowMoreItemMultiple(1, fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([{ name: 'Isaac' }]);

              closeModal(fixture);
            })
          );

          it('should select the correct items after existing search text is cleared',
            fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([{ name: 'Lindsey' }]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              clearShowMoreSearch(fixture);

              selectShowMoreItemMultiple(0, fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([
                {
                  name: 'Andy',
                  description: 'Mr. Andy',
                  birthDate: '1/1/1995'
                },
                { name: 'Lindsey' }
              ]);

              closeModal(fixture);
            })
          );

          it('should handle "Clear all" correct in the show more modal',
            fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('Pa', fixture);
              selectSearchResult(0, fixture);

              expect(lookupComponent.value).toEqual([{
                name: 'Patty',
                description: 'Ms. Patty',
                birthDate: '1/1/1996'
              }]);

              performSearch('Pa', fixture);
              clickShowMore(fixture);

              clickShowMoreClearAll(fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([]);

              closeModal(fixture);
            })
          );

          it('should handle "Select all" correct in the show more modal',
            fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('Pa', fixture);
              selectSearchResult(0, fixture);

              expect(lookupComponent.value).toEqual([{
                name: 'Patty',
                description: 'Ms. Patty',
                birthDate: '1/1/1996'
              }]);

              performSearch('Pa', fixture);
              clickShowMore(fixture);

              clickShowMoreSelectAll(fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([
                {
                  name: 'Patty',
                  description: 'Ms. Patty',
                  birthDate: '1/1/1996'
                },
                {
                  name: 'Paul',
                  description: 'Mr. Paul',
                  birthDate: '11/1997'
                }
              ]);

              closeModal(fixture);
            })
          );

          it('should handle "Only show selected correctly in the show more modal',
            fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([{ name: 'Lindsey' }]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              selectShowOnlySelected(fixture);

              selectShowMoreItemMultiple(0, fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([]);

              closeModal(fixture);
            })
          );

          it('the default modal title should be correct',
            fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              expect(getShowMoreModalTitle()).toBe('Select options');

              closeModal(fixture);
            })
          );

          it('should respect a custom modal title',
            fakeAsync(() => {
              component.enableShowMore = true;
              component.setShowMoreNativePickerConfig({
                title: 'Custom title'
              });
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              expect(getShowMoreModalTitle()).toBe('Custom title');

              closeModal(fixture);
            })
          );

          it('should collapse tokens if more than 5 items are selected', fakeAsync(() => {
            component.enableShowMore = true;
            component.selectedFriends = [
              { name: 'Fred' },
              { name: 'Isaac' },
              { name: 'John' },
              { name: 'Joyce' },
              { name: 'Lindsey' }
            ];
            fixture.detectChanges();
            tick();
            fixture.detectChanges();

            expect(lookupComponent.tokens.length).toBe(5);
            expect(lookupComponent.tokens[0].value).toEqual({ name: 'Fred' });
            expect(lookupComponent.value).toEqual([
              { name: 'Fred' },
              { name: 'Isaac' },
              { name: 'John' },
              { name: 'Joyce' },
              { name: 'Lindsey' }
            ]);

            performSearch('Oli', fixture);
            selectSearchResult(0, fixture);

            expect(lookupComponent.tokens.length).toBe(1);
            expect(lookupComponent.tokens[0].value).toEqual({ name: '6 items selected' });
            expect(lookupComponent.value).toEqual([
              { name: 'Fred' },
              { name: 'Isaac' },
              { name: 'John' },
              { name: 'Joyce' },
              { name: 'Lindsey' },
              { name: 'Oliver' }
            ]);
          }));

          it('should open the show more modal on token click', fakeAsync(() => {
            const showMoreSpy = spyOn(component.lookupComponent, 'showMoreButtonClicked').and.stub();

            component.enableShowMore = true;
            component.selectedFriends = [
              { name: 'Fred' },
              { name: 'Isaac' }
            ];
            fixture.detectChanges();
            tick();
            fixture.detectChanges();

            clickToken(0, fixture);

            expect(showMoreSpy).toHaveBeenCalled();
          }));

          it('should open the show more modal on collapsed token click', fakeAsync(() => {
            const showMoreSpy = spyOn(component.lookupComponent, 'showMoreButtonClicked').and.stub();

            component.enableShowMore = true;
            component.selectedFriends = [
              { name: 'Fred' },
              { name: 'Isaac' },
              { name: 'John' },
              { name: 'Joyce' },
              { name: 'Lindsey' },
              { name: 'Oliver' }
            ];
            fixture.detectChanges();
            tick();
            fixture.detectChanges();

            clickToken(0, fixture);

            expect(showMoreSpy).toHaveBeenCalled();
          }));

        });

        describe('single-select', () => {

          it('should populate the correct selected item and save that when no changes are made',
            fakeAsync(() => {
              component.selectMode = SkyLookupSelectMode.single;
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(0, fixture);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([{ name: 'Lindsey' }]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([{ name: 'Lindsey' }]);

              closeModal(fixture);
            })
          );

          it('should select the correct item when changed from the show all modal',
            fakeAsync(() => {
              component.selectMode = SkyLookupSelectMode.single;
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([{ name: 'Lindsey' }]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              selectShowMoreItemSingle(0, fixture);

              saveShowMoreModal(fixture);

              expect(lookupComponent.value).toEqual([{ name: 'Isaac' }]);

              closeModal(fixture);
            })
          );

          it('should not make any changes when the show all modal is cancelled',
            fakeAsync(() => {
              component.selectMode = SkyLookupSelectMode.single;
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              selectSearchResult(1, fixture);

              expect(lookupComponent.value).toEqual([{ name: 'Lindsey' }]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              selectShowMoreItemSingle(0, fixture);

              closeModal(fixture);

              expect(lookupComponent.value).toEqual([{ name: 'Lindsey' }]);

              closeModal(fixture);
            })
          );

          it('the default modal title should be correct',
            fakeAsync(() => {
              component.selectMode = SkyLookupSelectMode.single;
              component.enableShowMore = true;
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              expect(getShowMoreModalTitle()).toBe('Select an option');

              closeModal(fixture);
            })
          );

          it('should respect a custom modal title',
            fakeAsync(() => {
              component.selectMode = SkyLookupSelectMode.single;
              component.enableShowMore = true;
              component.setShowMoreNativePickerConfig({
                title: 'Custom title'
              });
              fixture.detectChanges();
              expect(lookupComponent.value).toEqual([]);

              performSearch('s', fixture);
              clickShowMore(fixture);

              expect(getShowMoreModalTitle()).toBe('Custom title');

              closeModal(fixture);
            })
          );

          it('should show only searched items when search is enabled',
            fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();

              performSearch('Pa', fixture);
              clickShowMore(fixture);

              expect(getRepeaterItemCount()).toBe(2);

              closeModal(fixture);
            })
          );

          it('should 10 items by default',
            fakeAsync(() => {
              component.enableShowMore = true;
              fixture.detectChanges();

              triggerInputFocus(fixture);
              fixture.detectChanges();
              tick();
              clickShowMore(fixture);

              expect(getRepeaterItemCount()).toBe(10);

              closeModal(fixture);
            })
          );

        });

        it('should trickle down the add button click event when triggered from the show all modal',
          fakeAsync(() => {
            component.showAddButton = true;
            component.enableShowMore = true;
            const addButtonSpy = spyOn(component, 'addButtonClicked').and.callThrough();
            fixture.detectChanges();

            performSearch('r', fixture);
            clickShowMore(fixture);

            clickModalAddButton(fixture);

            expect(addButtonSpy).toHaveBeenCalled();

            closeModal(fixture);
          })
        );

        it('should not show the show more button unless the component input asks for it',
          fakeAsync(() => {
            component.enableShowMore = false;
            fixture.detectChanges();

            // Type 'r' to activate the autocomplete dropdown, then click the first result.
            performSearch('r', fixture);

            const showMoreButton = getShowMoreButton();
            expect(showMoreButton).toBeNull();
          })
        );

        it('should show the "name" property in the modal items by default',
          fakeAsync(() => {
            component.enableShowMore = true;
            fixture.detectChanges();

            performSearch('p', fixture);
            clickShowMore(fixture);

            expect(getShowMoreRepeaterItemContent(0)).toBe('Patty');

            closeModal(fixture);
          })
        );

        it('should respect a descriptor property being sent into the show more modal',
          fakeAsync(() => {
            component.enableShowMore = true;
            component.descriptorProperty = 'birthDate';
            fixture.detectChanges();

            performSearch('p', fixture);
            clickShowMore(fixture);

            expect(getShowMoreRepeaterItemContent(0)).toBe('1/1/1996');

            closeModal(fixture);
          })
        );

        it('should send the search result template into the show more modal',
          fakeAsync(() => {
            component.enableShowMore = true;
            component.descriptorProperty = 'birthDate';
            component.enableSearchResultTemplate();
            fixture.detectChanges();

            performSearch('p', fixture);
            clickShowMore(fixture);

            expect(getShowMoreRepeaterItemContent(0)).toBe('Ms. Patty');

            closeModal(fixture);
          })
        );

        it('should respect a custom modal template',
          fakeAsync(() => {
            component.enableShowMore = true;
            component.descriptorProperty = 'birthDate';
            component.enableSearchResultTemplate();
            component.setShowMoreNativePickerConfig({ itemTemplate: component.showMoreTemplate });
            fixture.detectChanges();

            performSearch('p', fixture);
            clickShowMore(fixture);

            expect(getShowMoreRepeaterItemContent(0)).toBe('Patty - 1/1/1996');

            closeModal(fixture);
          })
        );

        it('should open a custom picker when enabled with no value',
          fakeAsync(() => {
            component.enableShowMore = true;
            component.enableCustomPicker();
            fixture.detectChanges();

            const customPickerSpy = spyOn(component.showMoreConfig.customPicker, 'open').and.callThrough();

            performSearch('p', fixture);
            clickShowMore(fixture);

            expect(customPickerSpy).toHaveBeenCalledWith({
              items: component.data,
              initialSearch: 'p',
              initialValue: []
            });
          })
        );

        it('should open a custom picker when enabled with a value',
          fakeAsync(() => {
            component.enableShowMore = true;
            component.enableCustomPicker();
            fixture.detectChanges();

            const customPickerSpy = spyOn(component.showMoreConfig.customPicker, 'open').and.callThrough();

            performSearch('p', fixture);
            selectSearchResult(0, fixture);
            performSearch('p', fixture);
            clickShowMore(fixture);

            expect(customPickerSpy).toHaveBeenCalledWith({
              items: component.data,
              initialSearch: 'p',
              initialValue: [component.data.find(item => item.name === 'Patty')]
            });
          })
        );
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

        let model = fixture.debugElement.query(By.css('sky-autocomplete')).injector.get(NgModel);
        expect(model.invalid).toEqual(false);

        dismissSelectedItem(0, fixture);
        fixture.detectChanges();

        model = fixture.debugElement.query(By.css('sky-autocomplete')).injector.get(NgModel);
        expect(model.invalid).toEqual(true);
      }));
    });

    describe('events', function () {
      it('should not add event listeners if disabled', function () {
        component.disableLookup();
        const spy = spyOn(lookupComponent as any, 'addEventListeners').and.callThrough();
        fixture.detectChanges();
        expect(spy).not.toHaveBeenCalled();
      });

      it('should allow setting `disabled` after initialization', fakeAsync(() => {
        const addSpy = spyOn(lookupComponent as any, 'addEventListeners').and.callThrough();
        const removeSpy = spyOn(lookupComponent as any, 'removeEventListeners').and.callThrough();

        component.enableLookup();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(addSpy).toHaveBeenCalled();
        expect(removeSpy).not.toHaveBeenCalled();

        addSpy.calls.reset();
        removeSpy.calls.reset();

        component.disableLookup();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(addSpy).not.toHaveBeenCalled();
        expect(removeSpy).toHaveBeenCalled();

        addSpy.calls.reset();
        removeSpy.calls.reset();

        component.enableLookup();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(addSpy).toHaveBeenCalled();
        expect(removeSpy).toHaveBeenCalled();
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
            keyboardEventInit: { key: 'ArrowRight' }
          });
          tick();
          fixture.detectChanges();
          tick();

          const inputElement = getInputElement(lookupComponent);
          expect(document.activeElement).toEqual(inputElement);
        }));

        it('should focus the last token if arrowleft or backspace pressed', fakeAsync(function () {
          component.selectedFriends = [{ name: 'Rachel' }];
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          const tokenElements = getTokenElements();
          const inputElement = getInputElement(lookupComponent);

          triggerKeyPress(inputElement, 'ArrowLeft', fixture);
          expect(document.activeElement).toEqual(tokenElements.item(tokenElements.length - 1));

          inputElement.focus();
          tick();
          fixture.detectChanges();

          triggerKeyPress(inputElement, 'Backspace', fixture);
          expect(document.activeElement).toEqual(tokenElements.item(tokenElements.length - 1));

          inputElement.focus();
          tick();
          fixture.detectChanges();

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
            keyboardEventInit: { key: 'Escape' }
          });
          tick();
          fixture.detectChanges();
          tick();

          expect(inputElement.value).toEqual('');
        }));

        it('should remove tokens when backpsace or delete is pressed', fakeAsync(function () {
          component.selectedFriends = [
            { name: 'John' },
            { name: 'Jane' },
            { name: 'Doe' }
          ];
          fixture.detectChanges();
          tick();
          fixture.detectChanges();

          let tokenHostElements = document.querySelectorAll('sky-token');
          expect(tokenHostElements.length).toEqual(3);

          const tokensHostElement = document.querySelector('sky-tokens');
          SkyAppTestUtility.fireDomEvent(tokensHostElement, 'keyup', {
            keyboardEventInit: { key: 'Backspace' }
          });
          tick();
          fixture.detectChanges();
          tick();

          tokenHostElements = document.querySelectorAll('sky-token');
          expect(tokenHostElements.length).toEqual(2);
          expect(tokenHostElements.item(0).contains(document.activeElement))
            .toEqual(true);

          SkyAppTestUtility.fireDomEvent(tokensHostElement, 'keyup', {
            keyboardEventInit: { key: 'Delete' }
          });
          tick();
          fixture.detectChanges();
          tick();

          tokenHostElements = document.querySelectorAll('sky-token');
          expect(tokenHostElements.length).toEqual(1);
          expect(tokenHostElements.item(0).contains(document.activeElement))
            .toEqual(true);
        }));

        it('should prevent default if Enter is pressed on the input element', fakeAsync(function () {
          fixture.detectChanges();

          const inputElement = getInputElement(lookupComponent);

          const event = Object.assign(
            document.createEvent('CustomEvent'),
            {
              key: 'Enter'
            }
          );

          spyOn(event, 'preventDefault');

          event.initEvent('keydown', true, true);
          inputElement.dispatchEvent(event);

          tick();
          fixture.detectChanges();
          tick();

          expect(event.preventDefault).toHaveBeenCalled();
        }));

        it('should unfocus the component if it loses focus', fakeAsync(function () {
          fixture.detectChanges();

          const inputElement = getInputElement(lookupComponent);
          SkyAppTestUtility.fireDomEvent(inputElement, 'focusin');
          tick();
          fixture.detectChanges();
          tick();

          expect(lookupComponent.isInputFocused).toEqual(true);

          SkyAppTestUtility.fireDomEvent(document, 'focusin');
          tick();
          fixture.detectChanges();
          tick();

          expect(lookupComponent.isInputFocused).toEqual(false);
        }));
      });

      describe('single-select', () => {
        beforeEach(() => {
          component.setSingleSelect();
        });

        it('should prevent default if Enter is pressed on the input element', fakeAsync(function () {
          fixture.detectChanges();

          const inputElement = getInputElement(lookupComponent);

          const event = Object.assign(
            document.createEvent('CustomEvent'),
            {
              key: 'Enter'
            }
          );

          spyOn(event, 'preventDefault');

          event.initEvent('keydown', true, true);
          inputElement.dispatchEvent(event);

          tick();
          fixture.detectChanges();
          tick();

          expect(event.preventDefault).toHaveBeenCalled();
        }));

        it('should unfocus the component if it loses focus', fakeAsync(function () {
          fixture.detectChanges();

          const inputElement = getInputElement(lookupComponent);
          SkyAppTestUtility.fireDomEvent(inputElement, 'focusin');
          tick();
          fixture.detectChanges();
          tick();

          expect(lookupComponent.isInputFocused).toEqual(true);

          SkyAppTestUtility.fireDomEvent(document, 'focusin');
          tick();
          fixture.detectChanges();
          tick();

          expect(lookupComponent.isInputFocused).toEqual(false);
        }));
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

        const tokenElements = getTokenElements();
        const input = getInputElement(lookupComponent);

        triggerClick(tokenElements.item(0), fixture, true);

        expect(document.activeElement).not.toEqual(input);
      }));
    });
  });

  describe('inside input box', () => {
    let fixture: ComponentFixture<SkyLookupInputBoxTestComponent>;
    let nativeElement: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(SkyLookupInputBoxTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
    });

    it('should render in the expected input box containers', fakeAsync(() => {
      fixture.detectChanges();

      const inputBoxEl = nativeElement.querySelector('sky-input-box');

      const inputGroupEl = inputBoxEl.querySelector('.sky-input-box-input-group-inner');
      const containerEl = inputGroupEl.children.item(0);

      expect(containerEl).toHaveCssClass('sky-lookup');
    }));

  });
});
