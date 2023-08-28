import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { SkyWaitModule } from '@skyux/indicators';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  standalone: true,
  selector: 'app-modal-wait-modal',
  templateUrl: './modal-wait-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SkyModalModule, SkyWaitModule],
})
export class ModalWaitModalComponent {
  public isWaiting = false;

  public readonly modalInstance = inject(SkyModalInstance);
  readonly #changeDetector = inject(ChangeDetectorRef);

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
