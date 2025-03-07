import { Component, inject } from '@angular/core';
import { SkyToastService, SkyToastType } from '@skyux/toast';

import { CustomToastContext } from './custom-context';
import { CustomToastComponent } from './custom-toast.component';

/**
 * @title Toast with custom content component
 */
@Component({
  standalone: true,
  selector: 'app-toast-custom-component-example',
  templateUrl: './example.component.html',
})
export class ToastCustomComponentExampleComponent {
  readonly #toastSvc = inject(SkyToastService);

  public openToast(): void {
    const context = new CustomToastContext(
      'This toast has embedded a custom component for its content.',
    );

    this.#toastSvc.openComponent(
      CustomToastComponent,
      {
        type: SkyToastType.Success,
      },
      [
        {
          provide: CustomToastContext,
          useValue: context,
        },
      ],
    );
  }

  public closeAll(): void {
    this.#toastSvc.closeAll();
  }
}
