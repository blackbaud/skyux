import {
  Injectable
} from '@angular/core';

import {
  Title
} from '@angular/platform-browser';

/**
 * @internal
 */
@Injectable({
  providedIn: 'root'
})
export class SkyDocsDemoPageTitleService {

  constructor(
    private title: Title
  ) { }

  public setTitle(...parts: string[]): void {
    let windowTitle = 'SKY UX';

    if (parts && parts.length > 0) {
      parts.push(windowTitle);
      windowTitle = parts.join(' - ');
    }

    this.title.setTitle(windowTitle);
  }
}
