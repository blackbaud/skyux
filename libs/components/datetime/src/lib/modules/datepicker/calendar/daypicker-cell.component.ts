import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  SkyPopoverMessage,
  SkyPopoverMessageType,
  SkyPopoverModule,
} from '@skyux/popovers';

import { Subject } from 'rxjs';

import { SkyDatepickerCalendarInnerComponent } from './datepicker-calendar-inner.component';
import { SkyDatepickerCalendarService } from './datepicker-calendar.service';
import { SkyDayPickerButtonComponent } from './daypicker-button.component';
import { SkyDayPickerContext } from './daypicker-context';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SkyDayPickerButtonComponent, SkyPopoverModule],
  selector: 'sky-daypicker-cell',
  standalone: true,
  templateUrl: './daypicker-cell.component.html',
})
export class SkyDayPickerCellComponent {
  readonly #datepicker = inject(SkyDatepickerCalendarInnerComponent);
  readonly #calendarSvc = inject(SkyDatepickerCalendarService);

  /**
   * Whether the active date has been changed.
   */
  public activeDateHasChanged = input(false);

  /**
   * The date this picker cell will represent on the calendar.
   */
  public date = input<SkyDayPickerContext | undefined>();

  protected popoverController = new Subject<SkyPopoverMessage>();

  protected ariaLabel = computed(() => {
    const date = this.date();
    return date?.keyDateText?.join(', ') ?? '';
  });

  protected hasTooltip = computed(() => {
    const date = this.date();

    return (
      date &&
      date.keyDate &&
      date.keyDateText &&
      date.keyDateText.length > 0 &&
      date.keyDateText[0].length > 0
    );
  });

  constructor() {
    this.#calendarSvc.keyDatePopoverStream
      .pipe(takeUntilDestroyed())
      .subscribe((popoverDate) => {
        if (popoverDate?.uid !== this.date()?.uid) {
          this.#closePopover();
        }
      });

    effect(() => {
      const activeDateHasChanged = this.activeDateHasChanged();
      const hasTooltip = this.hasTooltip();
      const date = this.date();

      if (
        activeDateHasChanged &&
        hasTooltip &&
        this.#datepicker.isActive(date)
      ) {
        this.#openPopover();
      }
    });
  }

  protected onMouseenter(): void {
    this.#openPopover();
    this.#calendarSvc.keyDatePopoverStream.next(this.date());
  }

  protected onMouseleave(): void {
    this.#closePopover();
    this.#calendarSvc.keyDatePopoverStream.next(undefined);
  }

  #openPopover(): void {
    this.popoverController.next({ type: SkyPopoverMessageType.Open });
  }

  #closePopover(): void {
    this.popoverController.next({ type: SkyPopoverMessageType.Close });
  }
}
