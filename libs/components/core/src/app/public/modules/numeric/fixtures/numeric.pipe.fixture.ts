import {
  Component
} from '@angular/core';

import {
  SkyAppLocaleProvider
} from '@skyux/i18n';

import {
  of
} from 'rxjs';

class MockLocaleProvider extends SkyAppLocaleProvider {
  public getLocaleInfo() {
    return of({
      locale: 'es'
    });
  }
}

@Component({
  selector: 'numeric-pipe-fixture',
  templateUrl: './numeric.pipe.fixture.html',
  providers: [
    { provide: SkyAppLocaleProvider, useClass: MockLocaleProvider }
  ]
})
export class NumericPipeFixtureComponent {

  public locale: string;

}
