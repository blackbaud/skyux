import {
  SkyAppTestUtilityDomEventOptions
} from './test-utility-dom-event-options';

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
      settings.keyboardEventInit
    );

    event.initEvent(eventName, settings.bubbles, settings.cancelable);
    element.dispatchEvent(event);
  }
}
