import { Injectable } from '@angular/core';
import { SkyAppLocaleInfo, SkyAppLocaleProvider } from '@skyux/i18n';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class LocaleProvider extends SkyAppLocaleProvider {
  #locale: BehaviorSubject<SkyAppLocaleInfo>;
  #localeObs: Observable<SkyAppLocaleInfo>;

  constructor() {
    super();

    this.#locale = new BehaviorSubject<SkyAppLocaleInfo>({
      locale: 'en-US',
    });

    this.#localeObs = this.#locale.asObservable();
  }

  public override getLocaleInfo(): Observable<SkyAppLocaleInfo> {
    return this.#localeObs;
  }

  public setLocale(locale: string): void {
    this.#locale.next({ locale });
  }
}
