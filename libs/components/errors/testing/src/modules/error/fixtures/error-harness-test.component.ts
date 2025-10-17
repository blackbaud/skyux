import { Component } from '@angular/core';
import { SkyErrorModule, SkyErrorType } from '@skyux/errors';

@Component({
  selector: 'sky-error-fixture',
  templateUrl: './error-harness-test.component.html',
  imports: [SkyErrorModule],
})
export class ErrorHarnessTestComponent {
  public errorType: SkyErrorType | undefined = 'broken';

  public customAction(): void {
    alert('action clicked!');
  }
}
