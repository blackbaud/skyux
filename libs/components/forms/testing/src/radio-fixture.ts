import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

/**
 * Allows interaction with a SKY UX radio buttons within a radio group.
 */
export class SkyRadioFixture {
  private debugEl: DebugElement;

  constructor(
    private fixture: ComponentFixture<any>,
    private skyTestId: string
  ) {
    this.debugEl = SkyAppTestUtility.getDebugElementByTestId(
      this.fixture,
      this.skyTestId,
      'sky-radio-group'
    );
  }

  /**
   * The selected radio button value.
   */
  public get value(): string {
    const selectedRadio = this.debugEl.query(By.css('sky-radio input:checked'));
    const selectedValue = selectedRadio && selectedRadio.nativeElement.value;

    return selectedValue;
  }

  /**
   * Set the selected radio button value.
   */
  public set value(value: string) {
    const allRadioInputs = this.getAllRadioInputEls();

    allRadioInputs.forEach((input, index) => {
      if (input.nativeElement.value === value) {
        input.nativeElement.checked = true;
      } else {
        input.nativeElement.checked = false;
      }
    });
  }

  /**
   * A flag indicating if every radio button in the radio group is disabled.
   */
  public get disabled(): boolean {
    const allRadioButtons = this.getAllSkyRadioButtonEls();

    for (let i = 0; i < allRadioButtons.length; i++) {
      if (!this.radioButtonDisabled(i)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Set the disabled value for all radio buttons.
   */
  public set disabled(value: boolean) {
    const allRadioButtons = this.getAllSkyRadioButtonEls();

    allRadioButtons.forEach((button, index) => {
      this.setRadioButtonDisabled(index, value);
    });
  }

  private getAllSkyRadioButtonEls(): DebugElement[] {
    return this.debugEl.queryAll(By.css('.sky-radio-group sky-radio'));
  }

  private getAllRadioInputEls(): DebugElement[] {
    return this.debugEl.queryAll(By.css('.sky-radio-group sky-radio input'));
  }

  private getRadioButtonInputEl(index: number): DebugElement {
    const allRadioInputs = this.getAllRadioInputEls();

    if (allRadioInputs && allRadioInputs[index]) {
      return allRadioInputs[index];
    }
  }

  private radioButtonDisabled(index: number): boolean {
    const radioButton = this.getRadioButtonInputEl(index);

    return radioButton && radioButton.nativeElement.disabled;
  }

  private setRadioButtonDisabled(index: number, value: boolean): void {
    const radioButton = this.getRadioButtonInputEl(index);

    /* istanbul ignore else */
    if (radioButton) {
      radioButton.nativeElement.disabled = value;

      this.fixture.detectChanges();
    }
  }
}
