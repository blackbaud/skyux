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

  protected ariaLabel = computed(() => {
    return this.date()?.keyDateText?.join(', ') ?? '';
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

  protected popoverController = new Subject<SkyPopoverMessage>();

  constructor() {
    this.#calendarSvc.keyDatePopoverStream
      .pipe(takeUntilDestroyed())
      .subscribe((popoverDate) => {
        if (!popoverDate || popoverDate?.uid !== this.date()?.uid) {
          this.#hideTooltip();
        }
      });

    effect(() => {
      const activeDateHasChanged = this.activeDateHasChanged();
      const hasTooltip = this.hasTooltip();
      const date = this.date();

      if (
        date &&
        activeDateHasChanged &&
        hasTooltip &&
        this.#datepicker.isActive(date)
      ) {
        this.#showTooltip();
      }
    });
  }

  protected onDayMouseenter(): void {
    if (this.hasTooltip()) {
      this.#showTooltip();
      this.#calendarSvc.keyDatePopoverStream.next(this.date());
    }
  }

  protected onDayMouseleave(): void {
    if (this.hasTooltip()) {
      this.#hideTooltip();
      this.#calendarSvc.keyDatePopoverStream.next(undefined);
    }
  }

  #hideTooltip(): void {
    this.popoverController.next({ type: SkyPopoverMessageType.Close });
  }

  #showTooltip(): void {
    this.popoverController.next({ type: SkyPopoverMessageType.Open });
  }
}
