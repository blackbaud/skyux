import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  OnDestroy,
  QueryList,
} from '@angular/core';
import { SkyMediaBreakpoints, SkyMediaQueryService } from '@skyux/core';
import { SkyDropdownMessage, SkyDropdownMessageType } from '@skyux/popovers';

import { Subject, Subscription } from 'rxjs';

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
  public secondaryActionComponents:
    | QueryList<SkySummaryActionBarSecondaryActionComponent>
    | undefined;

  public isMobile = false;

  public dropdownMessageStream = new Subject<SkyDropdownMessage>();

  #mediaQuerySubscription: Subscription | undefined;
  #actionChanges: Subscription | undefined;
  #actionClicks: Subscription[] = [];
  #changeDetector: ChangeDetectorRef;
  #mediaQueryService: SkyMediaQueryService;

  constructor(
    changeDetector: ChangeDetectorRef,
    mediaQueryService: SkyMediaQueryService,
  ) {
    this.#changeDetector = changeDetector;
    this.#mediaQueryService = mediaQueryService;

    console.log('foo', this.#mediaQueryService.current);
  }

  public ngAfterContentInit(): void {
    this.#mediaQuerySubscription = this.#mediaQueryService.subscribe(
      (args: SkyMediaBreakpoints) => {
        this.isMobile = args === SkyMediaBreakpoints.xs;
        this.#checkAndUpdateChildrenType();
      },
    );

    this.#actionChanges = this.secondaryActionComponents?.changes.subscribe(
      () => {
        this.#checkAndUpdateChildrenType();
      },
    );

    if (this.#mediaQueryService.current === SkyMediaBreakpoints.xs) {
      this.isMobile = true;
    }

    this.#checkAndUpdateChildrenType();
  }

  public ngOnDestroy(): void {
    this.#mediaQuerySubscription?.unsubscribe();
    this.#actionChanges?.unsubscribe();
    this.#actionClicks.forEach((actionClick) => actionClick.unsubscribe());
  }

  #checkAndUpdateChildrenType(): void {
    /* istanbul ignore else */
    if (this.secondaryActionComponents) {
      let isDropdown = false;
      if (this.secondaryActionComponents.length >= 5 || this.isMobile) {
        isDropdown = true;
      }
      this.secondaryActionComponents.forEach((action) => {
        action.isDropdown = isDropdown;
        this.#actionClicks.push(
          action.actionClick.subscribe(() => {
            this.dropdownMessageStream.next({
              type: SkyDropdownMessageType.Close,
            });
          }),
        );
      });
    }
    this.#changeDetector.detectChanges();
  }
}
