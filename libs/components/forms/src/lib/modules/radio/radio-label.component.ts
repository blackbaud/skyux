import { Component, HostListener, inject } from '@angular/core';
import { SkyLogService } from '@skyux/core';

/**
 * Specifies a label for the radio button. To display a help button beside the label, include a help button element,
 * such as `sky-help-inline`, in the `sky-radio-label` element and a `sky-control-help` CSS class on that help button
 * element.
 * @deprecated Use `labelText` input on `sky-radio-component` instead.
 */
@Component({
  selector: 'sky-radio-label',
  templateUrl: './radio-label.component.html',
  standalone: false,
})
export class SkyRadioLabelComponent {
  // When clicking on a checkbox label, Angular registers two click events.
  // This handler ignores all events except for those that deal
  // with the checkbox input explicitly.
  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  constructor() {
    inject(SkyLogService).deprecated('SkyToggleSwitchLabelComponent', {
      deprecationMajorVersion: 10,
      replacementRecommendation:
        'To add a label to radio button, use the `labelText` input on the radio button component instead.',
    });
  }
}
