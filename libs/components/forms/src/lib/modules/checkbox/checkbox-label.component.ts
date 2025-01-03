import { Component } from '@angular/core';

/**
 * Specifies a label for the checkbox. To display a help button beside the label, include a help button element, such as
 * `sky-help-inline`, in the `sky-checkbox-label` element and a `sky-control-help` CSS class on that help button
 * element.
 * @deprecated Use `labelText` input on `sky-checkbox-component` instead.
 */
@Component({
  selector: 'sky-checkbox-label',
  templateUrl: './checkbox-label.component.html',
  standalone: false,
})
export class SkyCheckboxLabelComponent {}
