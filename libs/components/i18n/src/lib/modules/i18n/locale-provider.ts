import { Injectable } from '@angular/core';

import { Observable, of as observableOf } from 'rxjs';

import { SkyAppLocaleInfo } from './locale-info';

const SKY_APP_LOCALE_PROVIDER_DEFAULT_LOCALE = 'en-US';

@Injectable({
  providedIn: 'root',
})
export class SkyAppLocaleProvider {
  public defaultLocale: string = SKY_APP_LOCALE_PROVIDER_DEFAULT_LOCALE;

  public getLocaleInfo(): Observable<SkyAppLocaleInfo> {
    return observableOf({
      locale: this.defaultLocale,
    });
  }
}
