import {
  Component
} from '@angular/core';

import {
  SkyAppLocaleInfo,
  SkyAppLocaleProvider
} from '@skyux/i18n';

import {
  BehaviorSubject,
  Observable
} from 'rxjs';

export class MyLocaleProvider extends SkyAppLocaleProvider {
  public getLocaleInfo(): Observable<SkyAppLocaleInfo> {
    const obs = new BehaviorSubject<any>({});

    // Simulate HTTP call.
    setTimeout(() => {
      obs.next({
        locale: 'fr-CA'
      });
    }, 1000);

    return obs;
  }
}

@Component({
  selector: 'date-pipe-with-provider-visual',
  templateUrl: './date-pipe-with-provider-visual.component.html',
  providers: [
    {
      provide: SkyAppLocaleProvider,
      useClass: MyLocaleProvider
    }
  ]
})
export class DatePipeWithProviderVisualComponent {
  public dateValue = new Date('01/01/2019');
}
