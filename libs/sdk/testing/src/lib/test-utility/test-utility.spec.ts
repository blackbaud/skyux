//#region imports
import { Component, DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { SkyAppTestUtility } from './test-utility';

//#endregion

//#region test components

@Component({
  selector: 'test-parent-cmp',
  template: `
    <test-cmp [attr.data-sky-id]="'my-id'"> My component. </test-cmp>
  `,
})
class TestParentComponent {}

@Component({
  selector: 'test-cmp',
  template: `<ng-content></ng-content>`,
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

  it('should use keyboard event values', fakeAsync(() => {
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

    SkyAppTestUtility.fireDomEvent(elem, 'keydown', {
      keyboardEventInit: {
        key: 'tab',
        altKey: true,
        ctrlKey: true,
        metaKey: true,
        shiftKey: true,
      },
    });

    tick();
    expect(listenerCalled).toBeTruthy();
  }));

  it('should use custom event values', fakeAsync(() => {
    const elem = document.createElement('div');
    document.body.appendChild(elem);

    let listenerCalled = false;
    elem.addEventListener('focusin', (event: any) => {
      listenerCalled = true;
      expect(event.relatedTarget).toBe(elem);
    });

    SkyAppTestUtility.fireDomEvent(elem, 'focusin', {
      customEventInit: {
        relatedTarget: elem,
      },
    });

    tick();
    expect(listenerCalled).toBeTruthy();
  }));

  it('should determine if an element is visible', () => {
    expect(SkyAppTestUtility.isVisible(textEl)).toBe(true);

    textEl.style.display = 'none';

    expect(SkyAppTestUtility.isVisible(textEl)).toBe(false);

    expect(SkyAppTestUtility.isVisible(undefined)).toBeUndefined();
  });

  it("should retrieve an element's inner text", () => {
    expect(SkyAppTestUtility.getText(textEl)).toBe('');

    textEl.innerText = '    test   ';

    expect(SkyAppTestUtility.getText(textEl)).toBe('test');

    expect(SkyAppTestUtility.getText(undefined)).toBeUndefined();
  });

  it("should retrieve an element's background URL", () => {
    let imageUrl: string | undefined;

    imageUrl = SkyAppTestUtility.getBackgroundImageUrl(bgEl);

    expect(imageUrl).toBeUndefined();

    bgEl.style.backgroundImage = 'url("https://example.com/bg/")';

    imageUrl = SkyAppTestUtility.getBackgroundImageUrl(bgEl);

    expect(imageUrl).toBe('https://example.com/bg/');

    imageUrl = SkyAppTestUtility.getBackgroundImageUrl(
      new DebugElement(bgEl, document.body, undefined)
    );

    expect(imageUrl).toBe('https://example.com/bg/');

    imageUrl = SkyAppTestUtility.getBackgroundImageUrl(undefined);

    expect(imageUrl).toBeUndefined();
  });

  it('should set the value of an input', () => {
    expect(inputEl.value).toEqual('');
    SkyAppTestUtility.setInputValue(inputEl, 'foobar');
    expect(inputEl.value).toEqual('foobar');
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

      const debugElement = SkyAppTestUtility.getDebugElementByTestId(
        fixture,
        'my-id',
        'test-cmp'
      );

      expect(debugElement).toBeDefined();
    });

    it('should throw if ID not found', () => {
      const testId = 'invalid-id';

      fixture.detectChanges();

      expect(() => {
        SkyAppTestUtility.getDebugElementByTestId(fixture, testId, 'test-cmp');
      }).toThrowError(
        `No element was found with a \`data-sky-id\` value of "${testId}".`
      );
    });

    it('should throw if selector invalid', () => {
      const testId = 'my-id';
      const selector = 'invalid-selector';

      fixture.detectChanges();

      expect(() => {
        SkyAppTestUtility.getDebugElementByTestId(fixture, testId, selector);
      }).toThrowError(
        `The element with the test ID "${testId}" is not a component of type ${selector}."`
      );
    });
  });
});
