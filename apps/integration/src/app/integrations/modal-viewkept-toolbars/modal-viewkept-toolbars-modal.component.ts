import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyModalInstance } from '@skyux/modals';

@Component({
  selector: 'app-modal-viewkept-toolbars-modal',
  templateUrl: './modal-viewkept-toolbars-modal.component.html',
  styleUrls: ['./modal-viewkept-toolbars-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalViewkeptToolbarsModalComponent {
  constructor(public modalInstance: SkyModalInstance) {}
}
