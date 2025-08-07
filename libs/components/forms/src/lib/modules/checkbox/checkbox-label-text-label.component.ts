import { Component, Input } from '@angular/core';

/**
@internal
 */
@Component({
  selector: 'sky-checkbox-label-text-label',
  styleUrls: [
    './checkbox-label-text-label.default.component.scss',
    './checkbox-label-text-label.modern.component.scss',
  ],
  templateUrl: './checkbox-label-text-label.component.html',
  standalone: false,
})
export class SkyCheckboxLabelTextLabelComponent {
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
