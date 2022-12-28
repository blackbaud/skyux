import { Component, Input } from '@angular/core';

import { SkyErrorService } from './error.service';

/**
 * A title to display with the error message.
 */
@Component({
  selector: 'sky-error-title',
  template: '<ng-content></ng-content>',
})
export class SkyErrorTitleComponent {
  /**
   * Whether to replace the default title. If `false`, the content
   * from this component is added after the default title.
   * @default false
   */
  @Input()
  public set replaceDefaultTitle(value: boolean | undefined) {
    this.#errorSvc.replaceDefaultTitle.next(!!value);
  }

  #errorSvc: SkyErrorService;

  constructor(errorSvc: SkyErrorService) {
    this.#errorSvc = errorSvc;
    errorSvc.replaceDefaultTitle.next(false);
  }
}
