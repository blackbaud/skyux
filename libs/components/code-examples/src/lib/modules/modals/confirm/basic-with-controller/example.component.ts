import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyButton } from '@skyux/forms';
import { SkyConfirmService } from '@skyux/modals';

/**
 * @title Confirm, tested with controller
 */
@Component({
  selector: 'app-modals-confirm-basic-with-controller-example',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SkyButton],
  template: `<sky-button
    ariaHasPopup="dialog"
    labelText="Open confirm"
    (buttonClick)="launchConfirm()"
  />`,
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
