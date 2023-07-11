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
   * A list of error messages to be shown above the modal footer buttons.
   */
  @Input()
  public errors: string[] | undefined;
}
