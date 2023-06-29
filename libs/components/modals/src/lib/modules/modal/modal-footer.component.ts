import { Component, Input, ViewEncapsulation } from '@angular/core';

/**
 * Specifies content to display in the modal's footer.
 */
@Component({
  selector: 'sky-modal-footer',
  templateUrl: './modal-footer.component.html',
  styleUrls: ['./modal-footer.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SkyModalFooterComponent {
  /**
   * A collection of error messages to be displayed to the user in the event of a form error.
   * Values assigned here will be displayed following [SKY UX style guidelines](https://developer.blackbaud.com/skyux/design/guidelines/form-design#validation-and-error-handling).
   */
  @Input()
  public errors: string[] | undefined;
}
