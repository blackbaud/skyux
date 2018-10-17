import {
  ChangeDetectionStrategy,
  Component,
  OnInit
} from '@angular/core';

import {
  SkyLibResourcesService
} from '../public';

@Component({
  selector: 'sky-sample-resources',
  templateUrl: './sample-resources.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkySampleResourcesComponent implements OnInit {
  public defaultGreeting: string;
  public localizedGreeting: string;

  constructor(
    private resourcesService: SkyLibResourcesService
  ) { }

  public ngOnInit(): void {
    this.defaultGreeting = this.resourcesService.getStringForLocale(
      { locale: 'en_US' },
      'greeting'
    );

    this.resourcesService
      .getString('greeting')
      .subscribe((localizedValue: string) => {
        this.localizedGreeting = localizedValue;
      });
  }
}
