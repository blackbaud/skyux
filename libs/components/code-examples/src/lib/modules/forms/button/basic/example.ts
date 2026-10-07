import { Component, inject } from '@angular/core';
import { SkyButton } from '@skyux/forms';
import { SkyConfirmService, SkyConfirmType } from '@skyux/modals';

/**
 * @title Button with basic setup
 */
@Component({
  selector: 'app-forms-button-example',
  templateUrl: 'example.html',
  imports: [SkyButton],
})
export class FormsButtonExample {
  readonly #confirmSvc = inject(SkyConfirmService);

  protected buttonClick(): void {
    this.#confirmSvc.open({
      message: 'You clicked the simple button!',
      type: SkyConfirmType.OK,
    });
  }
}
