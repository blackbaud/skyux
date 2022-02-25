import { Component, HostListener } from '@angular/core';

/**
 * Specifies a label for the radio button.
 */
@Component({
  selector: 'sky-radio-label',
  templateUrl: './radio-label.component.html',
})
export class SkyRadioLabelComponent {
  // When clicking on a checkbox label, Angular registers two click events.
  // This handler ignores all events except for those that deal
  // with the checkbox input explicitly.
  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
