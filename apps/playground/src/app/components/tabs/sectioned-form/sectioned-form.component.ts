import { ChangeDetectionStrategy, Component } from '@angular/core';
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
  #modalService: SkyModalService;

  constructor(modalService: SkyModalService) {
    this.#modalService = modalService;
  }

  public openSectionedForm(): void {
    this.#modalService.open(SectionedFormModalComponent, { size: 'large' });
  }

  public openSectionedFormWithColumns(): void {
    this.#modalService.open(SectionedFormModalWithColumnsComponent, {
      size: 'large',
    });
  }
}
