import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { StacheConfigService } from '../shared';

@Injectable()
export class StacheTitleService {
  constructor(
    private title: Title,
    private configService: StacheConfigService) { }

  public setTitle(...parts: string[]) {
    let windowTitle = this.configService.skyux.app.title;

    if (parts && parts.length > 0) {
      parts.push(windowTitle);
      let validParts = parts.filter((part: string) => !!part && part.trim());
      windowTitle = validParts.join(' - ');
    }

    this.title.setTitle(windowTitle);
  }
}
