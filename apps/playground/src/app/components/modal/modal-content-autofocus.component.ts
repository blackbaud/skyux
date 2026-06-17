import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-test-cmp-modal-autofocus',
  templateUrl: './modal-content-autofocus.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SkyModalModule],
})
export class ModalContentAutofocusComponent {
  public readonly instance = inject(SkyModalInstance);
}
