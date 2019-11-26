import {
  Injectable
} from '@angular/core';

import {
  Title
} from '@angular/platform-browser';

import {
  SkyAppSetTitleArgs
} from './set-title-args';

/**
 * Provides a method for setting a formatted title on the current window.
 */
@Injectable()
export class SkyAppTitleService {

  constructor(private title: Title) { }

  /**
   * Sets the title on the current window.
   * @param args An array of title parts. The parts will be concatenated with a hyphen between
   * each part.
   */
  public setTitle(args: SkyAppSetTitleArgs): void {
    if (args && args.titleParts) {
      this.title.setTitle(args.titleParts.join(' - '));
    }
  }

}
