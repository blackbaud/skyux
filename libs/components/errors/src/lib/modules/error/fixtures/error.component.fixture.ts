import { Component } from '@angular/core';

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

  public errorType: SkyErrorType = 'broken';

  public replaceDefaultDescription = false;

  public replaceDefaultTitle = false;

  public showImage = true;

  /* istanbul ignore next */
  public customAction(): void {
    console.log('custom action happened');
  }
}
