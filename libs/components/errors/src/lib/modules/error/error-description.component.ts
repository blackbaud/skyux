import { Component, Input } from '@angular/core';

import { SkyErrorService } from './error.service';

/**
 * Specifies a description to provide additional details about the error.
 */
@Component({
  selector: 'sky-error-description',
  template: '<ng-content />',
  standalone: false,
})
export class SkyErrorDescriptionComponent {
  /**
   * Whether to replace the default description. If `false`, the content
   * from this component is added after the default description.
   * @default false
   */
  @Input()
  public set replaceDefaultDescription(value: boolean | undefined) {
    this.#errorSvc.replaceDefaultDescription.next(!!value);
  }

  #errorSvc: SkyErrorService;

  constructor(errorSvc: SkyErrorService) {
    this.#errorSvc = errorSvc;
    errorSvc.replaceDefaultDescription.next(false);
  }
}
