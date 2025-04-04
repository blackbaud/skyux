import { Component, Injectable } from '@angular/core';
import { SkyAppLocaleProvider } from '@skyux/i18n';

import { BehaviorSubject } from 'rxjs';

let providedLocale = 'es';
const providedLocaleBehaviorSubject = new BehaviorSubject({
  locale: providedLocale,
});

@Injectable()
class MockLocaleProvider extends SkyAppLocaleProvider {
  public override getLocaleInfo() {
    return providedLocaleBehaviorSubject;
  }
}

@Component({
  selector: 'sky-numeric-pipe-fixture',
  templateUrl: './numeric.pipe.fixture.html',
  providers: [{ provide: SkyAppLocaleProvider, useClass: MockLocaleProvider }],
  standalone: false,
})
export class NumericPipeFixtureComponent {
  public locale: string | undefined;
  public value: number | undefined = 1234567.89;

  public updateLocaleProviderLocale(newLocale: string): void {
    providedLocale = newLocale;
    providedLocaleBehaviorSubject.next({
      locale: providedLocale,
    });
  }
}
