import { Component, Input } from '@angular/core';

/**
@internal
 */
@Component({
  selector: 'sky-radio-label-text-label',
  templateUrl: './radio-label-text-label.component.html',
})
export class SkyRadioLabelTextLabelComponent {
  @Input()
  public labelHidden = false;

  @Input()
  public set labelText(value: string) {
    this.#_labelText = value.trim();
  }

  public get labelText(): string {
    return this.#_labelText;
  }

  #_labelText = '';
}
