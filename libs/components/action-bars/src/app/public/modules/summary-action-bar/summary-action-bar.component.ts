import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';

import {
  Subscription
} from 'rxjs/Subscription';

import {
  skyAnimationSlide
} from '@skyux/animations';

import {
  SkyMediaBreakpoints,
  SkyMediaQueryService
} from '@skyux/core';

import {
  SkySummaryActionBarSummaryComponent
} from './summary';

import {
  SkySummaryActionBarAdapterService
} from './summary-action-bar-adapter.service';

import {
  SkySummaryActionBarType
} from './types';

/**
 * Auto-incrementing integer used to generate unique ids for summary action bar components.
 */
let nextId = 0;

@Component({
  selector: 'sky-summary-action-bar',
  templateUrl: './summary-action-bar.component.html',
  styleUrls: ['./summary-action-bar.component.scss'],
  animations: [skyAnimationSlide],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkySummaryActionBarComponent implements AfterViewInit, OnDestroy {

  public isSummaryCollapsed = false;

  public get isSummaryCollapsible(): boolean {
    return this.type === SkySummaryActionBarType.StandardModal ||
      this.mediaQueryService.current === SkyMediaBreakpoints.xs;
  }

  public type: SkySummaryActionBarType;

  public slideDirection: string = 'down';

  public summaryId: string = `sky-summary-action-bar-summary-${++nextId}`;

  private mediaQuerySubscription: Subscription;

  @ContentChild(SkySummaryActionBarSummaryComponent, { read: ElementRef })
  private summaryElement: ElementRef;

  constructor(
    private adapterService: SkySummaryActionBarAdapterService,
    private changeDetector: ChangeDetectorRef,
    private elementRef: ElementRef,
    private mediaQueryService: SkyMediaQueryService
    ) { }

  public ngAfterViewInit(): void {
    this.type = this.adapterService.getSummaryActionBarType(this.elementRef.nativeElement);
    if (this.type === SkySummaryActionBarType.Page) {
      this.setupReactiveState();

      this.adapterService.styleBodyElementForActionBar();
    } else {
      this.adapterService.styleModalFooter();

      if (this.type === SkySummaryActionBarType.FullPageModal) {
        this.setupReactiveState();
      }
    }
    this.changeDetector.detectChanges();
  }

  public ngOnDestroy(): void {
    if (!(this.type === SkySummaryActionBarType.StandardModal ||
      this.type === SkySummaryActionBarType.FullPageModal)) {
        this.adapterService.revertBodyElementStyles();
        this.adapterService.removeResizeListener();
    }

    if (this.mediaQuerySubscription) {
      this.mediaQuerySubscription.unsubscribe();
    }
  }

  public summaryContentExists(): boolean {
    return (
      this.summaryElement &&
      this.summaryElement.nativeElement.children.length > 0
    );
  }

  public showSummarySection(): void {
    this.slideDirection = 'down';
  }

  public hideSummarySection(): void {
    this.slideDirection = 'up';
  }

  // NOTE: This function is needed so that the button is not removed until post-animation
  public summaryTransitionEnd(): void {
    if (this.slideDirection === 'up') {
      this.isSummaryCollapsed = true;
    }
  }

  // NOTE: This function is needed so that the button is added before animation
  public summaryTransitionStart(): void {
    if (this.slideDirection === 'down') {
      this.isSummaryCollapsed = false;
    }
  }

  private setupReactiveState() {
    this.mediaQuerySubscription = this.mediaQueryService.subscribe((args: SkyMediaBreakpoints) => {
      if (args !== SkyMediaBreakpoints.xs) {
        this.isSummaryCollapsed = false;
        this.slideDirection = 'down';
      }
      this.changeDetector.detectChanges();
    });

    this.adapterService.setupResizeListener();
  }
}
