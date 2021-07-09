import {
  Component,
  Optional
} from '@angular/core';

import {
  ModalWithFocusContext
} from './modal-with-focus-context.fixture';

@Component({
  selector: 'sky-test-cmp-with-focus',
  templateUrl: './modal-with-focus-content.fixture.html'
})
export class ModalWithFocusContentTestComponent {
  constructor(@Optional() public context?: ModalWithFocusContext) { }
}
