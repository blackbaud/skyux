import { Component } from '@angular/core';
import { SkyAppLocaleInfo, SkyAppLocaleProvider } from '@skyux/i18n';

import { BehaviorSubject, Observable } from 'rxjs';

export class MyLocaleProvider extends SkyAppLocaleProvider {
  public override getLocaleInfo(): Observable<SkyAppLocaleInfo> {
    const obs = new BehaviorSubject<any>({});

    // Simulate HTTP call.
    setTimeout(() => {
      obs.next({
        locale: 'fr-CA',
      });
    }, 1000);

    return obs;
  }
}

@Component({
  selector: 'app-date-pipe-provider',
  templateUrl: './date-pipe-provider.component.html',
  providers: [
    {
      provide: SkyAppLocaleProvider,
      useClass: MyLocaleProvider,
    },
  ],
  standalone: false,
})
export class DatePipeProviderComponent {
  public dateValue = new Date('01/01/2019');
}
