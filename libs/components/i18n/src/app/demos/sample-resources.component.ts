import {
  ChangeDetectionStrategy,
  Component,
  OnInit
} from '@angular/core';

import {
  SkyAppResourcesService,
  SkyLibResourcesService
} from '@skyux/i18n';

import {
  Observable
} from 'rxjs';

@Component({
  selector: 'sky-sample-resources',
  templateUrl: './sample-resources.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkySampleResourcesComponent implements OnInit {
  public appGreeting: Observable<string>;
  public libDefaultGreeting: string;
  public libLocalizedGreeting: string;

  constructor(
    private appResources: SkyAppResourcesService,
    private libResources: SkyLibResourcesService
  ) { }

  public ngOnInit(): void {
    this.libDefaultGreeting = this.libResources.getStringForLocale(
      { locale: 'en_US' },
      'greeting'
    );

    this.libResources.getString('greeting')
      .subscribe((value: string) => {
        this.libLocalizedGreeting = value;
      });

    this.appGreeting = this.appResources.getString('greeting');
  }
}
