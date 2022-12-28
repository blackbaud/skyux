import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

import { ReplaySubject } from 'rxjs';

import { SkyAppViewportReserveArgs } from './viewport-reserve-args';
import { SkyAppViewportReservedPositionType } from './viewport-reserve-position-type';

/**
 * Information about the state of the application's viewport.
 */
@Injectable({
  providedIn: 'root',
})
export class SkyAppViewportService {
  /**
   * Updated when the viewport becomes visible.  While the page is rendered, the
   * viewport may remain hidden as fonts and styles are loaded asynchronously;
   * this is done to avoid a FOUC (Flash Of Unstyled Content) before the fonts
   * and styles are ready.
   */
  public visible = new ReplaySubject<boolean>(1);

  #reserveItems = new Map<string, SkyAppViewportReserveArgs>();
  #document: Document;

  constructor(@Inject(DOCUMENT) document: Document) {
    this.#document = document;
  }

  /**
   * Reserves space for components docked to the left, top, right, or bottom of the viewport.
   * @param args
   */
  public reserveSpace(args: SkyAppViewportReserveArgs): void {
    this.#reserveItems.set(args.id, args);
    this.#updateViewportArea();
  }

  /**
   * Removes reserved space for a component by the ID provided when it was reserved.
   * @param id
   */
  public unreserveSpace(id: string): void {
    this.#reserveItems.delete(id);
    this.#updateViewportArea();
  }

  #updateViewportArea(): void {
    const reservedSpaces: {
      [key in SkyAppViewportReservedPositionType]: number;
    } = {
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
    };

    for (const { position, size } of this.#reserveItems.values()) {
      reservedSpaces[position] += size;
    }

    const documentElementStyle = this.#document.documentElement.style;

    for (const [position, size] of Object.entries(reservedSpaces)) {
      documentElementStyle.setProperty(
        `--sky-viewport-${position}`,
        size + 'px'
      );
    }
  }
}
