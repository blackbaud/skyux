import { Component, ViewEncapsulation, inject } from '@angular/core';

import { SkyModalErrorsService } from './modal-errors.service';

/**
 * Specifies content to display in the modal's footer.
 */
@Component({
  selector: 'sky-modal-footer',
  templateUrl: './modal-footer.component.html',
  styleUrls: ['./modal-footer.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SkyModalFooterComponent {
  protected errorsSvc = inject(SkyModalErrorsService);
}
