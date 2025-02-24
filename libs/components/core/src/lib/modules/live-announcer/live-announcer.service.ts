import { DOCUMENT } from '@angular/common';
import { Injectable, NgZone, OnDestroy, inject } from '@angular/core';

import { ReplaySubject } from 'rxjs';

import { SkyIdService } from '../id/id.service';

import { SkyLiveAnnouncerArgs } from './types/live-announcer-args';

/**
 * Allows for announcing messages to screen reader users through the use of a common `aria-live` element.
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class SkyLiveAnnouncerService implements OnDestroy {
  public announcerElementChanged = new ReplaySubject<HTMLElement | undefined>(
    1,
  );

  #announcerElement: HTMLElement | undefined;
  #document = inject(DOCUMENT);
  #idService = inject(SkyIdService);
  #durationTimeout: number | undefined;
  #ngZone = inject(NgZone);

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

    const politeness = args?.politeness ?? 'polite';
    this.#announcerElement.setAttribute('aria-live', politeness);

    this.clear();
    clearTimeout(this.#durationTimeout);

    this.#announcerElement.textContent = message;
    this.#ngZone.runOutsideAngular(() => {
      this.#durationTimeout = setTimeout(
        () => this.clear(),
        args?.duration ?? this.#calculateDefaultDurationFromString(message),
      ) as unknown as number;
    });
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

  /**
   * @internal
   */
  public ngOnDestroy(): void {
    this.#announcerElement?.remove();
    this.#announcerElement = undefined;
    this.announcerElementChanged.next(undefined);
    clearTimeout(this.#durationTimeout);
  }

  #calculateDefaultDurationFromString(message: string): number {
    // Research suggests normal WPM is 110 for english. Lowering here to be conservative.
    const baseWordsPerMinute = 80;
    const minuteInMilliseconds = 60000;
    const numberOfWords = message.split(' ').length;

    const baseTime =
      (numberOfWords / baseWordsPerMinute) * minuteInMilliseconds;

    // Add 50% to time to account for exceptionally slow screen reader settings and/or speech settings that leave long pauses between words.
    return baseTime * 1.5;
  }

  #createLiveElement(): HTMLElement {
    const elementClass = 'sky-live-announcer-element';
    const previousElements = Array.from<Element>(
      this.#document.getElementsByClassName(elementClass),
    );
    const liveEl = this.#document.createElement('div');

    // Remove any old containers. This can happen when coming in from a server-side-rendered page.
    for (const previousElement of previousElements) {
      previousElement.remove();
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
