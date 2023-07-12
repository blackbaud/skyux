import { Component, ViewEncapsulation, inject } from '@angular/core';

import { SkyModalComponentAdapterService } from './modal-component-adapter.service';
import { SkyModalError } from './modal-error';

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
  public formErrors: SkyModalError[] | undefined;

  #adapterSvc = inject(SkyModalComponentAdapterService);

  constructor() {
    this.#adapterSvc.formErrors.subscribe((errors) => {
      this.formErrors = errors;
    });
  }
}
