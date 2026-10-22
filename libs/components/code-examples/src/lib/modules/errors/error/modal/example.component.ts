import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyErrorModalService } from '@skyux/errors';
import { SkyButton } from '@skyux/forms';

/**
 * @title Show an error inside a modal
 */
@Component({
  selector: 'app-errors-error-modal-example',
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './example.component.html',
  imports: [SkyButton],
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
