import { Component, Optional } from '@angular/core';

import { ModalWithDiscardPromptTestContext } from './modal-with-discard-prompt-test-context.fixture';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './modal-with-discard-prompt.component.fixture.html',
})
export class ModalWithDiscardPromptTestComponent {
  public isDirty: boolean;

  constructor(@Optional() context?: ModalWithDiscardPromptTestContext) {
    this.isDirty = context?.isDirty ?? false;
  }
}
