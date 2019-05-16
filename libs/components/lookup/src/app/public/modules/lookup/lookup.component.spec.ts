import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  expect,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import { SkyLookupComponent } from './lookup.component';
import { SkyLookupFixturesModule } from './fixtures/lookup-fixtures.module';
import { SkyLookupTestComponent } from './fixtures/lookup.component.fixture';

describe('Lookup component', function () {
  let fixture: ComponentFixture<SkyLookupTestComponent>;
  let component: SkyLookupTestComponent;
  let lookupComponent: SkyLookupComponent;

  function getInputElement(): HTMLInputElement {
    return lookupComponent['lookupInput'].nativeElement as HTMLInputElement;
  }

  function getTokenElements(): NodeListOf<Element> {
    return document.querySelectorAll('.sky-token');
  }

  function performSearch(searchText: string) {
    const inputElement = getInputElement();
    inputElement.value = searchText;
    inputElement.focus();
    SkyAppTestUtility.fireDomEvent(inputElement, 'keyup', {
      keyboardEventInit: { key: '' }
    });
    tick();
    fixture.detectChanges();
    tick();
  }

  function selectSearchResult(index: number) {
    const dropdownButtons = document.querySelectorAll('.sky-dropdown-menu button');
    (dropdownButtons.item(index) as HTMLElement).click();
    tick();
    fixture.detectChanges();
    tick();
  }

  function dismissSelectedItem(index: number) {
    const tokenElements = document.querySelectorAll('.sky-token');
    (tokenElements.item(index).querySelector('.sky-token-btn-close') as HTMLElement).click();
    tick();
    fixture.detectChanges();
    tick();
  }

  function triggerClick(element: Element, focusable = false) {
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

  function triggerKeyPress(element: Element, key: string) {
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

    fixture = TestBed.createComponent(SkyLookupTestComponent);
    component = fixture.componentInstance;
    lookupComponent = component.lookupComponent;
  });

  afterEach(function () {
    fixture.destroy();
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

      performSearch('s');
      selectSearchResult(0);

      const selectedItems = lookupComponent.value;
      expect(selectedItems.length).toEqual(1);
      expect(selectedItems[0].name).toEqual('Isaac');
    }));

    it('should NOT add new tokens if value is empty', fakeAsync(function () {
      fixture.detectChanges();
      expect(lookupComponent.value).toEqual([]);

      performSearch('s');
      selectSearchResult(0);

      performSearch('');
      getInputElement().blur();

      const selectedItems = lookupComponent.value;
      expect(selectedItems.length).toEqual(1);
      expect(selectedItems[0].name).toEqual('Isaac');
    }));

    it('should change the value of the lookup if tokens change', fakeAsync(function () {
      fixture.detectChanges();
      expect(lookupComponent.value).toEqual([]);

      performSearch('s');
      selectSearchResult(0);

      performSearch('s');
      selectSearchResult(1);

      expect(lookupComponent.value.length).toEqual(2);

      dismissSelectedItem(0);

      expect(lookupComponent.value.length).toEqual(1);
    }));

    it('should focus the input if all tokens are dismissed', fakeAsync(function () {
      component.friends = [{ name: 'Rachel' }];
      fixture.detectChanges();

      dismissSelectedItem(0);

      const inputElement = getInputElement();
      expect(lookupComponent.value.length).toEqual(0);
      expect(document.activeElement).toEqual(inputElement);
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

      const inputElement = getInputElement();
      expect(document.activeElement).toEqual(inputElement);
    }));

    it('should focus the last token if arrowleft or backspace pressed', fakeAsync(function () {
      component.friends = [{ name: 'Rachel' }];
      fixture.detectChanges();

      const tokenElements = getTokenElements();
      const inputElement = getInputElement();

      triggerKeyPress(inputElement, 'ArrowLeft');
      expect(document.activeElement).toEqual(tokenElements.item(tokenElements.length - 1));

      inputElement.focus();
      tick();
      fixture.detectChanges();

      triggerKeyPress(inputElement, 'Backspace');
      expect(document.activeElement).toEqual(tokenElements.item(tokenElements.length - 1));

      inputElement.focus();
      tick();
      fixture.detectChanges();

      triggerKeyPress(inputElement, 'Space');
      expect(document.activeElement).toEqual(inputElement);
    }));

    it('should not focus the last token if search text is present', fakeAsync(function () {
      component.friends = [{ name: 'Rachel' }];
      fixture.detectChanges();

      const inputElement = getInputElement();

      performSearch('s');

      expect(inputElement.value).toEqual('s');

      triggerKeyPress(inputElement, 'ArrowLeft');
      expect(document.activeElement).toEqual(inputElement);
    }));

    it('should clear the search text if escape key is pressed', fakeAsync(function () {
      const inputElement = getInputElement();

      fixture.detectChanges();
      performSearch('s');

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

      const inputElement = getInputElement();
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
      const input = getInputElement();

      triggerClick(hostElement);

      expect(document.activeElement).toEqual(input);
    }));

    it('should not focus the input if a token is clicked', fakeAsync(function () {
      fixture.detectChanges();

      performSearch('s');
      selectSearchResult(0);

      const tokenElements = getTokenElements();
      const input = getInputElement();

      triggerClick(tokenElements.item(0), true);

      expect(document.activeElement).not.toEqual(input);
    }));
  });
});
