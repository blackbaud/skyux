import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

/**
 * Allows interaction with a SKY UX timepicker component.
 * @internal
 */
export class SkyTimepickerFixture {
  #debugEl: DebugElement;
  #fixture: ComponentFixture<any>;

  constructor(fixture: ComponentFixture<any>, skyTestId: string) {
    this.#fixture = fixture;
    this.#debugEl = SkyAppTestUtility.getDebugElementByTestId(
      fixture,
      skyTestId,
      'sky-timepicker',
    );
  }

  /**
   * The timepicker's currently selected time.
   */
  public get value(): string {
    return this.#getTimepickerInputEl().nativeElement.value;
  }

  /**
   * Set the timepicker's selected time.
   */
  public set value(value: string) {
    const timepickerInputEl = this.#getTimepickerInputEl().nativeElement;
    timepickerInputEl.value = value;
    this.#fixture.detectChanges();

    SkyAppTestUtility.fireDomEvent(timepickerInputEl, 'change');
    this.#fixture.detectChanges();
  }

  /**
   * Flag indicating if timepicker input is disabled.
   */
  public get isDisabled(): boolean {
    return this.#getTimepickerInputEl().nativeElement.disabled;
  }

  /**
   * Set the timepicker's disabled value
   */
  public set isDisabled(value: boolean) {
    this.#getTimepickerInputEl().nativeElement.disabled = value;
  }

  /**
   * Flag indicating if timepicker input is valid.
   */
  public get isValid(): boolean {
    return !this.#getTimepickerInputEl().nativeElement.classList.contains(
      'ng-invalid',
    );
  }

  #getTimepickerInputEl(): DebugElement {
    return this.#debugEl.query(By.css('.sky-timepicker input'));
  }
}
