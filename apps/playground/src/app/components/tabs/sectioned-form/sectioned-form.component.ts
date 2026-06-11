import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyModalModule, SkyModalService } from '@skyux/modals';

import { SectionedFormModalWithColumnsComponent } from './sectioned-form-modal-with-columns.component';
import { SectionedFormModalComponent } from './sectioned-form-modal.component';

@Component({
  selector: 'app-sectioned-form',
  templateUrl: './sectioned-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyModalModule],
})
export default class SectionedFormComponent {
  readonly #modalService = inject(SkyModalService);

  public openSectionedForm(): void {
    this.#modalService.open(SectionedFormModalComponent, { size: 'large' });
  }

  public openSectionedFormWithColumns(): void {
    this.#modalService.open(SectionedFormModalWithColumnsComponent, {
      size: 'large',
    });
  }
}
