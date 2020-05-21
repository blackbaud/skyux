import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  OnDestroy,
  QueryList,
  ChangeDetectionStrategy
} from '@angular/core';

import {
  Subscription
} from 'rxjs';

import {
  SkyMediaBreakpoints,
  SkyMediaQueryService
} from '@skyux/core';

import {
  SkySummaryActionBarSecondaryActionComponent
} from './summary-action-bar-secondary-action.component';

@Component({
  selector: 'sky-summary-action-bar-secondary-actions',
  templateUrl: './summary-action-bar-secondary-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkySummaryActionBarSecondaryActionsComponent implements AfterContentInit, OnDestroy {

  @ContentChildren(SkySummaryActionBarSecondaryActionComponent)
  public secondaryActionComponents: QueryList<SkySummaryActionBarSecondaryActionComponent>;

  public isMobile = false;

  private mediaQuerySubscription: Subscription;
  private actionChanges: Subscription;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private mediaQueryService: SkyMediaQueryService
  ) { }

  public ngAfterContentInit(): void {
    this.mediaQuerySubscription = this.mediaQueryService.subscribe((args: SkyMediaBreakpoints) => {
      this.isMobile = args === SkyMediaBreakpoints.xs;
      this.checkAndUpdateChildrenType();
    });

    this.actionChanges = this.secondaryActionComponents.changes.subscribe(() => {
      this.checkAndUpdateChildrenType();
    });
    if (this.mediaQueryService.current === SkyMediaBreakpoints.xs) {
      this.isMobile = true;
    }
    this.checkAndUpdateChildrenType();
  }

  public ngOnDestroy(): void {
    this.mediaQuerySubscription.unsubscribe();
    this.actionChanges.unsubscribe();
  }

  private checkAndUpdateChildrenType() {
    /* istanbul ignore else */
    if (this.secondaryActionComponents) {
      let isDropdown = false;
      if (this.secondaryActionComponents.length >= 5 || this.isMobile) {
        isDropdown = true;
      }
      this.secondaryActionComponents.forEach(action => {
        action.isDropdown = isDropdown;
      });
    }
    this.changeDetector.detectChanges();
  }

}
