import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { SectionedFormModalComponent } from './sectioned-form-modal.component';

@Component({
  selector: 'app-sectioned-form',
  templateUrl: './sectioned-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SectionedFormComponent {
  readonly #modalService = inject(SkyModalService);

  public openSectionedForm(size: 'small' | 'medium' | 'large'): void {
    this.#modalService.open(SectionedFormModalComponent, {
      size,
    });
  }
}
