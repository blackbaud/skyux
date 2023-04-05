import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { SkyModalInstance } from '@skyux/modals';

@Component({
  selector: 'app-modal-wait-modal',
  templateUrl: './modal-wait-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalWaitModalComponent {
  public isWaiting = false;

  #changeDetector = inject(ChangeDetectorRef);

  constructor(public modalInstance: SkyModalInstance) {}

  public triggerWait(): void {
    this.isWaiting = true;
    setTimeout(
      /* istanbul ignore next */ () => {
        this.isWaiting = false;
        this.#changeDetector.markForCheck();
      },
      5000
    );
  }
}
