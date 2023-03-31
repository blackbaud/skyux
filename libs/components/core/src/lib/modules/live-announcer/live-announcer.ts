import {
  AriaLivePoliteness,
  LIVE_ANNOUNCER_DEFAULT_OPTIONS,
  LIVE_ANNOUNCER_ELEMENT_TOKEN,
  LiveAnnouncerDefaultOptions,
} from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import { Injectable, OnDestroy, inject } from '@angular/core';

let uniqueIds = 0;

@Injectable({ providedIn: 'root' })
export class SkyLiveAnnouncer implements OnDestroy {
  // We inject the live element and document as `any` because the constructor signature cannot
  // reference browser globals (HTMLElement, Document) on non-browser environments, since having
  // a class decorator causes TypeScript to preserve the constructor signature types.
  #_document = inject(DOCUMENT);
  #_defaultOptions: LiveAnnouncerDefaultOptions | null = inject(
    LIVE_ANNOUNCER_DEFAULT_OPTIONS,
    { optional: true }
  );
  #liveElement: HTMLElement;
  #previousTimeout: NodeJS.Timeout | undefined;

  constructor() {
    const elementToken: HTMLElement | null = inject(
      LIVE_ANNOUNCER_ELEMENT_TOKEN,
      {
        optional: true,
      }
    );
    this.#liveElement = elementToken || this.#createLiveElement();
  }

  /**
   * Announces a message to screen readers.
   * @param message Message to be announced to the screen reader.
   * @returns Promise that will be resolved when the message is added to the DOM.
   */
  announce(message: string): void;

  /**
   * Announces a message to screen readers.
   * @param message Message to be announced to the screen reader.
   * @param politeness The politeness of the announcer element.
   * @returns Promise that will be resolved when the message is added to the DOM.
   */
  announce(message: string, politeness?: AriaLivePoliteness): void;

  /**
   * Announces a message to screen readers.
   * @param message Message to be announced to the screen reader.
   * @param duration Time in milliseconds after which to clear out the announcer element. Note
   *   that this takes effect after the message has been added to the DOM, which can be up to
   *   100ms after `announce` has been called.
   * @returns Promise that will be resolved when the message is added to the DOM.
   */
  announce(message: string, duration?: number): void;

  /**
   * Announces a message to screen readers.
   * @param message Message to be announced to the screen reader.
   * @param politeness The politeness of the announcer element.
   * @param duration Time in milliseconds after which to clear out the announcer element. Note
   *   that this takes effect after the message has been added to the DOM, which can be up to
   *   100ms after `announce` has been called.
   * @returns Promise that will be resolved when the message is added to the DOM.
   */
  announce(
    message: string,
    politeness?: AriaLivePoliteness,
    duration?: number
  ): void;

  announce(message: string, ...args: any[]): void {
    const defaultOptions = this.#_defaultOptions;
    let politeness: AriaLivePoliteness | undefined;
    let duration: number | undefined;

    if (args.length === 1 && typeof args[0] === 'number') {
      duration = args[0];
    } else {
      [politeness, duration] = args;
    }

    this.clear();
    clearTimeout(this.#previousTimeout);

    if (!politeness) {
      politeness =
        defaultOptions && defaultOptions.politeness
          ? defaultOptions.politeness
          : 'polite';
    }

    if (duration === undefined && defaultOptions) {
      duration = defaultOptions.duration;
    }

    // TODO: ensure changing the politeness works on all environments we support.
    this.#liveElement.setAttribute('aria-live', politeness);

    if (this.#liveElement.id) {
      this.#exposeAnnouncerToModals(this.#liveElement.id);
    }

    this.#liveElement.textContent = message;

    if (typeof duration === 'number') {
      this.#previousTimeout = setTimeout(() => this.clear(), duration);
    }
  }

  /**
   * Clears the current text from the announcer element. Can be used to prevent
   * screen readers from reading the text out again while the user is going
   * through the page landmarks.
   */
  public clear(): void {
    if (this.#liveElement) {
      this.#liveElement.textContent = '';
    }
  }

  public ngOnDestroy(): void {
    this.#liveElement?.remove();
  }

  #createLiveElement(): HTMLElement {
    const elementClass = 'cdk-live-announcer-element';
    const previousElements =
      this.#_document.getElementsByClassName(elementClass);
    const liveEl = this.#_document.createElement('div');

    // Remove any old containers. This can happen when coming in from a server-side-rendered page.
    for (let i = 0; i < previousElements.length; i++) {
      previousElements[i].remove();
    }

    liveEl.classList.add(elementClass);
    liveEl.classList.add('cdk-visually-hidden');

    liveEl.setAttribute('aria-atomic', 'true');
    liveEl.setAttribute('aria-live', 'polite');
    liveEl.id = `cdk-live-announcer-${uniqueIds++}`;

    this.#_document.body.appendChild(liveEl);

    return liveEl;
  }

  /**
   * Some browsers won't expose the accessibility node of the live announcer element if there is an
   * `aria-modal` and the live announcer is outside of it. This method works around the issue by
   * pointing the `aria-owns` of all modals to the live announcer element.
   */
  #exposeAnnouncerToModals(id: string): void {
    // Note that the selector here is limited to CDK overlays at the moment in order to reduce the
    // section of the DOM we need to look through. This should cover all the cases we support, but
    // the selector can be expanded if it turns out to be too narrow.
    const modals = this.#_document.querySelectorAll(
      'body > .cdk-overlay-container [aria-modal="true"]'
    );

    for (let i = 0; i < modals.length; i++) {
      const modal = modals[i];
      const ariaOwns = modal.getAttribute('aria-owns');

      if (!ariaOwns) {
        modal.setAttribute('aria-owns', id);
      } else if (ariaOwns.indexOf(id) === -1) {
        modal.setAttribute('aria-owns', ariaOwns + ' ' + id);
      }
    }
  }
}
