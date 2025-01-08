import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyToggleSwitchModule } from '@skyux/forms';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-modal-dirt',
  templateUrl: './modal-dirty.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, SkyModalModule, SkyToggleSwitchModule],
})
export class ModalDirtyComponent {
  public isDirty = true;

  readonly #modalInstance: SkyModalInstance;

  constructor(modalInstance: SkyModalInstance) {
    this.#modalInstance = modalInstance;
  }

  public save(): void {
    this.#modalInstance.save();
  }

  public cancel(): void {
    this.#modalInstance.cancel();
  }
}
