import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { SectionedFormModalComponent } from './sectioned-form-modal.component';

@Component({
  selector: 'app-sectioned-form',
  templateUrl: './sectioned-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SectionedFormComponent {
  #modalService: SkyModalService;

  constructor(modalService: SkyModalService) {
    this.#modalService = modalService;
  }

  public openSectionedForm(size: 'small' | 'medium' | 'large'): void {
    this.#modalService.open(SectionedFormModalComponent, {
      size,
    });
  }
}
