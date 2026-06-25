import { Component, inject } from '@angular/core';

import { ModalTestContext } from './modal-context';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './modal-banner.component.fixture.html',
  standalone: false,
})
export class ModalBannerTestComponent {
  protected context = inject(ModalTestContext, { optional: true });
}
