import { Component, inject } from '@angular/core';

import { ModalWithFocusContext } from './modal-with-focus-context.fixture';

@Component({
  selector: 'sky-test-cmp-with-focus',
  templateUrl: './modal-with-focus-content.fixture.html',
  standalone: false,
})
export class ModalWithFocusContentTestComponent {
  public readonly context = inject(ModalWithFocusContext, {
    optional: true,
  });
}
