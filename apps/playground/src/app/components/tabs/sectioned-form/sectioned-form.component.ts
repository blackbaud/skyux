import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyModalModule, SkyModalService } from '@skyux/modals';

import { SectionedFormModalComponent } from './sectioned-form-modal.component';

@Component({
  selector: 'app-sectioned-form',
  templateUrl: './sectioned-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SkyModalModule],
})
export class SectionedFormComponent {
  #modalService: SkyModalService;

  constructor(modalService: SkyModalService) {
    this.#modalService = modalService;
  }

  public openSectionedForm(): void {
    this.#modalService.open(SectionedFormModalComponent);
  }
}
