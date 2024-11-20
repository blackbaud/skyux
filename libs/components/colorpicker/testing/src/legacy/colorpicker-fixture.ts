import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

/**
 * Allows interaction with a SKY UX colorpicker component.
 * @deprecated Use `SkyColorpickerHarness` instead.
 * @internal
 */
export class SkyColorpickerFixture {
  #debugEl: DebugElement;
  #fixture: ComponentFixture<unknown>;

  constructor(fixture: ComponentFixture<unknown>, skyTestId: string) {
    this.#fixture = fixture;
    this.#debugEl = SkyAppTestUtility.getDebugElementByTestId(
      fixture,
      skyTestId,
      'sky-colorpicker',
    );
  }

  /**
   * The colorpicker's currently selected color formatted to the `outputFormat`.
   */
  public get value(): string {
    return this.#getColorpickerInputEl().nativeElement.value;
  }

  /**
   * Set the colorpicker's color hex code.
   * @param hexValue The new color hex code. Must include '#'.
   */
  public async setValueFromHex(hexValue: string): Promise<void> {
    await this.#clickColorpickerButtonEl();

    const hexInput = document.querySelector(
      'input[id^=sky-colorpicker-hex-]',
    ) as HTMLInputElement;

    hexInput.value = hexValue;
    SkyAppTestUtility.fireDomEvent(hexInput, 'input');

    await this.#clickColorpickerApplyButtonEl();
    await this.#fixture.whenStable();
  }

  /**
   * Set the colorpicker's color RGB values.
   * @param red The red color value.
   * @param green The green color value.
   * @param blue The blue color value.
   * @param alpha The alpha channel value.
   */
  public async setValueFromRGBA(
    red: number,
    green: number,
    blue: number,
    alpha: number,
  ): Promise<void> {
    await this.#clickColorpickerButtonEl();

    const rInput = document.querySelector(
      'input[id^=sky-colorpicker-red-]',
    ) as HTMLInputElement;
    const gInput = document.querySelector(
      'input[id^=sky-colorpicker-green-]',
    ) as HTMLInputElement;
    const bInput = document.querySelector(
      'input[id^=sky-colorpicker-blue-]',
    ) as HTMLInputElement;
    const aInput = document.querySelector(
      'input[id^=sky-colorpicker-alpha-]',
    ) as HTMLInputElement;

    rInput.value = red.toString();
    gInput.value = green.toString();
    bInput.value = blue.toString();
    aInput.value = alpha.toString();

    SkyAppTestUtility.fireDomEvent(rInput, 'input');
    SkyAppTestUtility.fireDomEvent(gInput, 'input');
    SkyAppTestUtility.fireDomEvent(bInput, 'input');
    SkyAppTestUtility.fireDomEvent(aInput, 'input');

    await this.#clickColorpickerApplyButtonEl();

    await this.#fixture.whenStable();
  }

  /**
   * Set the colorpicker's color to the provided preset color at the given index.
   * @param presetIndex The index of the color in the `presetColors` list to select.
   */
  public async setValueFromPresets(presetIndex: number): Promise<void> {
    await this.#clickColorpickerButtonEl();

    const presetColors = document.querySelectorAll(
      '.sky-colorpicker-preset-color-area button',
    );
    const presetColor =
      presetColors && (presetColors[presetIndex] as HTMLButtonElement);

    if (presetColor) {
      presetColor.click();
      this.#fixture.detectChanges();
    }

    await this.#clickColorpickerApplyButtonEl();

    await this.#fixture.whenStable();
  }

  async #clickColorpickerButtonEl(): Promise<void> {
    const colorpickerButton = this.#debugEl.query(
      By.css('sky-colorpicker button'),
    ).nativeElement;

    colorpickerButton.click();

    this.#fixture.detectChanges();

    await this.#fixture.whenStable();
  }

  async #clickColorpickerApplyButtonEl(): Promise<void> {
    const applyButton = document.querySelector(
      '.sky-btn-colorpicker-apply',
    ) as HTMLButtonElement;

    applyButton.click();

    this.#fixture.detectChanges();

    await this.#fixture.whenStable();
  }

  #getColorpickerInputEl(): DebugElement {
    return this.#debugEl.query(By.css('sky-colorpicker input'));
  }
}
