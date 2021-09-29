import {
  Component
} from '@angular/core';

import {
  SkyErrorType
} from '../error-type';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: 'error.component.fixture.html'
})
export class ErrorTestComponent {

  public buttonText: string = 'Try again';

  public customDescription: string = 'custom description value';

  public customImage: string = 'custom image value';

  public customTitle: string = 'custom title value';

  public errorType: SkyErrorType = 'broken';

  public replaceDefaultDescription: boolean = false;

  public replaceDefaultTitle: boolean = false;

  public showImage: boolean = true;

  /* istanbul ignore next */
  public customAction(): void {
    console.log('custom action happened');
  }

}
