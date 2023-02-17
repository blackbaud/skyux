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
import {
  SkyAppViewportReservedSpace,
  SkyAppViewportService,
} from '@skyux/theme';

import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkySummaryActionBarSecondaryActionComponent } from './summary-action-bar-secondary-action.component';

// Assume an average button width when determining if secondary actions
// should be combined into a dropdown. An ideal implementation would take the
// actual button widths into account but would require a significant amount of
// rework.
const AVG_BTN_WIDTH = 70;
const DEFAULT_MAX_VISIBLE = 4;

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

  public isDropdown = false;

  public dropdownMessageStream = new Subject<SkyDropdownMessage>();

  #mediaQuerySubscription: Subscription | undefined;
  #actionClicks: Subscription[] = [];
  #changeDetector: ChangeDetectorRef;
  #mediaQueryService: SkyMediaQueryService;
  #viewportSvc: SkyAppViewportService;
  #ngUnsubscribe = new Subject<void>();
  #reservedSpace: SkyAppViewportReservedSpace | undefined;
  #isMobile = false;
  #maxVisible = DEFAULT_MAX_VISIBLE;

  constructor(
    changeDetector: ChangeDetectorRef,
    mediaQueryService: SkyMediaQueryService,
    viewportSvc: SkyAppViewportService
  ) {
    this.#changeDetector = changeDetector;
    this.#mediaQueryService = mediaQueryService;
    this.#viewportSvc = viewportSvc;
  }

  public ngAfterContentInit(): void {
    this.#viewportSvc.reservedSpaceChange
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((args) => {
        this.#reservedSpace = args.current;
        this.#checkAndUpdateChildrenType();
      });

    this.#mediaQuerySubscription = this.#mediaQueryService.subscribe(
      (args: SkyMediaBreakpoints) => {
        this.#isMobile = args === SkyMediaBreakpoints.xs;
        this.#checkAndUpdateChildrenType();
      }
    );

    this.secondaryActionComponents?.changes
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        this.#checkAndUpdateChildrenType();
      });

    if (this.#mediaQueryService.current === SkyMediaBreakpoints.xs) {
      this.#isMobile = true;
    }

    this.#checkAndUpdateChildrenType();
  }

  public ngOnDestroy(): void {
    this.#mediaQuerySubscription?.unsubscribe();

    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();

    this.#actionClicks.forEach((actionClick) => actionClick.unsubscribe());
  }

  #checkAndUpdateChildrenType(): void {
    /* istanbul ignore else */
    if (this.secondaryActionComponents) {
      let reservedWidth = 0;

      if (this.#reservedSpace) {
        reservedWidth = this.#reservedSpace.left + this.#reservedSpace.right;
      }

      this.#maxVisible =
        DEFAULT_MAX_VISIBLE - Math.ceil(reservedWidth / AVG_BTN_WIDTH);

      this.isDropdown =
        this.secondaryActionComponents.length > this.#maxVisible ||
        this.#isMobile;

      for (const action of this.secondaryActionComponents) {
        action.isDropdown = this.isDropdown;
        this.#actionClicks.push(
          action.actionClick.subscribe(() => {
            this.dropdownMessageStream.next({
              type: SkyDropdownMessageType.Close,
            });
          })
        );
      }
    } else {
      this.isDropdown = false;
    }

    this.#changeDetector.detectChanges();
  }
}
