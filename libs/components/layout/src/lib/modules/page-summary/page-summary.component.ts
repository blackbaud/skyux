import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
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

import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
export class SkyPageSummaryComponent
  implements AfterContentInit, AfterViewInit, OnDestroy
{
  public hasKeyInfo = false;

  @ContentChildren(SkyPageSummaryKeyInfoComponent, {
    read: SkyPageSummaryKeyInfoComponent,
  })
  public keyInfoComponents:
    | QueryList<SkyPageSummaryKeyInfoComponent>
    | undefined;

  #breakpointSubscription: Subscription | undefined;
  #ngUnsubscribe = new Subject<void>();

  #elRef: ElementRef;
  #adapter: SkyPageSummaryAdapterService;
  #mediaQueryService: SkyMediaQueryService;
  #changeDetectorRef: ChangeDetectorRef;

  constructor(
    elRef: ElementRef,
    adapter: SkyPageSummaryAdapterService,
    mediaQueryService: SkyMediaQueryService,
    logger: SkyLogService,
    changeDetector: ChangeDetectorRef
  ) {
    this.#elRef = elRef;
    this.#adapter = adapter;
    this.#mediaQueryService = mediaQueryService;
    this.#changeDetectorRef = changeDetector;
    logger.deprecated('SkyPageSummaryComponent', {
      deprecationMajorVersion: 6,
      moreInfoUrl:
        'https://developer.blackbaud.com/skyux/design/guidelines/page-layouts',
      replacementRecommendation:
        'For page templates and techniques to summarize page content, see the page design guidelines.',
    });
  }

  public ngAfterViewInit(): void {
    this.#breakpointSubscription = this.#mediaQueryService.subscribe(
      (args: SkyMediaBreakpoints) => {
        this.#adapter.updateKeyInfoLocation(
          this.#elRef,
          args === SkyMediaBreakpoints.xs
        );
      }
    );
  }

  public ngAfterContentInit(): void {
    if (this.keyInfoComponents) {
      this.hasKeyInfo = this.keyInfoComponents.length > 0;

      this.keyInfoComponents.changes
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe(() => {
          this.hasKeyInfo =
            !!this.keyInfoComponents && this.keyInfoComponents.length > 0;
          this.#changeDetectorRef.markForCheck();
        });
    }
  }

  public ngOnDestroy(): void {
    /* istanbul ignore else */
    /* sanity check */
    if (this.#breakpointSubscription) {
      this.#breakpointSubscription.unsubscribe();
    }
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }
}
