import { Component, Input } from '@angular/core';

/**
 * Specifies a description to provide additional details about the error.
 */
@Component({
  selector: 'sky-error-description',
  template: '<ng-content></ng-content>',
})
export class SkyErrorDescriptionComponent {
  /**
   * Indicates whether to replace the default description. If `false`, the content
   * from this component is added after the default description.
   * @default false
   */
  @Input()
  public replaceDefaultDescription = false;
}
