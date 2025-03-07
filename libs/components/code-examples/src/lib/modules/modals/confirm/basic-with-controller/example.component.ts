import { Component, inject } from '@angular/core';
import { SkyConfirmService } from '@skyux/modals';

/**
 * @title Confirm, tested with controller
 */
@Component({
  selector: 'app-modals-confirm-basic-with-controller-example',
  standalone: true,
  template: `<button
    aria-haspopup="dialog"
    class="sky-btn sky-btn-default"
    type="button"
    (click)="launchConfirm()"
  >
    Open confirm
  </button>`,
})
export class ModalsConfirmBasicWithControllerExampleComponent {
  public selectedAction: string | undefined;

  readonly #confirmSvc = inject(SkyConfirmService);

  public launchConfirm(): void {
    const dialog = this.#confirmSvc.open({
      message: 'Are you sure?',
    });

    dialog.closed.subscribe((args) => {
      this.selectedAction = args.action;
    });
  }
}
