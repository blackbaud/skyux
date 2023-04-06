import { DOCUMENT } from '@angular/common';
import { Injectable, OnDestroy, inject } from '@angular/core';

import { ReplaySubject } from 'rxjs';

import { SkyIdService } from '../id/id.service';

import {
  SKY_LIVE_ANNOUNCER_DEFAULT_OPTIONS,
  SKY_LIVE_ANNOUNCER_ELEMENT_TOKEN,
  SkyAriaLivePoliteness,
  SkyLiveAnnouncerDefaultOptions,
} from './live-announcer-tokens';

@Injectable({ providedIn: 'root' })
export class SkyLiveAnnouncer implements OnDestroy {
  public static announcerElement: HTMLElement | undefined;
  public static announcerElementChanged = new ReplaySubject<
    HTMLElement | undefined
  >(1);

  // We inject the live element and document as `any` because the constructor signature cannot
  // reference browser globals (HTMLElement, Document) on non-browser environments, since having
  // a class decorator causes TypeScript to preserve the constructor signature types.
  #_document = inject(DOCUMENT);
  #_defaultOptions: SkyLiveAnnouncerDefaultOptions | null = inject(
    SKY_LIVE_ANNOUNCER_DEFAULT_OPTIONS,
    { optional: true }
  );
  #idService = inject(SkyIdService);
  #previousTimeout: number | undefined;

  constructor() {
    const elementToken: HTMLElement | null = inject(
      SKY_LIVE_ANNOUNCER_ELEMENT_TOKEN,
      {
        optional: true,
      }
    );
    SkyLiveAnnouncer.announcerElement =
      elementToken || this.#createLiveElement();
    SkyLiveAnnouncer.announcerElementChanged.next(
      SkyLiveAnnouncer.announcerElement
    );
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
  announce(message: string, politeness?: SkyAriaLivePoliteness): void;

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
    politeness?: SkyAriaLivePoliteness,
    duration?: number
  ): void;

  announce(message: string, ...args: any[]): void {
    /* safety-check */
    /* istanbul ignore if */
    if (!SkyLiveAnnouncer.announcerElement) {
      SkyLiveAnnouncer.announcerElement = this.#createLiveElement();
      SkyLiveAnnouncer.announcerElementChanged.next(
        SkyLiveAnnouncer.announcerElement
      );
    }

    const defaultOptions = this.#_defaultOptions;
    let politeness: SkyAriaLivePoliteness | undefined;
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

    SkyLiveAnnouncer.announcerElement.setAttribute('aria-live', politeness);

    SkyLiveAnnouncer.announcerElement.textContent = message;

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
    if (SkyLiveAnnouncer.announcerElement) {
      SkyLiveAnnouncer.announcerElement.textContent = '';
    }
  }

  public ngOnDestroy(): void {
    SkyLiveAnnouncer.announcerElement?.remove();
    SkyLiveAnnouncer.announcerElement = undefined;
    SkyLiveAnnouncer.announcerElementChanged.next(undefined);
  }

  #createLiveElement(): HTMLElement {
    const elementClass = 'sky-live-announcer-element';
    const previousElements =
      this.#_document.getElementsByClassName(elementClass);
    const liveEl = this.#_document.createElement('div');

    // Remove any old containers. This can happen when coming in from a server-side-rendered page.
    for (let i = 0; i < previousElements.length; i++) {
      previousElements[i].remove();
    }

    liveEl.classList.add(elementClass);
    liveEl.classList.add('sky-screen-reader-only');

    liveEl.setAttribute('aria-atomic', 'true');
    liveEl.setAttribute('aria-live', 'polite');
    liveEl.id = this.#idService.generateId();

    this.#_document.body.appendChild(liveEl);

    return liveEl;
  }
}
