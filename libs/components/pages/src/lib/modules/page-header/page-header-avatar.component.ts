import { Component, OnDestroy, inject } from '@angular/core';
import {
  SkyDefaultInputProvider,
  SkyMediaBreakpoints,
  SkyMediaQueryService,
} from '@skyux/core';

import { Subscription } from 'rxjs';

/**
 * Displays an avatar within the page header to the left of the page title.
 * If no size is specified for the avatar component it will display at size
 * small on xs breakpoints and size large on small and above breakpoints.
 */
@Component({
  selector: 'sky-page-header-avatar',
  templateUrl: './page-header-avatar.component.html',
  styleUrls: ['./page-header-avatar.component.scss'],
  providers: [SkyDefaultInputProvider],
})
export class SkyPageHeaderAvatarComponent implements OnDestroy {
  #defaultInputProvider = inject(SkyDefaultInputProvider);
  #mediaQueryService = inject(SkyMediaQueryService);
  #mediaQuerySubscription: Subscription;

  constructor() {
    this.#mediaQuerySubscription = this.#mediaQueryService.subscribe(
      (args: SkyMediaBreakpoints) => {
        if (args === SkyMediaBreakpoints.xs) {
          this.#defaultInputProvider.setValue('avatar', 'size', 'small');
        } else {
          this.#defaultInputProvider.setValue('avatar', 'size', 'large');
        }
      },
    );
  }

  public ngOnDestroy(): void {
    this.#mediaQuerySubscription.unsubscribe();
  }
}
