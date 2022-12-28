import { Component, HostListener } from '@angular/core';

/**
 * A label for the radio button. To display a help button beside the label, include a help button element,
 * such as `sky-help-inline`, in the `sky-radio-label` element and a `sky-control-help` CSS class on that help button
 * element.
 */
@Component({
  selector: 'sky-radio-label',
  templateUrl: './radio-label.component.html',
  styleUrls: ['./radio-label.component.scss'],
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
