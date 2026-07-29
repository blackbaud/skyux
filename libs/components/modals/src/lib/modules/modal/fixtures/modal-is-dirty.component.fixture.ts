import { Component, inject } from '@angular/core';

import { ModalIsDirtyTestContext } from './modal-is-dirty-test-context.fixture';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './modal-is-dirty.component.fixture.html',
  standalone: false,
})
export class ModalIsDirtyTestComponent {
  public isDirty: boolean;

  constructor() {
    const context = inject(ModalIsDirtyTestContext, { optional: true });

    this.isDirty = context?.isDirty ?? false;
  }
}
