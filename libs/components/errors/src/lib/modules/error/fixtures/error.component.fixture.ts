import { Component } from '@angular/core';

import { ErrorModalConfig } from '../error-modal-config';
import { SkyErrorModalService } from '../error-modal.service';
import { SkyErrorType } from '../error-type';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: 'error.component.fixture.html',
})
export class ErrorTestComponent {
  public buttonText = 'Try again';

  public customDescription = 'custom description value';

  public customImage = 'custom image value';

  public customTitle = 'custom title value';

  public errorType: SkyErrorType | undefined = 'broken';

  public replaceDefaultDescription = false;

  public replaceDefaultTitle = false;

  public showImage = true;

  #errorModalSvc: SkyErrorModalService;

  constructor(errorModalSvc: SkyErrorModalService) {
    this.#errorModalSvc = errorModalSvc;
  }

  /* istanbul ignore next */
  public customAction(): void {
    console.log('custom action happened');
  }

  public openErrorModal(config: ErrorModalConfig): void {
    this.#errorModalSvc.open(config);
  }
}
