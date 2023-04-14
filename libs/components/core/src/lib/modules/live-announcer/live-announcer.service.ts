import { DOCUMENT } from '@angular/common';
import { Injectable, OnDestroy, inject } from '@angular/core';

import { ReplaySubject } from 'rxjs';

import { SkyIdService } from '../id/id.service';
import { SkyAppWindowRef } from '../window/window-ref';

import { SkyLiveAnnouncerArgs } from './types/live-announcer-args';
import {
  SKY_LIVE_ANNOUNCER_DEFAULT_OPTIONS,
  SKY_LIVE_ANNOUNCER_ELEMENT_TOKEN,
  SkyLiveAnnouncerDefaultOptions,
} from './types/live-announcer-tokens';

@Injectable({ providedIn: 'root' })
export class SkyLiveAnnouncerService implements OnDestroy {
  public static announcerElement: HTMLElement | undefined;
  public static announcerElementChanged = new ReplaySubject<
    HTMLElement | undefined
  >(1);

  // We inject the live element and document as `any` because the constructor signature cannot
  // reference browser globals (HTMLElement, Document) on non-browser environments, since having
  // a class decorator causes TypeScript to preserve the constructor signature types.
  #document = inject(DOCUMENT);
  #defaultOptions: SkyLiveAnnouncerDefaultOptions | null = inject(
    SKY_LIVE_ANNOUNCER_DEFAULT_OPTIONS,
    { optional: true }
  );
  #idService = inject(SkyIdService);
  #previousTimeout: number | undefined;
  #windowRef: SkyAppWindowRef = inject(SkyAppWindowRef);

  constructor() {
    if (!SkyLiveAnnouncerService.announcerElement) {
      const elementToken: HTMLElement | null = inject(
        SKY_LIVE_ANNOUNCER_ELEMENT_TOKEN,
        {
          optional: true,
        }
      );
      SkyLiveAnnouncerService.announcerElement =
        elementToken || this.#createLiveElement();
      SkyLiveAnnouncerService.announcerElementChanged.next(
        SkyLiveAnnouncerService.announcerElement
      );
    }
  }

  /**
   * Announces a message to screen readers.
   * @param message Message to be announced to the screen reader.
   * @param args Options for the announcement of the message.
   */
  public announce(message: string, args?: SkyLiveAnnouncerArgs): void {
    /* safety-check */
    /* istanbul ignore if */
    if (!SkyLiveAnnouncerService.announcerElement) {
      SkyLiveAnnouncerService.announcerElement = this.#createLiveElement();
      SkyLiveAnnouncerService.announcerElementChanged.next(
        SkyLiveAnnouncerService.announcerElement
      );
    }

    const defaultOptions = this.#defaultOptions;
    let politeness = args?.politeness;
    let duration = args?.duration;

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

    SkyLiveAnnouncerService.announcerElement.setAttribute(
      'aria-live',
      politeness
    );

    SkyLiveAnnouncerService.announcerElement.textContent = message;

    if (typeof duration === 'number') {
      // TODO: Explore limiting the types that are pulled in.
      // Explicitly declare the `setTimeout` from the `window` object in order to use the DOM typings
      // during a unit test (instead of confusing this with Node's `setTimeout`).
      this.#previousTimeout = this.#windowRef.nativeWindow.setTimeout(
        () => this.clear(),
        duration
      );
    }
  }

  /**
   * Clears the current text from the announcer element. Can be used to prevent
   * screen readers from reading the text out again while the user is going
   * through the page landmarks.
   */
  public clear(): void {
    if (SkyLiveAnnouncerService.announcerElement) {
      SkyLiveAnnouncerService.announcerElement.textContent = '';
    }
  }

  public ngOnDestroy(): void {
    SkyLiveAnnouncerService.announcerElement?.remove();
    SkyLiveAnnouncerService.announcerElement = undefined;
    SkyLiveAnnouncerService.announcerElementChanged.next(undefined);
  }

  #createLiveElement(): HTMLElement {
    const elementClass = 'sky-live-announcer-element';
    const previousElements =
      this.#document.getElementsByClassName(elementClass);
    const liveEl = this.#document.createElement('div');

    // Remove any old containers. This can happen when coming in from a server-side-rendered page.
    for (let i = 0; i < previousElements.length; i++) {
      previousElements[i].remove();
    }

    liveEl.classList.add(elementClass);
    liveEl.classList.add('sky-screen-reader-only');

    liveEl.setAttribute('aria-atomic', 'true');
    liveEl.setAttribute('aria-live', 'polite');
    liveEl.id = this.#idService.generateId();

    this.#document.body.appendChild(liveEl);

    return liveEl;
  }
}
