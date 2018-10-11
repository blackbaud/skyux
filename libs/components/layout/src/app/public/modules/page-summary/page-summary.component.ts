import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';

import { SkyPageSummaryAdapterService } from './page-summary-adapter.service';
import { SkyMediaBreakpoints, SkyMediaQueryService } from '@skyux/core/modules/media-query';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'sky-page-summary',
  templateUrl: './page-summary.component.html',
  styleUrls: ['./page-summary.component.scss'],
  providers: [SkyPageSummaryAdapterService]
})
export class SkyPageSummaryComponent implements OnDestroy, AfterViewInit {
  private breakpointSubscription: Subscription;

  constructor(
    private elRef: ElementRef,
    private adapter: SkyPageSummaryAdapterService,
    private mediaQueryService: SkyMediaQueryService
  ) { }

  public ngAfterViewInit() {
    this.breakpointSubscription = this.mediaQueryService.subscribe(
      (args: SkyMediaBreakpoints) => {
        this.adapter.updateKeyInfoLocation(this.elRef, args === SkyMediaBreakpoints.xs);
      }
    );
  }

  public ngOnDestroy() {
    /* istanbul ignore else */
    /* sanity check */
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
  }
}
