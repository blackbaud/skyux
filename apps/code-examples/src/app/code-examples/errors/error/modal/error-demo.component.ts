import { Component } from '@angular/core';
import { ErrorModalConfig, SkyErrorModalService } from '@skyux/errors';

@Component({
  selector: 'app-error-demo',
  templateUrl: './error-demo.component.html',
  providers: [SkyErrorModalService],
})
export class ErrorDemoComponent {
  constructor(private errorService: SkyErrorModalService) {}

  public openErrorModal(): void {
    const config: ErrorModalConfig = {
      errorTitle: 'Something went wrong.',
      errorDescription: 'Close the modal, and come back later.',
      errorCloseText: 'Close',
    };
    this.errorService.open(config);
  }
}
