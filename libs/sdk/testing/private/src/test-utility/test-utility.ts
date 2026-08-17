import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { _SkyAppTestUtilityDomEventOptions } from './test-utility-dom-event-options';

function getNativeEl(el: any): any {
  if (!el) {
    return undefined;
  }

  if (el.nativeElement) {
    return el.nativeElement;
  }

  return el;
}

/**
 * A collection of low-level DOM and Angular test helpers.
 * @deprecated Use native JavaScript DOM APIs or Angular testing utilities
 * (e.g. `DebugElement`, `ComponentFixture`, component test harnesses)
 * instead. See each method for a specific replacement.
 */
export class _SkyAppTestUtility {
  /**
   * @deprecated Construct and dispatch a native DOM event instead (e.g.
   * `element.dispatchEvent(new KeyboardEvent('keydown', {...}))`).
   */
  public static fireDomEvent(
    element: EventTarget | null | undefined,
    eventName: string,
    options?: _SkyAppTestUtilityDomEventOptions,
  ): void {
    if (!element) {
      throw new Error(
        `Event \`${eventName}\` could not be fired because the element is not defined.`,
      );
    }

    const defaults = {
      bubbles: true,
      cancelable: true,
      keyboardEventInit: {},
    };

    const settings = Object.assign({}, defaults, options);

    // Apply keyboard event options.
    const event = Object.assign(
      document.createEvent('CustomEvent'),
      settings.keyboardEventInit,
      settings.customEventInit,
    );

    event.initEvent(eventName, settings.bubbles, settings.cancelable);
    element.dispatchEvent(event);
  }

  /**
   * Returns the inner text content of an element.
   * @deprecated Use the native `Element.textContent` or `HTMLElement.innerText`
   * property instead.
   */
  public static getText(element: any): string | undefined {
    const nativeEl = getNativeEl(element);

    if (nativeEl) {
      return nativeEl.innerText.trim();
    }

    return undefined;
  }

  /**
   * Returns true if the element exists on the page.
   * @deprecated Use the native `getComputedStyle()` function instead.
   */
  public static isVisible(element: any): boolean | undefined {
    const nativeEl = getNativeEl(element);

    if (nativeEl) {
      return getComputedStyle(nativeEl).display !== 'none';
    }

    return undefined;
  }

  /**
   * Sets the value of an input element and triggers its 'input' and 'change' events.
   * @deprecated Set the native `value` property and dispatch native `input`
   * and `change` events instead.
   */
  public static setInputValue(element: any, value: string): void {
    const inputEvent = document.createEvent('Event');
    inputEvent.initEvent('input', false, false);

    const changeEvent = document.createEvent('Event');
    changeEvent.initEvent('change', false, false);

    element.value = value;

    element.dispatchEvent(inputEvent);
  }

  /**
   * Returns the URL of an element's background image, if it exists.
   * @deprecated Use the native `getComputedStyle()` function instead.
   */
  public static getBackgroundImageUrl(el: any): string | undefined {
    const nativeEl = getNativeEl(el);

    if (nativeEl) {
      const backgroundImageUrl = getComputedStyle(nativeEl).backgroundImage;

      /* istanbul ignore else */
      // Browser will likely not return an empty value for the computed style,
      // but leave the if statement here anyway as a sanity check.
      if (backgroundImageUrl) {
        const matches = /url\(('|")([^'"]+)('|")\)/gi.exec(backgroundImageUrl);

        if (matches) {
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
   * @deprecated Use Angular's `DebugElement.query()` (e.g. with `By.css()`)
   * or a SKY UX component test harness instead.
   */
  public static getDebugElementByTestId(
    fixture: ComponentFixture<any>,
    skyTestId: string,
    componentSelector: string,
  ): DebugElement {
    const skyEl = fixture.debugElement.query(
      By.css(`[data-sky-id="${skyTestId}"]`),
    );

    if (!skyEl) {
      throw new Error(
        `No element was found with a \`data-sky-id\` value of "${skyTestId}".`,
      );
    }

    if (skyEl.name !== componentSelector) {
      throw new Error(
        `The element with the test ID "${skyTestId}" is not a component of type ${componentSelector}."`,
      );
    }

    return skyEl;
  }
}
