import { Component, inject } from '@angular/core';
import { SkyToastService, SkyToastType } from '@skyux/toast';

import { CustomToastContext } from './custom-context';
import { CustomToastComponent } from './custom-toast.component';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
})
export class DemoComponent {
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
