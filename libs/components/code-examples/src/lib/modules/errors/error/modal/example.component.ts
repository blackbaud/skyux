import { Component, inject } from '@angular/core';
import { SkyErrorModalService } from '@skyux/errors';

@Component({
  standalone: true,
  selector: 'app-errors-error-modal-example',
  templateUrl: './example.component.html',
})
export class ErrorsErrorModalExampleComponent {
  readonly #errorSvc = inject(SkyErrorModalService);

  public openErrorModal(): void {
    this.#errorSvc.open({
      errorTitle: 'Something went wrong.',
      errorDescription: 'Close the modal, and come back later.',
      errorCloseText: 'Close',
    });
  }
}
