import { Component, OnDestroy, inject } from '@angular/core';
import { SkyMediaBreakpoints, SkyMediaQueryService } from '@skyux/core';
import { SkyAlertModule } from '@skyux/indicators';

import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyAlertModule],
})
export class DemoComponent implements OnDestroy {
  protected currentBreakpoint: string | undefined;

  #querySubscription: Subscription;

  readonly #mediaQuerySvc = inject(SkyMediaQueryService);

  constructor() {
    this.#querySubscription = this.#mediaQuerySvc.subscribe((newBreakpoint) => {
      switch (newBreakpoint) {
        case SkyMediaBreakpoints.xs:
          this.currentBreakpoint = 'xs';
          break;

        case SkyMediaBreakpoints.sm:
          this.currentBreakpoint = 'sm';
          break;

        case SkyMediaBreakpoints.md:
          this.currentBreakpoint = 'md';
          break;

        case SkyMediaBreakpoints.lg:
          this.currentBreakpoint = 'lg';
          break;

        default:
          this.currentBreakpoint = 'unknown';
      }
    });
  }

  public ngOnDestroy(): void {
    if (this.#querySubscription) {
      this.#querySubscription.unsubscribe();
    }
  }
}
