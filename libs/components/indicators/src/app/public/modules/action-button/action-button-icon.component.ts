import {
  Component,
  Input,
  OnDestroy
} from '@angular/core';

import {
  SkyMediaQueryService,
  SkyMediaBreakpoints
} from '../media-queries';

import {
  Subscription
} from 'rxjs/Subscription';

const FONTSIZECLASS_SMALL = '2x';
const FONTSIZECLASS_LARGE = '3x';

@Component({
  selector: 'sky-action-button-icon',
  styleUrls: ['./action-button-icon.component.scss'],
  templateUrl: './action-button-icon.component.html'
})
export class SkyActionButtonIconComponent implements OnDestroy {

  @Input()
  public iconType: string = '';

  public fontSizeClass: string = FONTSIZECLASS_LARGE;

  private subscription: Subscription;

  constructor(private mediaQueryService: SkyMediaQueryService) {
    this.subscription = this.mediaQueryService.subscribe((args: SkyMediaBreakpoints) => {
      if (args === SkyMediaBreakpoints.xs) {
        this.fontSizeClass = FONTSIZECLASS_SMALL;
      } else {
        this.fontSizeClass = FONTSIZECLASS_LARGE;
      }
    });
  }

  public ngOnDestroy() {
    /* istanbul ignore else */
    /* sanity check */
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
