import {
  ComponentFixture
} from '@angular/core/testing';

import {
  DebugElement
} from '@angular/core';

import {
  By
} from '@angular/platform-browser';

import {
  SkyAppTestUtilityDomEventOptions
} from './test-utility-dom-event-options';

function getNativeEl(el: any): any {
  if (!el) {
    return undefined;
  }

  if (el.nativeElement) {
    return el.nativeElement;
  }

  return el;
}

export class SkyAppTestUtility {
  public static fireDomEvent(
    element: EventTarget,
    eventName: string,
    options?: SkyAppTestUtilityDomEventOptions
  ): void {
    const defaults = {
      bubbles: true,
      cancelable: true,
      keyboardEventInit: {}
    };

    const settings = Object.assign({}, defaults, options);

    // Apply keyboard event options.
    const event = Object.assign(
      document.createEvent('CustomEvent'),
      settings.keyboardEventInit,
      settings.customEventInit
    );

    event.initEvent(eventName, settings.bubbles, settings.cancelable);
    element.dispatchEvent(event);
  }

  /**
   * Returns the inner text content of an element.
   */
  public static getText(element: any): string {
    const nativeEl = getNativeEl(element);

    if (nativeEl) {
      return getNativeEl(element).innerText.trim();
    }

    return undefined;
  }

  /**
   * Returns true if the element exists on the page.
   */
  public static isVisible(element: any): boolean {
    const nativeEl = getNativeEl(element);

    if (nativeEl) {
      return getComputedStyle(getNativeEl(element)).display !== 'none';
    }

    return undefined;
  }

  /**
   * Sets the value of an input element and triggers its 'input' and 'change' events.
   */
  public static setInputValue(element: any, value: string): void {
    let inputEvent = document.createEvent('Event');
    inputEvent.initEvent('input', false, false);

    let changeEvent = document.createEvent('Event');
    changeEvent.initEvent('change', false, false);

    element.value = value;

    element.dispatchEvent(inputEvent);
  }

  /**
   * Returns the URL of an element's background image, if it exists.
   */
  public static getBackgroundImageUrl(el: any): string {
    const nativeEl = getNativeEl(el);

    if (nativeEl) {
      const backgroundImageUrl = getComputedStyle(getNativeEl(el)).backgroundImage;

      /* istanbul ignore else */
      // Browser will likely not return an empty value for the computed style,
      // but leave the if statement here anyway as a sanity check.
      if (backgroundImageUrl) {
        const matches = /url\(('|")([^'"]+)('|")\)/gi.exec(backgroundImageUrl);

        if (matches && matches.length > 0) {
          return matches[2];
        }
      }
    }

    return undefined;
  }

  /**
   * Returns a DebugElement representing a SKY UX component.
   * @internal
   * @param fixture The ComponentFixture where the SKY UX component resides.
   * @param skyTestId The value of the `data-sky-id` property specified on the SKY UX component.
   * @param componentSelector The selector name for the SKY UX component (e.g. 'sky-alert').
   */
  public static getDebugElementByTestId(
    fixture: ComponentFixture<any>,
    skyTestId: string,
    componentSelector: string
  ): DebugElement {

    const skyEl = fixture.debugElement.query(
      By.css(`[data-sky-id="${skyTestId}"]`)
    );

    if (!skyEl) {
      throw new Error(`No element was found with a \`data-sky-id\` value of "${skyTestId}".`);
    }

    if (skyEl.name !== componentSelector) {
      throw new Error(
        `The element with the test ID "${skyTestId}" is not a component of type ${componentSelector}."`
      );
    }

    return skyEl;
  }

}
