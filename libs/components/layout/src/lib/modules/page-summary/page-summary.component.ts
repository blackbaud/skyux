import {
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  OnDestroy,
  QueryList,
} from '@angular/core';
import {
  SkyLogService,
  SkyMediaBreakpoints,
  SkyMediaQueryService,
} from '@skyux/core';

import { Subscription } from 'rxjs';

import { SkyPageSummaryAdapterService } from './page-summary-adapter.service';
import { SkyPageSummaryKeyInfoComponent } from './page-summary-key-info.component';

/**
 * Specifies the components to display in the page summary.
 * @deprecated `SkyPageSummaryComponent` is deprecated. For page templates and techniques to summarize page content, see the page design guidelines. For more information, see https://developer.blackbaud.com/skyux/design/guidelines/page-layouts.
 */
@Component({
  selector: 'sky-page-summary',
  templateUrl: './page-summary.component.html',
  styleUrls: ['./page-summary.component.scss'],
  providers: [SkyPageSummaryAdapterService],
})
export class SkyPageSummaryComponent implements OnDestroy, AfterViewInit {
  public get hasKeyInfo(): boolean {
    return this.keyInfoComponents.length > 0;
  }

  @ContentChildren(SkyPageSummaryKeyInfoComponent, {
    read: SkyPageSummaryKeyInfoComponent,
  })
  private keyInfoComponents: QueryList<SkyPageSummaryKeyInfoComponent>;

  private breakpointSubscription: Subscription;

  constructor(
    private elRef: ElementRef,
    private adapter: SkyPageSummaryAdapterService,
    private mediaQueryService: SkyMediaQueryService,
    logger: SkyLogService
  ) {
    logger.deprecated('SkyPageSummaryComponent', {
      deprecationMajorVersion: 6,
      moreInfoUrl:
        'https://developer.blackbaud.com/skyux/design/guidelines/page-layouts',
      replacementRecommendation:
        'For page templates and techniques to summarize page content, see the page design guidelines.',
    });
  }

  public ngAfterViewInit() {
    this.breakpointSubscription = this.mediaQueryService.subscribe(
      (args: SkyMediaBreakpoints) => {
        this.adapter.updateKeyInfoLocation(
          this.elRef,
          args === SkyMediaBreakpoints.xs
        );
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
