import { Component, inject, input } from '@angular/core';

import { ModalTestContext } from './modal-context';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './modal.component.fixture.html',
  standalone: false,
})
export class ModalTestComponent {
  public longContent = input<boolean>(false);

  protected context = inject(ModalTestContext, { optional: true });
}
