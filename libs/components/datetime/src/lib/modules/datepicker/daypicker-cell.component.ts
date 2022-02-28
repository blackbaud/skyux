import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { SkyPopoverMessage, SkyPopoverMessageType } from '@skyux/popovers';

import { takeUntil } from 'rxjs/operators';

import { Subject } from 'rxjs';

import { SkyDatepickerCalendarInnerComponent } from './datepicker-calendar-inner.component';

import { SkyDatepickerDate } from './datepicker-date';

import { SkyDatepickerService } from './datepicker.service';

/**
 * @internal
 */
@Component({
  selector: 'sky-daypicker-cell',
  templateUrl: 'daypicker-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDayPickerCellComponent implements OnInit, OnDestroy {
  /**
   * Specifies if the active date has been changed.
   */
  @Input()
  public activeDateHasChanged: boolean;

  /**
   * Specifies the date this picker cell will represent on the calendar.
   */
  @Input()
  public date: SkyDatepickerDate;

  public hasTooltip = false;

  public popoverController = new Subject<SkyPopoverMessage>();

  private activeUid = '';

  private cancelPopover = false;

  private popoverOpen = false;

  private ngUnsubscribe = new Subject<void>();

  public constructor(
    private datepicker: SkyDatepickerCalendarInnerComponent,
    private datepickerService: SkyDatepickerService
  ) {}

  public ngOnInit(): void {
    this.hasTooltip =
      this.date.keyDate &&
      this.date.keyDateText &&
      this.date.keyDateText.length > 0 &&
      this.date.keyDateText[0].length > 0;

    // show the tooltip if this is the active date and is not the
    // initial active date (activeDateHasChanged)
    if (
      this.datepicker.isActive(this.date) &&
      this.activeDateHasChanged &&
      this.hasTooltip
    ) {
      this.activeUid = this.date.uid;
      this.showTooltip();
    }

    if (this.hasTooltip) {
      this.datepickerService.keyDatePopoverStream
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((date) => {
          if (date) {
            this.activeUid = date.uid;
          } else {
            this.activeUid = '';
          }
          // If this day has an open popover and they have moved off of the day close the popover.
          if (this.date.uid !== this.activeUid) {
            this.hideTooltip();
          }
        });
    }
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public onDayMouseenter(): void {
    this.cancelPopover = false;
    if (this.hasTooltip) {
      this.showTooltip();
      this.datepickerService.keyDatePopoverStream.next(this.date);
    }
  }

  public onDayMouseleave(): void {
    this.cancelPopover = true;
    if (this.hasTooltip) {
      this.hideTooltip();
    }
    this.datepickerService.keyDatePopoverStream.next(undefined);
  }

  public onPopoverClosed(): void {
    this.popoverOpen = false;
  }

  public onPopoverOpened(): void {
    this.popoverOpen = true;
    /* istanbul ignore else */
    if (this.cancelPopover) {
      // If the popover gets opened just as a mouseout event happens, close it.
      this.hideTooltip();
      this.cancelPopover = false;
    }
  }

  public getKeyDateLabel(): string {
    if (this.hasTooltip) {
      return this.date.keyDateText.join(', ');
    } else {
      return '';
    }
  }

  private hideTooltip(): void {
    /* istanbul ignore else */
    if (this.popoverOpen) {
      this.popoverController.next({ type: SkyPopoverMessageType.Close });
    }
  }

  private showTooltip(): void {
    /* istanbul ignore else */
    if (this.hasTooltip && !this.popoverOpen) {
      /**
       * Delay 1/2 second before opening the popover as long as mouse hasn't moved off the date.
       */
      setTimeout(() => {
        if (!this.cancelPopover && this.activeUid === this.date.uid) {
          this.popoverController.next({ type: SkyPopoverMessageType.Open });
        }
      }, 500);
    }
  }
}
