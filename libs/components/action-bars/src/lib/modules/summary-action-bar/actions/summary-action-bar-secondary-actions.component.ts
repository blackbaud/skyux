import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  OnDestroy,
  QueryList,
  ChangeDetectionStrategy,
} from '@angular/core';

import { Subject, Subscription } from 'rxjs';

import { SkyMediaBreakpoints, SkyMediaQueryService } from '@skyux/core';

import { SkyDropdownMessage, SkyDropdownMessageType } from '@skyux/popovers';

import { SkySummaryActionBarSecondaryActionComponent } from './summary-action-bar-secondary-action.component';

/**
 * Contains secondary actions specified with `sky-summary-action-bar-secondary-action`
 * components.
 */
@Component({
  selector: 'sky-summary-action-bar-secondary-actions',
  templateUrl: './summary-action-bar-secondary-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkySummaryActionBarSecondaryActionsComponent
  implements AfterContentInit, OnDestroy
{
  @ContentChildren(SkySummaryActionBarSecondaryActionComponent)
  public secondaryActionComponents: QueryList<SkySummaryActionBarSecondaryActionComponent>;

  public isMobile = false;

  public dropdownMessageStream = new Subject<SkyDropdownMessage>();

  private mediaQuerySubscription: Subscription;
  private actionChanges: Subscription;
  private actionClicks: Subscription[] = [];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private mediaQueryService: SkyMediaQueryService
  ) {}

  public ngAfterContentInit(): void {
    this.mediaQuerySubscription = this.mediaQueryService.subscribe(
      (args: SkyMediaBreakpoints) => {
        this.isMobile = args === SkyMediaBreakpoints.xs;
        this.checkAndUpdateChildrenType();
      }
    );

    this.actionChanges = this.secondaryActionComponents.changes.subscribe(
      () => {
        this.checkAndUpdateChildrenType();
      }
    );
    if (this.mediaQueryService.current === SkyMediaBreakpoints.xs) {
      this.isMobile = true;
    }
    this.checkAndUpdateChildrenType();
  }

  public ngOnDestroy(): void {
    this.mediaQuerySubscription.unsubscribe();
    this.actionChanges.unsubscribe();
    this.actionClicks.forEach((actionClick) => actionClick.unsubscribe());
  }

  private checkAndUpdateChildrenType() {
    /* istanbul ignore else */
    if (this.secondaryActionComponents) {
      let isDropdown = false;
      if (this.secondaryActionComponents.length >= 5 || this.isMobile) {
        isDropdown = true;
      }
      this.secondaryActionComponents.forEach((action) => {
        action.isDropdown = isDropdown;
        this.actionClicks.push(
          action.actionClick.subscribe(() => {
            this.dropdownMessageStream.next({
              type: SkyDropdownMessageType.Close,
            });
          })
        );
      });
    }
    this.changeDetector.detectChanges();
  }
}
