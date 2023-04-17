import { DOCUMENT } from '@angular/common';
import { Injectable, OnDestroy, inject } from '@angular/core';

import { ReplaySubject } from 'rxjs';

import { SkyIdService } from '../id/id.service';

import { SkyLiveAnnouncerArgs } from './types/live-announcer-args';
import {
  SKY_LIVE_ANNOUNCER_DEFAULT_OPTIONS,
  SkyLiveAnnouncerDefaultOptions,
} from './types/live-announcer-tokens';

@Injectable({ providedIn: 'root' })
export class SkyLiveAnnouncerService implements OnDestroy {
  public announcerElementChanged = new ReplaySubject<HTMLElement | undefined>(
    1
  );

  #announcerElement: HTMLElement | undefined;
  // We inject the live element and document as `any` because the constructor signature cannot
  // reference browser globals (HTMLElement, Document) on non-browser environments, since having
  // a class decorator causes TypeScript to preserve the constructor signature types.
  #document = inject(DOCUMENT);
  #defaultOptions: SkyLiveAnnouncerDefaultOptions | null = inject(
    SKY_LIVE_ANNOUNCER_DEFAULT_OPTIONS,
    { optional: true }
  );
  #idService = inject(SkyIdService);

  constructor() {
    this.#announcerElement = this.#createLiveElement();
    this.announcerElementChanged.next(this.#announcerElement);
  }

  /**
   * Announces a message to screen readers.
   * @param message Message to be announced to the screen reader.
   * @param args Options for the announcement of the message.
   */
  public announce(message: string, args?: SkyLiveAnnouncerArgs): void {
    /* safety-check */
    /* istanbul ignore if */
    if (!this.#announcerElement) {
      this.#announcerElement = this.#createLiveElement();
      this.announcerElementChanged.next(this.#announcerElement);
    }

    const defaultOptions = this.#defaultOptions;
    let politeness = args?.politeness;

    this.clear();

    if (!politeness) {
      politeness =
        defaultOptions && defaultOptions.politeness
          ? defaultOptions.politeness
          : 'polite';
    }

    this.#announcerElement.setAttribute('aria-live', politeness);

    this.#announcerElement.textContent = message;
  }

  /**
   * Clears the current text from the announcer element. Can be used to prevent
   * screen readers from reading the text out again while the user is going
   * through the page landmarks.
   */
  public clear(): void {
    if (this.#announcerElement) {
      this.#announcerElement.textContent = '';
    }
  }

  public ngOnDestroy(): void {
    this.#announcerElement?.remove();
    this.#announcerElement = undefined;
    this.announcerElementChanged.next(undefined);
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
