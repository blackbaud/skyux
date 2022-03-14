import { Injectable } from '@angular/core';

import { Observable, of as observableOf } from 'rxjs';

import { SkyAppLocaleInfo } from './locale-info';

@Injectable({
  providedIn: 'root',
})
export class SkyAppLocaleProvider {
  public get defaultLocale(): string {
    return SkyAppLocaleProvider._defaultLocale;
  }

  private static _defaultLocale = 'en-US';

  public getLocaleInfo(): Observable<SkyAppLocaleInfo> {
    return observableOf({
      locale: this.defaultLocale,
    });
  }
}
