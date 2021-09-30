import {
  Component
} from '@angular/core';

import {
  SkyToastBodyContext
} from './toast-body-context';

/**
 * @internal
 */
@Component({
  selector: 'sky-toast-body',
  templateUrl: './toast-body.component.html'
})
export class SkyToastBodyComponent {
  constructor(
    public context: SkyToastBodyContext
  ) { }
}
