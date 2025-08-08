import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

/**
 * Allows interaction with a SKY UX checkbox component.
 * @internal
 * @deprecated Use `SkyCheckboxHarness` instead.
 */
export class SkyCheckboxFixture {
  #debugEl: DebugElement;

  constructor(fixture: ComponentFixture<any>, skyTestId: string) {
    this.#debugEl = SkyAppTestUtility.getDebugElementByTestId(
      fixture,
      skyTestId,
      'sky-checkbox',
    );
  }

  /**
   * A flag indicating whether the checkbox is currently selected.
   */
  public get selected(): boolean {
    return this.#getCheckboxInputEl().nativeElement.checked;
  }

  /**
   * The checkbox's label
   */
  public get labelText(): string | undefined {
    return SkyAppTestUtility.getText(
      this.#debugEl.query(By.css('label.sky-checkbox-wrapper')),
    );
  }

  /**
   * The checkbox's icon type
   */
  public get iconType(): string | undefined {
    const svgElement = this.#debugEl.query(By.css('sky-icon svg'));

    if (svgElement) {
      return svgElement.nativeElement.getAttribute('data-sky-icon');
    }

    return undefined;
  }

  /**
   * The checkbox's type.
   */
  public get checkboxType(): string | undefined {
    const classList = this.#getCheckboxBoxEl().nativeElement.classList;

    if (classList.contains('sky-switch-control-danger')) {
      return 'danger';
    }

    if (classList.contains('sky-switch-control-info')) {
      return 'info';
    }

    if (classList.contains('sky-switch-control-success')) {
      return 'success';
    }

    if (classList.contains('sky-switch-control-warning')) {
      return 'warning';
    }

    return undefined;
  }

  /**
   * A flag indicating whether the checkbox is currently disabled.
   */
  public get disabled(): boolean {
    return this.#getCheckboxInputEl().nativeElement.disabled;
  }

  /**
   * Selects the checkbox.
   */
  public select(): void {
    if (!this.selected) {
      this.#clickCheckboxLabelEl();
    }
  }

  /**
   * Deselects the checkbox.
   */
  public deselect(): void {
    if (this.selected) {
      this.#clickCheckboxLabelEl();
    }
  }

  #clickCheckboxLabelEl(): void {
    this.#debugEl
      .query(By.css('label.sky-checkbox-wrapper'))
      .nativeElement.click();
  }

  #getCheckboxInputEl(): DebugElement {
    return this.#debugEl.query(By.css('.sky-checkbox-wrapper input'));
  }

  #getCheckboxBoxEl(): DebugElement {
    return this.#debugEl.query(By.css('label.sky-checkbox-wrapper span'));
  }
}
