import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { SkyAppSetTitleArgs } from './set-title-args';

/**
 * Provides a method for setting a formatted title on the current window.
 */
@Injectable({
  providedIn: 'root',
})
export class SkyAppTitleService {
  #title: Title;

  constructor(title: Title) {
    this.#title = title;
  }

  /**
   * Sets the title on the current window.
   * @param args An array of title parts. The parts will be concatenated with a hyphen between
   * each part.
   */
  public setTitle(args: SkyAppSetTitleArgs | undefined): void {
    if (args?.titleParts) {
      this.#title.setTitle(args.titleParts.join(' - '));
    }
  }
}
