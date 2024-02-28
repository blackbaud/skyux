import { Component, Input } from '@angular/core';

/**
@internal
 */
@Component({
  selector: 'sky-checkbox-label-text-label',
  templateUrl: './checkbox-label-text-label.component.html',
})
export class SkyCheckboxLabelTextLabelComponent {
  @Input()
  public labelHidden = false;
}
