//#region imports
import 'zone.js';
import 'zone.js/testing';

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';

import { _SkyAppTestUtility } from './test-utility';

//#endregion

getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting(),
);

//#region test components

@Component({
  selector: 'test-parent-cmp',
  template: `
    <test-cmp [attr.data-sky-id]="'my-id'"> My component. </test-cmp>
  `,
  standalone: false,
})
class TestParentComponent {}

@Component({
  selector: 'test-cmp',
  template: `<ng-content />`,
  standalone: false,
})
class TestComponent {}

//#endregion

describe('Test utility', () => {
  let bgEl: HTMLDivElement;
  let textEl: HTMLSpanElement;
  let inputEl: HTMLInputElement;

  beforeEach(() => {
    document.body.innerHTML = '';

    bgEl = document.createElement('div');
    textEl = document.createElement('span');
    // jsdom doesn't compute `innerText` from layout, so seed it explicitly.
    textEl.innerText = '';
    inputEl = document.createElement('input');
    inputEl.type = 'text';

    document.body.appendChild(bgEl);
    document.body.appendChild(textEl);
    document.body.appendChild(inputEl);
  });

  afterEach(() => {
    document.body.removeChild(bgEl);
    document.body.removeChild(textEl);
    document.body.removeChild(inputEl);
  });

  it('should use keyboard event values', () => {
    const elem = document.createElement('div');
    document.body.appendChild(elem);

    let listenerCalled = false;
    elem.addEventListener('keydown', (event: any) => {
      listenerCalled = true;
      expect(event.key).toBe('tab');
      expect(event.altKey).toBeTruthy();
      expect(event.ctrlKey).toBeTruthy();
      expect(event.metaKey).toBeTruthy();
      expect(event.shiftKey).toBeTruthy();
    });

    _SkyAppTestUtility.fireDomEvent(elem, 'keydown', {
      keyboardEventInit: {
        key: 'tab',
        altKey: true,
        ctrlKey: true,
        metaKey: true,
        shiftKey: true,
      },
    });

    expect(listenerCalled).toBeTruthy();
  });

  it('should use custom event values', () => {
    const elem = document.createElement('div');
    document.body.appendChild(elem);

    let listenerCalled = false;
    elem.addEventListener('focusin', (event: any) => {
      listenerCalled = true;
      expect(event.relatedTarget).toBe(elem);
    });

    _SkyAppTestUtility.fireDomEvent(elem, 'focusin', {
      customEventInit: {
        relatedTarget: elem,
      },
    });

    expect(listenerCalled).toBeTruthy();
  });

  it('should determine if an element is visible', () => {
    expect(_SkyAppTestUtility.isVisible(textEl)).toBe(true);

    textEl.style.display = 'none';

    expect(_SkyAppTestUtility.isVisible(textEl)).toBe(false);

    expect(_SkyAppTestUtility.isVisible(undefined)).toBeUndefined();
  });

  it("should retrieve an element's inner text", () => {
    expect(_SkyAppTestUtility.getText(textEl)).toBe('');

    textEl.innerText = '    test   ';

    expect(_SkyAppTestUtility.getText(textEl)).toBe('test');

    expect(_SkyAppTestUtility.getText(undefined)).toBeUndefined();
  });

  it("should retrieve an element's background URL", () => {
    let imageUrl: string | undefined;

    imageUrl = _SkyAppTestUtility.getBackgroundImageUrl(bgEl);

    expect(imageUrl).toBeUndefined();

    bgEl.style.backgroundImage = 'none';

    imageUrl = _SkyAppTestUtility.getBackgroundImageUrl(bgEl);

    expect(imageUrl).toBeUndefined();

    bgEl.style.backgroundImage = 'url("https://example.com/bg/")';

    imageUrl = _SkyAppTestUtility.getBackgroundImageUrl(bgEl);

    expect(imageUrl).toBe('https://example.com/bg/');

    imageUrl = _SkyAppTestUtility.getBackgroundImageUrl(new DebugElement(bgEl));

    expect(imageUrl).toBe('https://example.com/bg/');

    imageUrl = _SkyAppTestUtility.getBackgroundImageUrl(undefined);

    expect(imageUrl).toBeUndefined();
  });

  it('should set the value of an input', () => {
    expect(inputEl.value).toEqual('');
    _SkyAppTestUtility.setInputValue(inputEl, 'foobar');
    expect(inputEl.value).toEqual('foobar');
  });

  it('should throw and error if `fireDomEvent` is called with an null element', () => {
    expect(() =>
      _SkyAppTestUtility.fireDomEvent(null, 'mousedown'),
    ).toThrowError(
      'Event `mousedown` could not be fired because the element is not defined.',
    );
  });

  it('should throw and error if `fireDomEvent` is called with an undefined element', () => {
    expect(() =>
      _SkyAppTestUtility.fireDomEvent(undefined, 'mousedown'),
    ).toThrowError(
      'Event `mousedown` could not be fired because the element is not defined.',
    );
  });

  describe('getDebugElementByTestId', function () {
    let fixture: ComponentFixture<TestParentComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, TestParentComponent],
      });
      fixture = TestBed.createComponent(TestParentComponent);
    });

    afterEach(() => {
      fixture.destroy();
    });

    it('should get the debug element of a component', () => {
      fixture.detectChanges();

      const debugElement = _SkyAppTestUtility.getDebugElementByTestId(
        fixture,
        'my-id',
        'test-cmp',
      );

      expect(debugElement).toBeDefined();
    });

    it('should throw if ID not found', () => {
      const testId = 'invalid-id';

      fixture.detectChanges();

      expect(() => {
        _SkyAppTestUtility.getDebugElementByTestId(fixture, testId, 'test-cmp');
      }).toThrowError(
        `No element was found with a \`data-sky-id\` value of "${testId}".`,
      );
    });

    it('should throw if selector invalid', () => {
      const testId = 'my-id';
      const selector = 'invalid-selector';

      fixture.detectChanges();

      expect(() => {
        _SkyAppTestUtility.getDebugElementByTestId(fixture, testId, selector);
      }).toThrowError(
        `The element with the test ID "${testId}" is not a component of type ${selector}."`,
      );
    });
  });
});
