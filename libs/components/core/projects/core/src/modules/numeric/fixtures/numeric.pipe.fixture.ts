import {
  Component,
  Injectable
} from '@angular/core';

import {
  SkyAppLocaleProvider
} from '@skyux/i18n';

import {
  BehaviorSubject,
  of
} from 'rxjs';

let providedLocale: string = 'es';
let providedLocaleBehaviorSubject = new BehaviorSubject({
  locale: providedLocale
});

@Injectable()
class MockLocaleProvider extends SkyAppLocaleProvider {
  public getLocaleInfo() {
    return providedLocaleBehaviorSubject;
  }
}

@Component({
  selector: 'sky-numeric-pipe-fixture',
  templateUrl: './numeric.pipe.fixture.html',
  providers: [
    { provide: SkyAppLocaleProvider, useClass: MockLocaleProvider }
  ]
})
export class NumericPipeFixtureComponent {

  public locale: string;

  public updateLocaleProviderLocale(newLocale: string): void {
    providedLocale = newLocale;
    providedLocaleBehaviorSubject.next({
      locale: providedLocale
    });
  }
}
