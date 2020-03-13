import {
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
  expect,
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

describe('Lookup component', function () {

  function getInputElement(lookupComponent: SkyLookupComponent): HTMLInputElement {
    return lookupComponent['lookupInput'].nativeElement as HTMLInputElement;
  }

  function getTokenElements(): NodeListOf<Element> {
    return document.querySelectorAll('.sky-token');
  }

  function performSearch(searchText: string, fixture: ComponentFixture<any>) {
    const inputElement = getInputElement(fixture.componentInstance.lookupComponent);
    inputElement.value = searchText;
    inputElement.focus();
    SkyAppTestUtility.fireDomEvent(inputElement, 'keyup', {
      keyboardEventInit: { key: '' }
    });
    tick();
    fixture.detectChanges();
    tick();
  }

  function selectSearchResult(index: number, fixture: ComponentFixture<any>) {
    const dropdownButtons = document.querySelectorAll('.sky-dropdown-menu button');
    (dropdownButtons.item(index) as HTMLElement).click();
    tick();
    fixture.detectChanges();
    tick();
  }

  function dismissSelectedItem(index: number, fixture: ComponentFixture<any>) {
    const tokenElements = document.querySelectorAll('.sky-token');
    (tokenElements.item(index).querySelector('.sky-token-btn-close') as HTMLElement).click();
    tick();
    fixture.detectChanges();
    tick();
  }

  function triggerClick(element: Element, fixture: ComponentFixture<any>, focusable = false) {
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

  function triggerKeyPress(element: Element, key: string, fixture: ComponentFixture<any>) {
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

      it('should allow preselected tokens', function () {
        const friends = [{ name: 'Rachel' }];
        component.friends = friends;
        expect(lookupComponent.value).toEqual([]);
        fixture.detectChanges();
        expect(lookupComponent.value).toEqual(friends);
      });

      it('should add new tokens', fakeAsync(function () {
        fixture.detectChanges();
        expect(lookupComponent.value).toEqual([]);

        performSearch('s', fixture);
        selectSearchResult(0, fixture);

        const selectedItems = lookupComponent.value;
        expect(selectedItems.length).toEqual(1);
        expect(selectedItems[0].name).toEqual('Isaac');
      }));

      it('should NOT add new tokens if value is empty', fakeAsync(function () {
        fixture.detectChanges();
        expect(lookupComponent.value).toEqual([]);

        performSearch('s', fixture);
        selectSearchResult(0, fixture);

        performSearch('', fixture);
        getInputElement(lookupComponent).blur();

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

      it('should focus the input if all tokens are dismissed', fakeAsync(function () {
        component.friends = [{ name: 'Rachel' }];
        fixture.detectChanges();

        dismissSelectedItem(0, fixture);

        const inputElement = getInputElement(lookupComponent);
        expect(lookupComponent.value.length).toEqual(0);
        expect(document.activeElement).toEqual(inputElement);
      }));

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
    });

    describe('validation', () => {
      it('should mark the form as invalid when it is required but is then emptied', fakeAsync(() => {
        component.friends = [{ name: 'Rachel' }];
        fixture.detectChanges();
        component.setRequired();
        fixture.detectChanges();
        expect(component.form.invalid).toEqual(false);
        dismissSelectedItem(0, fixture);
        fixture.detectChanges();
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
        component.friends = [{ name: 'Rachel' }];
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
        component.friends = [{ name: 'Rachel' }];
        fixture.detectChanges();

        const inputElement = getInputElement(lookupComponent);

        performSearch('s', fixture);

        expect(inputElement.value).toEqual('s');

        triggerKeyPress(inputElement, 'ArrowLeft', fixture);
        expect(document.activeElement).toEqual(inputElement);
      }));

      it('should clear the search text if escape key is pressed', fakeAsync(function () {
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
        component.friends = [
          { name: 'John' },
          { name: 'Jane' },
          { name: 'Doe' }
        ];
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

      it('should allow preselected tokens', fakeAsync(() => {
        fixture.detectChanges();
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

      it('should NOT add new tokens if value is empty', fakeAsync(function () {
        fixture.detectChanges();
        expect(lookupComponent.value).toEqual([]);

        performSearch('s', fixture);
        selectSearchResult(0, fixture);

        performSearch('', fixture);
        getInputElement(lookupComponent).blur();

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
    });

    describe('validation', () => {
      it('should mark the form as invalid when it is required but is then emptied', fakeAsync(() => {
        component.friends = [{ name: 'Rachel' }];
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
      it('should focus the input if arrowright key is pressed on the last token', fakeAsync(function () {
        component.friends = [{ name: 'Rachel' }];
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
        component.friends = [{ name: 'Rachel' }];
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
        component.friends = [{ name: 'Rachel' }];
        fixture.detectChanges();

        const inputElement = getInputElement(lookupComponent);

        performSearch('s', fixture);

        expect(inputElement.value).toEqual('s');

        triggerKeyPress(inputElement, 'ArrowLeft', fixture);
        expect(document.activeElement).toEqual(inputElement);
      }));

      it('should clear the search text if escape key is pressed', fakeAsync(function () {
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
        component.friends = [
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
});
