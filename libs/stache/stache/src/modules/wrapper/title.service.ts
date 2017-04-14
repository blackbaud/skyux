import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { SkyAppConfig } from '@blackbaud/skyux-builder/runtime';

@Injectable()
export class StacheTitleService {
  constructor(
    private title: Title,
    private skyAppConfig: SkyAppConfig) { }

  public setTitle(...parts: string[]) {
    let windowTitle = this.skyAppConfig.skyux.app.title;

    if (parts && parts.length > 0) {
      parts.push(windowTitle);
      let validParts = parts.filter(part => part !== undefined);
      windowTitle = validParts.join(' - ');
    }

    this.title.setTitle(windowTitle);
  }
}
