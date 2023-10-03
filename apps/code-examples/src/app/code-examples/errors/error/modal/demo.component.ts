import { Component, inject } from '@angular/core';
import { SkyErrorModalService } from '@skyux/errors';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
})
export class DemoComponent {
  readonly #errorSvc = inject(SkyErrorModalService);

  public openErrorModal(): void {
    this.#errorSvc.open({
      errorTitle: 'Something went wrong.',
      errorDescription: 'Close the modal, and come back later.',
      errorCloseText: 'Close',
    });
  }
}
