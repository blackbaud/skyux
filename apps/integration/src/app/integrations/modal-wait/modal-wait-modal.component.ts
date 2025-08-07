import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { SkyWaitModule } from '@skyux/indicators';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-modal-wait-modal',
  templateUrl: './modal-wait-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyModalModule, SkyWaitModule],
})
export class ModalWaitModalComponent {
  protected isWaiting = false;

  protected readonly modalInstance = inject(SkyModalInstance);
  readonly #changeDetector = inject(ChangeDetectorRef);

  protected triggerWait(): void {
    this.isWaiting = true;
    setTimeout(
      /* istanbul ignore next */ () => {
        this.isWaiting = false;
        this.#changeDetector.markForCheck();
      },
      5000,
    );
  }
}
