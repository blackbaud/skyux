import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

/**
 * Allows interaction with a SKY UX datepicker component.
 */
export class SkyDatepickerFixture {
  private debugEl: DebugElement;

  constructor(fixture: ComponentFixture<any>, skyTestId: string) {
    this.debugEl = SkyAppTestUtility.getDebugElementByTestId(
      fixture,
      skyTestId,
      'sky-datepicker'
    );
  }

  /**
   * The datepicker's currently selected date.
   */
  public get date(): string {
    return this.getDatepickerInputEl().nativeElement.value;
  }

  /**
   * Flag indicating if datepicker input is disabled.
   */
  public get disabled(): boolean {
    return this.getDatepickerInputEl().nativeElement.disabled;
  }

  /**
   * The datepicker's calendar element.
   */
  public get calendarEl(): any {
    const button = this.debugEl.query(
      By.css('.sky-datepicker .sky-input-group-datepicker-btn')
    ).nativeElement;

    const calendarId = button.getAttribute('aria-controls');
    if (!calendarId) {
      /* tslint:disable-next-line:no-null-keyword */
      return null;
    }

    return document.getElementById(calendarId);
  }

  /**
   * Click the calendar button to open or close calendar.
   */
  public clickDatepickerCalenderButtonEl(): void {
    this.debugEl
      .query(By.css('.sky-datepicker .sky-input-group-datepicker-btn'))
      .nativeElement.click();
  }

  public clickDayEl(dayIndex: number): void {
    const dayEls = this.calendarEl.querySelectorAll('.sky-datepicker-btn-date');

    const dayEl = dayEls[dayIndex];

    if (!dayEl) {
      throw new Error(`No day exists at index ${dayIndex}.`);
    }

    dayEl.click();
  }

  private getDatepickerInputEl(): DebugElement {
    return this.debugEl.query(By.css('.sky-datepicker input'));
  }
}
