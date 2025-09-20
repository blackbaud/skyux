import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';
import { SkyDropdownModule } from '@skyux/popovers';

@Component({
  selector: 'app-modal-footer-dropdown-modal',
  templateUrl: './modal-footer-dropdown-modal.component.html',
  styleUrls: ['./modal-footer-dropdown-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyModalModule, SkyDropdownModule],
})
export class ModalFooterDropdownModalComponent {
  protected readonly modalInstance = inject(SkyModalInstance);

  protected readonly dropdownItems = Array.from(
    { length: 10 },
    (_, i) => `Item ${i + 1}`,
  );
}
