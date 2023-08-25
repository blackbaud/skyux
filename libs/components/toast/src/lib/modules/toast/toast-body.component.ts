import { Component, inject } from '@angular/core';

import { SkyToastBodyContext } from './toast-body-context';

/**
 * @internal
 */
@Component({
  standalone: true,
  selector: 'sky-toast-body',
  templateUrl: './toast-body.component.html',
})
export class SkyToastBodyComponent {
  protected readonly context = inject(SkyToastBodyContext);
}
