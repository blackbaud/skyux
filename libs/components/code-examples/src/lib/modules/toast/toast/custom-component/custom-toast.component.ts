import { Component, inject } from '@angular/core';
import { SkyToastInstance } from '@skyux/toast';

import { CustomToastContext } from './custom-context';

@Component({
  selector: 'app-toast-content-example',
  templateUrl: './custom-toast.component.html',
})
export class CustomToastComponent {
  protected readonly context = inject(CustomToastContext);
  readonly #instance = inject(SkyToastInstance);

  protected close(): void {
    this.#instance.close();
  }
}
